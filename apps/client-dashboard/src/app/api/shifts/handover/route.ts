import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const HandoverSchema = z.object({
  gateId: z.string().min(1, 'Gate ID is required'),
  incomingGuardId: z.string().optional().nullable(),
  notes: z.string().max(250).optional().nullable(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims?.sub) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orgId = claims.orgId;
    const body = await request.json().catch(() => ({}));
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
      if (activeShift) {
        await tx.shiftLog.update({
          where: { id: activeShift.id },
          data: { endTime: now },
        });
      }

      if (incomingGuardId) {
        // Verify incoming user exists in org
        const incomingUser = await tx.user.findFirst({
          where: { id: incomingGuardId, organizationId: orgId },
          select: { id: true },
        });

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
      }

      // Record compliance audit log (zero raw PII)
      await tx.auditLog.create({
        data: {
          action: 'SHIFT_HANDOVER',
          organizationId: orgId,
          userId: claims.sub,
          targetId: gateId,
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
    console.error('Error executing shift handover:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during handover' },
      { status: 500 }
    );
  }
}
