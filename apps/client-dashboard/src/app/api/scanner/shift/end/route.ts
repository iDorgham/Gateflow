/**
 * POST /api/scanner/shift/end
 *
 * Clock-out: closes the authenticated guard's open ShiftLog.
 * Body: { shiftLogId?: string } — when omitted, closes the current open shift.
 *
 * Auth: Bearer JWT. Org + guard ownership required (IDOR-safe).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { closeShift, findOpenShiftForGuard } from '@/lib/scanner-shift';

export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  shiftLogId: z.string().min(1).optional(),
});

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

  // Empty / missing body is allowed (clock-out current open shift).
  // If a Content-Type is present, body must be valid JSON (matches start endpoint).
  let body: unknown = {};
  const contentType = request.headers.get('content-type');
  if (contentType) {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }
  }

  const parsed = BodySchema.safeParse(body ?? {});
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

  const organizationId = claims.orgId;
  const guardId = claims.sub;

  let shiftLogId = parsed.data.shiftLogId;
  if (!shiftLogId) {
    const open = await findOpenShiftForGuard({ organizationId, guardId });
    if (!open) {
      return NextResponse.json(
        { success: false, message: 'No active shift to end' },
        { status: 404 }
      );
    }
    shiftLogId = open.id;
  }

  const closed = await closeShift({
    organizationId,
    guardId,
    shiftLogId,
  });

  if (!closed) {
    return NextResponse.json(
      {
        success: false,
        message: 'Shift not found, already ended, or not owned by you',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: closed.id,
      gateId: closed.gateId,
      guardId: closed.guardId,
      organizationId: closed.organizationId,
      startTime: closed.startTime.toISOString(),
      endTime: closed.endTime?.toISOString() ?? null,
    },
  });
}
