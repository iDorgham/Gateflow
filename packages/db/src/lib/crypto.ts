import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

/**
 * Standard field-level encryption for CRM PII data (AE-256-GCM).
 * Requires CRM_ENCRYPTION_KEY and CRM_ENCRYPTION_SALT.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.CRM_ENCRYPTION_KEY;
  const salt = process.env.CRM_ENCRYPTION_SALT || 'gf_crm_salt_default';

  if (!secret) {
    // Falls back to a deterministic development key if missing
    // In production, this should throw or use a 32-byte key
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRM_ENCRYPTION_KEY must be set in production');
    }
    return scryptSync('dev_secret_only', salt, 32);
  }

  return scryptSync(secret, salt, 32);
}

/**
 * Encrypts a string to a base64-encoded payload (iv:authTag:encryptedContent).
 */
export function encryptField(text: string | null): string | null {
  if (!text) return null;

  const iv = randomBytes(IV_LENGTH);
  const key = getKey();
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  // Format: iv(hex):tag(hex):encrypted(hex)
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a base64-encoded payload (iv:authTag:encryptedContent).
 */
export function decryptField(payload: string | null): string | null {
  if (!payload) return null;

  try {
    const [ivHex, tagHex, encryptedHex] = payload.split(':');
    if (!ivHex || !tagHex || !encryptedHex) return null;

    const key = getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted as any, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt field:', error);
    return null;
  }
}
