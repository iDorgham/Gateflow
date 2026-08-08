import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTED_PREFIX = 'enc:v1:';

function getMasterKey(): Buffer {
  const raw = process.env.ENCRYPTION_MASTER_KEY;
  if (!raw) {
    // In production, this should fail hard. In dev/test, we might want a fallback,
    // but security mandated "fail-closed".
    throw new Error('ENCRYPTION_MASTER_KEY environment variable is not set');
  }
  const key = Buffer.from(raw, 'hex');
  if (key.length !== 32) {
    throw new Error(
      'ENCRYPTION_MASTER_KEY must be 64 hex characters (32 bytes)'
    );
  }
  return key;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output is prefixed with "enc:v1:" and base64 encoded.
 *
 * @param plaintext The string to encrypt.
 * @returns The encrypted string with version prefix.
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;

  try {
    const masterKey = getMasterKey();
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
    // `Error(message, { cause })` needs ES2022 lib typings; this repo
    // targets ES2020, so attach cause via Object.assign instead.
    throw Object.assign(new Error('Failed to encrypt data'), { cause: err });
  }
}

/**
 * Decrypts a string that was encrypted with encrypt().
 * Returns the plaintext.
 * If the string is not encrypted (missing prefix), returns it as-is.
 *
 * @param value The encrypted string or plaintext.
 * @returns The decrypted plaintext string.
 */
export function decrypt(value: string): string {
  if (!value || !value.startsWith(ENCRYPTED_PREFIX)) {
    return value;
  }

  try {
    const masterKey = getMasterKey();
    const b64 = value.slice(ENCRYPTED_PREFIX.length);
    const data = Buffer.from(b64, 'base64');

    if (data.length < 28) {
      throw new Error('Invalid encrypted data length (too short for IV + Tag)');
    }

    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const ciphertext = data.subarray(28);

    const decipher = createDecipheriv('aes-256-gcm', masterKey, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');
  } catch (err) {
    console.error('Decryption failed:', err);
    // `Error(message, { cause })` needs ES2022 lib typings; this repo
    // targets ES2020, so attach cause via Object.assign instead.
    throw Object.assign(
      new Error(
        'Failed to decrypt data — possibly wrong master key or corrupted data'
      ),
      { cause: err }
    );
  }
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
