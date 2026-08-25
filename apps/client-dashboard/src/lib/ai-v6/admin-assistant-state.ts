import {
  UIMessageV6,
  StreamChunk,
  applyStreamChunkToMessage,
} from './ui-message-adapter';
import {
  AgenticToolCall,
  createAgenticToolCall,
  ToolExecutionState,
} from './tool-lifecycle-engine';
import { AssistantConnectionStatus } from './client-assistant-state';

export interface EmulationScenarioConfig {
  scenario:
    'luxury-compound' | 'nightclub' | 'private-school' | 'wedding-venue';
  scansCount: number;
  pastDays: number;
  incidentRate: number;
  organizationId: string;
}

export interface SecuritySurfaceAuditReport {
  offlineGatesCount: number;
  anomalousScanRate: number;
  missingStreamAlerts: string[];
  securityHealthScore: number; // 0-100
}

export interface AdminAssistantState {
  messages: UIMessageV6[];
  status: AssistantConnectionStatus;
  pendingToolCalls: AgenticToolCall[];
}

/**
 * Initializes the super-admin assistant state.
 */
export function initAdminAssistantState(
  initialMessages: UIMessageV6[] = []
): AdminAssistantState {
  return {
    messages: initialMessages,
    status: 'ready',
    pendingToolCalls: [],
  };
}

/**
 * Super-admin tool handler for triggering realistic compound traffic emulation.
 */
export function triggerCompoundTrafficEmulation(
  config: EmulationScenarioConfig
): { success: boolean; seededRecords: number; batchId: string } {
  if (!config.organizationId) {
    throw new Error(
      'TENANT_SCOPE_REQUIRED: Cannot emulate traffic without a target organizationId'
    );
  }

  const batchId = `emu-batch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const seededRecords = config.scansCount * (config.pastDays || 1);

  return {
    success: true,
    seededRecords,
    batchId,
  };
}

/**
 * Super-admin tool handler for auditing perimeter gate telemetry and anomaly detection.
 */
export function runPerimeterSecurityAudit(
  organizationId: string,
  gates: {
    id: string;
    name: string;
    isOnline: boolean;
    cameraOnline: boolean;
    scansLastHour: number;
  }[]
): SecuritySurfaceAuditReport {
  let offlineGatesCount = 0;
  const missingStreamAlerts: string[] = [];
  let totalDeductions = 0;

  for (const g of gates) {
    if (!g.isOnline) {
      offlineGatesCount++;
      totalDeductions += 25;
    }
    if (!g.cameraOnline) {
      missingStreamAlerts.push(
        `Camera optical stream disconnected at ${g.name}`
      );
      totalDeductions += 15;
    }
    if (g.scansLastHour > 500) {
      totalDeductions += 10;
    }
  }

  const healthScore = Math.max(0, 100 - totalDeductions);
  const anomalousScanRate = gates.some((g) => g.scansLastHour > 500)
    ? 0.25
    : 0.02;

  return {
    offlineGatesCount,
    anomalousScanRate,
    missingStreamAlerts,
    securityHealthScore: healthScore,
  };
}

/**
 * Formats super-admin tool call view models for the admin assistant.
 */
export function buildAdminToolCardViewModel(call: AgenticToolCall): {
  toolCallId: string;
  toolName: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  requiresApproval: boolean;
  state: ToolExecutionState;
  badgeColor: string;
} {
  let titleEn = 'Super-Admin Diagnostic';
  let titleAr = 'تشخيص المشرف العام';
  let descriptionEn = `Executing ${call.toolName}`;
  let descriptionAr = `تشغيل ${call.toolName}`;

  switch (call.toolName) {
    case 'triggerCompoundEmulation':
      titleEn = 'Trigger Traffic Emulation';
      titleAr = 'تشغيل محاكاة حركة الدخول';
      descriptionEn = `Seed ${call.args.scansCount || 100} scans for scenario: ${call.args.scenario || 'luxury-compound'}`;
      descriptionAr = `محاكاة ${call.args.scansCount || 100} حركة دخول لسيناريو: ${call.args.scenario || 'مجمع سكني فاخر'}`;
      break;

    case 'runPerimeterSecurityAudit':
      titleEn = 'Perimeter Security Audit';
      titleAr = 'تدقيق أمن البوابات والمحيط';
      descriptionEn = `Audit all perimeter gates for org: ${call.args.organizationId || 'Target Org'}`;
      descriptionAr = `فحص سلامة بوابات المنشأة: ${call.args.organizationId || ''}`;
      break;
  }

  let badgeColor = '#6554C0'; // ADS Purple P400 for Super-Admin
  if (call.state === 'requires-action') {
    badgeColor = '#FFAB00';
  } else if (call.state === 'completed') {
    badgeColor = '#36B37E';
  } else if (call.state === 'failed' || call.state === 'rejected') {
    badgeColor = '#FF5630';
  }

  return {
    toolCallId: call.toolCallId,
    toolName: call.toolName,
    titleEn,
    titleAr,
    descriptionEn,
    descriptionAr,
    requiresApproval: call.isDangerous && call.state === 'requires-action',
    state: call.state,
    badgeColor,
  };
}
