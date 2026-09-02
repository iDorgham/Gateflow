import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { requireAdminApi } from '@/lib/require-admin-api';

/**
 * GET /api/admin/analytics/ai-cost
 *
 * Admin-only: aggregates GateAI token usage and estimated spend from AiActionLog
 * over a bounded lookback window, grouped by day and by action type.
 *
 * Query params:
 *  - `days` (default 30): number of trailing days to aggregate.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminApi(request);
  if (authError) return authError;

  const url = new URL(request.url);
  const rawDays = Number(url.searchParams.get('days') ?? 30);
  const days =
    Number.isFinite(rawDays) && rawDays >= 1 && rawDays <= 90 ? rawDays : 30;

  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  try {
    const logs = await prisma.aiActionLog.findMany({
      where: { createdAt: { gte: start } },
      select: {
        createdAt: true,
        actionType: true,
        totalTokens: true,
        completionTokens: true,
        promptTokens: true,
        estimatedCost: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dayKey = (date: Date) => date.toISOString().slice(0, 10);

    type DayBucket = {
      date: string;
      actions: number;
      totalTokens: number;
      completionTokens: number;
      promptTokens: number;
      estimatedCost: number;
    };

    const byDay = new Map<string, DayBucket>();
    const byType = new Map<
      string,
      { actions: number; totalTokens: number; estimatedCost: number }
    >();

    let totalTokens = 0;
    let completionTokens = 0;
    let promptTokens = 0;
    let totalCost = 0;

    for (const log of logs) {
      const t = log.totalTokens ?? 0;
      const c = log.completionTokens ?? 0;
      const p = log.promptTokens ?? 0;
      const cost = log.estimatedCost ?? 0;

      totalTokens += t;
      completionTokens += c;
      promptTokens += p;
      totalCost += cost;

      const key = dayKey(log.createdAt);
      const day = byDay.get(key) ?? {
        date: key,
        actions: 0,
        totalTokens: 0,
        completionTokens: 0,
        promptTokens: 0,
        estimatedCost: 0,
      };
      day.actions += 1;
      day.totalTokens += t;
      day.completionTokens += c;
      day.promptTokens += p;
      day.estimatedCost += cost;
      byDay.set(key, day);

      const type = log.actionType || 'UNKNOWN';
      const typeEntry = byType.get(type) ?? {
        actions: 0,
        totalTokens: 0,
        estimatedCost: 0,
      };
      typeEntry.actions += 1;
      typeEntry.totalTokens += t;
      typeEntry.estimatedCost += cost;
      byType.set(type, typeEntry);
    }

    const series = Array.from(byDay.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const byActionType = Array.from(byType.entries()).map(
      ([actionType, v]) => ({
        actionType,
        ...v,
      })
    );

    const round2 = (n: number) => Math.round(n * 100) / 100;

    return NextResponse.json({
      success: true,
      windowDays: days,
      totals: {
        totalActions: logs.length,
        totalTokens,
        completionTokens,
        promptTokens,
        totalCost: round2(totalCost),
      },
      series,
      byActionType,
    });
  } catch (err) {
    console.error('[analytics/ai-cost] GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to aggregate AI cost analytics' },
      { status: 500 }
    );
  }
}
