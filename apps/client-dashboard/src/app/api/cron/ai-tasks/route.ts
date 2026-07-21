import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { AiTaskService } from '@/lib/ai/ai-task-service';

export const dynamic = 'force-dynamic';

/**
 * Background Task Runner
 * Triggered by a cron service (e.g. Upstash, GitHub Actions)
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Fail closed: missing CRON_SECRET must not expose the runner publicly.
  if (!cronSecret || cronSecret.length < 16) {
    return NextResponse.json(
      { success: false, message: 'Cron endpoint misconfigured' },
      { status: 503 }
    );
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const now = new Date();

    // 1. Find pending tasks to run
    const tasks = await (prisma as any).aiTask.findMany({
      where: {
        status: { in: ['PENDING', 'COMPLETED'] }, // Allow completed tasks to run again if they have a cron
        nextRun: { lte: now },
      },
    });

    console.log(`>>> [GateAI Cron] Found ${tasks.length} tasks to process`);

    const results = [];

    for (const task of tasks) {
      try {
        // Mark as running
        await (prisma as any).aiTask.update({
          where: { id: task.id },
          data: { status: 'RUNNING' },
        });

        // 2. Execute Task Logic
        // For now, we only support REPORT_GEN
        if (task.type === 'REPORT_GEN') {
          console.log(
            `>>> [GateAI Cron] Executing Report Gen for ${task.title}`
          );
          // Logic would go here: e.g. generate report and email/store it.
          // Since this is a skeleton phase, we just log and succeed.
        }

        // 3. Update task status and next run
        const nextRun = AiTaskService.calculateNextRun(task.cron || undefined);

        await (prisma as any).aiTask.update({
          where: { id: task.id },
          data: {
            status: 'COMPLETED',
            lastRun: now,
            nextRun: nextRun,
          },
        });

        results.push({ id: task.id, title: task.title, status: 'SUCCESS' });
      } catch (err: any) {
        console.error(`>>> [GateAI Cron] Task failed: ${task.id}`, err);
        await (prisma as any).aiTask.update({
          where: { id: task.id },
          data: {
            status: 'FAILED',
            error: err?.message || 'Unknown error',
          },
        });
        results.push({ id: task.id, title: task.title, status: 'FAILED' });
      }
    }

    return NextResponse.json({
      success: true,
      processed: tasks.length,
      results,
    });
  } catch (error) {
    console.error('>>> [GateAI Cron] Fatal Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
