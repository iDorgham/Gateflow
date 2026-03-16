import { prisma } from '@gate-access/db';
import { AiActionStatus } from '@gate-access/db';

export interface CreateAiActionParams {
  organizationId: string;
  userId?: string;
  actionType: string;
  prompt: string;
  intentJson?: any;
  metadata?: any;
  status?: AiActionStatus | string;
}

export class AiActionService {
  /**
   * Create a new AI action log
   */
  static async createAction(params: CreateAiActionParams) {
    console.log(`>>> [AiActionService] Creating action: ${params.actionType}`);
    
    return await (prisma as any).aiActionLog.create({
      data: {
        organizationId: params.organizationId,
        userId: params.userId,
        actionType: params.actionType,
        prompt: params.prompt,
        intentJson: params.intentJson || null,
        status: (params.status as any) || 'PENDING',
        metadata: params.metadata,
      },
    });
  }

  /**
   * Record token usage and estimated cost
   */
  static async recordUsage(actionId: string, usage: { promptTokens: number; completionTokens: number; totalTokens: number }) {
    // Gemini Flash pricing: $0.075 / 1M input, $0.30 / 1M output
    const inputCost = (usage.promptTokens / 1_000_000) * 0.075;
    const outputCost = (usage.completionTokens / 1_000_000) * 0.30;
    const estimatedCost = inputCost + outputCost;

    return await (prisma as any).aiActionLog.update({
      where: { id: actionId },
      data: {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        estimatedCost,
      },
    });
  }

  /**
   * Submit feedback for an action
   */
  static async submitFeedback(actionId: string, feedback: 'THUMBS_UP' | 'THUMBS_DOWN') {
    return await (prisma as any).aiActionLog.update({
      where: { id: actionId },
      data: { feedback },
    });
  }

  /**
   * Update the status of an AI action
   */
  static async updateStatus(actionId: string, status: AiActionStatus | string, result?: string) {
    console.log(`>>> [AiActionService] Updating action ${actionId} to: ${status}`);
    
    return await (prisma as any).aiActionLog.update({
      where: { id: actionId },
      data: {
        status,
        result,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get an action by ID
   */
  static async getAction(actionId: string) {
    return await (prisma as any).aiActionLog.findUnique({
      where: { id: actionId },
    });
  }
}
