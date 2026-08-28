import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import type { CheckpointQrPayload } from '@gate-access/types';

export const PATROL_QR_PREFIX = 'gateflow:patrol:1';

function getSigningSecret(): string {
  const secret =
    process.env.PATROL_QR_SECRET ||
    process.env.QR_SIGNING_SECRET ||
    'default_patrol_secret_key_at_least_32_characters_long';
  return secret;
}

export function generateCheckpointPayload(params: {
  orgId: string;
  routeId: string;
  checkpointId: string;
}): CheckpointQrPayload {
  const nonce = randomBytes(8).toString('hex');
  const timestamp = Date.now();
  const secret = getSigningSecret();

  const dataToSign = `${params.orgId}:${params.routeId}:${params.checkpointId}:${nonce}:${timestamp}`;
  const hmac = createHmac('sha256', secret).update(dataToSign).digest('hex');

  return {
    orgId: params.orgId,
    routeId: params.routeId,
    checkpointId: params.checkpointId,
    nonce,
    timestamp,
    hmac,
  };
}

export function encodeCheckpointQrString(payload: CheckpointQrPayload): string {
  const jsonStr = JSON.stringify(payload);
  const base64 = Buffer.from(jsonStr, 'utf8').toString('base64url');
  return `${PATROL_QR_PREFIX}:${base64}`;
}

export function decodeCheckpointQrString(
  qrString: string
): CheckpointQrPayload | null {
  if (!qrString.startsWith(`${PATROL_QR_PREFIX}:`)) {
    return null;
  }

  try {
    const base64 = qrString.slice(PATROL_QR_PREFIX.length + 1);
    const jsonStr = Buffer.from(base64, 'base64url').toString('utf8');
    const parsed = JSON.parse(jsonStr) as CheckpointQrPayload;

    if (
      !parsed.orgId ||
      !parsed.routeId ||
      !parsed.checkpointId ||
      !parsed.hmac ||
      !parsed.nonce
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function verifyCheckpointPayload(payload: CheckpointQrPayload): boolean {
  if (
    !payload.orgId ||
    !payload.routeId ||
    !payload.checkpointId ||
    !payload.hmac ||
    !payload.nonce
  ) {
    return false;
  }

  const secret = getSigningSecret();
  const dataToSign = `${payload.orgId}:${payload.routeId}:${payload.checkpointId}:${payload.nonce}:${payload.timestamp}`;
  const expectedHmac = createHmac('sha256', secret)
    .update(dataToSign)
    .digest('hex');

  const actualBuf = Buffer.from(payload.hmac, 'hex');
  const expectedBuf = Buffer.from(expectedHmac, 'hex');

  if (actualBuf.length !== expectedBuf.length) {
    return false;
  }

  return timingSafeEqual(actualBuf, expectedBuf);
}

export function generateCheckpointPlacardSvg(params: {
  checkpointName: string;
  routeName: string;
  orderIndex: number;
  qrSvgContent?: string;
}): string {
  const { checkpointName, routeName, orderIndex, qrSvgContent } = params;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <rect x="20" y="20" width="560" height="760" rx="16" fill="#f8fafc" stroke="#091e4224" stroke-width="4" />
  <rect x="40" y="40" width="520" height="90" rx="12" fill="#0c66e4" />
  
  <text x="300" y="80" text-anchor="middle" fill="#ffffff" font-size="22" font-weight="bold" letter-spacing="1">GATEFLOW SECURITY CHECKPOINT</text>
  <text x="300" y="110" text-anchor="middle" fill="#ffffff" font-size="14" opacity="0.9">PHYSICAL PERIMETER VERIFICATION TAG</text>

  <!-- Route and Checkpoint Info -->
  <g transform="translate(60, 160)">
    <text x="0" y="20" fill="#626f86" font-size="13" font-weight="600" text-transform="uppercase">PATROL ROUTE</text>
    <text x="0" y="45" fill="#172b4d" font-size="18" font-weight="bold">${routeName}</text>

    <text x="0" y="90" fill="#626f86" font-size="13" font-weight="600" text-transform="uppercase">STATION / CHECKPOINT</text>
    <text x="0" y="115" fill="#0c66e4" font-size="20" font-weight="bold">#${orderIndex + 1} — ${checkpointName}</text>
  </g>

  <!-- QR Container Frame -->
  <rect x="150" y="320" width="300" height="300" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  
  ${
    qrSvgContent
      ? `<g transform="translate(160, 330)">${qrSvgContent}</g>`
      : `
  <g transform="translate(300, 470)">
    <circle cx="0" cy="0" r="40" fill="#0c66e414" />
    <text x="0" y="6" text-anchor="middle" fill="#0c66e4" font-size="14" font-weight="600">SCAN TAG</text>
  </g>`
  }

  <!-- Instructions Footer -->
  <rect x="40" y="660" width="520" height="80" rx="12" fill="#edf5ff" />
  <text x="300" y="695" text-anchor="middle" fill="#0055cc" font-size="14" font-weight="bold">Hold GateFlow Guard Scanner within 10-20 cm</text>
  <text x="300" y="720" text-anchor="middle" fill="#626f86" font-size="12">Timestamp and station sequence logged to security operations</text>
</svg>`.trim();
}
