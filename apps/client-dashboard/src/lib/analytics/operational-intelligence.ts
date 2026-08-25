/**
 * operational-intelligence.ts — Operational Analytics & Security Intelligence Aggregator
 *
 * Computes decision-first metrics for GateFlow client and admin operations:
 * - Security Health Score (0-100)
 * - Gate traffic velocity & peak rush hour throughput
 * - Denial rate anomalies and incident frequency
 * - Shift patrol coverage and guard activity stats
 */

export interface ScanRecord {
  id: string;
  gateId?: string | null;
  gateName?: string | null;
  status: 'GRANTED' | 'DENIED' | 'REVOKED' | 'EXPIRED';
  scannedAt: Date | string;
  userId?: string | null;
}

export interface IncidentRecord {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: Date | string;
}

export interface ShiftRecord {
  id: string;
  userId: string;
  gateId: string;
  status: 'ACTIVE' | 'ENDED';
}

export interface SecurityHealthBreakdown {
  score: number; // 0 - 100
  grade: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  denialRate: number; // percentage (0 - 100)
  totalScans: number;
  deniedScans: number;
  openIncidentsCount: number;
  criticalIncidentsCount: number;
  activeShiftsCount: number;
}

export interface HourlyTrafficBucket {
  hour: number; // 0 - 23
  hourLabel: string; // e.g. "08:00"
  granted: number;
  denied: number;
  total: number;
}

export interface GateThroughputStat {
  gateId: string;
  gateName: string;
  scansCount: number;
  percentage: number;
  denialRate: number;
}

export interface OperationalIntelligenceSummary {
  securityHealth: SecurityHealthBreakdown;
  hourlyTraffic: HourlyTrafficBucket[];
  topGates: GateThroughputStat[];
  peakHour: {
    hour: number;
    hourLabel: string;
    totalScans: number;
  };
  totalTraffic: number;
}

/**
 * Computes a weighted Security Health Score from 0 to 100.
 */
export function computeSecurityHealthScore(params: {
  totalScans: number;
  deniedScans: number;
  openIncidents: number;
  criticalIncidents: number;
  activeShifts: number;
}): SecurityHealthBreakdown {
  const {
    totalScans,
    deniedScans,
    openIncidents,
    criticalIncidents,
    activeShifts,
  } = params;

  if (totalScans === 0 && openIncidents === 0) {
    return {
      score: 100,
      grade: 'OPTIMAL',
      denialRate: 0,
      totalScans: 0,
      deniedScans: 0,
      openIncidentsCount: 0,
      criticalIncidentsCount: 0,
      activeShiftsCount: activeShifts,
    };
  }

  let baseScore = 100;
  const denialRate = totalScans > 0 ? (deniedScans / totalScans) * 100 : 0;

  // Penalize for high denial rate (> 5% starts penalizing, > 20% drops steeply)
  if (denialRate > 20) {
    baseScore -= 35;
  } else if (denialRate > 10) {
    baseScore -= 20;
  } else if (denialRate > 5) {
    baseScore -= 10;
  }

  // Penalize for open critical and regular incidents
  baseScore -= criticalIncidents * 25;
  baseScore -= openIncidents * 5;

  // Ensure score stays bounded in [0, 100]
  const score = Math.max(0, Math.min(100, Math.round(baseScore)));

  let grade: 'OPTIMAL' | 'WARNING' | 'CRITICAL' = 'OPTIMAL';
  if (score < 60 || criticalIncidents > 0) {
    grade = 'CRITICAL';
  } else if (score < 85) {
    grade = 'WARNING';
  }

  return {
    score,
    grade,
    denialRate: Number(denialRate.toFixed(2)),
    totalScans,
    deniedScans,
    openIncidentsCount: openIncidents,
    criticalIncidentsCount: criticalIncidents,
    activeShiftsCount: activeShifts,
  };
}

/**
 * Groups scan logs into 24 hourly buckets.
 */
export function calculateHourlyTraffic(
  scans: ScanRecord[]
): HourlyTrafficBucket[] {
  const buckets: HourlyTrafficBucket[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    hourLabel: `${i.toString().padStart(2, '0')}:00`,
    granted: 0,
    denied: 0,
    total: 0,
  }));

  for (const scan of scans) {
    const date = new Date(scan.scannedAt);
    if (isNaN(date.getTime())) continue;

    const hour = date.getHours();
    if (hour >= 0 && hour < 24) {
      buckets[hour].total += 1;
      if (scan.status === 'GRANTED') {
        buckets[hour].granted += 1;
      } else {
        buckets[hour].denied += 1;
      }
    }
  }

  return buckets;
}

/**
 * Calculates per-gate throughput statistics and traffic distribution.
 */
export function calculateGateThroughput(
  scans: ScanRecord[]
): GateThroughputStat[] {
  const gateMap = new Map<
    string,
    { name: string; total: number; denied: number }
  >();

  for (const scan of scans) {
    const gateId = scan.gateId || 'unassigned';
    const gateName = scan.gateName || 'Main Gate';

    const current = gateMap.get(gateId) || {
      name: gateName,
      total: 0,
      denied: 0,
    };
    current.total += 1;
    if (scan.status !== 'GRANTED') {
      current.denied += 1;
    }
    gateMap.set(gateId, current);
  }

  const totalScans = scans.length;
  const result: GateThroughputStat[] = [];

  for (const [gateId, stats] of gateMap.entries()) {
    const percentage = totalScans > 0 ? (stats.total / totalScans) * 100 : 0;
    const denialRate = stats.total > 0 ? (stats.denied / stats.total) * 100 : 0;

    result.push({
      gateId,
      gateName: stats.name,
      scansCount: stats.total,
      percentage: Number(percentage.toFixed(1)),
      denialRate: Number(denialRate.toFixed(1)),
    });
  }

  return result.sort((a, b) => b.scansCount - a.scansCount);
}

/**
 * Computes full operational intelligence summary from logs, incidents, and shifts.
 */
export function computeOperationalMetrics(
  scans: ScanRecord[],
  incidents: IncidentRecord[] = [],
  shifts: ShiftRecord[] = []
): OperationalIntelligenceSummary {
  const totalScans = scans.length;
  const deniedScans = scans.filter((s) => s.status !== 'GRANTED').length;

  const openIncidents = incidents.filter(
    (i) => i.status === 'OPEN' || i.status === 'IN_PROGRESS'
  );
  const criticalIncidents = openIncidents.filter(
    (i) => i.severity === 'CRITICAL' || i.severity === 'HIGH'
  );
  const activeShifts = shifts.filter((s) => s.status === 'ACTIVE').length;

  const securityHealth = computeSecurityHealthScore({
    totalScans,
    deniedScans,
    openIncidents: openIncidents.length,
    criticalIncidents: criticalIncidents.length,
    activeShifts,
  });

  const hourlyTraffic = calculateHourlyTraffic(scans);
  const topGates = calculateGateThroughput(scans);

  // Find peak hour
  let peakHour = { hour: 0, hourLabel: '00:00', totalScans: 0 };
  for (const bucket of hourlyTraffic) {
    if (bucket.total > peakHour.totalScans) {
      peakHour = {
        hour: bucket.hour,
        hourLabel: bucket.hourLabel,
        totalScans: bucket.total,
      };
    }
  }

  return {
    securityHealth,
    hourlyTraffic,
    topGates,
    peakHour,
    totalTraffic: totalScans,
  };
}
