import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export const ENCRYPTED_PREFIX = 'enc:v1:';

function parseKey(
  rawKey: string | Buffer | undefined,
  keyName: string
): Buffer | null {
  if (!rawKey) return null;
  const key = Buffer.isBuffer(rawKey) ? rawKey : Buffer.from(rawKey, 'hex');
  if (key.length !== 32) {
    throw new Error(`${keyName} must be 64 hex characters (32 bytes)`);
  }
  return key;
}

function getMasterKey(customKey?: string | Buffer): Buffer {
  if (customKey) {
    const key = parseKey(customKey, 'Custom encryption key');
    if (key) return key;
  }
  const raw = process.env.ENCRYPTION_MASTER_KEY;
  if (!raw) {
    throw new Error('ENCRYPTION_MASTER_KEY environment variable is not set');
  }
  const key = parseKey(raw, 'ENCRYPTION_MASTER_KEY');
  if (!key) {
    throw new Error('ENCRYPTION_MASTER_KEY environment variable is not set');
  }
  return key;
}

function getFallbackKey(customFallbackKey?: string | Buffer): Buffer | null {
  if (customFallbackKey) {
    return parseKey(customFallbackKey, 'Custom fallback encryption key');
  }
  const raw = process.env.ENCRYPTION_FALLBACK_KEY;
  return raw ? parseKey(raw, 'ENCRYPTION_FALLBACK_KEY') : null;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output is prefixed with "enc:v1:" and base64 encoded.
 *
 * @param plaintext The string to encrypt.
 * @param key Optional custom 32-byte key (Buffer or 64 hex chars).
 * @returns The encrypted string with version prefix.
 */
export function encrypt(plaintext: string, key?: string | Buffer): string {
  if (!plaintext) return plaintext;

  const masterKey = getMasterKey(key);
  try {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', masterKey, iv);

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    // Format: prefix + base64(iv + tag + ciphertext)
    // IV = 12 bytes, Tag = 16 bytes, Ciphertext = variable
    return (
      ENCRYPTED_PREFIX + Buffer.concat([iv, tag, ciphertext]).toString('base64')
    );
  } catch (err) {
    console.error('Encryption failed:', err);
    throw Object.assign(new Error('Failed to encrypt data'), { cause: err });
  }
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
 * Decrypts a string that was encrypted with encrypt().
 * Supports dual-key fallback when ENCRYPTION_FALLBACK_KEY is set or passed.
 * Returns the plaintext. If missing prefix, returns as-is.
 *
 * @param value The encrypted string or plaintext.
 * @param primaryKey Optional primary 32-byte key.
 * @param fallbackKey Optional fallback 32-byte key.
 * @returns The decrypted plaintext string.
 */
export function decrypt(
  value: string,
  primaryKey?: string | Buffer,
  fallbackKey?: string | Buffer
): string {
  if (!value || !value.startsWith(ENCRYPTED_PREFIX)) {
    return value;
  }

  const masterKey = getMasterKey(primaryKey);
  const altKey = getFallbackKey(fallbackKey);

  const b64 = value.slice(ENCRYPTED_PREFIX.length);
  const data = Buffer.from(b64, 'base64');

  if (data.length < 28) {
    throw new Error('Invalid encrypted data length (too short for IV + Tag)');
  }

  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);

  try {
    return tryDecryptWithKey(iv, tag, ciphertext, masterKey);
  } catch (primaryErr) {
    if (altKey) {
      try {
        return tryDecryptWithKey(iv, tag, ciphertext, altKey);
      } catch {
        // Fall through to throw fail-closed error
      }
    }
    throw Object.assign(
      new Error(
        'Failed to decrypt data — possibly wrong master key or corrupted data'
      ),
      { cause: primaryErr }
    );
  }
}

/**
 * Re-encrypts an existing encrypted field with a new key during envelope rotation.
 *
 * @param encryptedValue The ciphertext to rotate.
 * @param newKey The new primary key.
 * @param oldKey The old key used to decrypt.
 * @returns Newly encrypted ciphertext string.
 */
export function rotateEncryption(
  encryptedValue: string,
  newKey?: string | Buffer,
  oldKey?: string | Buffer
): string {
  if (!encryptedValue || !isEncrypted(encryptedValue)) {
    return encryptedValue;
  }
  const plainText = decrypt(encryptedValue, oldKey);
  return encrypt(plainText, newKey);
}

/**
 * Checks if a value is encrypted.
 *
 * @param value The value to check.
 * @returns True if it starts with the encryption version prefix.
 */
export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && value.startsWith(ENCRYPTED_PREFIX);
}
