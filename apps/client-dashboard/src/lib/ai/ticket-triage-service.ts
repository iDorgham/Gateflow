import {
  prisma,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceLocationType,
} from '@gate-access/db';
import { AiActionService } from './ai-action-service';

export interface TriageResult {
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  summary: string;
  recommendedAction: string;
  urgencyScore: number; // 0 to 100
}

export class TicketTriageService {
  /**
   * Analyzes natural language input text to categorize priority, category, and action recommendation.
   */
  static analyzeRequestText(text: string): TriageResult {
    const lower = text.toLowerCase();

    let category: MaintenanceCategory = MaintenanceCategory.GENERAL;
    let priority: MaintenancePriority = MaintenancePriority.MEDIUM;
    let urgencyScore = 40;

    // Category detection heuristics
    if (/gate|barrier|scanner|camera|anpr|sensor|relay|lpr|rfid/i.test(lower)) {
      category = MaintenanceCategory.HARDWARE;
    } else if (
      /wire|power|electric|light|outage|short|voltage|spark/i.test(lower)
    ) {
      category = MaintenanceCategory.ELECTRICAL;
    } else if (/leak|water|pipe|drain|flood|plumb/i.test(lower)) {
      category = MaintenanceCategory.PLUMBING;
    } else if (/air|ac|heat|hvac|vent|chiller/i.test(lower)) {
      category = MaintenanceCategory.HVAC;
    }

    // Priority detection heuristics
    if (
      /urgent|emergency|danger|stuck open|broken barrier|smoke|fire|flood|security breach/i.test(
        lower
      )
    ) {
      priority = MaintenancePriority.URGENT;
      urgencyScore = 95;
    } else if (
      /high|broken|not working|fail|jammed|error|blocked/i.test(lower)
    ) {
      priority = MaintenancePriority.HIGH;
      urgencyScore = 75;
    } else if (/minor|noise|cosmetic|slow|squeak|request/i.test(lower)) {
      priority = MaintenancePriority.LOW;
      urgencyScore = 20;
    }

    const summary = `GateAI Triage: Classified as ${category} (${priority} priority).`;
    const recommendedAction =
      priority === MaintenancePriority.URGENT
        ? 'Immediate vendor dispatch & perimeter alert'
        : priority === MaintenancePriority.HIGH
          ? 'Assign to hardware technician within 4 hours'
          : 'Queue for standard maintenance window';

    return {
      category,
      priority,
      summary,
      recommendedAction,
      urgencyScore,
    };
  }

  /**
   * Accepts natural language maintenance ticket request, runs AI triage, creates a WorkOrder,
   * assigns vendor automatically, and logs AI action audit trail.
   */
  static async triageAndDispatch(params: {
    organizationId: string;
    reporterId: string;
    description: string;
    locationType?: MaintenanceLocationType;
    locationId?: string;
    gateId?: string;
    unitId?: string;
  }) {
    const analysis = this.analyzeRequestText(params.description);

    // Find best matching active vendor for organization
    const vendor = await prisma.vendor.findFirst({
      where: {
        organizationId: params.organizationId,
        deletedAt: null,
        category: { in: [analysis.category, MaintenanceCategory.GENERAL] },
      },
      orderBy: { createdAt: 'asc' },
    });

    const workOrder = await prisma.workOrder.create({
      data: {
        organizationId: params.organizationId,
        title: `GateAI: ${analysis.category} - ${params.description.slice(0, 50)}...`,
        description: `${params.description}\n\n--- GateAI Autonomous Triage Summary ---\n${analysis.summary}\nRecommended Action: ${analysis.recommendedAction}\nUrgency Score: ${analysis.urgencyScore}/100`,
        status: vendor ? MaintenanceStatus.ASSIGNED : MaintenanceStatus.OPEN,
        priority: analysis.priority,
        category: analysis.category,
        locationType: params.locationType,
        locationId: params.locationId || params.gateId || params.unitId,
        gateId: params.gateId,
        unitId: params.unitId,
        vendorId: vendor?.id,
        reporterId: params.reporterId,
      },
    });

    // Record AI Action for Audit Compliance
    await AiActionService.createAction({
      organizationId: params.organizationId,
      actionType: 'TICKET_AUTONOMOUS_TRIAGE',
      prompt: params.description,
      status: 'EXECUTED',
      metadata: {
        workOrderId: workOrder.id,
        category: analysis.category,
        priority: analysis.priority,
        urgencyScore: analysis.urgencyScore,
        vendorId: vendor?.id,
        vendorName: vendor?.name || 'Unassigned',
      },
    });

    return {
      workOrder,
      analysis,
      assignedVendor: vendor ? { id: vendor.id, name: vendor.name } : null,
    };
  }
}
