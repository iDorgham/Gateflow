import {
  prisma,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceLocationType,
} from '@gate-access/db';
import { AiActionService } from './ai-action-service';

export class MaintenanceExecutor {
  /**
   * Automatically process a scan failure event.
   * If threshold is met or it's a critical failure, assign a vendor.
   */
  static async handleScanFailure(params: {
    organizationId: string;
    gateId: string;
    projectId?: string;
    reason: string;
  }) {
    console.log(
      `>>> [MaintenanceExecutor] Handling scan failure for gate: ${params.gateId}`
    );

    // 1. Log the event in EventLog (Agentic context)
    // We use a separate EventLog row to track the raw failure event
    const event = await prisma.eventLog.create({
      data: {
        organizationId: params.organizationId,
        type: 'SCAN_FAILURE',
        payload: {
          gateId: params.gateId,
          projectId: params.projectId,
          reason: params.reason,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // 2. Fetch recent failures for this gate to detect "Downtime"
    // In a real scenario, we'd use a more specialized stream processor,
    // but for the MVP foundation, we query the SQL log.
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Note: Prisma Json filtering can be tricky. We use a count of EventLog entries
    // with type SCAN_FAILURE for this organization in the last 10 mins.
    const recentEvents = await prisma.eventLog.findMany({
      where: {
        organizationId: params.organizationId,
        type: 'SCAN_FAILURE',
        createdAt: { gte: tenMinutesAgo },
      },
    });

    // Filter manually for this gateId in payload since cross-db Json paths are non-standard
    const matchingFailures = recentEvents.filter(
      (e) => (e.payload as any)?.gateId === params.gateId
    );

    console.log(
      `>>> [MaintenanceExecutor] Found ${matchingFailures.length} recent failures for gate ${params.gateId}`
    );

    // 3. If threshold met (e.g. 3 failures in 10 mins), escalate to WorkOrder
    if (matchingFailures.length >= 3) {
      return await this.createAutonomousWorkOrder(params);
    }

    return null;
  }

  /**
   * Create a work order and link it to the appropriate vendor.
   */
  private static async createAutonomousWorkOrder(params: {
    organizationId: string;
    gateId: string;
    projectId?: string;
    reason: string;
  }) {
    console.log(
      `>>> [MaintenanceExecutor] Threshold exceeded! Escalating to WorkOrder.`
    );

    // Find a vendor for this organization (and project if specified)
    // Preference: Project-specific vendor -> Org-wide vendor
    // We target GATE_MAINTENANCE/HARDWARE category
    const vendor = await prisma.vendor.findFirst({
      where: {
        organizationId: params.organizationId,
        deletedAt: null,
        category: {
          in: [MaintenanceCategory.HARDWARE, MaintenanceCategory.GENERAL],
        },
        OR: [{ projectId: params.projectId }, { projectId: null }],
      },
      orderBy: {
        projectId: { sort: 'desc', nulls: 'last' } as any, // Prefer specific project
      },
    });

    // Strategy: We need a reporterId.
    // We'll search for the first ADMIN user in the organization to act as the "Requester".
    const systemAdmin = await prisma.user.findFirst({
      where: {
        organizationId: params.organizationId,
        role: { name: 'ADMIN' },
      },
    });

    if (!systemAdmin) {
      console.warn(
        `>>> [MaintenanceExecutor] No admin found to report WorkOrder for org ${params.organizationId}`
      );
      return null;
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        organizationId: params.organizationId,
        title: `GateAI: Repair needed for ${params.reason}`,
        description: `Autonomous Maintenance: Detected 3+ consecutive scan failures for gate ID ${params.gateId}. Reason: ${params.reason}. Assigned automatically via GateFlow Perimeter Intelligence.`,
        status: vendor ? MaintenanceStatus.ASSIGNED : MaintenanceStatus.OPEN,
        priority: MaintenancePriority.URGENT,
        category: MaintenanceCategory.HARDWARE,
        locationType: MaintenanceLocationType.GATE,
        locationId: params.gateId,
        gateId: params.gateId,
        projectId: params.projectId,
        vendorId: vendor?.id,
        reporterId: systemAdmin.id,
      },
    });

    // 4. Record the AI action for the audit trail
    await AiActionService.createAction({
      organizationId: params.organizationId,
      actionType: 'MAINTENANCE_AUTONOMOUS_TRIGGER',
      prompt: `Autonomous maintenance escalation for gate ${params.gateId}. Failures detected: ${params.reason}`,
      status: 'EXECUTED',
      metadata: {
        workOrderId: workOrder.id,
        vendorId: vendor?.id,
        vendorName: vendor?.name || 'Unassigned',
      },
    });

    console.log(
      `>>> [MaintenanceExecutor] WorkOrder ${workOrder.id} created and assigned to ${vendor?.name || 'Backlog'}`
    );

    return workOrder;
  }
}
