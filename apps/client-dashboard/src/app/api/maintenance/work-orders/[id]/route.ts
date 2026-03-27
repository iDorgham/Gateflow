import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { WorkOrderService } from '@/lib/maintenance/work-order-service';
import { updateWorkOrderSchema, BUILT_IN_ROLES } from '@gate-access/types';

/**
 * GET /api/maintenance/work-orders/[id]
 * Get work order details.
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await props.params;
    const { id } = params;
    const workOrder = await WorkOrderService.getById(claims.orgId, id);

    if (!workOrder) {
      return NextResponse.json(
        { success: false, message: 'Work order not found' },
        { status: 404 }
      );
    }

    // RBAC: Residents can only see their own reports
    if (
      claims.roleName === BUILT_IN_ROLES.RESIDENT &&
      workOrder.reporterId !== claims.sub
    ) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: workOrder,
    });
  } catch (error) {
    console.error(`GET /api/maintenance/work-orders/[id] error:`, error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/maintenance/work-orders/[id]
 * Update work order.
 */
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const parsed = updateWorkOrderSchema.safeParse(body);

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

    // RBAC: Residents cannot update work orders (except maybe cancellation, but keeping it simple for now)
    if (claims.roleName === BUILT_IN_ROLES.RESIDENT) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const updated = await WorkOrderService.update(
      claims.orgId,
      id,
      parsed.data
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error(`PATCH /api/maintenance/work-orders/[id] error:`, error);
    const status = error.message === 'Work order not found' ? 404 : 400;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

/**
 * DELETE /api/maintenance/work-orders/[id]
 * Soft-delete work order.
 */
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // RBAC: Only Admins can delete
    if (
      claims.roleName !== BUILT_IN_ROLES.SUPER_ADMIN &&
      claims.roleName !== BUILT_IN_ROLES.ORG_ADMIN
    ) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const params = await props.params;
    const { id } = params;
    await WorkOrderService.delete(claims.orgId, id);

    return NextResponse.json({
      success: true,
      message: 'Work order deleted',
    });
  } catch (error: any) {
    console.error(`DELETE /api/maintenance/work-orders/[id] error:`, error);
    const status = error.message === 'Work order not found' ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}
