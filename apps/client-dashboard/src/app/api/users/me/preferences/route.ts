import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const TableViewSchema = z.object({
  columnOrder: z.array(z.string()).optional(),
  columnVisibility: z.record(z.string(), z.boolean()).optional(),
  activeView: z.string().optional(),
  savedViews: z
    .record(
      z.string(),
      z.object({
        columnOrder: z.array(z.string()).optional(),
        columnVisibility: z.record(z.string(), z.boolean()).optional(),
      })
    )
    .optional(),
});

const PatchPreferencesSchema = z.object({
  tableViews: z
    .object({
      contacts: TableViewSchema.optional(),
      units: TableViewSchema.optional(),
    })
    .optional(),
});

/** GET /api/users/me/preferences — return current user preferences */
export async function GET(): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: claims.sub, deletedAt: null },
      select: { preferences: true },
    });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const preferences = (user.preferences as Record<string, unknown>) ?? {};
    return NextResponse.json({ success: true, data: preferences });
  } catch (error) {
    console.error('GET /api/users/me/preferences error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

/** PATCH /api/users/me/preferences — update current user preferences (e.g. tableViews) */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = PatchPreferencesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id: claims.sub, deletedAt: null },
      select: { preferences: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const current = (existing.preferences as Record<string, unknown>) ?? {};
    const updated = {
      ...current,
      ...(validation.data.tableViews !== undefined
        ? { tableViews: { ...((current.tableViews as Record<string, unknown>) ?? {}), ...validation.data.tableViews } }
        : {}),
    };

    await prisma.user.update({
      where: { id: claims.sub },
      data: { preferences: updated },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/users/me/preferences error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
