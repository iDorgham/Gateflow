import { encryptField, decryptField } from './crypto';

describe('packages/db crypto (AES-256-GCM)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      CRM_ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef',
      CRM_ENCRYPTION_SALT: 'test_salt_123',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('encrypts and decrypts strings correctly in iv:tag:encrypted format', () => {
    const plaintext = 'NationalID-1234567890';
    const encrypted = encryptField(plaintext);

    expect(encrypted).not.toBeNull();
    expect(typeof encrypted).toBe('string');

    // Verify format: iv(24 hex):tag(32 hex):encrypted(hex)
    const parts = (encrypted as string).split(':');
    expect(parts.length).toBe(3);
    expect(parts[0]?.length).toBe(24); // 12 bytes IV
    expect(parts[1]?.length).toBe(32); // 16 bytes auth tag
    expect(parts[2]?.length).toBeGreaterThan(0);

    const decrypted = decryptField(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('handles null/empty gracefully', () => {
    expect(encryptField(null)).toBeNull();
    expect(decryptField(null)).toBeNull();
    expect(encryptField('')).toBeNull();
    expect(decryptField('')).toBeNull();
  });

  it('returns null for tampered/corrupted payload', () => {
    const plaintext = 'Sensitive-PII-Data';
    const encrypted = encryptField(plaintext)!;
    const parts = encrypted.split(':');

    // Tamper with ciphertext
    const tampered = `${parts[0]}:${parts[1]}:${parts[2]?.slice(0, -2)}ff`;
    expect(decryptField(tampered)).toBeNull();

    // Tamper with tag
    const tamperedTag = `${parts[0]}:00000000000000000000000000000000:${parts[2]}`;
    expect(decryptField(tamperedTag)).toBeNull();

    // Malformed segments
    expect(decryptField('not-a-valid-payload')).toBeNull();
    expect(decryptField('only:two')).toBeNull();
  });
});
