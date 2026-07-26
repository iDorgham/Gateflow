import { Prisma, prisma } from '@gate-access/db';
import { AiActionStatus } from '@gate-access/db';
import { redactSensitiveAiText } from './transcript-privacy';

export interface CreateAiActionParams {
  organizationId: string;
  userId?: string;
  actionType: string;
  prompt: string;
  intentJson?: unknown;
  metadata?: unknown;
  status?: AiActionStatus | string;
}

export class AiActionService {
  /**
   * Redact sensitive information from text (Emails, Phones, etc.)
   */
  static maskPII(text: string | null | undefined): string {
    return redactSensitiveAiText(text);
  }

  /**
   * Create a new AI action log
   */
  static async createAction(params: CreateAiActionParams) {
    console.log(`>>> [AiActionService] Creating action: ${params.actionType}`);

    return await prisma.aiActionLog.create({
      data: {
        organizationId: params.organizationId,
        userId: params.userId,
        actionType: params.actionType,
        prompt: this.maskPII(params.prompt),
        intentJson:
          params.intentJson == null
            ? Prisma.JsonNull
            : (params.intentJson as Prisma.InputJsonValue),
        status: (params.status as AiActionStatus) || 'PENDING',
        metadata:
          params.metadata == null
            ? Prisma.JsonNull
            : (params.metadata as Prisma.InputJsonValue),
      },
    });
  }

  /**
   * Record token usage and estimated cost
   */
  static async recordUsage(
    actionId: string,
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    }
  ) {
    // Gemini Flash pricing: $0.075 / 1M input, $0.30 / 1M output
    const inputCost = (usage.promptTokens / 1_000_000) * 0.075;
    const outputCost = (usage.completionTokens / 1_000_000) * 0.3;
    const estimatedCost = inputCost + outputCost;

    return await prisma.aiActionLog.update({
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
  static async submitFeedback(params: {
    actionId: string;
    organizationId: string;
    userId: string;
    feedback: 'THUMBS_UP' | 'THUMBS_DOWN';
  }): Promise<boolean> {
    const result = await prisma.aiActionLog.updateMany({
      where: {
        id: params.actionId,
        organizationId: params.organizationId,
        userId: params.userId,
        feedback: null,
      },
      data: { feedback: params.feedback },
    });
    return result.count === 1;
  }

  static async claimPendingAction(params: {
    actionId: string;
    organizationId: string;
    userId: string;
  }) {
    const action = await prisma.aiActionLog.findFirst({
      where: {
        id: params.actionId,
        organizationId: params.organizationId,
        userId: params.userId,
        status: 'PENDING',
      },
      select: {
        id: true,
        actionType: true,
        intentJson: true,
      },
    });
    if (!action) return null;

    const claimed = await prisma.aiActionLog.updateMany({
      where: {
        id: params.actionId,
        organizationId: params.organizationId,
        userId: params.userId,
        status: 'PENDING',
      },
      data: { status: 'CONFIRMED' },
    });
    return claimed.count === 1 ? action : null;
  }

  static async completeClaimedAction(params: {
    actionId: string;
    organizationId: string;
    userId: string;
    status: 'EXECUTED' | 'FAILED';
    result?: string;
  }): Promise<boolean> {
    const updated = await prisma.aiActionLog.updateMany({
      where: {
        id: params.actionId,
        organizationId: params.organizationId,
        userId: params.userId,
        status: 'CONFIRMED',
      },
      data: {
        status: params.status,
        result: params.result ? this.maskPII(params.result) : undefined,
        updatedAt: new Date(),
      },
    });
    return updated.count === 1;
  }

  /**
   * Update the status of an AI action
   */
  static async updateStatus(
    actionId: string,
    status: AiActionStatus | string,
    result?: string
  ) {
    console.log(
      `>>> [AiActionService] Updating action ${actionId} to: ${status}`
    );

    return await prisma.aiActionLog.update({
      where: { id: actionId },
      data: {
        status: status as AiActionStatus,
        result: result ? this.maskPII(result) : undefined,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get an action by ID
   */
  static async getAction(actionId: string) {
    return await prisma.aiActionLog.findUnique({
      where: { id: actionId },
    });
  }
}
