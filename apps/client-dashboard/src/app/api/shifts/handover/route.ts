import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const SHIFT_HANDOVER_PERMISSION: Permission = 'gates:manage';

class InvalidIncomingGuardError extends Error {}
class ConcurrentHandoverError extends Error {}

const HandoverSchema = z.object({
  gateId: z.string().min(1, 'Gate ID is required'),
  incomingGuardId: z.string().optional().nullable(),
  notes: z.string().max(250).optional().nullable(),
});

/**
 * Processes an authenticated gate shift handover request.
 *
 * @param request - The request containing the gate and optional incoming guard details.
 * @returns A response indicating whether the handover completed successfully or why it failed.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims?.sub) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    if (!hasPermission(claims, SHIFT_HANDOVER_PERMISSION)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const orgId = claims.orgId;

    let body: unknown = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const parseResult = HandoverSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid handover payload',
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { gateId, incomingGuardId, notes } = parseResult.data;

    // Verify gate exists and belongs to the organization
    const gate = await prisma.gate.findFirst({
      where: {
        id: gateId,
        organizationId: orgId,
        deletedAt: null,
      },
      select: { id: true, name: true },
    });

    if (!gate) {
      return NextResponse.json(
        { success: false, message: 'Gate not found or unauthorized' },
        { status: 404 }
      );
    }

    // Find current running shift on this gate
    const activeShift = await prisma.shiftLog.findFirst({
      where: {
        gateId,
        organizationId: orgId,
        endTime: null,
      },
      select: { id: true, guardId: true, startTime: true },
    });

    const now = new Date();

    // Perform transaction: end current shift, optionally start next shift, and log audit trail
    await prisma.$transaction(async (tx) => {
      let incomingUser: { id: string } | null = null;
      if (incomingGuardId) {
        incomingUser = await tx.user.findFirst({
          where: {
            id: incomingGuardId,
            organizationId: orgId,
            deletedAt: null,
          },
          select: { id: true },
        });
        if (!incomingUser) {
          throw new InvalidIncomingGuardError();
        }
      }

      if (activeShift) {
        const closedShift = await tx.shiftLog.updateMany({
          where: {
            id: activeShift.id,
            organizationId: orgId,
            endTime: null,
          },
          data: { endTime: now },
        });
        if (closedShift.count === 0) {
          throw new ConcurrentHandoverError();
        }
      }

      if (incomingUser) {
        await tx.shiftLog.create({
          data: {
            guardId: incomingUser.id,
            gateId,
            organizationId: orgId,
            startTime: now,
          },
        });
      }

      // Record compliance audit log (zero raw PII)
      await tx.auditLog.create({
        data: {
          action: 'SHIFT_HANDOVER',
          entityType: 'GATE',
          entityId: gateId,
          organizationId: orgId,
          userId: claims.sub,
          metadata: {
            gateName: gate.name,
            previousShiftId: activeShift?.id ?? null,
            previousGuardId: activeShift?.guardId ?? null,
            hasIncomingGuard: Boolean(incomingGuardId),
            hasNotes: Boolean(notes?.trim()),
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Shift handover completed successfully',
    });
  } catch (error) {
    if (error instanceof InvalidIncomingGuardError) {
      return NextResponse.json(
        { success: false, message: 'Incoming guard not found in organization' },
        { status: 400 }
      );
    }
    if (error instanceof ConcurrentHandoverError) {
      return NextResponse.json(
        { success: false, message: 'Shift was already handed over' },
        { status: 409 }
      );
    }
    console.error('Error executing shift handover:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during handover' },
      { status: 500 }
    );
  }
}
