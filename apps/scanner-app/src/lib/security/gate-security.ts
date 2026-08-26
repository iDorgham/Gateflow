/**
 * Gate-level biometric policy evaluation and scan log audit serialization.
 */

export interface GateSecurityPolicy {
  gateId: string;
  gateName?: string;
  requireBiometric?: boolean;
}

export interface GateScanEvaluation {
  requiresPrompt: boolean;
  canProceed: boolean;
  reason?:
    | 'GRACE_PERIOD_ACTIVE'
    | 'POLICY_DISABLED'
    | 'BIOMETRICS_REQUIRED'
    | 'UNENROLLED_FALLBACK';
}

/**
 * Evaluates whether a QR scan at a specific gate requires a biometric challenge.
 */
export function evaluateGateScanPolicy(params: {
  gate: GateSecurityPolicy;
  isGracePeriodValid: boolean;
  isBiometricAvailable: boolean;
}): GateScanEvaluation {
  const { gate, isGracePeriodValid, isBiometricAvailable } = params;

  // If gate does not mandate biometrics, proceed immediately
  if (!gate.requireBiometric) {
    return {
      requiresPrompt: false,
      canProceed: true,
      reason: 'POLICY_DISABLED',
    };
  }

  // If within active grace period (e.g. recent scan in vehicle queue), bypass prompt
  if (isGracePeriodValid) {
    return {
      requiresPrompt: false,
      canProceed: true,
      reason: 'GRACE_PERIOD_ACTIVE',
    };
  }

  // If biometrics not enrolled or unavailable on device, signal fallback to PIN
  if (!isBiometricAvailable) {
    return {
      requiresPrompt: true,
      canProceed: false,
      reason: 'UNENROLLED_FALLBACK',
    };
  }

  // Gate requires biometric prompt
  return {
    requiresPrompt: true,
    canProceed: false,
    reason: 'BIOMETRICS_REQUIRED',
  };
}

export interface ScanAuditLogEntry {
  qrId: string;
  gateId: string;
  scannedAt: string;
  status: 'GRANTED' | 'DENIED' | 'FLAGGED';
  biometricVerified: boolean;
  auditNotes?: Record<string, unknown>;
}

/**
 * Constructs a serialized scan log entry with biometric verification stamp.
 */
export function buildScanLogPayload(input: {
  qrId: string;
  gateId: string;
  status: 'GRANTED' | 'DENIED' | 'FLAGGED';
  biometricVerified: boolean;
  notes?: Record<string, unknown>;
}): ScanAuditLogEntry {
  return {
    qrId: input.qrId,
    gateId: input.gateId,
    scannedAt: new Date().toISOString(),
    status: input.status,
    biometricVerified: input.biometricVerified,
    auditNotes: {
      ...(input.notes ?? {}),
      biometricVerified: input.biometricVerified,
      verificationSource: input.biometricVerified
        ? 'ON_DEVICE_BIOMETRIC'
        : 'PIN_FALLBACK_OR_NONE',
    },
  };
}
