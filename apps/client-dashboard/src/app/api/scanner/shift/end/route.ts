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

/** Case-insensitive header get (Jest NextRequest Headers are case-sensitive). */
function getHeader(request: NextRequest, name: string): string | null {
  const lower = name.toLowerCase();
  for (const key of request.headers.keys()) {
    if (key.toLowerCase() === lower) {
      return request.headers.get(key);
    }
  }
  return null;
}

/**
 * Empty body → {}; intended JSON that fails to parse → 400.
 * Matches start-endpoint strictness without treating empty as an error.
 */
async function readEndBody(
  request: NextRequest
): Promise<
  { ok: true; body: unknown } | { ok: false; response: NextResponse }
> {
  const contentType = getHeader(request, 'content-type') ?? '';
  const contentLength = getHeader(request, 'content-length');

  const mightHaveBody =
    contentType.toLowerCase().includes('application/json') ||
    (contentLength != null && contentLength !== '0');

  if (!mightHaveBody) {
    return { ok: true, body: {} };
  }

  try {
    const text = await request.text();
    if (text.trim() === '') {
      return { ok: true, body: {} };
    }
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      ),
    };
  }
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

  const parsedBody = await readEndBody(request);
  if (parsedBody.ok === false) {
    return parsedBody.response;
  }

  const parsed = BodySchema.safeParse(parsedBody.body ?? {});
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

  try {
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
  } catch (error) {
    console.error('[scanner/shift/end] Failed to end shift:', error);
    return NextResponse.json(
      { success: false, message: 'Could not end shift — please retry' },
      { status: 503 }
    );
  }
}
