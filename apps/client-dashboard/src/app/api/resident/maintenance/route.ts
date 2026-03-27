import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { WorkOrderService } from '@/lib/maintenance/work-order-service';
import { prisma } from '@gate-access/db';
import {
  createWorkOrderSchema,
  workOrderQuerySchema,
  BUILT_IN_ROLES,
  MaintenanceLocationType,
} from '@gate-access/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/resident/maintenance
 * List maintenance reports created by the current resident.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // RBAC check: only residents should use this endpoint
    const isResident = claims.roleName === BUILT_IN_ROLES.RESIDENT;
    if (!isResident) {
      return NextResponse.json(
        { success: false, message: 'Resident role required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const parsed = workOrderQuerySchema.safeParse({
      ...queryParams,
      reporterId: claims.sub, // Enforce resident scoping
    });

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

    const result = await WorkOrderService.list(claims.orgId, parsed.data);

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error('GET /api/resident/maintenance error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resident/maintenance
 * Create a new work order for a resident's linked unit.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. Resolve the resident's linked unit
    const unit = await prisma.unit.findFirst({
      where: {
        userId: claims.sub,
        organizationId: claims.orgId,
        deletedAt: null,
      },
      select: { id: true, projectId: true },
    });

    if (!unit) {
      return NextResponse.json(
        {
          success: false,
          message: 'No unit linked to this account. Cannot report maintenance.',
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // 2. Pre-fill unit and project context to ensure data integrity
    const payload = {
      ...body,
      locationType: MaintenanceLocationType.UNIT,
      locationId: unit.id,
      unitId: unit.id,
      projectId: unit.projectId,
    };

    const parsed = createWorkOrderSchema.safeParse(payload);

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
    console.error('POST /api/resident/maintenance error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
