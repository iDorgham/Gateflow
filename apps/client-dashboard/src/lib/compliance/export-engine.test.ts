import {
  buildEvidence,
  parseVerifiedTenantComplianceSettings,
  renderCsv,
  type CollectedRows,
} from './export-engine';

const rows: CollectedRows = {
  contacts: [
    {
      id: 'c1',
      fullName: 'Amr Hassan',
      email: 'amr@example.com',
      phone: '+201000000000',
      company: 'Acme',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'c2',
      fullName: 'Nora Ali',
      email: '',
      phone: '+966500000000',
      company: '',
      createdAt: '2026-02-01T00:00:00.000Z',
    },
  ],
  processingEvents: [
    {
      id: 'p1',
      scannedAt: '2026-08-01T10:00:00.000Z',
      status: 'SUCCESS',
      gateId: 'g1',
    },
  ],
  auditEvents: [
    {
      id: 'a1',
      action: 'CONTACT_CREATED',
      entityType: 'CONTACT',
      createdAt: '2026-08-01T09:00:00.000Z',
    },
  ],
};

describe('compliance export engine (pure helpers)', () => {
  it('builds evidence counts from collected rows', () => {
    const ev = buildEvidence(rows);
    expect(ev.piiRecordCount).toBe(2);
    expect(ev.processingEventCount).toBe(1);
    expect(ev.auditLogCount).toBe(1);
    expect(ev.hasDataProtectionOfficer).toBeNull();
    expect(ev.breachNotificationConfigured).toBeNull();
  });

  it('uses only complete, timestamped tenant verification settings', () => {
    const settings = parseVerifiedTenantComplianceSettings({
      compliance: {
        verifiedAt: '2026-08-01T00:00:00.000Z',
        hasDataProtectionOfficer: true,
        breachNotificationConfigured: false,
        auditLoggingVerified: true,
        statutoryRightsWorkflowsVerified: true,
        retentionAgingVerified: true,
      },
    });
    const ev = buildEvidence(rows, settings);
    expect(ev.hasDataProtectionOfficer).toBe(true);
    expect(ev.breachNotificationConfigured).toBe(false);
    expect(
      parseVerifiedTenantComplianceSettings({
      compliance: {
        verifiedAt: '2026-08-01T00:00:00.000Z',
        hasDataProtectionOfficer: true,
        breachNotificationConfigured: false,
        auditLoggingVerified: true,
        statutoryRightsWorkflowsVerified: true,
        // retentionAgingVerified intentionally omitted
      },
  });

  it('renders all record types in one normalized CSV table', () => {
    const csv = renderCsv(rows);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(1 + 2 + 1 + 1);
    expect(lines[0]).toBe(
      '"recordType","id","fullName","email","phone","company","createdAt","scannedAt","status","gateId","action","entityType"'
    );
    expect(csv).toContain('"contact"');
    expect(csv).toContain('"processing_event"');
    expect(csv).toContain('"audit_event"');
    expect(csv).not.toContain('# CONTACTS');
    expect(csv).toContain('Amr Hassan');
    expect(csv).toContain('Acme');
  });

  it('handles empty collections without throwing', () => {
    const csv = renderCsv({
      contacts: [],
      processingEvents: [],
      auditEvents: [],
    });
    expect(csv.split('\n')).toHaveLength(1);
    expect(csv).toContain('"recordType"');
  });
});
