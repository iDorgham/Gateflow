import { prisma } from '@gate-access/db';

/**
 * AI Usage Tracking Utility
 * Records token consumption and estimated costs into the AiUsageLog table.
 * Supports Vercel AI SDK v6 metrics.
 */
export async function trackAiUsage(params: {
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens?: number;
  };
  department: 'SALES' | 'MARKETING' | 'DEV' | 'SUPPORT' | 'CRM';
  action: string;
}) {
  const { model, usage, department, action } = params;

  // Estimated cost based on mid-2026 pricing (Blended average for high-fidelity models)
  // Gemini 1.5 Pro: ~$1.25 / 1M input, ~$3.75 / 1M output
  const cost =
    (usage.promptTokens * 1.25) / 1_000_000 +
    (usage.completionTokens * 3.75) / 1_000_000;

  try {
    await (prisma as any).aiUsageLog.create({
      data: {
        model,
        inputTokens: usage.promptTokens,
        outputTokens: usage.completionTokens,
        estimatedCost: cost,
        department,
        action,
      },
    });

    return { success: true, cost };
  } catch (error) {
    console.error('[AI_USAGE_LOG_ERROR]', error);
    return { success: false, cost: 0 };
  }
}
