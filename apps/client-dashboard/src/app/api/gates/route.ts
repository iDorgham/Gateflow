import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

// ─── GET /api/gates ───────────────────────────────────────────────────────────
// Returns all gates for the authenticated org with live stats.
// Intended for external consumers (scanner app, mobile) and the 30-s auto-refresh.

export async function GET(): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const orgId = claims.orgId;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [gates, scansTodayGroups] = await Promise.all([
      prisma.gate.findMany({
        where: { organizationId: orgId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { qrCodes: true, scanLogs: true } },
        },
      }),
      prisma.scanLog.groupBy({
        by: ['gateId'],
        where: {
          gate: { organizationId: orgId },
          scannedAt: { gte: todayStart },
        },
        _count: true,
      }),
    ]);

    const scansTodayMap = new Map(scansTodayGroups.map((g) => [g.gateId, g._count]));

    const data = gates.map((gate) => {
      const scansToday = scansTodayMap.get(gate.id) ?? 0;
      const isActiveToday =
        gate.lastAccessedAt != null && gate.lastAccessedAt >= todayStart;

      return {
        id: gate.id,
        name: gate.name,
        location: gate.location,
        isActive: gate.isActive,
        lastAccessedAt: gate.lastAccessedAt?.toISOString() ?? null,
        createdAt: gate.createdAt.toISOString(),
        qrCodeCount: gate._count.qrCodes,
        totalScans: gate._count.scanLogs,
        scansToday,
        isActiveToday,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/gates error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/gates ──────────────────────────────────────────────────────────
// Creates a new gate for the authenticated org.

const CreateGateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  location: z.string().min(1, 'Location is required').max(200),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = CreateGateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, location } = validation.data;

    const gate = await prisma.gate.create({
      data: {
        name: name.trim(),
        location: location.trim(),
        organizationId: claims.orgId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        location: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: gate }, { status: 201 });
  } catch (error) {
    console.error('POST /api/gates error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── PATCH /api/gates ─────────────────────────────────────────────────────────
// Updates an existing gate (name, location, isActive).

const UpdateGateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  location: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = UpdateGateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { id, name, location, isActive } = validation.data;

    const existing = await prisma.gate.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Gate not found' }, { status: 404 });
    }

    const updated = await prisma.gate.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(location !== undefined ? { location: location.trim() } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      select: { id: true, name: true, location: true, isActive: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/gates error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/gates ────────────────────────────────────────────────────────
// Soft-deletes a gate (sets deletedAt + isActive = false).

const DeleteGateSchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = DeleteGateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.gate.findFirst({
      where: { id: validation.data.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Gate not found' }, { status: 404 });
    }

    await prisma.gate.update({
      where: { id: validation.data.id },
      data: { deletedAt: new Date(), isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gates error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
