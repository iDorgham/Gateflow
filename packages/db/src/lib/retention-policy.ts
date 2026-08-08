export type RetentionPolicy = {
  scanLogRetentionMonths: number | null;
  visitorHistoryRetentionMonths: number | null;
  idArtifactRetentionMonths: number | null;
  incidentRetentionMonths: number | null;
  retentionLegalHold: boolean;
};

export type RetentionCutoffs = {
  scanLogs: Date | null;
  visitorHistory: Date | null;
  idArtifacts: Date | null;
  incidents: Date | null;
};

const MIN_MONTHS = 1;
const MAX_MONTHS = 120;

export function validateRetentionMonths(value: number | null): void {
  if (value === null) return;
  if (!Number.isInteger(value) || value < MIN_MONTHS || value > MAX_MONTHS) {
    throw new Error(
      `Retention months must be null or an integer from ${MIN_MONTHS} to ${MAX_MONTHS}.`
    );
  }
}

export function subtractUtcMonths(now: Date, months: number): Date {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  return cutoff;
}

export function buildRetentionCutoffs(
  policy: RetentionPolicy,
  now: Date
): RetentionCutoffs {
  for (const value of [
    policy.scanLogRetentionMonths,
    policy.visitorHistoryRetentionMonths,
    policy.idArtifactRetentionMonths,
    policy.incidentRetentionMonths,
  ]) {
    validateRetentionMonths(value);
  }
  if (policy.retentionLegalHold) {
    return {
      scanLogs: null,
      visitorHistory: null,
      idArtifacts: null,
      incidents: null,
    };
  }
  const cutoff = (months: number | null) =>
    months === null ? null : subtractUtcMonths(now, months);
  return {
    scanLogs: cutoff(policy.scanLogRetentionMonths),
    visitorHistory: cutoff(policy.visitorHistoryRetentionMonths),
    idArtifacts: cutoff(policy.idArtifactRetentionMonths),
    incidents: cutoff(policy.incidentRetentionMonths),
  };
}

export function retentionApplyAllowed(
  policy: RetentionPolicy,
  confirm: string | undefined
): boolean {
  return !policy.retentionLegalHold && confirm === 'APPLY_RETENTION';
}
