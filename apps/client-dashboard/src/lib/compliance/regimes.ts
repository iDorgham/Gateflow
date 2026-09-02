/**
 * Regulatory regimes for MENA personal-data compliance.
 *
 * Encodes the obligations of Egyptian Law 151/2020 (the PDPL) and Saudi
 * Arabia's PDPL (Royal Decree M/19 of 2023), plus the capabilities we can
 * actually assert at export time. This module is dependency-free and fully
 * unit-testable so the compliance posture logic is provable without the PDF,
 * CSV or database layers.
 */

export type ComplianceRegime = 'EGYPT_LAW_151' | 'SAUDI_PDPL';

export interface RegimeRights {
  access: boolean;
  rectification: boolean;
  erasure: boolean;
  portability: boolean;
  objection: boolean;
}

export interface RegimeDefinition {
  id: ComplianceRegime;
  /** Full official name of the law. */
  name: string;
  jurisdiction: string;
  effectiveAt: string;
  /** Documented regulator/controller disclosure strings used in exports. */
  controllerNotice: string;
  /** Minimum breach-notification window (ISO 8601 duration). */
  breachNotifyWindow: string;
  /** Whether the regime restricts cross-border transfers. */
  restrictsTransfers: boolean;
  /** Whether retained PII must be destroyed or anonymised when the purpose ends. */
  requiresErasureOnPurposeEnd: boolean;
  rights: RegimeRights;
  /** Default data-retention policy (days) per record class, used by the purge scheduler. */
  retentionDays: {
    contacts: number;
    scanLogs: number;
    auditLogs: number;
  };
}

export const REGIMES: Record<ComplianceRegime, RegimeDefinition> = {
  EGYPT_LAW_151: {
    id: 'EGYPT_LAW_151',
    name: 'Egyptian Law No. 151 of 2020 (Personal Data Protection Law)',
    jurisdiction: 'Arab Republic of Egypt',
    effectiveAt: '2020-10-13',
    controllerNotice:
      'The data controller is the GateFlow tenant (Wagic Group). Law 151/2020 requires a licensed data-protection office (DPO) for the controller.',
    breachNotifyWindow: '72 hours',
    restrictsTransfers: false,
    requiresErasureOnPurposeEnd: true,
    rights: {
      access: true,
      rectification: true,
      erasure: true,
      portability: false,
      objection: true,
    },
    retentionDays: {
      contacts: 1095,
      scanLogs: 730,
      auditLogs: 1825,
    },
  },
  SAUDI_PDPL: {
    id: 'SAUDI_PDPL',
    name: 'Saudi Personal Data Protection Law (PDPL), Royal Decree M/19 of 2023',
    jurisdiction: 'Kingdom of Saudi Arabia',
    effectiveAt: '2024-09-14',
    controllerNotice:
      'The data controller is the GateFlow tenant (Wagic Group). The PDPL restricts cross-border transfer of personal data to non-KSA jurisdictions.',
    breachNotifyWindow: '72 hours',
    restrictsTransfers: true,
    requiresErasureOnPurposeEnd: true,
    rights: {
      access: true,
      rectification: true,
      erasure: true,
      portability: true,
      objection: true,
    },
    retentionDays: {
      contacts: 730,
      scanLogs: 365,
      auditLogs: 1095,
    },
  },
};

export function getRegime(id: ComplianceRegime | string): RegimeDefinition {
  if (id === 'EGYPT_LAW_151' || id === 'SAUDI_PDPL') {
    return REGIMES[id];
  }
  throw new Error(`Unknown compliance regime: ${id}`);
}

export function isSupportedRegime(id: unknown): id is ComplianceRegime {
  return id === 'EGYPT_LAW_151' || id === 'SAUDI_PDPL';
}

/**
 * Data we can measure at export time and assert against the regime.
 * The engine supplies these; the assessment derivation is pure.
 */
export interface ComplianceEvidence {
  /** Number of personal-data records retained within the tenant. */
  piiRecordCount: number;
  /** Number of access/processing events in the export window. */
  processingEventCount: number;
  /** Number of audit-log entries retained. */
  auditLogCount: number;
  /** Whether the org has a designated data-protection officer/contact. */
  hasDataProtectionOfficer: boolean | null;
  /** Whether breach notification to the regulator is configured. */
  breachNotificationConfigured: boolean | null;
  /** Whether tenant audit tooling and its operating workflow were verified. */
  auditLoggingVerified: boolean | null;
  /** Whether workflows for the regime's statutory rights were verified. */
  statutoryRightsWorkflowsVerified: boolean | null;
  /** Whether configured retention aging and purge execution were verified. */
  retentionAgingVerified: boolean | null;
}

export type ControlStatus = 'PASS' | 'PARTIAL' | 'FAIL' | 'INFO';
export type ControlCategory =
  'governance' | 'rights' | 'retention' | 'transfer' | 'breach';

export interface ComplianceControl {
  id: string;
  category: ControlCategory;
  title: string;
  status: ControlStatus;
  note: string;
}

export interface ComplianceAssessment {
  regime: ComplianceRegime;
  score: number;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  controls: ComplianceControl[];
}

/**
 * Derive a compliance assessment from measurable evidence against a regime.
 * Pure — no I/O — so it is exhaustively unit-testable.
 */
export function assessCompliance(
  regime: ComplianceRegime,
  evidence: ComplianceEvidence
): ComplianceAssessment {
  const def = getRegime(regime);
  const controls: ComplianceControl[] = [];

  const push = (
    c: Omit<ComplianceControl, 'category'> & { category: ControlCategory }
  ) => controls.push(c as ComplianceControl);

  // Governance — DPO / supervisory oversight
  push({
    id: 'GOV-DPO',
    category: 'governance',
    title: 'Designated data-protection officer',
    status:
      evidence.hasDataProtectionOfficer === null
        ? 'INFO'
        : evidence.hasDataProtectionOfficer
          ? 'PASS'
          : 'PARTIAL',
    note:
      evidence.hasDataProtectionOfficer === null
        ? 'Unassessed: no verified tenant DPO setting was available.'
        : evidence.hasDataProtectionOfficer
          ? 'A data-protection officer is designated for this tenant.'
          : 'Suggest designating a DPO and documenting their contact in the export.',
  });

  // Governance — records of processing
  push({
    id: 'GOV-RECORDS',
    category: 'governance',
    title: 'Records of processing activities',
    status:
      evidence.auditLoggingVerified === true && evidence.auditLogCount > 0
        ? 'PASS'
        : 'PARTIAL',
    note:
      evidence.auditLoggingVerified === true
        ? `${evidence.auditLogCount} audit entries retained; tenant audit tooling and workflow verified.`
        : `${evidence.auditLogCount} audit entries retained; tenant audit tooling and workflow are unverified.`,
  });

  // Rights — all enacted rights must be covered by tooling
  const rightsLabels: Record<keyof RegimeRights, string> = {
    access: 'Subject access',
    rectification: 'Rectification',
    erasure: 'Erasure',
    portability: 'Data portability',
    objection: 'Objection / restriction',
  };
  (Object.keys(def.rights) as (keyof RegimeRights)[]).forEach((right) => {
    push({
      id: `RIGHTS-${right.toUpperCase()}`,
      category: 'rights',
      title: rightsLabels[right],
      status: def.rights[right]
        ? evidence.statutoryRightsWorkflowsVerified === true
          ? 'PASS'
          : 'PARTIAL'
        : 'INFO',
      note: def.rights[right]
        ? evidence.statutoryRightsWorkflowsVerified === true
          ? `${def.name.split(' (')[0]} grants this right; the tenant request workflow is verified.`
          : `${def.name.split(' (')[0]} grants this right; the tenant request workflow is unverified.`
        : 'Not explicitly required by this regime; still recommended.',
    });
  });

  // Retention
  push({
    id: 'RET-PII',
    category: 'retention',
    title: 'Retention of personal data',
    status: evidence.retentionAgingVerified === true ? 'PASS' : 'PARTIAL',
    note:
      evidence.retentionAgingVerified === true
        ? `${evidence.piiRecordCount} PII records; retention aging and purge execution were verified against the ${def.retentionDays.contacts}-day contact window.`
        : `${evidence.piiRecordCount} PII records; retention aging and purge execution are unverified.`,
  });

  // Transfer
  push({
    id: 'TRANSFER-XB',
    category: 'transfer',
    title: 'Cross-border transfer controls',
    status: def.restrictsTransfers ? 'PARTIAL' : 'PASS',
    note: def.restrictsTransfers
      ? 'PDPL restricts transfer of personal data out of KSA; ensure processing stays in-region or has an adequacy basis.'
      : 'Law 151 permits cross-border transfer under adequacy/consent safeguards.',
  });

  // Breach notification
  push({
    id: 'BREACH-NOTIFY',
    category: 'breach',
    title: 'Breach notification to regulator',
    status:
      evidence.breachNotificationConfigured === null
        ? 'INFO'
        : evidence.breachNotificationConfigured
          ? 'PASS'
          : 'PARTIAL',
    note:
      evidence.breachNotificationConfigured === null
        ? 'Unassessed: no verified tenant breach-notification setting was available.'
        : evidence.breachNotificationConfigured
          ? `${def.breachNotifyWindow} breach-notification window configured.`
          : `Required within ${def.breachNotifyWindow}; configure the regulator notification destination.`,
  });

  // Score: PASS=1.0, PARTIAL and FAIL=0, INFO=excluded from denominator.
  // Compliance is gated on controls actually being met; a PARTIAL is a real gap.
  const scored = controls.filter((c) => c.status !== 'INFO');
  const denom = scored.length || 1;
  const total = scored.reduce((s, c) => s + (c.status === 'PASS' ? 1 : 0), 0);
  const score = Math.round((total / denom) * 100);

  const status: ComplianceAssessment['status'] =
    controls.some((c) => c.status === 'FAIL') || score < 50
      ? 'NON_COMPLIANT'
      : score >= 80 && !controls.some((c) => c.status === 'PARTIAL')
        ? 'COMPLIANT'
        : 'PARTIAL';

  return { regime, score, status, controls };
}
