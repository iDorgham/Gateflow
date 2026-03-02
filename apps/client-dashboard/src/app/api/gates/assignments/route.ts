import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const ASSIGN_PERMISSION: Permission = 'gates:manage';

// ─── GET /api/gates/assignments ─────────────────────────────────────────────────
// List gate assignments for the org (active only). Requires gates:manage.
// Query: ?project= — optional projectId to filter assignments by gate.projectId.

export async function GET(request?: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, ASSIGN_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const rawProjectId = request?.nextUrl?.searchParams?.get('project') ?? undefined;
    let projectId: string | undefined;
    if (rawProjectId) {
      const project = await prisma.project.findFirst({
        where: { id: rawProjectId, organizationId: claims.orgId, deletedAt: null },
        select: { id: true },
      });
      if (project) projectId = project.id;
    }

    const assignments = await prisma.gateAssignment.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
        ...(projectId ? { gate: { projectId } } : {}),
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        gate: { select: { id: true, name: true, location: true } },
      },
      orderBy: [{ userId: 'asc' }, { gateId: 'asc' }],
    });

    const data = assignments.map((a) => ({
      id: a.id,
      userId: a.userId,
      user: a.user,
      gateId: a.gateId,
      gate: a.gate,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/gates/assignments error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/gates/assignments ────────────────────────────────────────────────
// Assign a user to one or more gates. User and gates must belong to the same org.

const AssignSchema = z.object({
  userId: z.string().min(1),
  gateIds: z.array(z.string().min(1)).min(1).max(100),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, ASSIGN_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = AssignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, gateIds } = parsed.data;
    const orgId = claims.orgId;

    // Ensure user belongs to org
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: orgId, deletedAt: null },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Ensure all gates belong to org and are not deleted
    const gates = await prisma.gate.findMany({
      where: { id: { in: gateIds }, organizationId: orgId, deletedAt: null },
      select: { id: true },
    });
    const foundIds = new Set(gates.map((g) => g.id));
    const missing = gateIds.filter((id) => !foundIds.has(id));
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'One or more gates not found', gateIds: missing },
        { status: 404 }
      );
    }

    const created: Array<{ id: string; userId: string; gateId: string }> = [];
    for (const gateId of gateIds) {
      const existing = await prisma.gateAssignment.findUnique({
        where: { userId_gateId: { userId, gateId } },
      });
      if (existing) {
        if (existing.deletedAt) {
          await prisma.gateAssignment.update({
            where: { id: existing.id },
            data: { deletedAt: null, updatedAt: new Date() },
          });
          created.push({ id: existing.id, userId, gateId });
        }
        // else already active, skip
      } else {
        const a = await prisma.gateAssignment.create({
          data: { userId, gateId, organizationId: orgId },
        });
        created.push({ id: a.id, userId, gateId });
      }
    }

    return NextResponse.json({ success: true, data: { assigned: created } }, { status: 201 });
  } catch (err) {
    console.error('POST /api/gates/assignments error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/gates/assignments ──────────────────────────────────────────────
// Unassign a user from a gate (soft delete). Requires gates:manage.

const UnassignSchema = z.object({
  userId: z.string().min(1),
  gateId: z.string().min(1),
});

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!hasPermission(claims, ASSIGN_PERMISSION)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = UnassignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, gateId } = parsed.data;
    const orgId = claims.orgId;

    const assignment = await prisma.gateAssignment.findFirst({
      where: {
        userId,
        gateId,
        organizationId: orgId,
        deletedAt: null,
      },
    });

    if (!assignment) {
      return NextResponse.json({ success: false, message: 'Assignment not found' }, { status: 404 });
    }

    await prisma.gateAssignment.update({
      where: { id: assignment.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/gates/assignments error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
