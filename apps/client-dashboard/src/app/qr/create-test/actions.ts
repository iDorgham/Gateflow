'use server';

import { randomUUID } from 'crypto';
import { init as initCuid2 } from '@paralleldrive/cuid2';
import { signQRPayload, QRCodeType } from '@gate-access/types';
import { prisma } from '@gate-access/db';

const createId = initCuid2({ length: 8 });

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateTestQRInput {
  organizationId: string;
  type: QRCodeType;
  /** Positive integer for RECURRING; ignored (1) for SINGLE; ignored (null) for PERMANENT. */
  maxUses: number | null;
  /** ISO 8601 string or null. Ignored (null) for PERMANENT. */
  expiresAt: string | null;
}

export type CreateTestQRResult = {
  success: boolean;
  error?: string;
  qrString?: string;
  qrId?: string;
  nonce?: string;
  shortId?: string;
  shortUrl?: string;
};

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * Sign and generate a test GateFlow QR code using the server-side secret.
 * Persists a short-link mapping so the QR can encode a compact URL instead of
 * the full signed payload — keeping the QR small (version 2, 25×25 modules).
 */
export async function createTestQR(
  input: CreateTestQRInput,
): Promise<CreateTestQRResult> {
  const secret = process.env.QR_SIGNING_SECRET ?? '';

  if (!secret || secret.length < 32) {
    return {
      success: false,
      error:
        'QR_SIGNING_SECRET is not configured or is shorter than 32 characters. ' +
        'Set it in your .env file.',
    };
  }

  const { organizationId, type, maxUses, expiresAt } = input;

  // ── Validate inputs ────────────────────────────────────────────────────────

  if (!organizationId.trim()) {
    return { success: false, error: 'organizationId is required.' };
  }

  if (type === QRCodeType.RECURRING) {
    if (maxUses === null || !Number.isInteger(maxUses) || maxUses < 1) {
      return {
        success: false,
        error: 'maxUses must be a positive integer for RECURRING type.',
      };
    }
  }

  if (type !== QRCodeType.PERMANENT && expiresAt !== null) {
    const expDate = new Date(expiresAt);
    if (isNaN(expDate.getTime())) {
      return { success: false, error: 'Invalid expiresAt date.' };
    }
    if (expDate <= new Date()) {
      return { success: false, error: 'expiresAt must be in the future.' };
    }
  }

  // ── Build payload ──────────────────────────────────────────────────────────

  const resolvedMaxUses: number | null =
    type === QRCodeType.SINGLE
      ? 1
      : type === QRCodeType.PERMANENT
        ? null
        : (maxUses as number); // RECURRING — validated above

  const qrId = `test-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const nonce = randomUUID();

  const payload = {
    qrId,
    organizationId: organizationId.trim(),
    type,
    maxUses: resolvedMaxUses,
    expiresAt: type === QRCodeType.PERMANENT ? null : expiresAt,
    issuedAt: new Date().toISOString(),
    nonce,
  };

  // ── Sign ───────────────────────────────────────────────────────────────────

  let qrString: string;
  try {
    qrString = signQRPayload(payload, secret);
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  // ── Persist short-link (QR encodes this URL instead of full payload) ───────

  const shortId = createId();
  const appUrl = process.env.NEXT_PUBLIC_QR_BASE_URL ?? 'http://localhost:3000';
  const shortUrl = `${appUrl}/s/${shortId}`;

  // Expire the short-link 1 hour after the QR's own expiry (or in 24h for PERMANENT)
  const linkExpiresAt = expiresAt
    ? new Date(new Date(expiresAt).getTime() + 60 * 60 * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await prisma.qrShortLink.create({
      data: {
        shortId,
        fullPayload: qrString,
        qrId,
        organizationId: organizationId.trim(),
        expiresAt: linkExpiresAt,
      },
    });
  } catch (err) {
    // Non-fatal: fall back to returning the full payload in the QR
    console.error('[createTestQR] Failed to persist short-link:', err);
    return { success: true, qrString, qrId, nonce };
  }

  return { success: true, qrString, qrId, nonce, shortId, shortUrl };
}
