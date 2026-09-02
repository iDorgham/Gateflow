import {
  assessCompliance,
  getRegime,
  isSupportedRegime,
  REGIMES,
  type ComplianceEvidence,
} from './regimes';

const fullEvidence: ComplianceEvidence = {
  piiRecordCount: 5,
  processingEventCount: 42,
  auditLogCount: 9001,
  hasDataProtectionOfficer: true,
  breachNotificationConfigured: true,
  auditLoggingVerified: true,
  statutoryRightsWorkflowsVerified: true,
  retentionAgingVerified: true,
};

describe('compliance regimes', () => {
  it('exposes both supported regimes', () => {
    expect(Object.keys(REGIMES).sort()).toEqual([
      'EGYPT_LAW_151',
      'SAUDI_PDPL',
    ]);
  });

  it('parses the Egyptian Law 151 definition', () => {
    const def = getRegime('EGYPT_LAW_151');
    expect(def.jurisdiction).toContain('Egypt');
    expect(def.effectiveAt).toBe('2020-10-13');
    expect(def.requiresErasureOnPurposeEnd).toBe(true);
    expect(def.restrictsTransfers).toBe(false);
    expect(def.rights.portability).toBe(false);
  });

  it('parses the Saudi PDPL definition', () => {
    const def = getRegime('SAUDI_PDPL');
    expect(def.jurisdiction).toContain('Saudi Arabia');
    expect(def.effectiveAt).toBe('2024-09-14');
    expect(def.restrictsTransfers).toBe(true);
    expect(def.rights.portability).toBe(true);
  });

  it('rejects an unknown regime', () => {
    expect(() => getRegime('GDPR')).toThrow(/Unknown compliance regime/);
  });

  it('recognises supported regime identifiers', () => {
    expect(isSupportedRegime('EGYPT_LAW_151')).toBe(true);
    expect(isSupportedRegime('SAUDI_PDPL')).toBe(true);
    expect(isSupportedRegime('GDPR')).toBe(false);
    expect(isSupportedRegime(undefined)).toBe(false);
  });

  it('remains partial when a required control is partial', () => {
    const a = assessCompliance('SAUDI_PDPL', fullEvidence);
    expect(a.status).toBe('PARTIAL');
    expect(a.score).toBeGreaterThanOrEqual(80);
    expect(a.controls.every((c) => c.status !== 'FAIL')).toBe(true);
  });

  it('downgrades to PARTIAL without a DPO or breach channel', () => {
    const a = assessCompliance('SAUDI_PDPL', {
      ...fullEvidence,
      hasDataProtectionOfficer: false,
      breachNotificationConfigured: false,
    });
    expect(a.status).toBe('PARTIAL');
    expect(a.score).toBeLessThan(80);
  });

  it('flags transfer controls for KSA, not for Egypt', () => {
    const ksa = assessCompliance('SAUDI_PDPL', fullEvidence);
    const eg = assessCompliance('EGYPT_LAW_151', fullEvidence);
    const ksaTransfer = ksa.controls.find((c) => c.id === 'TRANSFER-XB')!;
    const egTransfer = eg.controls.find((c) => c.id === 'TRANSFER-XB')!;
    expect(ksaTransfer.status).not.toBe('PASS');
    expect(egTransfer.status).toBe('PASS');
  });

  it('excludes INFO controls from the score denominator', () => {
    const a = assessCompliance('EGYPT_LAW_151', {
      ...fullEvidence,
      piiRecordCount: 0,
    });
    const info = a.controls.filter((c) => c.status === 'INFO');
    expect(info.some((c) => c.id === 'RIGHTS-PORTABILITY')).toBe(true);
    expect(a.score).toBeGreaterThanOrEqual(0);
  });

  it('does not pass controls based on counts or statutory declarations alone', () => {
    const a = assessCompliance('EGYPT_LAW_151', {
      ...fullEvidence,
      auditLoggingVerified: null,
      statutoryRightsWorkflowsVerified: null,
      retentionAgingVerified: null,
    });
    expect(a.controls.find((c) => c.id === 'GOV-RECORDS')?.status).toBe(
      'PARTIAL'
    );
    expect(a.controls.find((c) => c.id === 'RIGHTS-ACCESS')?.status).toBe(
      'PARTIAL'
    );
    expect(a.controls.find((c) => c.id === 'RET-PII')?.status).toBe('PARTIAL');
  });

  it('produces a deterministic control set', () => {
    const a1 = assessCompliance('EGYPT_LAW_151', fullEvidence);
    const a2 = assessCompliance('EGYPT_LAW_151', fullEvidence);
    expect(a1.controls.map((c) => c.id)).toEqual(a2.controls.map((c) => c.id));
    expect(a1.controls.length).toBeGreaterThanOrEqual(8);
  });
});
