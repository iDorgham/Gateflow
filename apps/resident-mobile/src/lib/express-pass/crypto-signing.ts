import { createHmac, timingSafeEqual } from 'crypto';

export interface ExpressPassSignOptions {
  passId: string;
  organizationId: string;
  unitId: string;
  residentId: string;
  validityHours?: number; // Default 24h
  issuedAt?: string; // ISO 8601
}

export interface SignedExpressPassToken {
  passId: string;
  signature: string;
  shortUrl: string;
  validFrom: string;
  validUntil: string;
  rawPayload: string;
}

export interface TokenVerificationResult {
  isValid: boolean;
  isExpired: boolean;
  passId?: string;
  organizationId?: string;
  unitId?: string;
  residentId?: string;
  validUntil?: string;
  errorReason?: string;
}

/**
 * Generates an unforgeable HMAC-SHA256 signed Express Pass token and short-link.
 */
export function generateExpressPassToken(
  options: ExpressPassSignOptions,
  secret: string,
  baseUrl: string = 'https://gateflow.site'
): SignedExpressPassToken {
  const now = options.issuedAt ? new Date(options.issuedAt) : new Date();
  const validityHours = options.validityHours ?? 24;
  const validFrom = now.toISOString();
  const validUntil = new Date(
    now.getTime() + validityHours * 60 * 60 * 1000
  ).toISOString();

  // Canonical payload structure: exp|<passId>|<orgId>|<unitId>|<residentId>|<validUntil>
  const rawPayload = `exp|${options.passId}|${options.organizationId}|${options.unitId}|${options.residentId}|${validUntil}`;

  const hmac = createHmac('sha256', secret);
  hmac.update(rawPayload);
  const signature = hmac.digest('hex').substring(0, 32);

  const shortUrl = `${baseUrl.replace(/\/$/, '')}/s/${options.passId}?sig=${signature}`;

  return {
    passId: options.passId,
    signature,
    shortUrl,
    validFrom,
    validUntil,
    rawPayload,
  };
}

/**
 * Verifies the integrity, signature, and expiration of an Express Pass token.
 */
export function verifyExpressPassToken(
  passId: string,
  signature: string,
  rawPayload: string,
  secret: string,
  now: Date = new Date()
): TokenVerificationResult {
  if (!passId || !signature || !rawPayload || !secret) {
    return {
      isValid: false,
      isExpired: false,
      errorReason: 'MISSING_PARAMETERS',
    };
  }

  try {
    const parts = rawPayload.split('|');
    if (parts.length !== 6 || parts[0] !== 'exp') {
      return {
        isValid: false,
        isExpired: false,
        errorReason: 'INVALID_PAYLOAD_FORMAT',
      };
    }

    const [, payloadPassId, organizationId, unitId, residentId, validUntil] =
      parts;

    if (payloadPassId !== passId) {
      return {
        isValid: false,
        isExpired: false,
        errorReason: 'PASS_ID_MISMATCH',
      };
    }

    // Recompute expected HMAC signature
    const hmac = createHmac('sha256', secret);
    hmac.update(rawPayload);
    const expectedSignature = hmac.digest('hex').substring(0, 32);

    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const providedBuf = Buffer.from(signature, 'utf-8');

    if (
      expectedBuf.length !== providedBuf.length ||
      !timingSafeEqual(expectedBuf, providedBuf)
    ) {
      return {
        isValid: false,
        isExpired: false,
        errorReason: 'SIGNATURE_MISMATCH',
      };
    }

    // Check expiration
    const expiryDate = new Date(validUntil);
    const isExpired = now.getTime() > expiryDate.getTime();

    if (isExpired) {
      return {
        isValid: false,
        isExpired: true,
        passId,
        organizationId,
        unitId,
        residentId,
        validUntil,
        errorReason: 'TOKEN_EXPIRED',
      };
    }

    return {
      isValid: true,
      isExpired: false,
      passId,
      organizationId,
      unitId,
      residentId,
      validUntil,
    };
  } catch {
    return {
      isValid: false,
      isExpired: false,
      errorReason: 'VERIFICATION_ERROR',
    };
  }
}
