import {
  anonymizeContactPii,
  anonymizeUserPii,
  anonymizeVehiclePlatePii,
  redact,
  redactedOrNull,
  retentionBatchEnabled,
} from './retention-apply';

const SALT = 'org-abc123';

describe('retention-apply redaction', () => {
  it('produces deterministic, non-reversible tags', () => {
    const a = redact('Amr Hassan', SALT);
    const b = redact('Amr Hassan', SALT);
    expect(a).toBe(b);
    expect(a).toMatch(/^\[redacted-[0-9a-f]{12}\]$/);
    expect(a).not.toContain('Amr');
  });

  it('derives different tags from different salts', () => {
    const a = redact('same-value', 'salt-1');
    const b = redact('same-value', 'salt-2');
    expect(a).not.toBe(b);
  });

  it('nullifies empty optional fields', () => {
    expect(redactedOrNull(null, SALT)).toBeNull();
    expect(redactedOrNull('', SALT)).toBeNull();
    expect(redactedOrNull(undefined, SALT)).toBeNull();
  });

  it('anonymizes a contact while preserving structure', () => {
    const scrubbed = anonymizeContactPii(
      {
        firstName: 'Amr',
        lastName: 'Hassan',
        email: 'amr@example.com',
        phone: '+201000000000',
        company: 'Acme',
        jobTitle: 'Engineer',
        companyWebsite: 'https://acme.example',
        notes: 'VIP visitor',
      },
      SALT
    );
    expect(scrubbed.firstName).toMatch(/^\[redacted-/);
    expect(scrubbed.lastName).toMatch(/^\[redacted-/);
    expect(scrubbed.email).toMatch(/^\[redacted-/);
    expect(scrubbed.phone).toMatch(/^\[redacted-/);
    expect(JSON.stringify(scrubbed)).not.toContain('amr@example.com');
  });

  it('anonymizes a user while preserving the password hash', () => {
    const scrubbed = anonymizeUserPii(
      {
        name: 'Nora Ali',
        email: 'nora@example.com',
        phone: '+966500000000',
        passwordHash: 'hash',
      },
      SALT
    );
    expect(scrubbed.name).toMatch(/^\[redacted-/);
    expect(scrubbed.email).toMatch(/^\[redacted-/);
    expect(scrubbed.phone).toMatch(/^\[redacted-/);
    expect(scrubbed.passwordHash).toBe('hash');
  });

  it('anonymizes vehicle owner PII but keeps the plate number', () => {
    const scrubbed = anonymizeVehiclePlatePii(
      { plateNumber: 'ABC123', ownerName: 'Amr', ownerPhone: '+201000000000' },
      SALT
    );
    expect(scrubbed.plateNumber).toBe('ABC123');
    expect(scrubbed.ownerName).toMatch(/^\[redacted-/);
    expect(scrubbed.ownerPhone).toMatch(/^\[redacted-/);
  });

  it('recognises an enabled batch from at least one window', () => {
    expect(
      retentionBatchEnabled({
        scanLogs: new Date(),
        visitorHistory: null,
        idArtifacts: null,
        incidents: null,
      })
    ).toBe(true);
    expect(
      retentionBatchEnabled({
        scanLogs: null,
        visitorHistory: null,
        idArtifacts: null,
        incidents: null,
      })
    ).toBe(false);
  });
});
