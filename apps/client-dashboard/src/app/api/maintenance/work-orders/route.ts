import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { WorkOrderService } from '@/lib/maintenance/work-order-service';
import { prisma } from '@gate-access/db';
import {
  createWorkOrderSchema,
  workOrderQuerySchema,
  BUILT_IN_ROLES,
} from '@gate-access/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/maintenance/work-orders
 * List work orders for the current organization.
 * Residents can only see their own reports.
 */
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

    const parsed = workOrderQuerySchema.safeParse(queryParams);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid query parameters',
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const query = parsed.data;

    // RBAC: Residents only see their own reports
    if (claims.roleName === BUILT_IN_ROLES.RESIDENT) {
      query.reporterId = claims.sub;
    }

    const result = await WorkOrderService.list(claims.orgId, query);

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error('GET /api/maintenance/work-orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/maintenance/work-orders
 * Create a new work order.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createWorkOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { gateId, unitId, projectId, assigneeId } = parsed.data;
    const [gate, unit, project, assignee] = await Promise.all([
      gateId
        ? prisma.gate.findFirst({
            where: {
              id: gateId,
              organizationId: claims.orgId,
              deletedAt: null,
            },
            select: { id: true },
          })
        : null,
      unitId
        ? prisma.unit.findFirst({
            where: {
              id: unitId,
              organizationId: claims.orgId,
              deletedAt: null,
            },
            select: { id: true },
          })
        : null,
      projectId
        ? prisma.project.findFirst({
            where: {
              id: projectId,
              organizationId: claims.orgId,
              deletedAt: null,
            },
            select: { id: true },
          })
        : null,
      assigneeId
        ? prisma.user.findFirst({
            where: {
              id: assigneeId,
              organizationId: claims.orgId,
              deletedAt: null,
            },
            select: { id: true },
          })
        : null,
    ]);

    if (
      (gateId && !gate) ||
      (unitId && !unit) ||
      (projectId && !project) ||
      (assigneeId && !assignee)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid gateId, unitId, projectId, or assigneeId',
        },
        { status: 400 }
      );
    }

    const workOrder = await WorkOrderService.create(
      claims.orgId,
      claims.sub,
      parsed.data
    );

    return NextResponse.json(
      {
        success: true,
        data: workOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/maintenance/work-orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
