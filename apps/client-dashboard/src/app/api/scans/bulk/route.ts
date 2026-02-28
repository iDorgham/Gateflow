import { NextRequest, NextResponse } from 'next/server';
import {
  BulkScanRequestSchema,
  BulkScanResponseSchema,
} from '@gate-access/types';
import { prisma } from '@gate-access/db';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { processBulkScans } from '@/lib/scans/bulk-sync';
import {
  orgHasAssignments,
  getUserAssignedGateIds,
} from '@/lib/gate-assignment';
import { checkLocationForGate } from '@/lib/location';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(request);
    if (isNextResponse(authResult)) return authResult;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const validation = BulkScanRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { scans } = validation.data;
    const orgId = authResult.orgId;

    // Location rule: when a gate has locationEnforced, reject scans without valid location or outside radius.
    const gateIds = Array.from(new Set(scans.map((s) => s.gateId)));
    const gates =
      gateIds.length > 0 && orgId
        ? await prisma.gate.findMany({
            where: { id: { in: gateIds }, organizationId: orgId, deletedAt: null },
            select: {
              id: true,
              latitude: true,
              longitude: true,
              locationRadiusMeters: true,
              locationEnforced: true,
            },
          })
        : [];
    const gateMap = new Map(gates.map((g) => [g.id, g]));
    const locationFailed: Array<{ id: string; error: string }> = [];
    const scansPassingLocation = scans.filter((scan) => {
      const gate = gateMap.get(scan.gateId);
      if (!gate) return true; // Gate not in org or missing — let processBulkScans or downstream handle
      const deviceLocation =
        scan.latitude != null && scan.longitude != null
          ? { latitude: scan.latitude, longitude: scan.longitude }
          : null;
      const result = checkLocationForGate(gate, deviceLocation);
      if (!result.allowed) {
        const errMsg = 'message' in result ? result.message : 'Scan only allowed at gate location.';
        locationFailed.push({ id: scan.id, error: errMsg });
        return false;
      }
      return true;
    });

    // Gate–account assignment: when org uses assignments, operator must be assigned to every gate in the batch.
    if (orgId) {
      const hasAny = await orgHasAssignments(orgId);
      if (hasAny) {
        const assignedGateIds = await getUserAssignedGateIds(
          authResult.sub,
          orgId
        );
        const gateIdsInBatch = new Set(scansPassingLocation.map((s) => s.gateId));
        const unassigned = Array.from(gateIdsInBatch).filter(
          (id) => !assignedGateIds.has(id)
        );
        if (unassigned.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message:
                'You are not allowed to scan at one or more gates in this batch.',
              unassignedGateIds: unassigned,
            },
            { status: 403 }
          );
        }
      }
    }

    // Rate limit: 30 bulk-sync requests per minute per user
    const rl = await checkRateLimit(`bulk:${authResult.sub}`, 30, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many sync requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)),
            'X-RateLimit-Limit': String(rl.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const results = await prisma.$transaction(async (tx) => {
      return processBulkScans(scansPassingLocation, tx);
    });

    const response = {
      success: true,
      synced: results.synced,
      conflicted: results.conflicted,
      failed: [...locationFailed, ...results.failed],
    };

    return NextResponse.json({
      success: true,
      data: BulkScanResponseSchema.parse(response),
    });
  } catch (error) {
    console.error('Bulk sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
