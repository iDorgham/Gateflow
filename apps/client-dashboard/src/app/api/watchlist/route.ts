/**
 * Watchlist API: list (GET), add (POST), soft-delete (DELETE).
 * Requires gates:manage (Security Manager / Org Admin). All org-scoped.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const WATCHLIST_PERMISSION: Permission = 'gates:manage';

const AddEntrySchema = z.object({
  name: z.string().min(1).max(200),
  idNumber: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, WATCHLIST_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim() || undefined;

    const entries = await prisma.watchlistEntry.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { idNumber: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        idNumber: true,
        phone: true,
        notes: true,
        createdBy: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: entries.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error('GET /api/watchlist error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, WATCHLIST_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = AddEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const entry = await prisma.watchlistEntry.create({
      data: {
        organizationId: claims.orgId,
        name: parsed.data.name.trim(),
        idNumber: parsed.data.idNumber?.trim() ?? null,
        phone: parsed.data.phone?.trim() ?? null,
        notes: parsed.data.notes?.trim() ?? null,
        createdBy: claims.sub ?? null,
      },
      select: {
        id: true,
        name: true,
        idNumber: true,
        phone: true,
        notes: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, data: { ...entry, createdAt: entry.createdAt.toISOString() } },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/watchlist error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

const DeleteEntrySchema = z.object({ id: z.string().min(1) });

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, WATCHLIST_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const parsed = DeleteEntrySchema.safeParse({ id: id ?? '' });
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Missing or invalid id' }, { status: 400 });
    }

    const existing = await prisma.watchlistEntry.findFirst({
      where: { id: parsed.data.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Watchlist entry not found' }, { status: 404 });
    }

    await prisma.watchlistEntry.update({
      where: { id: parsed.data.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/watchlist error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
