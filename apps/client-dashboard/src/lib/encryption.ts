/**
 * Field-level encryption utilities — AES-256-GCM
 *
 * Storage format: "enc:v1:" + base64(IV[12] + GCM-tag[16] + ciphertext)
 *
 * The "enc:v1:" prefix lets callers distinguish encrypted values from
 * plaintext at a glance without attempting a decryption trial.
 *
 * Backward compatibility: decryptField() accepts old values that lack the
 * prefix (created before this prefix was introduced).
 *
 * Dual-Key Rotation: Supports ENCRYPTION_MASTER_KEY (primary) and
 * ENCRYPTION_FALLBACK_KEY (secondary) for zero-downtime key rotations.
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// ─── Format prefix ────────────────────────────────────────────────────────────

export const ENCRYPTED_PREFIX = 'enc:v1:';

function parseKey(
  rawKey: string | Buffer | undefined,
  keyName: string
): Buffer | null {
  if (!rawKey) return null;
  const key = Buffer.isBuffer(rawKey) ? rawKey : Buffer.from(rawKey, 'hex');
  if (key.length !== 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `[encryption] ${keyName} must be exactly 64 hex characters (got ${key.length * 2}).`
      );
    }
    const padded = Buffer.alloc(32);
    key.copy(padded);
    return padded;
  }
  return key;
}

function getMasterKey(customKey?: string | Buffer): Buffer {
  if (customKey) {
    const key = parseKey(customKey, 'Custom encryption key');
    if (key) return key;
  }

  const rawKey = process.env.ENCRYPTION_MASTER_KEY;
  if (!rawKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[encryption] ENCRYPTION_MASTER_KEY must be set in production. ' +
          'Generate one with: openssl rand -hex 32'
      );
    }
    console.warn(
      '[encryption] ENCRYPTION_MASTER_KEY not set — using all-zero fallback key. ' +
        'This is INSECURE outside local development.'
    );
  }

  const keyHex =
    rawKey ??
    '0000000000000000000000000000000000000000000000000000000000000000';
  const key = parseKey(keyHex, 'ENCRYPTION_MASTER_KEY');
  return key ?? Buffer.alloc(32);
}

function getFallbackKey(customFallbackKey?: string | Buffer): Buffer | null {
  if (customFallbackKey) {
    return parseKey(customFallbackKey, 'Custom fallback encryption key');
  }
  const rawKey = process.env.ENCRYPTION_FALLBACK_KEY;
  return rawKey ? parseKey(rawKey, 'ENCRYPTION_FALLBACK_KEY') : null;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Encrypt a plaintext string.
 * Returns a string with the "enc:v1:" prefix so it is unambiguously
 * identifiable as an encrypted value.
 */
export function encryptField(plaintext: string, key?: string | Buffer): string {
  const iv = randomBytes(12); // 96-bit GCM IV
  const cipher = createCipheriv('aes-256-gcm', getMasterKey(key), iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag(); // 128-bit authentication tag

  // Layout: IV (12 B) | Tag (16 B) | Ciphertext (N B)
  return (
    ENCRYPTED_PREFIX + Buffer.concat([iv, tag, encrypted]).toString('base64')
  );
}

function tryDecryptWithKey(
  iv: Buffer,
  tag: Buffer,
  ciphertext: Buffer,
  key: Buffer
): string {
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
}

/**
 * Decrypt a value produced by encryptField().
 * Also accepts old values that lack the "enc:v1:" prefix (backward compat).
 * Supports dual-key fallback when ENCRYPTION_FALLBACK_KEY is set.
 */
export function decryptField(
  value: string,
  primaryKey?: string | Buffer,
  fallbackKey?: string | Buffer
): string {
  const b64 = value.startsWith(ENCRYPTED_PREFIX)
    ? value.slice(ENCRYPTED_PREFIX.length)
    : value; // backward compat: old format had no prefix

  const data = Buffer.from(b64, 'base64');

  if (data.length < 28) {
    throw new Error(
      '[encryption] Decryption failed — data too short (invalid format)'
    );
  }

  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);

  const masterKey = getMasterKey(primaryKey);
  const altKey = getFallbackKey(fallbackKey);

  try {
    return tryDecryptWithKey(iv, tag, ciphertext, masterKey);
  } catch (primaryErr) {
    if (altKey) {
      try {
        return tryDecryptWithKey(iv, tag, ciphertext, altKey);
      } catch (fallbackErr) {
        throw new Error(
          '[encryption] Decryption failed — wrong key or corrupted data',
          {
            cause: fallbackErr,
          }
        );
      }
    }
    throw new Error(
      '[encryption] Decryption failed — wrong key or corrupted data',
      {
        cause: primaryErr,
      }
    );
  }
}

/**
 * Re-encrypts an existing encrypted field with a new key during envelope rotation.
 */
export function rotateEncryptionField(
  encryptedValue: string,
  newKey?: string | Buffer,
  oldKey?: string | Buffer
): string {
  if (!encryptedValue || !isEncryptedField(encryptedValue)) {
    return encryptedValue;
  }
  const plainText = decryptField(encryptedValue, oldKey);
  return encryptField(plainText, newKey);
}

/**
 * Returns true when the value was produced by encryptField() with the
 * current "enc:v1:" prefix.
 */
export function isEncryptedField(value: string): boolean {
  return typeof value === 'string' && value.startsWith(ENCRYPTED_PREFIX);
}

/**
 * Generate a cryptographically random hex secret (e.g. for webhook signing).
 */
export function generateSecret(): string {
  return randomBytes(32).toString('hex');
}
