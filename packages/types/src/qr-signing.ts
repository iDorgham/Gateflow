import { createHmac, timingSafeEqual } from 'crypto';
import {
  QR_PREFIX,
  QR_VERSION,
  QRPayloadSchema,
  type QRPayload,
  type QRVerificationResult,
} from './qr-payload';

// ─── Base64url helpers (no padding by default for compact QR) ─────────────────

function base64urlEncode(str: string): string {
  return Buffer.from(str, 'utf8').toString('base64url');
}

function base64urlDecode(b64url: string): string {
  return Buffer.from(b64url, 'base64url').toString('utf8');
}

// ─── HMAC-SHA256 ──────────────────────────────────────────────────────────────

function hmacSign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('hex');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Sign a QR payload and produce the full QR string.
 *
 * Format: "gateflow:1:<base64url(json payload)>.<hex HMAC-SHA256>"
 *
 * @param payload  The QR payload object (will be validated)
 * @param secret   HMAC secret (from QR_SIGNING_SECRET env var)
 * @returns        The complete signed QR string to encode into the QR image
 */
export function signQRPayload(payload: QRPayload, secret: string): string {
  if (!secret || secret.length < 32) {
    throw new Error('QR signing secret must be at least 32 characters');
  }

  // Validate payload structure
  QRPayloadSchema.parse(payload);

  const jsonStr = JSON.stringify(payload);
  const encoded = base64urlEncode(jsonStr);
  const signature = hmacSign(encoded, secret);

  return `${QR_PREFIX}:${QR_VERSION}:${encoded}.${signature}`;
}

/**
 * Verify a signed QR string and extract the payload.
 *
 * Steps:
 * 1. Parse format (prefix, version, payload.signature)
 * 2. Verify HMAC-SHA256 signature
 * 3. Validate payload schema
 * 4. Check expiration (if expiresAt is set)
 *
 * Nonce replay check is NOT done here — the caller (scanner) maintains
 * a local nonce cache and the server does authoritative checking.
 *
 * @param qrString  The scanned QR string
 * @param secret    HMAC secret (must match the signing secret)
 * @returns         Verification result with payload or rejection reason
 */
export function verifyQRSignature(
  qrString: string,
  secret: string
): QRVerificationResult {
  // 1. Parse format
  const parts = qrString.split(':');
  if (parts.length !== 3 || parts[0] !== QR_PREFIX) {
    return {
      valid: false,
      reason: 'INVALID_FORMAT',
      details: 'Missing gateflow prefix',
    };
  }

  const version = parseInt(parts[1], 10);
  if (version !== QR_VERSION) {
    return {
      valid: false,
      reason: 'UNKNOWN_VERSION',
      details: `Version ${parts[1]} not supported`,
    };
  }

  const payloadAndSig = parts[2];
  const dotIndex = payloadAndSig.lastIndexOf('.');
  if (dotIndex === -1) {
    return {
      valid: false,
      reason: 'INVALID_FORMAT',
      details: 'Missing signature separator',
    };
  }

  const encodedPayload = payloadAndSig.slice(0, dotIndex);
  const signature = payloadAndSig.slice(dotIndex + 1);

  if (!encodedPayload || !signature) {
    return {
      valid: false,
      reason: 'INVALID_FORMAT',
      details: 'Empty payload or signature',
    };
  }

  // 2. Verify HMAC
  const expectedSig = hmacSign(encodedPayload, secret);
  if (!constantTimeEqual(signature, expectedSig)) {
    return { valid: false, reason: 'INVALID_SIGNATURE' };
  }

  // 3. Decode and validate payload
  let payload: QRPayload;
  try {
    const decoded = base64urlDecode(encodedPayload);
    const parsed = JSON.parse(decoded);
    payload = QRPayloadSchema.parse(parsed);
  } catch {
    return { valid: false, reason: 'MALFORMED_PAYLOAD' };
  }

  // 4. Check expiration
  if (payload.expiresAt) {
    const expiresAtMs = new Date(payload.expiresAt).getTime();
    if (Date.now() > expiresAtMs) {
      return {
        valid: false,
        reason: 'EXPIRED',
        details: `Expired at ${payload.expiresAt}`,
      };
    }
  }

  return { valid: true, payload };
}

/**
 * Constant-time string comparison to prevent timing attacks on HMAC.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

export { base64urlEncode, base64urlDecode };
