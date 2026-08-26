/**
 * data-retention.ts — Data Retention & Lifecycle Policy Definitions
 *
 * Defines enterprise data retention windows and query filters for transient,
 * audit, and operational telemetry records across the GateFlow platform.
 */

export interface RetentionPolicy {
  modelName: string;
  retentionDays: number;
  dateField: string;
  description: string;
}

export const DATA_RETENTION_POLICIES: Record<string, RetentionPolicy> = {
  auditLog: {
    modelName: 'auditLog',
    retentionDays: 365, // 1 year
    dateField: 'createdAt',
    description: 'Security and admin audit trails for compliance',
  },
  scanLog: {
    modelName: 'scanLog',
    retentionDays: 180, // 6 months
    dateField: 'scannedAt',
    description: 'Physical gate access and scanning records',
  },
  shortLinkClick: {
    modelName: 'shortLinkClick',
    retentionDays: 90, // 3 months
    dateField: 'clickedAt',
    description: 'Transient QR invite redirect telemetry',
  },
  chatMessage: {
    modelName: 'chatMessage',
    retentionDays: 180, // 6 months
    dateField: 'createdAt',
    description: 'GateAI and resident-guard operational chat logs',
  },
  eventLog: {
    modelName: 'eventLog',
    retentionDays: 90, // 3 months
    dateField: 'createdAt',
    description: 'System event logs and automated triggers',
  },
};

/**
 * Returns retention policy for a given model if defined.
 */
export function getDataRetentionPolicy(
  modelName: string
): RetentionPolicy | undefined {
  const normalized = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return DATA_RETENTION_POLICIES[normalized];
}

/**
 * Builds a Prisma where filter to select expired records past their retention window.
 */
export function buildRetentionFilter(
  modelName: string,
  asOfDate: Date = new Date()
): Record<string, any> | null {
  const policy = getDataRetentionPolicy(modelName);
  if (!policy) return null;

  const cutoff = new Date(
    asOfDate.getTime() - policy.retentionDays * 24 * 60 * 60 * 1000
  );
  return {
    [policy.dateField]: {
      lt: cutoff,
    },
  };
}
