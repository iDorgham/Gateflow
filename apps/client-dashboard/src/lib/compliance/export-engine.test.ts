import { buildEvidence, renderCsv, type CollectedRows } from './export-engine';

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
    expect(ev.hasDataProtectionOfficer).toBe(false);
  });

  it('renders a CSV containing all three sections', () => {
    const csv = renderCsv(rows);
    expect(csv).toContain('# CONTACTS (PII)');
    expect(csv).toContain('# PROCESSING EVENTS');
    expect(csv).toContain('# AUDIT LOG');
    expect(csv).toContain('Amr Hassan');
    expect(csv).toContain('Acme');
  });

  it('handles empty collections without throwing', () => {
    const csv = renderCsv({
      contacts: [],
      processingEvents: [],
      auditEvents: [],
    });
    expect(csv).toContain('# CONTACTS (PII)');
    expect(csv).toContain('# AUDIT LOG');
  });
});
