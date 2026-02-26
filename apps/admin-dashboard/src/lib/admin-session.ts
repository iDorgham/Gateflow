import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

interface SessionPayload {
  sub: 'admin';
  iat: number;
  exp: number;
  jti: string;
}

const SESSION_EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 hours

// Helper to base64url encode
function base64urlEncode(str: string): string {
  return Buffer.from(str).toString('base64url');
}

// Helper to base64url decode
function base64urlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString();
}

/**
 * Generates a signed session token.
 * Payload: { sub: 'admin', iat: now, exp: now + 12h, jti: uuid }
 * Signature: HMAC-SHA256(encodedPayload, secret)
 */
export function generateSessionToken(secret: string): string {
  const now = Date.now();
  const payload: SessionPayload = {
    sub: 'admin',
    iat: now,
    exp: now + SESSION_EXPIRY_MS,
    jti: randomUUID(),
  };

  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a session token.
 * Returns payload if valid, null otherwise.
 */
export function verifySessionToken(token: string, secret: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;

    // Verify signature using timingSafeEqual
    const expectedSignature = createHmac('sha256', secret).update(encodedPayload).digest('base64url');

    const signatureBuf = Buffer.from(signature);
    const expectedSignatureBuf = Buffer.from(expectedSignature);

    if (signatureBuf.length !== expectedSignatureBuf.length || !timingSafeEqual(signatureBuf, expectedSignatureBuf)) {
      return null;
    }

    // Verify payload structure and expiration
    const payload = JSON.parse(base64urlDecode(encodedPayload)) as SessionPayload;

    if (payload.sub !== 'admin' || !payload.exp || !payload.jti) return null;

    if (Date.now() > payload.exp) return null;

    return payload;
  } catch (e) {
    return null;
  }
}
