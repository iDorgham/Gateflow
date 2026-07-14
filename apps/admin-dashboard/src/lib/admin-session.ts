/**
 * Signed admin session tokens (Edge + Node safe via Web Crypto).
 *
 * Format: base64url(JSON payload).base64url(HMAC-SHA256 signature)
 * Payload: { sub: 'admin', iat, exp, jti }
 */

export interface AdminSessionPayload {
  sub: 'admin';
  iat: number;
  exp: number;
  jti: string;
}

export const ADMIN_SESSION_EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 hours

function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const base64 = padded + '='.repeat(padLength);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function utf8ToBase64Url(str: string): string {
  return bufferToBase64Url(new TextEncoder().encode(str));
}

function base64UrlToUtf8(value: string): string {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signPayload(
  encodedPayload: string,
  secret: string
): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(encodedPayload)
  );
  return bufferToBase64Url(signature);
}

/**
 * Generates a signed session token with nonce + expiry.
 */
export async function generateSessionToken(secret: string): Promise<string> {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    sub: 'admin',
    iat: now,
    exp: now + ADMIN_SESSION_EXPIRY_MS,
    jti: crypto.randomUUID(),
  };

  const encodedPayload = utf8ToBase64Url(JSON.stringify(payload));
  const signature = await signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies signature + expiry. Returns payload if valid, otherwise null.
 */
export async function verifySessionToken(
  token: string,
  secret: string
): Promise<AdminSessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    if (!encodedPayload || !signature) return null;

    const expectedSignature = await signPayload(encodedPayload, secret);
    const signatureBytes = base64UrlToBytes(signature);
    const expectedBytes = base64UrlToBytes(expectedSignature);

    if (!timingSafeEqualBytes(signatureBytes, expectedBytes)) {
      return null;
    }

    const payload = JSON.parse(
      base64UrlToUtf8(encodedPayload)
    ) as AdminSessionPayload;

    if (
      payload.sub !== 'admin' ||
      typeof payload.exp !== 'number' ||
      !payload.jti
    ) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
