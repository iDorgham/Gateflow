import {
  generateExpressPassToken,
  verifyExpressPassToken,
} from './crypto-signing';

export type ExpressPassStatus =
  'UNASSIGNED' | 'CLAIMED' | 'EXPIRED' | 'USED' | 'REVOKED';

export interface ExpressPassRecord {
  id: string;
  organizationId: string;
  unitId: string;
  residentId: string;
  status: ExpressPassStatus;
  visitorName?: string;
  visitorPhone?: string;
  signedUrl: string;
  rawPayload: string;
  signature: string;
  validFrom: string;
  validUntil: string;
  createdAt: string;
  claimedAt?: string;
  qrToken?: string;
}

export interface GuestIdentityInput {
  visitorName: string;
  visitorPhone?: string;
}

export interface ClaimPassResult {
  success: boolean;
  pass?: ExpressPassRecord;
  error?: string;
}

/**
 * Creates an unassigned Express Pass with silent HMAC signature.
 */
export function createSilentExpressPass(
  resident: { id: string; orgId: string; unitId: string },
  secret: string,
  validityHours: number = 24,
  customPassId?: string
): ExpressPassRecord {
  const passId =
    customPassId ||
    `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date();

  const token = generateExpressPassToken(
    {
      passId,
      organizationId: resident.orgId,
      unitId: resident.unitId,
      residentId: resident.id,
      validityHours,
      issuedAt: now.toISOString(),
    },
    secret
  );

  return {
    id: passId,
    organizationId: resident.orgId,
    unitId: resident.unitId,
    residentId: resident.id,
    status: 'UNASSIGNED',
    signedUrl: token.shortUrl,
    rawPayload: token.rawPayload,
    signature: token.signature,
    validFrom: token.validFrom,
    validUntil: token.validUntil,
    createdAt: now.toISOString(),
  };
}

/**
 * Claims an unassigned express pass when the visitor opens the short-link.
 */
export function claimExpressPass(
  pass: ExpressPassRecord,
  guest: GuestIdentityInput,
  secret: string,
  now: Date = new Date()
): ClaimPassResult {
  if (!guest.visitorName || guest.visitorName.trim().length === 0) {
    return { success: false, error: 'VISITOR_NAME_REQUIRED' };
  }

  if (pass.status === 'REVOKED') {
    return { success: false, error: 'PASS_REVOKED' };
  }

  if (pass.status === 'USED') {
    return { success: false, error: 'PASS_ALREADY_USED' };
  }

  // Verify HMAC signature and token expiration
  const verification = verifyExpressPassToken(
    pass.id,
    pass.signature,
    pass.rawPayload,
    secret,
    now
  );

  if (
    !verification.isValid ||
    verification.isExpired ||
    (pass.validUntil && now.getTime() > new Date(pass.validUntil).getTime())
  ) {
    return {
      success: false,
      error:
        verification.isExpired ||
        now.getTime() > new Date(pass.validUntil).getTime()
          ? 'PASS_EXPIRED'
          : 'INVALID_SIGNATURE',
    };
  }

  const qrToken = `GF-EXP:${pass.id}:${guest.visitorName.trim()}:${pass.signature}`;

  const updatedPass: ExpressPassRecord = {
    ...pass,
    status: 'CLAIMED',
    visitorName: guest.visitorName.trim(),
    visitorPhone: guest.visitorPhone?.trim(),
    claimedAt: now.toISOString(),
    qrToken,
  };

  return {
    success: true,
    pass: updatedPass,
  };
}
