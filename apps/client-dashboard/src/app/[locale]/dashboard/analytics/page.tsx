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
  const [
    successRate30d,
    totalScans30d,
    heatmapRaw,
    deniedCount30d,
    gatesForFilter,
  ] = await Promise.all([
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

    // Denied scans (30d)
    prisma.scanLog.count({
      where: { qrCode: qrFilter, status: 'DENIED', scannedAt: { gte: thirtyDaysAgo } },
    }),

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
