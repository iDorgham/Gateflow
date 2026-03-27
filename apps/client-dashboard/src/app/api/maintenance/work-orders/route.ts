import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import {
  createWorkOrderSchema,
  workOrderQuerySchema,
} from '@gate-access/types';
import { MaintenanceStatus } from '@gate-access/types';

export const dynamic = 'force-dynamic';

// ─── GET /api/maintenance/work-orders ──────────────────────────────────────────
// List work orders with pagination and filtering.
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = workOrderQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid query parameters',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      status,
      priority,
      category,
      locationType,
      locationId,
      reporterId,
      assigneeId,
      page,
      limit,
    } = validation.data;

    const skip = (page - 1) * limit;

    const where: any = {
      organizationId: claims.orgId,
      deletedAt: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(category && { category }),
      ...(locationType && { locationType }),
      ...(locationId && { locationId }),
      ...(reporterId && { reporterId }),
      ...(assigneeId && { assigneeId }),
    };

    const [workOrders, totalCount] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: { id: true, name: true, email: true, image: true },
          },
          assignee: {
            select: { id: true, name: true, email: true, image: true },
          },
          gate: { select: { id: true, name: true } },
          unit: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      }),
      prisma.workOrder.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: workOrders,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/maintenance/work-orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── POST /api/maintenance/work-orders ─────────────────────────────────────────
// Create a new work order.
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims?.sub) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = createWorkOrderSchema.safeParse(body);
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

    const {
      title,
      description,
      priority,
      category,
      locationType,
      locationId,
      gateId,
      unitId,
      projectId,
      dueDate,
      assigneeId,
    } = validation.data;

    // Verify assets belong to the organization
    if (gateId) {
      const gate = await prisma.gate.findFirst({
        where: { id: gateId, organizationId: claims.orgId, deletedAt: null },
      });
      if (!gate) {
        return NextResponse.json(
          { success: false, message: 'Gate not found' },
          { status: 404 }
        );
      }
    }

    if (unitId) {
      const unit = await prisma.unit.findFirst({
        where: { id: unitId, organizationId: claims.orgId, deletedAt: null },
      });
      if (!unit) {
        return NextResponse.json(
          { success: false, message: 'Unit not found' },
          { status: 404 }
        );
      }
    }

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, organizationId: claims.orgId, deletedAt: null },
      });
      if (!project) {
        return NextResponse.json(
          { success: false, message: 'Project not found' },
          { status: 404 }
        );
      }
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        title: title.trim(),
        description: description?.trim() ?? null,
        status: MaintenanceStatus.OPEN,
        priority,
        category,
        locationType,
        locationId: locationId ?? null,
        gateId: gateId ?? null,
        unitId: unitId ?? null,
        projectId: projectId ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        reporterId: claims.sub,
        assigneeId: assigneeId ?? null,
        organizationId: claims.orgId,
      },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, image: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, image: true },
        },
        gate: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: workOrder }, { status: 201 });
  } catch (error) {
    console.error('POST /api/maintenance/work-orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
