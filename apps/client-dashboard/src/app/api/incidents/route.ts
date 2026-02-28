/**
 * Incidents API: list with filters (GET), create (POST), update status (PATCH).
 * Requires gates:manage. All org-scoped.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const INCIDENT_PERMISSION: Permission = 'gates:manage';

const CreateIncidentSchema = z.object({
  gateId: z.string().min(1),
  reason: z.string().min(1).max(500),
  notes: z.string().max(1000).optional(),
});

const UpdateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['UNDER_REVIEW', 'RESOLVED', 'ESCALATED']),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, INCIDENT_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const gateId = searchParams.get('gateId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const from = searchParams.get('from') ?? undefined;
    const to = searchParams.get('to') ?? undefined;

    const where: Record<string, unknown> = { organizationId: claims.orgId };
    if (gateId) where.gateId = gateId;
    if (status) where.status = status;
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, Date>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, Date>).lte = new Date(to);
    }

    const incidents = await prisma.incident.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        gate: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const data = incidents.map((i) => ({
      id: i.id,
      gateId: i.gateId,
      gate: i.gate,
      userId: i.userId,
      user: i.user,
      reason: i.reason,
      status: i.status,
      notes: i.notes,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/incidents error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, INCIDENT_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = CreateIncidentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const gate = await prisma.gate.findFirst({
      where: { id: parsed.data.gateId, organizationId: claims.orgId, deletedAt: null },
    });
    if (!gate) {
      return NextResponse.json({ success: false, message: 'Gate not found' }, { status: 404 });
    }

    const incident = await prisma.incident.create({
      data: {
        organizationId: claims.orgId,
        gateId: parsed.data.gateId,
        userId: claims.sub ?? null,
        reason: parsed.data.reason.trim(),
        notes: parsed.data.notes?.trim() ?? null,
        status: 'UNDER_REVIEW',
      },
      include: {
        gate: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...incident,
          createdAt: incident.createdAt.toISOString(),
          updatedAt: incident.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/incidents error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, INCIDENT_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = UpdateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.incident.findFirst({
      where: { id: parsed.data.id, organizationId: claims.orgId },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Incident not found' }, { status: 404 });
    }

    const updated = await prisma.incident.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status as 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED' },
      include: {
        gate: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    console.error('PATCH /api/incidents error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
