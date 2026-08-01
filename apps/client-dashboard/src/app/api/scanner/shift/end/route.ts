/**
 * POST /api/scanner/shift/end
 *
 * Clock-out: closes the authenticated guard's open ShiftLog.
 * Body: { shiftLogId?: string } — when omitted, closes the current open shift.
 *
 * Auth: Bearer JWT + scans:view. Org + guard ownership required (IDOR-safe).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { hasPermission } from '@/lib/auth';
import {
  closeShift,
  findOpenShiftForGuard,
  serializeShift,
} from '@/lib/scanner-shift';

export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  shiftLogId: z.string().min(1).optional(),
});

/**
 * Empty / whitespace body → {}; non-empty invalid JSON → 400.
 *
 * Prefer `.text()` in real runtimes. Jest's NextRequest stub does not
 * implement `.text()` (calling it throws), so fall back to `.json()`.
 */
async function readEndBody(
  request: NextRequest
): Promise<
  { ok: true; body: unknown } | { ok: false; response: NextResponse }
> {
  let raw: string | null = null;

  if (typeof request.text === 'function') {
    try {
      raw = await request.text();
    } catch {
      raw = null;
    }
  } else if (typeof request.arrayBuffer === 'function') {
    try {
      const buf = await request.arrayBuffer();
      raw = new TextDecoder().decode(buf);
    } catch {
      raw = null;
    }
  }

  if (raw !== null) {
    if (!raw.trim()) {
      return { ok: true, body: {} };
    }
    try {
      return { ok: true, body: JSON.parse(raw) };
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

  try {
    const body = await request.json();
    // Some runtimes resolve empty application/json to null/undefined.
    return { ok: true, body: body ?? {} };
  } catch (error) {
    const message =
      error instanceof Error ? error.message.toLowerCase() : String(error);
    // Whitespace-only / empty payloads surface as "Unexpected end of JSON input"
    // under Jest's NextRequest (no `.text()`). Treat those as {}.
    if (message.includes('unexpected end')) {
      return { ok: true, body: {} };
    }
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

  if (!hasPermission(claims, 'scans:view')) {
    return NextResponse.json(
      { success: false, message: 'Scanner permission required' },
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
      data: serializeShift(closed),
    });
  } catch (error) {
    console.error('[scanner/shift/end] Failed to end shift:', error);
    return NextResponse.json(
      { success: false, message: 'Could not end shift — please retry' },
      { status: 503 }
    );
  }
}
