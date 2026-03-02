/**
 * Watchlist entry PATCH — update an existing entry.
 * Requires gates:manage.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const WATCHLIST_PERMISSION: Permission = 'gates:manage';

const UpdateEntrySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  idNumber: z.string().max(100).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, WATCHLIST_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.watchlistEntry.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Watchlist entry not found' }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = UpdateEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name.trim();
    if (parsed.data.idNumber !== undefined) data.idNumber = parsed.data.idNumber?.trim() ?? null;
    if (parsed.data.phone !== undefined) data.phone = parsed.data.phone?.trim() ?? null;
    if (parsed.data.notes !== undefined) data.notes = parsed.data.notes?.trim() ?? null;

    const updated = await prisma.watchlistEntry.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        idNumber: true,
        phone: true,
        notes: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...updated, updatedAt: updated.updatedAt.toISOString() },
    });
  } catch (err) {
    console.error('PATCH /api/watchlist/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
