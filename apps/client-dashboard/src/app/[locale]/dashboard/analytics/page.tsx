import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { getTranslation, type TranslationFunction } from '@/lib/i18n';
import { Locale } from '@/lib/i18n-config';
import { AnalyticsClient } from './analytics-client';

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

// ─── Page ─────────────────────────────────────────────────────────────────────

type SearchParams = {
  range?: string;
  from?: string;
  to?: string;
  projectId?: string;
  gateId?: string;
  unitType?: string;
  search?: string;
  mode?: string;
};

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
  const cookieProjectId = await getValidatedProjectId(orgId);
  let projectId: string | null = cookieProjectId;
  if (searchParams.projectId) {
    const valid = await prisma.project.findFirst({
      where: { id: searchParams.projectId, organizationId: orgId, deletedAt: null },
      select: { id: true },
    });
    if (valid) projectId = valid.id;
  }

  const { dateFrom, dateTo } = parseDateRange(
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
    _statusBreakdown,
    _topGatesRaw,
    successRate30d,
    totalScans30d,
    heatmapRaw,
    _roleBreakdown,
    _prevSuccessRate30d,
    _prevTotalScans30d,
    deniedCount30d,
    _qrTypeBreakdownRaw,
    _gateSuccessRatesRaw,
    gatesForFilter,
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

    // Top 10 gates (explicit select so DBs without optional columns still work)
    prisma.gate.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(projectId ? { projectId } : {}),
      },
      select: { id: true, name: true, _count: { select: { scanLogs: true } } },
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

    // Role breakdown (reserved for Phase 2)
    (async () => {
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

    // Gates for filter bar
    prisma.gate.findMany({
      where: { organizationId: orgId, deletedAt: null, ...(projectId ? { projectId } : {}) },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const successRatePct =
    totalScans30d > 0 ? Math.round((successRate30d / totalScans30d) * 100) : 0;

  // Peak hour: aggregate heatmap by hour, find max
  const heatmapRows = heatmapRaw as { dow: number; hour: number; count: bigint | number }[];
  const hourCounts = new Map<number, number>();
  for (const r of heatmapRows) {
    const count = typeof r.count === 'bigint' ? Number(r.count) : r.count;
    hourCounts.set(r.hour, (hourCounts.get(r.hour) ?? 0) + count);
  }
  let peakHour = -1;
  let maxCount = 0;
  for (const [h, c] of Array.from(hourCounts.entries())) {
    if (c > maxCount) {
      maxCount = c;
      peakHour = h;
    }
  }

  const kpiData = {
    totalVisits: totalScans30d,
    passRate: successRatePct,
    peakHour,
    uniqueVisitors: -1,
    deniedScans: deniedCount30d,
    attributedScans: -1,
  };

  const gates = gatesForFilter.map((g) => ({ id: g.id, name: g.name }));

  return (
    <AnalyticsClient kpiData={kpiData} gates={gates} />
  );
}
