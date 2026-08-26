import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const STEP_UP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function getStepUpSecret(): string {
  const secret =
    process.env.NEXTAUTH_SECRET ??
    process.env.JWT_SECRET ??
    'gateflow-step-up-default-hmac-secret-key-32-chars-minimum';
  return secret;
}

export interface StepUpTokenPayload {
  userId: string;
  orgId: string;
  action: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

/**
 * Signs a time-bounded Step-Up verification token.
 */
export function issueStepUpToken(params: {
  userId: string;
  orgId: string;
  action: string;
  ttlMs?: number;
}): string {
  const now = Date.now();
  const ttl = params.ttlMs ?? STEP_UP_EXPIRY_MS;
  const payload: StepUpTokenPayload = {
    userId: params.userId,
    orgId: params.orgId,
    action: params.action,
    issuedAt: now,
    expiresAt: now + ttl,
    nonce: randomBytes(16).toString('hex'),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', getStepUpSecret())
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export interface StepUpVerificationResult {
  valid: boolean;
  payload?: StepUpTokenPayload;
  reason?: 'MISSING' | 'EXPIRED' | 'TAMPERED' | 'MISMATCH';
}

/**
 * Validates a Step-Up token against user, org, and target action.
 */
export function verifyStepUpToken(
  token: string | null | undefined,
  expected: { userId?: string; orgId?: string; action?: string }
): StepUpVerificationResult {
  if (!token) {
    return { valid: false, reason: 'MISSING' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'TAMPERED' };
  }

  const [payloadB64, signature] = parts;

  // 1. Verify HMAC signature using constant-time comparison
  const expectedSig = createHmac('sha256', getStepUpSecret())
    .update(payloadB64)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);

  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return { valid: false, reason: 'TAMPERED' };
  }

  // 2. Decode payload
  let payload: StepUpTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'TAMPERED' };
  }

  // 3. Verify expiration
  if (Date.now() > payload.expiresAt) {
    return { valid: false, payload, reason: 'EXPIRED' };
  }

  // 4. Verify context assertions
  if (expected.userId && payload.userId !== expected.userId) {
    return { valid: false, payload, reason: 'MISMATCH' };
  }
  if (expected.orgId && payload.orgId !== expected.orgId) {
    return { valid: false, payload, reason: 'MISMATCH' };
  }
  if (
    expected.action &&
    payload.action !== expected.action &&
    payload.action !== '*'
  ) {
    return { valid: false, payload, reason: 'MISMATCH' };
  }

  return { valid: true, payload };
}

/**
 * Guard utility for API routes requiring step-up authentication.
 */
export function requireStepUp(
  request: NextRequest,
  context: { userId: string; orgId: string; action: string }
): NextResponse | null {
  const token =
    request.headers.get('x-gateflow-stepup-token') ??
    request.headers.get('x-stepup-token');

  const verification = verifyStepUpToken(token, context);
  if (!verification.valid) {
    return NextResponse.json(
      {
        error: 'Step-up authentication required',
        stepUpRequired: true,
        action: context.action,
        reason: verification.reason,
      },
      {
        status: 403,
        headers: {
          'X-StepUp-Required': 'true',
          'X-StepUp-Action': context.action,
        },
      }
    );
  }

  return null; // Passed step-up verification
}
