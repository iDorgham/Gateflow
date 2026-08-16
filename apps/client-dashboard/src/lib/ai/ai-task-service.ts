import { prisma } from '@gate-access/db';
// import { AiTaskStatus } from '@gate-access/db';

export interface CreateAiTaskParams {
  organizationId: string;
  userId?: string;
  type: string;
  title: string;
  params: Record<string, unknown>;
  cron?: string;
}

/**
 * Service to manage AI-driven background tasks (e.g. scheduled reports).
 */
export const AiTaskService = {
  /**
   * Create a new scheduled task.
   */
  async createTask(data: CreateAiTaskParams) {
    const nextRun = this.calculateNextRun(data.cron);
    
    return await prisma.aiTask.create({
      data: {
        organizationId: data.organizationId,
        type: data.type,
        title: data.title,
        params: data.params as object,
        cron: data.cron,
        status: 'PENDING',
        nextRun: nextRun,
      },
    });
  },

  /**
   * Simple "next run" calculator for basic intervals.
   * Supports: 
   * - "daily": Every day at midnight.
   * - "weekly": Every Sunday at midnight.
   * - Cron expressions (basic support): "0 0 * * *" (daily), "0 0 * * 0" (weekly)
   */
  calculateNextRun(cron?: string): Date {
    const now = new Date();
    const next = new Date(now);
    
    // Clear time for default midnight runs
    next.setHours(24, 0, 0, 0);

    if (!cron) return next;

    const c = cron.toLowerCase();
    
    if (c === 'daily' || c === '0 0 * * *') {
      return next;
    }
    
    if (c === 'weekly' || c === '0 0 * * 0') {
      // Find next Sunday (day 0)
      const day = next.getDay();
      const diff = day === 0 ? 0 : 7 - day;
      next.setDate(next.getDate() + diff);
      return next;
    }

    // Default to tomorrow if unknown
    return next;
  }
};
