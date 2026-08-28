import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import {
  decodeCheckpointQrString,
  verifyCheckpointPayload,
} from '@/lib/patrols/checkpoint-qr';
import type { CheckpointQrPayload } from '@gate-access/types';

export const dynamic = 'force-dynamic';

interface PatrolScanRequestBody {
  qrString?: string;
  payload?: CheckpointQrPayload;
  runId?: string;
}

/**
 * POST /api/patrols/scan
 * Validates HMAC cryptographic checkpoint QR and logs guard waypoint arrival.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orgId = claims.orgId;
    const guardId = claims.sub || null;
    const body: PatrolScanRequestBody = await request.json();

    let payload: CheckpointQrPayload | null = null;

    if (body.qrString) {
      payload = decodeCheckpointQrString(body.qrString);
    } else if (body.payload) {
      payload = body.payload;
    }

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing QR checkpoint payload' },
        { status: 400 }
      );
    }

    // 1. Verify tenant scope
    if (payload.orgId !== orgId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Checkpoint does not belong to current organization',
        },
        { status: 403 }
      );
    }

    // 2. Verify HMAC cryptographic signature
    const isValidSignature = verifyCheckpointPayload(payload);
    if (!isValidSignature) {
      console.warn(
        `[patrols/scan] Checkpoint signature verification failed for checkpoint ${payload.checkpointId}`
      );
      return NextResponse.json(
        {
          success: false,
          message: 'Cryptographic signature verification failed',
        },
        { status: 403 }
      );
    }

    // 3. Find checkpoint in database
    const checkpoint = await prisma.patrolCheckpoint.findFirst({
      where: {
        id: payload.checkpointId,
        routeId: payload.routeId,
        organizationId: orgId,
        deletedAt: null,
      },
      include: {
        route: {
          include: {
            checkpoints: {
              where: { deletedAt: null },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!checkpoint) {
      return NextResponse.json(
        { success: false, message: 'Patrol checkpoint not found or inactive' },
        { status: 404 }
      );
    }

    const route = checkpoint.route;

    // 4. Resolve or initialize active PatrolRun
    let activeRun = body.runId
      ? await prisma.patrolRun.findFirst({
          where: {
            id: body.runId,
            organizationId: orgId,
            status: 'IN_PROGRESS',
          },
          include: { logEntries: { orderBy: { scannedAt: 'asc' } } },
        })
      : await prisma.patrolRun.findFirst({
          where: {
            routeId: route.id,
            organizationId: orgId,
            status: 'IN_PROGRESS',
            ...(guardId ? { guardId } : {}),
          },
          include: { logEntries: { orderBy: { scannedAt: 'asc' } } },
        });

    const now = new Date();

    if (!activeRun) {
      // Start a new patrol run on first checkpoint scan
      activeRun = await prisma.patrolRun.create({
        data: {
          routeId: route.id,
          guardId,
          status: 'IN_PROGRESS',
          startedAt: now,
          organizationId: orgId,
        },
        include: { logEntries: true },
      });
    }

    // 5. Check duplicate check-in
    const alreadyScanned = activeRun.logEntries.some(
      (entry) => entry.checkpointId === checkpoint.id
    );
    if (alreadyScanned) {
      return NextResponse.json(
        {
          success: false,
          message: `Checkpoint ${checkpoint.name} has already been logged for this active patrol run`,
        },
        { status: 400 }
      );
    }

    // 6. Enforce strict sequential order if required
    if (route.isStrictSequence) {
      const expectedOrderIndex = activeRun.logEntries.length;
      if (checkpoint.orderIndex !== expectedOrderIndex) {
        return NextResponse.json(
          {
            success: false,
            message: `Out of sequence scan. Expected checkpoint #${expectedOrderIndex + 1}, but scanned #${
              checkpoint.orderIndex + 1
            } (${checkpoint.name})`,
          },
          { status: 400 }
        );
      }
    }

    // 7. Calculate latency in seconds from previous scan or run start
    let latencySeconds = 0;
    if (activeRun.logEntries.length > 0) {
      const lastScan = activeRun.logEntries[activeRun.logEntries.length - 1];
      latencySeconds = Math.floor(
        (now.getTime() - new Date(lastScan.scannedAt).getTime()) / 1000
      );
    } else if (activeRun.startedAt) {
      latencySeconds = Math.floor(
        (now.getTime() - new Date(activeRun.startedAt).getTime()) / 1000
      );
    }

    // 8. Record PatrolLogEntry
    const logEntry = await prisma.patrolLogEntry.create({
      data: {
        runId: activeRun.id,
        checkpointId: checkpoint.id,
        guardId,
        scannedAt: now,
        latencySeconds,
        organizationId: orgId,
      },
    });

    // 9. Check if all route checkpoints have been completed
    const totalCheckpoints = route.checkpoints.length;
    const completedCheckpoints = activeRun.logEntries.length + 1;
    const isCompleted = completedCheckpoints >= totalCheckpoints;

    if (isCompleted) {
      await prisma.patrolRun.update({
        where: { id: activeRun.id },
        data: {
          status: 'COMPLETED',
          completedAt: now,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: isCompleted
        ? `Patrol route ${route.name} fully completed!`
        : `Logged station #${checkpoint.orderIndex + 1} (${checkpoint.name})`,
      logEntry: {
        id: logEntry.id,
        runId: logEntry.runId,
        checkpointId: logEntry.checkpointId,
        checkpointName: checkpoint.name,
        guardId: logEntry.guardId,
        scannedAt: logEntry.scannedAt.toISOString(),
        latencySeconds: logEntry.latencySeconds,
      },
      isCompleted,
      progress: {
        completed: completedCheckpoints,
        total: totalCheckpoints,
      },
    });
  } catch (error) {
    console.error('[patrols/scan/POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
