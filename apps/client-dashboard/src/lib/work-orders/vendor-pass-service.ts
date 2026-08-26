import crypto from 'crypto';

/**
 * Cryptographic Vendor Gate Access Pass generator and scanner verification engine.
 */

export interface VendorPassRequest {
  workOrderId: string;
  vendorName: string;
  technicianName: string;
  technicianPhone?: string;
  organizationId: string;
  allowedGateIds: string[];
  validFrom: string; // ISO 8601
  validUntil: string; // ISO 8601
}

export interface VendorAccessPayload {
  type: 'VENDOR_WORK_ORDER';
  qrId: string;
  woId: string;
  vendor: string;
  tech: string;
  org: string;
  gates: string[];
  nbf: number; // Unix timestamp in seconds
  exp: number; // Unix timestamp in seconds
  sig: string; // HMAC-SHA256
}

export type VendorPassVerificationCode =
  | 'GRANTED'
  | 'EXPIRED'
  | 'NOT_YET_VALID'
  | 'GATE_NOT_ALLOWED'
  | 'INVALID_SIGNATURE';

export interface VendorPassVerificationResult {
  valid: boolean;
  code: VendorPassVerificationCode;
  reason?: string;
}

/**
 * Computes deterministic HMAC-SHA256 signature for vendor pass payload.
 */
function computePassSignature(
  data: Omit<VendorAccessPayload, 'sig'>,
  secret: string
): string {
  const serialized = `${data.qrId}:${data.woId}:${data.org}:${data.gates.sort().join(',')}:${data.nbf}:${data.exp}`;
  return crypto.createHmac('sha256', secret).update(serialized).digest('hex');
}

/**
 * Generates signed vendor access pass payload.
 */
export function generateVendorAccessPass(
  request: VendorPassRequest,
  secret: string = 'gateflow-vendor-secret-key-2026'
): VendorAccessPayload {
  const qrId = `vendor-pass-${crypto.randomUUID()}`;
  const nbf = Math.floor(new Date(request.validFrom).getTime() / 1000);
  const exp = Math.floor(new Date(request.validUntil).getTime() / 1000);

  const unsigned: Omit<VendorAccessPayload, 'sig'> = {
    type: 'VENDOR_WORK_ORDER',
    qrId,
    woId: request.workOrderId,
    vendor: request.vendorName,
    tech: request.technicianName,
    org: request.organizationId,
    gates: request.allowedGateIds,
    nbf,
    exp,
  };

  const sig = computePassSignature(unsigned, secret);

  return {
    ...unsigned,
    sig,
  };
}

/**
 * Validates vendor pass at scanner checkpoint.
 */
export function verifyVendorAccessPass(
  payload: VendorAccessPayload,
  currentGateId: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
  secret: string = 'gateflow-vendor-secret-key-2026'
): VendorPassVerificationResult {
  // 1. Verify Cryptographic Signature
  const expectedSig = computePassSignature(
    {
      type: payload.type,
      qrId: payload.qrId,
      woId: payload.woId,
      vendor: payload.vendor,
      tech: payload.tech,
      org: payload.org,
      gates: payload.gates,
      nbf: payload.nbf,
      exp: payload.exp,
    },
    secret
  );

  if (payload.sig !== expectedSig) {
    return {
      valid: false,
      code: 'INVALID_SIGNATURE',
      reason:
        'Cryptographic HMAC signature verification failed. Pass may be tampered.',
    };
  }

  // 2. Verify Time Window
  if (nowSeconds < payload.nbf) {
    return {
      valid: false,
      code: 'NOT_YET_VALID',
      reason: 'Pass is not yet active for scheduled maintenance window.',
    };
  }

  if (nowSeconds > payload.exp) {
    return {
      valid: false,
      code: 'EXPIRED',
      reason: 'Maintenance access window has expired.',
    };
  }

  // 3. Verify Allowed Gate Zones
  const isGateAllowed =
    payload.gates.includes('*') || payload.gates.includes(currentGateId);
  if (!isGateAllowed) {
    return {
      valid: false,
      code: 'GATE_NOT_ALLOWED',
      reason: `Vendor is not authorized for entry at Gate [${currentGateId}].`,
    };
  }

  return {
    valid: true,
    code: 'GRANTED',
  };
}
