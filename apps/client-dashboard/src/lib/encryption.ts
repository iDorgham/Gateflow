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
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// ─── Format prefix ────────────────────────────────────────────────────────────

export const ENCRYPTED_PREFIX = 'enc:v1:';

const RAW_KEY = process.env.ENCRYPTION_MASTER_KEY;
let cachedMasterKey: Buffer | null = null;

/**
 * Parse and cache the master key lazily.
 * Expected value: 64 hex characters (= 32 bytes / 256 bits).
 */
function getMasterKey(): Buffer {
  if (cachedMasterKey) return cachedMasterKey;

  if (!RAW_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[encryption] ENCRYPTION_MASTER_KEY must be set in production. ' +
          'Generate one with: openssl rand -hex 32',
      );
    }
    console.warn(
      '[encryption] ENCRYPTION_MASTER_KEY not set — using all-zero fallback key. ' +
        'This is INSECURE outside local development.',
    );
  }

  const keyHex =
    RAW_KEY ?? '0000000000000000000000000000000000000000000000000000000000000000';
  let key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    // Pad or truncate misconfigured keys — never silently accept a weak key in prod
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `[encryption] ENCRYPTION_MASTER_KEY must be exactly 64 hex characters (got ${key.length * 2}).`,
      );
    }
    const padded = Buffer.alloc(32);
    key.copy(padded);
    key = padded;
  }
  
  cachedMasterKey = key;
  return key;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Encrypt a plaintext string.
 * Returns a string with the "enc:v1:" prefix so it is unambiguously
 * identifiable as an encrypted value.
 */
export function encryptField(plaintext: string): string {
  const iv = randomBytes(12); // 96-bit GCM IV
  const cipher = createCipheriv('aes-256-gcm', getMasterKey(), iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag(); // 128-bit authentication tag

  // Layout: IV (12 B) | Tag (16 B) | Ciphertext (N B)
  return ENCRYPTED_PREFIX + Buffer.concat([iv, tag, encrypted]).toString('base64');
}

/**
 * Decrypt a value produced by encryptField().
 * Also accepts old values that lack the "enc:v1:" prefix (backward compat).
 */
export function decryptField(value: string): string {
  const b64 = value.startsWith(ENCRYPTED_PREFIX)
    ? value.slice(ENCRYPTED_PREFIX.length)
    : value; // backward compat: old format had no prefix

  const data = Buffer.from(b64, 'base64');

  if (data.length < 28) {
    throw new Error('[encryption] Decryption failed — data too short (invalid format)');
  }

  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);

  const decipher = createDecipheriv('aes-256-gcm', getMasterKey(), iv);
  decipher.setAuthTag(tag);

  try {
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    throw new Error('[encryption] Decryption failed — wrong key or corrupted data');
  }
}

/**
 * Returns true when the value was produced by encryptField() with the
 * current "enc:v1:" prefix.  Values lacking the prefix are either plaintext
 * or were encrypted before the prefix convention was introduced.
 */
export function isEncryptedField(value: string): boolean {
  return value.startsWith(ENCRYPTED_PREFIX);
}

/**
 * Generate a cryptographically random hex secret (e.g. for webhook signing).
 */
export function generateSecret(): string {
  return randomBytes(32).toString('hex');
}
