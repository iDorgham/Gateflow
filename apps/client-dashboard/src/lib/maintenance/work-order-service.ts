import { prisma } from '@gate-access/db';
import {
  MaintenanceStatus,
  WorkOrder,
  CreateWorkOrderInput,
  UpdateWorkOrderInput,
  isValidStatusTransition,
  WorkOrderQuery,
} from '@gate-access/types';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';

export class WorkOrderService {
  /**
   * Create a new work order.
   */
  static async create(
    organizationId: string,
    reporterId: string,
    input: CreateWorkOrderInput
  ): Promise<WorkOrder> {
    const workOrder = await prisma.workOrder.create({
      data: {
        organizationId,
        reporterId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        category: input.category,
        locationType: input.locationType,
        locationId: input.locationId,
        gateId: input.gateId,
        unitId: input.unitId,
        projectId: input.projectId,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        assigneeId: input.assigneeId,
        status: input.assigneeId
          ? MaintenanceStatus.ASSIGNED
          : MaintenanceStatus.OPEN,
      },
    });

    // Emit event for real-time updates
    emitEvent(organizationId, EventType.MAINTENANCE_CREATED, {
      workOrderId: workOrder.id,
      title: workOrder.title,
    }).catch(() => {});

    if (workOrder.assigneeId) {
      emitEvent(organizationId, EventType.MAINTENANCE_ASSIGNED, {
        workOrderId: workOrder.id,
        assigneeId: workOrder.assigneeId,
      }).catch(() => {});
    }

    return workOrder as unknown as WorkOrder;
  }

  /**
   * List work orders with filtering and pagination.
   */
  static async list(organizationId: string, query: WorkOrderQuery) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    // If reporterId or assigneeId are in filters, they are handled by spread

    const [items, total] = await Promise.all([
      prisma.workOrder.findMany({
        // Force tenant scope + soft-delete filter to be un-overridable by query filters.
        where: { ...filters, organizationId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          assignee: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          gate: { select: { id: true, name: true } },
          unit: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      }),
      prisma.workOrder.count({
        where: { ...filters, organizationId, deletedAt: null },
      }),
    ]);

    return {
      items: items as unknown as WorkOrder[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single work order by ID.
   */
  static async getById(
    organizationId: string,
    id: string
  ): Promise<WorkOrder | null> {
    const workOrder = await prisma.workOrder.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        gate: { select: { id: true, name: true } },
        unit: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });

    return workOrder as unknown as WorkOrder | null;
  }

  /**
   * Update a work order.
   */
  static async update(
    organizationId: string,
    id: string,
    input: UpdateWorkOrderInput
  ): Promise<WorkOrder> {
    const current = await prisma.workOrder.findFirst({
      where: { id, organizationId, deletedAt: null },
    });

    if (!current) {
      throw new Error('Work order not found');
    }

    // Validate status transition
    if (
      input.status &&
      !isValidStatusTransition(
        current.status as MaintenanceStatus,
        input.status
      )
    ) {
      throw new Error(
        `Invalid status transition from ${current.status} to ${input.status}`
      );
    }

    const updated = await prisma.workOrder.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        category: input.category,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        assigneeId: input.assigneeId,
      },
    });

    // If assignee changed, emit event
    if (input.assigneeId && input.assigneeId !== current.assigneeId) {
      emitEvent(organizationId, EventType.MAINTENANCE_ASSIGNED, {
        workOrderId: updated.id,
        assigneeId: updated.assigneeId,
      }).catch(() => {});
    }

    return updated as unknown as WorkOrder;
  }

  /**
   * Soft-delete a work order.
   */
  static async delete(organizationId: string, id: string): Promise<void> {
    const count = await prisma.workOrder.count({
      where: { id, organizationId, deletedAt: null },
    });

    if (count === 0) {
      throw new Error('Work order not found');
    }

    await prisma.workOrder.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
