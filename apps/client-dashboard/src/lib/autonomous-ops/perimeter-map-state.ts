/**
 * Perimeter Map State Aggregator, Event Filtering, and Compound Security Telemetry.
 */

export interface GateTopologyNode {
  gateId: string;
  gateName: string;
  gateZone: string;
  coordinates: { x: number; y: number }; // Relative percentage (0-100) on compound map
  status: 'NOMINAL' | 'ANOMALY' | 'INCIDENT';
  cameraCount: number;
  lastHeartbeat: string;
}

export interface PerimeterAnomalyEvent {
  id: string;
  gateId: string;
  gateName: string;
  type:
    'TAILGATING' | 'HARDWARE_ANOMALY' | 'CAMERA_OFFLINE' | 'AGENTIC_DISPATCH';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  message: string;
  messageAr: string;
  isResolved: boolean;
}

export interface PerimeterSummaryMetrics {
  totalGates: number;
  activeCameras: number;
  unresolvedIncidents: number;
  agenticActions24h: number;
  perimeterSecurityScore: number; // 0 - 100%
}

/**
 * Derives comprehensive perimeter telemetry metrics.
 */
export function calculatePerimeterMetrics(
  gates: GateTopologyNode[],
  events: PerimeterAnomalyEvent[]
): PerimeterSummaryMetrics {
  const totalGates = gates.length;
  const activeCameras = gates.reduce((acc, g) => acc + g.cameraCount, 0);

  const unresolved = events.filter((e) => !e.isResolved);
  const unresolvedIncidents = unresolved.filter(
    (e) => e.severity === 'CRITICAL'
  ).length;
  const unresolvedWarnings = unresolved.filter(
    (e) => e.severity === 'WARNING'
  ).length;

  const agenticActions24h = events.filter(
    (e) => e.type === 'AGENTIC_DISPATCH'
  ).length;

  // Security score deduction algorithm
  const deduction = unresolvedIncidents * 15 + unresolvedWarnings * 5;
  const perimeterSecurityScore = Math.max(0, Math.min(100, 100 - deduction));

  return {
    totalGates,
    activeCameras,
    unresolvedIncidents,
    agenticActions24h,
    perimeterSecurityScore,
  };
}

/**
 * Filters and sorts perimeter anomaly events chronologically (most recent first).
 */
export function filterAndSortPerimeterEvents(
  events: PerimeterAnomalyEvent[],
  filter: {
    severity?: 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO';
    gateId?: string;
    unresolvedOnly?: boolean;
  } = {}
): PerimeterAnomalyEvent[] {
  let filtered = [...events];

  if (filter.severity && filter.severity !== 'ALL') {
    filtered = filtered.filter((e) => e.severity === filter.severity);
  }

  if (filter.gateId && filter.gateId !== 'ALL') {
    filtered = filtered.filter((e) => e.gateId === filter.gateId);
  }

  if (filter.unresolvedOnly) {
    filtered = filtered.filter((e) => !e.isResolved);
  }

  return filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Re-evaluates each gate node's visual map status based on active unresolved events.
 */
export function updateGateNodeStatuses(
  gates: GateTopologyNode[],
  events: PerimeterAnomalyEvent[]
): GateTopologyNode[] {
  return gates.map((gate) => {
    const gateEvents = events.filter(
      (e) => e.gateId === gate.gateId && !e.isResolved
    );

    const hasCritical = gateEvents.some((e) => e.severity === 'CRITICAL');
    const hasWarning = gateEvents.some((e) => e.severity === 'WARNING');

    let status: 'NOMINAL' | 'ANOMALY' | 'INCIDENT' = 'NOMINAL';
    if (hasCritical) {
      status = 'INCIDENT';
    } else if (hasWarning) {
      status = 'ANOMALY';
    }

    return {
      ...gate,
      status,
    };
  });
}
