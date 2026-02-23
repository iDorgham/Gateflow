/**
 * Field-level encryption utilities for sensitive data
 *
 * Uses AES-256-GCM with a master key from environment variables
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const RAW_KEY = process.env.ENCRYPTION_MASTER_KEY;

if (!RAW_KEY) {
  console.warn(
    '[encryption] ENCRYPTION_MASTER_KEY not set - using fallback (not secure for production)'
  );
}

// Ensure key is exactly 32 bytes (256 bits)
function getMasterKey(): Buffer {
  // 64 hex chars = 32 bytes fallback for dev
  const keyHex = RAW_KEY || '0000000000000000000000000000000000000000000000000000000000000000';
  let key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    // Pad or truncate to 32 bytes if the env var is misconfigured
    const padded = Buffer.alloc(32);
    key.copy(padded);
    key = padded;
  }
  return key;
}

/**
 * Encrypt a plaintext value
 */
export function encryptField(plaintext: string): string {
  const key = getMasterKey();
  const iv = randomBytes(12); // GCM standard IV length
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  
  // Pack as: IV (12 bytes) + Tag (16 bytes) + Ciphertext
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

/**
 * Decrypt an encrypted value
 */
export function decryptField(ciphertextBase64: string): string {
  const key = getMasterKey();
  const data = Buffer.from(ciphertextBase64, 'base64');
  
  // Extract parts: IV (12), Tag (16), Ciphertext (rest)
  if (data.length < 28) {
    throw new Error('Decryption failed - invalid data format');
  }
  
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const encrypted = data.subarray(28);
  
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  
  try {
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error('Decryption failed - invalid key or corrupted data');
  }
}

/**
 * Generate a random secret
 */
export function generateSecret(): string {
  return randomBytes(32).toString('hex');
}
