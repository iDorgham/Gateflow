import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

// ─── GET /api/gates ───────────────────────────────────────────────────────────
// Returns all gates for the authenticated org with live stats.
// Query: ?project= — optional projectId to filter gates by project.
// Intended for external consumers (scanner app, mobile) and the 30-s auto-refresh.

export async function GET(request?: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const orgId = claims.orgId;
    const rawProjectId = request?.nextUrl?.searchParams?.get('project') ?? undefined;
    let projectId: string | undefined;
    if (rawProjectId) {
      const project = await prisma.project.findFirst({
        where: { id: rawProjectId, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (project) projectId = project.id;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const gateWhere = {
      organizationId: orgId,
      deletedAt: null,
      ...(projectId ? { projectId } : {}),
    };

    const [gates, scansTodayGroups] = await Promise.all([
      prisma.gate.findMany({
        where: gateWhere,
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
        projectId: gate.projectId ?? null,
        isActive: gate.isActive,
        lastAccessedAt: gate.lastAccessedAt?.toISOString() ?? null,
        createdAt: gate.createdAt.toISOString(),
        qrCodeCount: gate._count.qrCodes,
        totalScans: gate._count.scanLogs,
        scansToday,
        isActiveToday,
        latitude: gate.latitude ?? null,
        longitude: gate.longitude ?? null,
        locationRadiusMeters: gate.locationRadiusMeters ?? null,
        locationEnforced: gate.locationEnforced ?? false,
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
  location: z.string().max(200).optional(),
  projectId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
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

    const { name, location, projectId, isActive } = validation.data;

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, organizationId: claims.orgId, deletedAt: null },
        select: { id: true },
      });
      if (!project) {
        return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
      }
    }

    const gate = await prisma.gate.create({
      data: {
        name: name.trim(),
        location: location?.trim() ?? null,
        organizationId: claims.orgId,
        projectId: projectId ?? null,
        isActive: isActive ?? true,
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
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  locationRadiusMeters: z.number().int().min(1).max(100_000).nullable().optional(),
  locationEnforced: z.boolean().nullable().optional(),
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

    const { id, name, location, isActive, latitude, longitude, locationRadiusMeters, locationEnforced } = validation.data;

    const existing = await prisma.gate.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Gate not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (location !== undefined) updateData.location = location.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (locationRadiusMeters !== undefined) updateData.locationRadiusMeters = locationRadiusMeters;
    if (locationEnforced !== undefined) updateData.locationEnforced = locationEnforced;

    const updated = await prisma.gate.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        location: true,
        isActive: true,
        latitude: true,
        longitude: true,
        locationRadiusMeters: true,
        locationEnforced: true,
      },
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
