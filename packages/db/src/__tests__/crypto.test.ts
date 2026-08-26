export {};

import {
  encrypt,
  decrypt,
  isEncrypted,
  rotateEncryption,
  ENCRYPTED_PREFIX,
} from '../crypto';

const KEY_A =
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const KEY_B =
  'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
const SAMPLE_PLAINTEXT = '29901011234567'; // Egyptian National ID format

describe('packages/db: field encryption primitives', () => {
  const originalEnvMaster = process.env.ENCRYPTION_MASTER_KEY;
  const originalEnvFallback = process.env.ENCRYPTION_FALLBACK_KEY;

  beforeEach(() => {
    process.env.ENCRYPTION_MASTER_KEY = KEY_A;
    delete process.env.ENCRYPTION_FALLBACK_KEY;
  });

  afterAll(() => {
    process.env.ENCRYPTION_MASTER_KEY = originalEnvMaster;
    process.env.ENCRYPTION_FALLBACK_KEY = originalEnvFallback;
  });

  test('encrypt() returns string starting with enc:v1: prefix and decrypt() recovers plaintext', () => {
    const encrypted = encrypt(SAMPLE_PLAINTEXT);
    expect(encrypted.startsWith(ENCRYPTED_PREFIX)).toBe(true);
    expect(isEncrypted(encrypted)).toBe(true);

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(SAMPLE_PLAINTEXT);
  });

  test('encrypt() produces different ciphertexts for same plaintext (unique random IVs)', () => {
    const enc1 = encrypt(SAMPLE_PLAINTEXT);
    const enc2 = encrypt(SAMPLE_PLAINTEXT);
    expect(enc1).not.toBe(enc2);
    expect(decrypt(enc1)).toBe(SAMPLE_PLAINTEXT);
    expect(decrypt(enc2)).toBe(SAMPLE_PLAINTEXT);
  });

  test('encrypt() and decrypt() handle empty/null strings safely', () => {
    expect(encrypt('')).toBe('');
    expect(decrypt('')).toBe('');
    expect(isEncrypted('')).toBe(false);
  });

  test('decrypt() returns unencrypted plaintext as-is without crashing', () => {
    const plain = 'unencrypted_string_value';
    expect(decrypt(plain)).toBe(plain);
    expect(isEncrypted(plain)).toBe(false);
  });

  test('decrypt() fails-closed on tampered ciphertext or auth tag', () => {
    const encrypted = encrypt(SAMPLE_PLAINTEXT);
    const b64 = encrypted.slice(ENCRYPTED_PREFIX.length);
    const data = Buffer.from(b64, 'base64');

    // Tamper with last byte
    data[data.length - 1] ^= 0xff;
    const tampered = ENCRYPTED_PREFIX + data.toString('base64');

    expect(() => decrypt(tampered)).toThrow(
      'Failed to decrypt data — possibly wrong master key or corrupted data'
    );
  });

  test('supports custom key override directly in encrypt and decrypt', () => {
    const encryptedWithB = encrypt(SAMPLE_PLAINTEXT, KEY_B);
    expect(decrypt(encryptedWithB, KEY_B)).toBe(SAMPLE_PLAINTEXT);

    // Decrypting with wrong key KEY_A throws
    expect(() => decrypt(encryptedWithB, KEY_A)).toThrow();
  });

  test('dual-key rotation: fallback key decrypts historical data when master key is rotated', () => {
    // 1. Data was encrypted with KEY_B in the past
    const historicalEncrypted = encrypt(SAMPLE_PLAINTEXT, KEY_B);

    // 2. Platform rotated to KEY_A as master, keeping KEY_B as fallback
    process.env.ENCRYPTION_MASTER_KEY = KEY_A;
    process.env.ENCRYPTION_FALLBACK_KEY = KEY_B;

    // Decrypt transparently falls back to KEY_B and succeeds
    const decrypted = decrypt(historicalEncrypted);
    expect(decrypted).toBe(SAMPLE_PLAINTEXT);

    // New writes use KEY_A
    const newEncrypted = encrypt('NEW_DATA');
    expect(decrypt(newEncrypted)).toBe('NEW_DATA');
  });

  test('rotateEncryption() re-encrypts ciphertext with new key', () => {
    const encWithOld = encrypt(SAMPLE_PLAINTEXT, KEY_B);
    const rotated = rotateEncryption(encWithOld, KEY_A, KEY_B);

    expect(isEncrypted(rotated)).toBe(true);
    expect(decrypt(rotated, KEY_A)).toBe(SAMPLE_PLAINTEXT);
  });

  test('throws error if ENCRYPTION_MASTER_KEY is not set or invalid length', () => {
    delete process.env.ENCRYPTION_MASTER_KEY;
    expect(() => encrypt('test')).toThrow(
      'ENCRYPTION_MASTER_KEY environment variable is not set'
    );

    process.env.ENCRYPTION_MASTER_KEY = 'too_short';
    expect(() => encrypt('test')).toThrow(
      'must be 64 hex characters (32 bytes)'
    );
  });
});
