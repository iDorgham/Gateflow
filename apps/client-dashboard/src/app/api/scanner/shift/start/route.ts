/**
 * POST /api/scanner/shift/start
 *
 * Clock-in: creates an open ShiftLog for the authenticated guard at a gate.
 * Body: { gateId: string }
 *
 * Auth: Bearer JWT (scanner). Org + gate scoped; assignment-checked when org uses assignments.
 * If the guard already has an open shift at another gate, it is closed first.
 * If an open shift already exists at the same gate, that record is returned (idempotent).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { checkGateAssignment } from '@/lib/gate-assignment';
import {
  findOpenShiftForGate,
  findOpenShiftForGuard,
} from '@/lib/scanner-shift';

export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  gateId: z.string().min(1),
});

function serializeShift(shift: {
  id: string;
  gateId: string;
  guardId: string;
  organizationId: string;
  startTime: Date;
  endTime: Date | null;
}) {
  return {
    id: shift.id,
    gateId: shift.gateId,
    guardId: shift.guardId,
    organizationId: shift.organizationId,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime?.toISOString() ?? null,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authResult = await requireAuth(request);
  if (isNextResponse(authResult)) return authResult;
  const claims = authResult;

  if (!claims.orgId) {
    return NextResponse.json(
      { success: false, message: 'Organization context required' },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request body',
        errors: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { gateId } = parsed.data;
  const organizationId = claims.orgId;
  const guardId = claims.sub;

  const gate = await prisma.gate.findFirst({
    where: { id: gateId, organizationId, deletedAt: null },
    select: { id: true, name: true, isActive: true },
  });
  if (!gate) {
    return NextResponse.json(
      { success: false, message: 'Gate not found in your organization' },
      { status: 404 }
    );
  }
  if (!gate.isActive) {
    return NextResponse.json(
      { success: false, message: 'Gate is inactive' },
      { status: 403 }
    );
  }

  const assignmentError = await checkGateAssignment(claims, gateId);
  if (assignmentError) {
    return NextResponse.json(
      { success: false, message: assignmentError },
      { status: 403 }
    );
  }

  const existingAtGate = await findOpenShiftForGate({
    organizationId,
    guardId,
    gateId,
  });
  if (existingAtGate) {
    return NextResponse.json({
      success: true,
      data: { ...serializeShift(existingAtGate), gateName: gate.name },
      reused: true,
    });
  }

  const openElsewhere = await findOpenShiftForGuard({
    organizationId,
    guardId,
  });
  if (openElsewhere) {
    await prisma.shiftLog.update({
      where: { id: openElsewhere.id },
      data: { endTime: new Date() },
    });
  }

  const created = await prisma.shiftLog.create({
    data: {
      organizationId,
      guardId,
      gateId,
      startTime: new Date(),
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: { ...serializeShift(created), gateName: gate.name },
      reused: false,
    },
    { status: 201 }
  );
}
