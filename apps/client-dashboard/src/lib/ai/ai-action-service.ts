import { prisma } from '@gate-access/db';
import { AiActionStatus } from '@gate-access/db';

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
    if (!text) return '';

    // Mask emails: test@example.com -> t***@example.com
    // ReDoS-resistant pattern using non-backtracking structure
    let masked = text.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
      (match) => {
        const atIdx = match.indexOf('@');
        if (atIdx <= 1) return match[0] + '***' + match.slice(atIdx);
        return match[0] + '***' + match.slice(atIdx);
      }
    );

    // Mask phone numbers: +961 70 123 456 -> +961 70 *** 456
    // Simplified pattern to avoid nested quantifiers and polynomial backtracking
    masked = masked.replace(
      /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,9}/g,
      (match) => {
        if (match.length < 8) return match;
        // Basic masking strategy: keep first part, mask middle, keep last 4
        const visible = Math.max(3, match.length - 8);
        return (
          match.substring(0, visible) +
          '***' +
          match.substring(match.length - 4)
        );
      }
    );

    return masked;
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
        intentJson: (params.intentJson as any) || null,
        status: (params.status as AiActionStatus) || 'PENDING',
        metadata: params.metadata as any,
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
  static async submitFeedback(
    actionId: string,
    feedback: 'THUMBS_UP' | 'THUMBS_DOWN'
  ) {
    return await prisma.aiActionLog.update({
      where: { id: actionId },
      data: { feedback },
    });
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
