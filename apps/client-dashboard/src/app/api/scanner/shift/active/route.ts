/**
 * GET /api/scanner/shift/active?gateId=
 *
 * Returns the authenticated guard's open ShiftLog for the gate (if any).
 * Used by the scanner app to invalidate stale SecureStore sessions.
 *
 * Auth: Bearer JWT + scans:view.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { hasPermission } from '@/lib/auth';
import { findOpenShiftForGate, serializeShift } from '@/lib/scanner-shift';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authResult = await requireAuth(request);
  if (isNextResponse(authResult)) return authResult;
  const claims = authResult;

  if (!claims.orgId) {
    return NextResponse.json(
      { success: false, message: 'Organization context required' },
      { status: 403 }
    );
  }

  if (!hasPermission(claims, 'scans:view')) {
    return NextResponse.json(
      { success: false, message: 'Scanner permission required' },
      { status: 403 }
    );
  }

  const gateId = request.nextUrl.searchParams.get('gateId');
  if (!gateId) {
    return NextResponse.json(
      { success: false, message: 'gateId is required' },
      { status: 400 }
    );
  }

  try {
    const open = await findOpenShiftForGate({
      organizationId: claims.orgId,
      guardId: claims.sub,
      gateId,
    });

    if (!open) {
      return NextResponse.json(
        { success: false, message: 'No active shift' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeShift(open),
    });
  } catch (error) {
    console.error('[scanner/shift/active] Failed:', error);
    return NextResponse.json(
      { success: false, message: 'Could not load active shift — please retry' },
      { status: 503 }
    );
  }
}
