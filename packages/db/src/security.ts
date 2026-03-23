import { createHmac, timingSafeEqual } from 'crypto';

const MIN_SECRET_LENGTH = 16;

/**
 * Creates an HMAC-SHA256 signature for an invitation payload.
 * Output is URL-safe lowercase hex (64 chars).
 *
 * @throws {Error} if the secret is shorter than 16 characters.
 */
export function createSecureInviteSignature(
  payload: string,
  secret: string
): string {
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `HMAC secret must be at least ${MIN_SECRET_LENGTH} characters`
    );
  }
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verifies an HMAC-SHA256 signature using constant-time comparison
 * to prevent timing side-channel attacks.
 *
 * Returns false for any invalid or mismatched input without throwing.
 */
export function verifySecureInviteSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!payload || !signature || !secret) return false;
  try {
    const expected = createSecureInviteSignature(payload, secret);
    // Buffer.from(hex) silently strips invalid chars; length check catches forgeries.
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(signature, 'hex');
    if (expectedBuf.length !== actualBuf.length) return false;
    return timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}
