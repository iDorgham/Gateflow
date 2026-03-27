import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { updateWorkOrderSchema, isValidStatusTransition, MaintenanceStatus } from '@gate-access/types';

export const dynamic = 'force-dynamic';

// ─── GET /api/maintenance/work-orders/[id] ─────────────────────────────────────
// Retrieve a single work order detail.
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const workOrder = await prisma.workOrder.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
      include: {
        reporter: { select: { id: true, name: true, email: true, image: true } },
        assignee: { select: { id: true, name: true, email: true, image: true } },
        gate: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });

    if (!workOrder) {
      return NextResponse.json(
        { success: false, message: 'Work order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: workOrder });
  } catch (error) {
    console.error('GET /api/maintenance/work-orders/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/maintenance/work-orders/[id] ───────────────────────────────────
// Update a work order (status, priority, assignee, etc.).
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = updateWorkOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existing = await prisma.workOrder.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Work order not found' },
        { status: 404 }
      );
    }

    const updates = validation.data;

    // Validate Status Transition
    if (updates.status && updates.status !== existing.status) {
      if (!isValidStatusTransition(existing.status as MaintenanceStatus, updates.status as MaintenanceStatus)) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Invalid status transition from ${existing.status} to ${updates.status}` 
          },
          { status: 400 }
        );
      }
    }

    // Auto-update status to ASSIGNED if assigneeId is provided and current status is OPEN
    if (updates.assigneeId && existing.status === MaintenanceStatus.OPEN && !updates.status) {
      updates.status = MaintenanceStatus.ASSIGNED;
    }

    const updated = await prisma.workOrder.update({
      where: { id },
      data: {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : updates.dueDate,
      },
      include: {
        reporter: { select: { id: true, name: true, email: true, image: true } },
        assignee: { select: { id: true, name: true, email: true, image: true } },
        gate: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/maintenance/work-orders/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/maintenance/work-orders/[id] ──────────────────────────────────
// Soft-deletes a work order.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const existing = await prisma.workOrder.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Work order not found' },
        { status: 404 }
      );
    }

    await prisma.workOrder.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/maintenance/work-orders/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
