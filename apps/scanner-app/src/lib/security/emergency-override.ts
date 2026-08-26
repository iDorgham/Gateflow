import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

export interface EmergencyTokenPayload {
  version: '1.0';
  guardId: string;
  gateId: string;
  shiftId: string;
  reason: string;
  issuedAt: number;
  expiresAt: number;
}

const EMERGENCY_TTL_MS = 15 * 60 * 1000; // 15 minutes max offline override

/**
 * Issues an HMAC-signed emergency gate unlock token for an authenticated on-duty guard.
 */
export function issueEmergencyToken(params: {
  guardId: string;
  gateId: string;
  shiftId: string;
  reason: string;
  secret: string;
  ttlMs?: number;
}): string {
  const now = Date.now();
  const expiresAt = now + (params.ttlMs ?? EMERGENCY_TTL_MS);

  const payload: EmergencyTokenPayload = {
    version: '1.0',
    guardId: params.guardId,
    gateId: params.gateId,
    shiftId: params.shiftId,
    reason: params.reason,
    issuedAt: now,
    expiresAt,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = CryptoJS.HmacSHA256(payloadB64, params.secret).toString(
    CryptoJS.enc.Hex
  );

  return `EMG:${payloadB64}.${signature}`;
}

/**
 * Decodes and verifies an offline emergency override token.
 */
export function verifyEmergencyToken(
  token: string,
  secret: string,
  context?: { gateId?: string }
): {
  valid: boolean;
  payload?: EmergencyTokenPayload;
  error?: 'EXPIRED' | 'TAMPERED' | 'INVALID_FORMAT' | 'GATE_MISMATCH';
} {
  if (!token || !token.startsWith('EMG:')) {
    return { valid: false, error: 'INVALID_FORMAT' };
  }

  const raw = token.slice(4);
  const parts = raw.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'INVALID_FORMAT' };
  }

  const [payloadB64, signature] = parts;

  // 1. Check signature
  const expectedSig = CryptoJS.HmacSHA256(payloadB64, secret).toString(
    CryptoJS.enc.Hex
  );

  if (signature.toLowerCase() !== expectedSig.toLowerCase()) {
    return { valid: false, error: 'TAMPERED' };
  }

  // 2. Decode payload
  let payload: EmergencyTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, error: 'INVALID_FORMAT' };
  }

  // 3. Expiration check
  if (Date.now() > payload.expiresAt) {
    return { valid: false, payload, error: 'EXPIRED' };
  }

  // 4. Context check
  if (context?.gateId && payload.gateId !== context.gateId) {
    return { valid: false, payload, error: 'GATE_MISMATCH' };
  }

  return { valid: true, payload };
}
