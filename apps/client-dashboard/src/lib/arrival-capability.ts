import { createHmac, timingSafeEqual } from 'crypto';

const PURPOSE = 'resident-arrival';
const VERSION = 1;
const MIN_SECRET_LENGTH = 32;
export const ARRIVAL_CAPABILITY_TTL_MS = 5 * 60_000;

interface ArrivalCapabilityPayload {
  exp: number;
  purpose: typeof PURPOSE;
  v: typeof VERSION;
  visitorQRId: string;
}

function validSecret(secret: string): boolean {
  return secret.length >= MIN_SECRET_LENGTH;
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(`${PURPOSE}.${encodedPayload}`)
    .digest('base64url');
}

export function createArrivalCapability(
  visitorQRId: string,
  secret: string,
  now = new Date()
): string {
  if (!validSecret(secret)) {
    throw new Error('Arrival capability secret must be at least 32 characters');
  }

  const payload: ArrivalCapabilityPayload = {
    exp: now.getTime() + ARRIVAL_CAPABILITY_TTL_MS,
    purpose: PURPOSE,
    v: VERSION,
    visitorQRId,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64url'
  );
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyArrivalCapability(
  token: string,
  secret: string,
  now = new Date()
): { visitorQRId: string } | null {
  if (!validSecret(secret)) return null;

  try {
    const [encodedPayload, suppliedSignature, extra] = token.split('.');
    if (!encodedPayload || !suppliedSignature || extra) return null;

    const expectedSignature = sign(encodedPayload, secret);
    const supplied = Buffer.from(suppliedSignature, 'base64url');
    const expected = Buffer.from(expectedSignature, 'base64url');
    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as Partial<ArrivalCapabilityPayload>;
    if (
      payload.v !== VERSION ||
      payload.purpose !== PURPOSE ||
      typeof payload.visitorQRId !== 'string' ||
      payload.visitorQRId.length === 0 ||
      typeof payload.exp !== 'number' ||
      !Number.isSafeInteger(payload.exp) ||
      payload.exp <= now.getTime()
    ) {
      return null;
    }

    return { visitorQRId: payload.visitorQRId };
  } catch {
    return null;
  }
}
