import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';
import { AnalyticsCharts } from './analytics-charts';
import { PrintButton } from './print-button';
import type {
  DailyCount,
  StatusCount,
  GateCount,
  HeatmapCell,
  RoleCount,
} from './analytics-charts';

export const metadata = { title: 'Analytics' };

// ─── Date range helpers ────────────────────────────────────────────────────────

function parseDateRange(
  range?: string,
  from?: string,
  to?: string
): { dateFrom: Date; dateTo: Date; label: string } {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (range === 'custom' && from && to) {
    const df = new Date(from);
    const dt = new Date(to);
    dt.setHours(23, 59, 59, 999);
    if (!isNaN(df.getTime()) && !isNaN(dt.getTime())) {
      return {
        dateFrom: df,
        dateTo: dt,
        label: `${df.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      };
    }
  }

  if (range === '30d') {
    const df = new Date(now);
    df.setDate(df.getDate() - 29);
    df.setHours(0, 0, 0, 0);
    return { dateFrom: df, dateTo: now, label: 'Last 30 days' };
  }

  // Default: 7d
  const df = new Date(now);
  df.setDate(df.getDate() - 6);
  df.setHours(0, 0, 0, 0);
  return { dateFrom: df, dateTo: now, label: 'Last 7 days' };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SearchParams = { range?: string; from?: string; to?: string };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const orgId = claims.orgId;
  const projectId = await getValidatedProjectId(orgId);

  const { dateFrom, dateTo, label: dateLabel } = parseDateRange(
    searchParams.range,
    searchParams.from,
    searchParams.to
  );

  // Build shared Prisma where for scans via qrCode
  const qrFilter = projectId
    ? { organizationId: orgId, projectId }
    : { organizationId: orgId };

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Build days array
  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.min(
    Math.round((dateTo.getTime() - dateFrom.getTime()) / dayMs) + 1,
    90
  );
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(dateFrom);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [
    dailyCountsRaw,
    statusBreakdown,
    topGatesRaw,
    successRate30d,
    totalScans30d,
    heatmapRaw,
    roleBreakdown,
  ] = await Promise.all([
    // Daily scans
    Promise.all(
      days.map(async (dayStart) => {
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        const count = await prisma.scanLog.count({
          where: {
            qrCode: qrFilter,
            scannedAt: { gte: dayStart, lt: dayEnd },
          },
        });
        return { date: dayStart, count };
      })
    ),

    // Status breakdown (30d)
    prisma.scanLog.groupBy({
      by: ['status'],
      where: { qrCode: qrFilter, scannedAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),

    // Top 10 gates
    prisma.gate.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(projectId ? { projectId } : {}),
      },
      include: { _count: { select: { scanLogs: true } } },
      orderBy: { scanLogs: { _count: 'desc' } },
      take: 10,
    }),

    // 30d success rate
    prisma.scanLog.count({
      where: { qrCode: qrFilter, status: 'SUCCESS', scannedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.scanLog.count({
      where: { qrCode: qrFilter, scannedAt: { gte: thirtyDaysAgo } },
    }),

    // Heatmap via raw SQL — no conditional template-literal injection
    (async () => {
      type Row = { dow: number; hour: number; count: bigint };
      if (projectId) {
        return prisma.$queryRaw<Row[]>`
          SELECT
            EXTRACT(DOW FROM sl."scannedAt")::int AS dow,
            EXTRACT(HOUR FROM sl."scannedAt")::int AS hour,
            COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          WHERE qr."organizationId" = ${orgId}
            AND qr."projectId" = ${projectId}
            AND sl."scannedAt" >= ${dateFrom}
            AND sl."scannedAt" <= ${dateTo}
          GROUP BY dow, hour
        `;
      }
      return prisma.$queryRaw<Row[]>`
        SELECT
          EXTRACT(DOW FROM sl."scannedAt")::int AS dow,
          EXTRACT(HOUR FROM sl."scannedAt")::int AS hour,
          COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."scannedAt" >= ${dateFrom}
          AND sl."scannedAt" <= ${dateTo}
        GROUP BY dow, hour
      `;
    })(),

    // Role breakdown
    (async (): Promise<RoleCount[]> => {
      const groups = await prisma.scanLog.groupBy({
        by: ['userId'],
        where: {
          qrCode: qrFilter,
          scannedAt: { gte: dateFrom, lte: dateTo },
          userId: { not: null },
        },
        _count: true,
      });
      if (groups.length === 0) return [];
      const userIds = groups.map((g) => g.userId!).filter(Boolean);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, role: true },
      });
      const roleMap = new Map(users.map((u) => [u.id, u.role]));
      const roleCounts = new Map<string, number>();
      for (const g of groups) {
        const role = roleMap.get(g.userId!) ?? 'UNKNOWN';
        roleCounts.set(role, (roleCounts.get(role) ?? 0) + g._count);
      }
      return Array.from(roleCounts.entries()).map(([role, count]) => ({ role, count }));
    })(),
  ]);

  const successRatePct =
    totalScans30d > 0 ? Math.round((successRate30d / totalScans30d) * 100) : 0;

  // Serialise for client component
  const daily: DailyCount[] = dailyCountsRaw.map(({ date, count }) => ({
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count,
  }));

  const statusBreakdownSer: StatusCount[] = statusBreakdown.map((s) => ({
    status: s.status,
    _count: s._count,
  }));

  const topGates: GateCount[] = topGatesRaw.map((g) => ({
    name: g.name,
    scans: g._count.scanLogs,
  }));

  const heatmap: HeatmapCell[] = (heatmapRaw as { dow: number; hour: number; count: bigint | number }[]).map(
    (r) => ({
      dow: r.dow,
      hour: r.hour,
      count: typeof r.count === 'bigint' ? Number(r.count) : r.count,
    })
  );

  const currentRange = searchParams.range ?? '7d';
  const currentFrom = searchParams.from ?? '';
  const currentTo = searchParams.to ?? '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Scan activity and access patterns for your organisation.
          </p>
        </div>

        {/* Date range controls + print */}
        <div className="no-print flex flex-wrap items-center gap-2 shrink-0">
          <form method="GET" className="flex flex-wrap items-center gap-2">
            {(['7d', '30d'] as const).map((r) => (
              <button
                key={r}
                name="range"
                value={r}
                type="submit"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  currentRange === r
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {r === '7d' ? '7 days' : '30 days'}
              </button>
            ))}

            <div className="flex items-center gap-1">
              <input
                type="date"
                name="from"
                defaultValue={currentFrom}
                aria-label="From date"
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-400">–</span>
              <input
                type="date"
                name="to"
                defaultValue={currentTo}
                aria-label="To date"
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                name="range"
                value="custom"
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Apply
              </button>
            </div>
          </form>

          <PrintButton />
        </div>
      </div>

      {/* Date label badge */}
      <span className="no-print inline-block rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 shadow-sm">
        {dateLabel}
      </span>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Success Rate (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{successRatePct}%</div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100 dark:bg-slate-700">
              <div className="h-full rounded bg-green-500" style={{ width: `${successRatePct}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Scans (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalScans30d.toLocaleString()}</div>
            <p className="mt-1 text-xs text-slate-400">{successRate30d.toLocaleString()} successful</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Gates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{topGates.length}</div>
            <p className="mt-1 text-xs text-slate-400">with scan activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts charts */}
      <AnalyticsCharts
        daily={daily}
        statusBreakdown={statusBreakdownSer}
        topGates={topGates}
        heatmap={heatmap}
        roleBreakdown={roleBreakdown}
        dateLabel={dateLabel}
      />
    </div>
  );
}
