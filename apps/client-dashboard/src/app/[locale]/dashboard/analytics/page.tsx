import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';
import dynamic from 'next/dynamic';
import { getTranslation, type TranslationFunction } from '@/lib/i18n';
import { Locale } from '@/lib/i18n-config';
import { PrintButton } from './print-button';
const AnalyticsCharts = dynamic(() => import('./analytics-charts').then(mod => mod.AnalyticsCharts), { ssr: false });
import type {
  DailyCount,
  StatusCount,
  GateCount,
  HeatmapCell,
  RoleCount,
  QRTypeCount,
  GateSuccessRate,
} from './analytics-charts';

export const metadata = { title: 'Analytics' };

// ─── Date range helpers ────────────────────────────────────────────────────────

function parseDateRange(
  t: TranslationFunction,
  locale: string,
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
        label: `${df.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${dt.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`,
      };
    }
  }

  if (range === '30d') {
    const df = new Date(now);
    df.setDate(df.getDate() - 29);
    df.setHours(0, 0, 0, 0);
    return { dateFrom: df, dateTo: now, label: t('analytics.range30d') };
  }

  // Default: 7d
  const df = new Date(now);
  df.setDate(df.getDate() - 6);
  df.setHours(0, 0, 0, 0);
  return { dateFrom: df, dateTo: now, label: t('analytics.range7d') };
}

function calcTrend(current: number, prior: number): { pct: number; dir: 'up' | 'down' | 'flat' } {
  if (prior === 0 && current === 0) return { pct: 0, dir: 'flat' };
  if (prior === 0) return { pct: 100, dir: 'up' };
  const pct = Math.round(((current - prior) / prior) * 100);
  return { pct: Math.abs(pct), dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SearchParams = { range?: string; from?: string; to?: string };

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const orgId = claims.orgId;
  const projectId = await getValidatedProjectId(orgId);

  const { dateFrom, dateTo, label: dateLabel } = parseDateRange(
    t,
    params.locale,
    searchParams.range,
    searchParams.from,
    searchParams.to
  );

  // Build shared Prisma where for scans via qrCode
  const qrFilter = projectId
    ? { organizationId: orgId, projectId }
    : { organizationId: orgId };

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

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
    prevSuccessRate30d,
    prevTotalScans30d,
    deniedCount30d,
    qrTypeBreakdownRaw,
    gateSuccessRatesRaw,
  ] = await Promise.all([
    // Daily scans (Optimized raw GROUP BY query)
    (async () => {
      type DailyRow = { day: Date; count: bigint };
      let rows: DailyRow[];
      if (projectId) {
        rows = await prisma.$queryRaw<DailyRow[]>`
          SELECT DATE(sl."scannedAt") AS day, COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          WHERE qr."organizationId" = ${orgId}
            AND qr."projectId" = ${projectId}
            AND sl."scannedAt" >= ${dateFrom}
            AND sl."scannedAt" <= ${dateTo}
          GROUP BY day
        `;
      } else {
        rows = await prisma.$queryRaw<DailyRow[]>`
          SELECT DATE(sl."scannedAt") AS day, COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          WHERE qr."organizationId" = ${orgId}
            AND sl."scannedAt" >= ${dateFrom}
            AND sl."scannedAt" <= ${dateTo}
          GROUP BY day
        `;
      }
      
      const countsMap = new Map();
      for (const r of rows) {
        countsMap.set(new Date(r.day).toISOString().split('T')[0], Number(r.count));
      }

      return days.map(dayStart => {
        const dateStr = dayStart.toISOString().split('T')[0];
        return {
          date: dayStart,
          count: countsMap.get(dateStr) ?? 0
        };
      });
    })(),

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
        const roleObj = roleMap.get(g.userId!);
        const role = roleObj ? (typeof roleObj === 'object' ? roleObj.name : String(roleObj)) : 'UNKNOWN';
        roleCounts.set(role, (roleCounts.get(role) ?? 0) + g._count);
      }
      return Array.from(roleCounts.entries()).map(([role, count]) => ({ role, count }));
    })(),

    // Prior 30d success rate (60–30 days ago, for trend comparison)
    prisma.scanLog.count({
      where: { qrCode: qrFilter, status: 'SUCCESS', scannedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    }),
    prisma.scanLog.count({
      where: { qrCode: qrFilter, scannedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    }),

    // Denied scans (30d)
    prisma.scanLog.count({
      where: { qrCode: qrFilter, status: 'DENIED', scannedAt: { gte: thirtyDaysAgo } },
    }),

    // QR type breakdown for selected range
    (async () => {
      type QRTypeRow = { type: string; count: bigint };
      if (projectId) {
        return prisma.$queryRaw<QRTypeRow[]>`
          SELECT qr."type", COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          WHERE qr."organizationId" = ${orgId}
            AND qr."projectId" = ${projectId}
            AND sl."scannedAt" >= ${dateFrom}
            AND sl."scannedAt" <= ${dateTo}
          GROUP BY qr."type"
        `;
      }
      return prisma.$queryRaw<QRTypeRow[]>`
        SELECT qr."type", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."scannedAt" >= ${dateFrom}
          AND sl."scannedAt" <= ${dateTo}
        GROUP BY qr."type"
      `;
    })(),

    // Per-gate success rates for selected range
    (async () => {
      type GateRow = { name: string; successes: bigint; total: bigint };
      if (projectId) {
        return prisma.$queryRaw<GateRow[]>`
          SELECT g.name,
            COUNT(*) FILTER (WHERE sl.status = 'SUCCESS')::bigint AS successes,
            COUNT(*)::bigint AS total
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          JOIN "Gate" g ON sl."gateId" = g.id
          WHERE qr."organizationId" = ${orgId}
            AND qr."projectId" = ${projectId}
            AND g."deletedAt" IS NULL
            AND sl."scannedAt" >= ${dateFrom}
            AND sl."scannedAt" <= ${dateTo}
          GROUP BY g.id, g.name
          ORDER BY total DESC
          LIMIT 10
        `;
      }
      return prisma.$queryRaw<GateRow[]>`
        SELECT g.name,
          COUNT(*) FILTER (WHERE sl.status = 'SUCCESS')::bigint AS successes,
          COUNT(*)::bigint AS total
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND g."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFrom}
          AND sl."scannedAt" <= ${dateTo}
        GROUP BY g.id, g.name
        ORDER BY total DESC
        LIMIT 10
      `;
    })(),
  ]);

  const successRatePct =
    totalScans30d > 0 ? Math.round((successRate30d / totalScans30d) * 100) : 0;
  const prevSuccessRatePct =
    prevTotalScans30d > 0 ? Math.round((prevSuccessRate30d / prevTotalScans30d) * 100) : 0;

  const totalScansInRange = dailyCountsRaw.reduce((sum, d) => sum + d.count, 0);
  const avgScansPerDay = totalDays > 0 ? Math.round(totalScansInRange / totalDays) : 0;

  const successRateTrend = calcTrend(successRatePct, prevSuccessRatePct);
  const totalScansTrend = calcTrend(totalScans30d, prevTotalScans30d);

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

  const qrTypeBreakdown: QRTypeCount[] = (qrTypeBreakdownRaw as { type: string; count: bigint | number }[]).map(
    (r) => ({
      type: r.type,
      count: typeof r.count === 'bigint' ? Number(r.count) : r.count,
    })
  );

  const gateSuccessRates: GateSuccessRate[] = (
    gateSuccessRatesRaw as { name: string; successes: bigint | number; total: bigint | number }[]
  ).map((r) => {
    const successes = typeof r.successes === 'bigint' ? Number(r.successes) : r.successes;
    const total = typeof r.total === 'bigint' ? Number(r.total) : r.total;
    return {
      name: r.name,
      successes,
      total,
      rate: total > 0 ? Math.round((successes / total) * 100) : 0,
    };
  });

  const currentRange = searchParams.range ?? '7d';
  const currentFrom = searchParams.from ?? '';
  const currentTo = searchParams.to ?? '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('analytics.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('analytics.subtitle')}
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
                {t(`analytics.range${r}`)}
              </button>
            ))}

            <div className="flex items-center gap-1">
              <input
                type="date"
                name="from"
                defaultValue={currentFrom}
                aria-label={t('analytics.fromDate')}
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
              <span className="text-xs text-slate-400">–</span>
              <input
                type="date"
                name="to"
                defaultValue={currentTo}
                aria-label={t('analytics.toDate')}
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                name="range"
                value="custom"
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {t('analytics.apply')}
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Success Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('analytics.successRate30d')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{successRatePct}%</div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100 dark:bg-slate-700">
              <div className="h-full rounded bg-green-500" style={{ width: `${successRatePct}%` }} />
            </div>
            <TrendBadge dir={successRateTrend.dir} pct={successRateTrend.pct} suffix={t('analytics.vsPrev30d')} />
          </CardContent>
        </Card>

        {/* Total Scans */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('analytics.totalScans30d')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalScans30d.toLocaleString(params.locale)}</div>
            <p className="mt-1 text-xs text-slate-400">{successRate30d.toLocaleString(params.locale)} {t('analytics.successful')}</p>
            <TrendBadge dir={totalScansTrend.dir} pct={totalScansTrend.pct} suffix={t('analytics.vsPrev30d')} />
          </CardContent>
        </Card>

        {/* Avg Scans / Day */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('analytics.avgScansDay')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{avgScansPerDay.toLocaleString(params.locale)}</div>
            <p className="mt-1 text-xs text-slate-400">
              {totalScansInRange.toLocaleString(params.locale)} {t('analytics.over')} {totalDays} {t('analytics.days')}
            </p>
          </CardContent>
        </Card>

        {/* Active Gates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('analytics.activeGates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{topGates.length}</div>
            <p className="mt-1 text-xs text-slate-400">{t('analytics.withScanActivity')}</p>
          </CardContent>
        </Card>

        {/* Denied / Overrides */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('analytics.denied30d')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${deniedCount30d > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
              {deniedCount30d.toLocaleString(params.locale)}
            </div>
            <p className="mt-1 text-xs text-slate-400">{t('analytics.operatorOverrides')}</p>
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
        qrTypeBreakdown={qrTypeBreakdown}
        gateSuccessRates={gateSuccessRates}
        dateLabel={dateLabel}
      />
    </div>
  );
}

// ─── Trend badge ──────────────────────────────────────────────────────────────

function TrendBadge({
  dir,
  pct,
  suffix,
}: {
  dir: 'up' | 'down' | 'flat';
  pct: number;
  suffix: string;
}) {
  if (dir === 'flat') {
    return <p className="mt-1 text-xs text-slate-400">— {suffix}</p>;
  }
  const isUp = dir === 'up';
  return (
    <p className={`mt-1 text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
      {isUp ? '↑' : '↓'} {pct}% {suffix}
    </p>
  );
}
