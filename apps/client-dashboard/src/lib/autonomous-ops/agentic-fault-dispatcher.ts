/**
 * Agentic Telemetry Anomaly Evaluator and Autonomous Work Order Dispatch Engine.
 */

export interface GateScanFailureEvent {
  gateId: string;
  gateName: string;
  organizationId: string;
  errorReason:
    | 'CAMERA_TIMEOUT'
    | 'QR_DECODE_FAILURE'
    | 'LOOP_DETECTOR_DISCONNECT'
    | 'BARRIER_TIMEOUT';
  timestamp: string; // ISO 8601
}

export interface AnomalyEvaluationResult {
  isAnomaly: boolean;
  failureCount: number;
  timeSpanMinutes: number;
  dominantErrorReason?: string;
}

export interface ApprovedVendor {
  vendorId: string;
  name: string;
  specialty: 'GATE_HARDWARE' | 'ELECTRICAL' | 'ACCESS_CONTROL';
  assignedZones: string[];
}

export interface AutonomousWorkOrderPayload {
  titleEn: string;
  titleAr: string;
  description: string;
  priority: 'URGENT';
  category: 'GATE_HARDWARE';
  assetType: 'GATE';
  assetId: string;
  assetName: string;
  organizationId: string;
  assignedVendorId: string;
  assignedVendorName: string;
  actor: 'GATEAI_AGENTIC_SYSTEM';
  createdAt: string;
}

/**
 * Evaluates whether scan failures exceed autonomous incident thresholds.
 */
export function evaluateTelemetryAnomaly(
  events: GateScanFailureEvent[],
  thresholdCount: number = 5,
  windowMinutes: number = 2,
  now: Date = new Date()
): AnomalyEvaluationResult {
  const windowMs = windowMinutes * 60 * 1000;
  const recentEvents = events.filter((e) => {
    const eventTime = new Date(e.timestamp).getTime();
    return now.getTime() - eventTime <= windowMs;
  });

  const failureCount = recentEvents.length;
  const isAnomaly = failureCount >= thresholdCount;

  if (recentEvents.length === 0) {
    return {
      isAnomaly: false,
      failureCount: 0,
      timeSpanMinutes: windowMinutes,
    };
  }

  // Find dominant error reason
  const counts: Record<string, number> = {};
  for (const e of recentEvents) {
    counts[e.errorReason] = (counts[e.errorReason] || 0) + 1;
  }
  const dominantErrorReason = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );

  return {
    isAnomaly,
    failureCount,
    timeSpanMinutes: windowMinutes,
    dominantErrorReason,
  };
}

/**
 * Selects the optimal approved vendor based on gate zone and specialty.
 */
export function selectBestVendor(
  vendors: ApprovedVendor[],
  specialty: 'GATE_HARDWARE' | 'ELECTRICAL' | 'ACCESS_CONTROL',
  gateZone: string
): ApprovedVendor | null {
  const matching = vendors.filter(
    (v) =>
      v.specialty === specialty &&
      (v.assignedZones.includes('*') || v.assignedZones.includes(gateZone))
  );

  return matching.length > 0 ? matching[0] : null;
}

/**
 * Constructs an autonomous urgent work order payload.
 */
export function createAutonomousWorkOrder(
  gateId: string,
  gateName: string,
  organizationId: string,
  anomaly: AnomalyEvaluationResult,
  vendor: ApprovedVendor
): AutonomousWorkOrderPayload {
  const timestamp = new Date().toISOString();
  const errorLabel = anomaly.dominantErrorReason || 'HARDWARE_ANOMALY';

  return {
    titleEn: `[Autonomous Incident] ${gateName} - ${errorLabel}`,
    titleAr: `[بلاغ صيانة ذاتي] ${gateName} - ${errorLabel}`,
    description: [
      `Automated AI Incident Triggered by GateAI.`,
      `Failure Spike: ${anomaly.failureCount} scan failures detected within ${anomaly.timeSpanMinutes} minutes.`,
      `Dominant Fault Signal: ${errorLabel}`,
      `Auto-Assigned Vendor: ${vendor.name} (Specialty: ${vendor.specialty})`,
    ].join('\n'),
    priority: 'URGENT',
    category: 'GATE_HARDWARE',
    assetType: 'GATE',
    assetId: gateId,
    assetName: gateName,
    organizationId,
    assignedVendorId: vendor.vendorId,
    assignedVendorName: vendor.name,
    actor: 'GATEAI_AGENTIC_SYSTEM',
    createdAt: timestamp,
  };
}
