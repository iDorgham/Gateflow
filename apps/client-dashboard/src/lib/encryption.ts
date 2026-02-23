/**
 * Field-level encryption utilities for sensitive data
 *
 * Uses AES-256-GCM with a master key from environment variables
 */

import CryptoJS from 'crypto-js';

const MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY;

if (!MASTER_KEY) {
  console.warn(
    '[encryption] ENCRYPTION_MASTER_KEY not set - using fallback (not secure for production)'
  );
}

/**
 * Encrypt a plaintext value
 */
export function encryptField(plaintext: string): string {
  const key = MASTER_KEY || 'dev-fallback-key-do-not-use-in-prod';
  const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
  return encrypted;
}

/**
 * Decrypt an encrypted value
 */
export function decryptField(ciphertext: string): string {
  const key = MASTER_KEY || 'dev-fallback-key-do-not-use-in-prod';
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('Decryption failed - invalid key or corrupted data');
  }

  return decrypted;
}

/**
 * Generate a random secret
 */
export function generateSecret(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}
