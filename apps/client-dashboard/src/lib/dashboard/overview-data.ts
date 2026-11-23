import 'server-only';
import { prisma } from '@gate-access/db';
import type { OrganizationFeatures } from '@gate-access/types';
import {
  getDashboardTimeZone,
  startOfZonedDay,
  startOfZonedHour,
  zonedDayKey,
  zonedHourKey,
} from './time';

/**
 * Data loader for the organization overview (dashboard home).
 *
 * Query budget: 11 queries in one parallel batch, all bounded by time window
 * or `take`. No all-time aggregates. Tenant scoping for ScanLog goes through
 * QRCode.organizationId because rejected scans written by
 * /api/qrcodes/validate (logRejectedScan) do not set ScanLog.organizationId.
 */

const LIVE_WINDOW_MS = 10 * 60 * 1000; // matches /api/shifts/live heartbeat
const HOURS = 24;
const TREND_DAYS = 14;
const MIX_DAYS = 7;
const GATE_LIMIT = 6;
const FEED_LIMIT = 8;
const ATTENTION_LIMIT = 5;

export type GateLiveState = 'live' | 'idle' | 'quiet';

export interface ActivityBucket {
  key: string; // local hour or day key
  at: string; // ISO instant of bucket start
  granted: number;
  rejected: number;
}

export interface GateSnapshot {
  id: string;
  name: string;
  location: string | null;
  scansToday: number;
  rejectedToday: number;
  lastScanAt: string | null;
  state: GateLiveState;
  guardName: string | null;
}

export interface FeedItem {
  id: string;
  status: string;
  scannedAt: string;
  gateName: string | null;
  qrType: string | null;
  code: string | null;
}

export interface AttentionItem {
  id: string;
  kind: 'incident' | 'work-order';
  title: string;
  status: string;
  severity: 'critical' | 'high' | 'normal';
  createdAt: string;
  context: string | null;
}

export interface OverviewData {
  timeZone: string;
  generatedAt: string;
  totals: {
    scansToday: number;
    rejectedToday: number;
    scansYesterday: number;
    avgDaily7d: number;
    activeQRs: number;
    activeGates: number;
    teamSize: number;
    residents: number | null;
    openMaintenance: number | null;
    openIncidents: number;
    liveGates: number;
    guardsOnDuty: number;
  };
  hourly: ActivityBucket[];
  daily: ActivityBucket[];
  statusMix: { status: string; count: number }[];
  gates: GateSnapshot[];
  feed: FeedItem[];
  attention: AttentionItem[];
  maintenanceByStatus: { status: string; count: number }[];
}

type BucketRow = { bucket: string; granted: bigint; rejected: bigint };
type GateRow = {
  gateId: string;
  today: bigint;
  rejectedToday: bigint;
  lastScanAt: Date | null;
};

// Prisma's groupBy return type collapses to {} under this app's TS config.
type GroupRow = { status: string; _count: { _all: number } };
const groupToCount = (r: GroupRow) => ({
  status: r.status,
  count: r._count._all,
});

type IncidentRow = {
  id: string;
  reason: string;
  status: string;
  createdAt: Date;
  gate: { name: string } | null;
};

const toNum = (v: bigint | number | null | undefined) => Number(v ?? 0);

export async function getOverviewData(
  orgId: string,
  features: OrganizationFeatures
): Promise<OverviewData> {
  const tz = getDashboardTimeZone();
  const now = new Date();
  const todayStart = startOfZonedDay(now, tz);
  const hourStart = new Date(
    startOfZonedHour(now).getTime() - (HOURS - 1) * 3600_000
  );
  // Noon of the first trend day, snapped to local midnight (DST-safe).
  const trendStart = startOfZonedDay(
    new Date(
      todayStart.getTime() - (TREND_DAYS - 1) * 86400_000 + 12 * 3600_000
    ),
    tz
  );
  const mixStart = new Date(now.getTime() - MIX_DAYS * 86400_000);
  const gateWindowStart = mixStart;

  const showResidents =
    features.sidebar.visibleCapabilities.includes('contacts') ||
    features.sidebar.visibleCapabilities.includes('units');
  const showMaintenance = features.flags.maintenanceModule;

  const [
    activeQRs,
    activeGates,
    teamSize,
    residents,
    hourlyRows,
    dailyRows,
    statusMixRows,
    gateRows,
    gates,
    openShifts,
    recentScans,
    incidents,
    maintenanceGroups,
    urgentWorkOrders,
  ] = await Promise.all([
    prisma.qRCode.count({
      where: { organizationId: orgId, isActive: true, deletedAt: null },
    }),
    prisma.gate.count({
      where: { organizationId: orgId, isActive: true, deletedAt: null },
    }),
    prisma.user.count({ where: { organizationId: orgId, deletedAt: null } }),
    showResidents
      ? prisma.unit.count({
          where: {
            organizationId: orgId,
            userId: { not: null },
            deletedAt: null,
          },
        })
      : Promise.resolve(null),
    prisma.$queryRaw<BucketRow[]>`
      SELECT
        to_char(date_trunc('hour', (sl."scannedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${tz}), 'YYYY-MM-DD HH24') AS bucket,
        COUNT(*) FILTER (WHERE sl."status" = 'SUCCESS')::bigint AS granted,
        COUNT(*) FILTER (WHERE sl."status" <> 'SUCCESS')::bigint AS rejected
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      WHERE qr."organizationId" = ${orgId}
        AND sl."deletedAt" IS NULL
        AND sl."scannedAt" >= ${hourStart}
      GROUP BY bucket
    `,
    prisma.$queryRaw<BucketRow[]>`
      SELECT
        to_char(date_trunc('day', (sl."scannedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${tz}), 'YYYY-MM-DD') AS bucket,
        COUNT(*) FILTER (WHERE sl."status" = 'SUCCESS')::bigint AS granted,
        COUNT(*) FILTER (WHERE sl."status" <> 'SUCCESS')::bigint AS rejected
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      WHERE qr."organizationId" = ${orgId}
        AND sl."deletedAt" IS NULL
        AND sl."scannedAt" >= ${trendStart}
      GROUP BY bucket
    `,
    prisma.scanLog.groupBy({
      by: ['status'],
      where: {
        deletedAt: null,
        qrCode: { organizationId: orgId },
        scannedAt: { gte: mixStart },
      },
      _count: { _all: true },
    }),
    prisma.$queryRaw<GateRow[]>`
      SELECT
        sl."gateId" AS "gateId",
        COUNT(*) FILTER (WHERE sl."scannedAt" >= ${todayStart})::bigint AS today,
        COUNT(*) FILTER (WHERE sl."scannedAt" >= ${todayStart} AND sl."status" <> 'SUCCESS')::bigint AS "rejectedToday",
        MAX(sl."scannedAt") AS "lastScanAt"
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      WHERE qr."organizationId" = ${orgId}
        AND sl."deletedAt" IS NULL
        AND sl."scannedAt" >= ${gateWindowStart}
      GROUP BY sl."gateId"
    `,
    prisma.gate.findMany({
      where: { organizationId: orgId, isActive: true, deletedAt: null },
      select: { id: true, name: true, location: true },
      orderBy: { name: 'asc' },
      take: 50,
    }),
    prisma.shiftLog.findMany({
      where: {
        organizationId: orgId,
        endTime: null,
        startTime: { gte: new Date(now.getTime() - 24 * 3600_000) },
      },
      select: {
        gateId: true,
        guardId: true,
        guard: { select: { name: true } },
      },
      orderBy: { startTime: 'desc' },
      take: 50,
    }),
    prisma.scanLog.findMany({
      where: { deletedAt: null, qrCode: { organizationId: orgId } },
      orderBy: { scannedAt: 'desc' },
      take: FEED_LIMIT,
      select: {
        id: true,
        status: true,
        scannedAt: true,
        gate: { select: { name: true } },
        qrCode: { select: { code: true, type: true } },
      },
    }),
    prisma.incident
      .findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          status: { in: ['UNDER_REVIEW', 'ESCALATED'] },
        },
        orderBy: { createdAt: 'desc' },
        take: ATTENTION_LIMIT,
        select: {
          id: true,
          reason: true,
          status: true,
          createdAt: true,
          gate: { select: { name: true } },
        },
      })
      .then((rows) => rows as unknown as IncidentRow[]),
    showMaintenance
      ? prisma.workOrder
          .groupBy({
            by: ['status'],
            where: { organizationId: orgId, deletedAt: null },
            _count: { _all: true },
          })
          .then((rows) => (rows as unknown as GroupRow[]).map(groupToCount))
      : Promise.resolve([] as { status: string; count: number }[]),
    showMaintenance
      ? prisma.workOrder.findMany({
          where: {
            organizationId: orgId,
            deletedAt: null,
            status: { notIn: ['RESOLVED', 'CLOSED', 'CANCELLED'] },
            priority: { in: ['URGENT', 'HIGH'] },
          },
          orderBy: { createdAt: 'desc' },
          take: ATTENTION_LIMIT,
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            createdAt: true,
            gate: { select: { name: true } },
          },
        })
      : Promise.resolve(
          [] as {
            id: string;
            title: string;
            status: string;
            priority: string;
            createdAt: Date;
            gate: { name: string } | null;
          }[]
        ),
  ]);

  // Open incident total needs its own count only when the list is full.
  const openIncidents =
    incidents.length < ATTENTION_LIMIT
      ? incidents.length
      : await prisma.incident.count({
          where: {
            organizationId: orgId,
            deletedAt: null,
            status: { in: ['UNDER_REVIEW', 'ESCALATED'] },
          },
        });

  // ── Hourly buckets: last 24 local hours, zero-filled ──────────────────────
  const hourlyMap = new Map(hourlyRows.map((r) => [r.bucket, r]));
  const hourly: ActivityBucket[] = Array.from({ length: HOURS }, (_, i) => {
    const at = new Date(hourStart.getTime() + i * 3600_000);
    const key = zonedHourKey(at, tz);
    const row = hourlyMap.get(key);
    return {
      key,
      at: at.toISOString(),
      granted: toNum(row?.granted),
      rejected: toNum(row?.rejected),
    };
  });

  // ── Daily buckets: last 14 local days, zero-filled ────────────────────────
  const dailyMap = new Map(dailyRows.map((r) => [r.bucket, r]));
  const daily: ActivityBucket[] = Array.from({ length: TREND_DAYS }, (_, i) => {
    // Noon avoids DST edges when stepping whole days.
    const at = new Date(
      todayStart.getTime() - (TREND_DAYS - 1 - i) * 86400_000 + 12 * 3600_000
    );
    const key = zonedDayKey(at, tz);
    const row = dailyMap.get(key);
    return {
      key,
      at: startOfZonedDay(at, tz).toISOString(),
      granted: toNum(row?.granted),
      rejected: toNum(row?.rejected),
    };
  });

  const today = daily[daily.length - 1];
  const yesterday = daily[daily.length - 2];
  const prior7 = daily.slice(-8, -1);
  const avgDaily7d =
    prior7.reduce((s, d) => s + d.granted + d.rejected, 0) / prior7.length;

  // ── Gates ─────────────────────────────────────────────────────────────────
  const gateStats = new Map(gateRows.map((r) => [r.gateId, r]));
  const guardByGate = new Map<string, string | null>();
  for (const s of openShifts) {
    if (!guardByGate.has(s.gateId))
      guardByGate.set(s.gateId, s.guard?.name ?? null);
  }

  const gateSnapshots: GateSnapshot[] = gates.map((g) => {
    const stat = gateStats.get(g.id);
    const last = stat?.lastScanAt ? new Date(stat.lastScanAt) : null;
    const scansToday = toNum(stat?.today);
    let state: GateLiveState = 'quiet';
    if (last && now.getTime() - last.getTime() < LIVE_WINDOW_MS) state = 'live';
    else if (scansToday > 0) state = 'idle';
    return {
      id: g.id,
      name: g.name,
      location: g.location,
      scansToday,
      rejectedToday: toNum(stat?.rejectedToday),
      lastScanAt: last?.toISOString() ?? null,
      state,
      guardName: guardByGate.get(g.id) ?? null,
    };
  });
  const stateRank: Record<GateLiveState, number> = {
    live: 0,
    idle: 1,
    quiet: 2,
  };
  gateSnapshots.sort(
    (a, b) =>
      stateRank[a.state] - stateRank[b.state] || b.scansToday - a.scansToday
  );

  // ── Attention queue: incidents first, then urgent work orders ─────────────
  const attention: AttentionItem[] = [
    ...incidents.map((i) => ({
      id: i.id,
      kind: 'incident' as const,
      title: i.reason,
      status: i.status,
      severity: (i.status === 'ESCALATED'
        ? 'critical'
        : 'high') as AttentionItem['severity'],
      createdAt: i.createdAt.toISOString(),
      context: i.gate?.name ?? null,
    })),
    ...urgentWorkOrders.map((w) => ({
      id: w.id,
      kind: 'work-order' as const,
      title: w.title,
      status: w.status,
      severity: (w.priority === 'URGENT'
        ? 'critical'
        : 'normal') as AttentionItem['severity'],
      createdAt: w.createdAt.toISOString(),
      context: w.gate?.name ?? null,
    })),
  ]
    .sort((a, b) => {
      const sev = { critical: 0, high: 1, normal: 2 };
      return (
        sev[a.severity] - sev[b.severity] ||
        b.createdAt.localeCompare(a.createdAt)
      );
    })
    .slice(0, ATTENTION_LIMIT);

  const maintenanceByStatus = maintenanceGroups;
  const openMaintenance = showMaintenance
    ? maintenanceByStatus
        .filter((m) => !['RESOLVED', 'CLOSED', 'CANCELLED'].includes(m.status))
        .reduce((s, m) => s + m.count, 0)
    : null;

  return {
    timeZone: tz,
    generatedAt: now.toISOString(),
    totals: {
      scansToday: today.granted + today.rejected,
      rejectedToday: today.rejected,
      scansYesterday: yesterday.granted + yesterday.rejected,
      avgDaily7d,
      activeQRs,
      activeGates,
      teamSize,
      residents,
      openMaintenance,
      openIncidents,
      liveGates: gateSnapshots.filter((g) => g.state === 'live').length,
      guardsOnDuty: new Set(openShifts.map((s) => s.guardId)).size,
    },
    hourly,
    daily,
    statusMix: (statusMixRows as unknown as GroupRow[])
      .map(groupToCount)
      .sort((a, b) => b.count - a.count),
    gates: gateSnapshots.slice(0, GATE_LIMIT),
    feed: recentScans.map((s) => ({
      id: s.id,
      status: s.status,
      scannedAt: s.scannedAt.toISOString(),
      gateName: s.gate?.name ?? null,
      qrType: s.qrCode?.type ?? null,
      code: s.qrCode?.code ?? null,
    })),
    attention,
    maintenanceByStatus,
  };
}
