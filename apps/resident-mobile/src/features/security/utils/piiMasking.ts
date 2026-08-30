import { type PiiMaskingOptions } from '../types';

/**
 * Masks a phone number preserving the country/area code and last 4 digits.
 * Example: "+20 10 1234 5678" -> "+20 10 **** 5678"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.trim();
  if (cleaned.length <= 6) return cleaned;

  // Split into country/operator prefix and remainder
  const prefixLength = cleaned.startsWith('+') ? 5 : 3;
  const suffixLength = 4;

  const prefix = cleaned.slice(0, prefixLength);
  const suffix = cleaned.slice(-suffixLength);
  const maskedLength = Math.max(
    2,
    cleaned.length - prefixLength - suffixLength
  );

  return `${prefix}${'*'.repeat(maskedLength)}${suffix}`;
}

/**
 * Masks national ID or passport numbers.
 * Example: "29801011234567" -> "2980******4567"
 */
export function maskNationalId(id?: string | null): string {
  if (!id || typeof id !== 'string') return '';
  const trimmed = id.trim();
  if (trimmed.length <= 8) return '****' + trimmed.slice(-4);

  const prefix = trimmed.slice(0, 4);
  const suffix = trimmed.slice(-4);
  const maskedCount = trimmed.length - 8;

  return `${prefix}${'*'.repeat(maskedCount)}${suffix}`;
}

/**
 * Masks an email address preserving first and last char of local part.
 * Example: "john.doe@gateflow.site" -> "j***e@gateflow.site"
 */
export function maskEmail(email?: string | null): string {
  if (!email || typeof email !== 'string') return '';
  const parts = email.trim().split('@');
  if (parts.length !== 2) return email;

  const [local, domain] = parts;
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }

  const first = local[0];
  const last = local[local.length - 1];
  const masked = '*'.repeat(Math.min(5, local.length - 2));

  return `${first}${masked}${last}@${domain}`;
}

/**
 * Masks vehicle plate numbers.
 * Example: "ABC 1234" -> "A** 1234"
 */
export function maskPlateNumber(plate?: string | null): string {
  if (!plate || typeof plate !== 'string') return '';
  const parts = plate.trim().split(' ');
  if (parts.length < 2) {
    return plate.slice(0, 1) + '***' + plate.slice(-2);
  }

  const [letters, numbers] = parts;
  const maskedLetters =
    letters.slice(0, 1) + '*'.repeat(Math.max(1, letters.length - 1));
  return `${maskedLetters} ${numbers}`;
}
