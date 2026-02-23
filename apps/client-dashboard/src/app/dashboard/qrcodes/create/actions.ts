'use server';

import { randomUUID } from 'crypto';
import { init as initCuid2 } from '@paralleldrive/cuid2';
import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { signQRPayload, QRCodeType } from '@gate-access/types';
import { QRCodeType as PrismaQRCodeType } from '@gate-access/db';

const createId = initCuid2({ length: 8 });

interface CreateInput {
  organizationId: string;
  type: QRCodeType;
  gateId: string | null;
  maxUses: number | null;
  expiresAt: string | null;
}

type CreateResult = {
  success: boolean;
  error?: string;
  qrString?: string;
  qrId?: string;
  /** Short URL encoded in the QR. Present unless shortlink persistence failed. */
  shortUrl?: string;
};

export async function createQRCode(input: CreateInput): Promise<CreateResult> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return { success: false, error: 'Unauthorized.' };
    if (claims.orgId !== input.organizationId) return { success: false, error: 'Forbidden.' };

    const secret = process.env.QR_SIGNING_SECRET ?? '';
    if (!secret || secret.length < 32) {
      console.error('createQRCode: QR_SIGNING_SECRET is missing or too short');
      return {
        success: false,
        error: 'QR_SIGNING_SECRET is not configured (minimum 32 chars).',
      };
    }

    // Validate gate belongs to org
    if (input.gateId) {
      const gate = await prisma.gate.findFirst({
        where: { id: input.gateId, organizationId: claims.orgId, deletedAt: null },
      });
      if (!gate) return { success: false, error: 'Gate not found.' };
    }

    if (input.type === QRCodeType.RECURRING) {
      if (!input.maxUses || !Number.isInteger(input.maxUses) || input.maxUses < 1) {
        return { success: false, error: 'maxUses must be a positive integer for RECURRING type.' };
      }
    }

    if (input.type !== QRCodeType.PERMANENT && input.expiresAt) {
      const expDate = new Date(input.expiresAt);
      if (isNaN(expDate.getTime()) || expDate <= new Date()) {
        return { success: false, error: 'Expiry must be a valid future date.' };
      }
    }

    const resolvedMaxUses =
      input.type === QRCodeType.SINGLE ? 1 : input.type === QRCodeType.PERMANENT ? null : input.maxUses;

    const qrId = randomUUID();
    const nonce = randomUUID();

    const payload = {
      qrId,
      organizationId: input.organizationId,
      type: input.type,
      maxUses: resolvedMaxUses,
      expiresAt: input.type === QRCodeType.PERMANENT ? null : input.expiresAt,
      issuedAt: new Date().toISOString(),
      nonce,
    };

    let qrString: string;
    try {
      qrString = signQRPayload(payload, secret);
    } catch (err) {
      console.error('createQRCode: Signing error:', err);
      return { success: false, error: (err as Error).message };
    }

    const projectId = await getValidatedProjectId(input.organizationId);

    // Persist QRCode to DB
    await prisma.qRCode.create({
      data: {
        code: qrString,
        type: input.type as unknown as PrismaQRCodeType,
        organizationId: input.organizationId,
        ...(projectId ? { projectId } : {}),
        gateId: input.gateId,
        maxUses: resolvedMaxUses,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        isActive: true,
      },
    });

    // ── Generate short link so the QR encodes a compact URL ─────────────────
    // 8-char hex = 4 random bytes = ~4 billion combinations (ample for this use case).
    const shortId = createId();
    const appUrl = process.env.NEXT_PUBLIC_QR_BASE_URL ?? 'http://localhost:3000';
    const shortUrl = `${appUrl}/s/${shortId}`;

    // Short link expires 1 hour after the QR's own expiry; 24 h for PERMANENT.
    const linkExpiresAt = input.expiresAt
      ? new Date(new Date(input.expiresAt).getTime() + 60 * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      await prisma.qrShortLink.create({
        data: {
          shortId,
          fullPayload: qrString,
          qrId,
          organizationId: input.organizationId,
          ...(projectId ? { projectId } : {}),
          expiresAt: linkExpiresAt,
        },
      });
    } catch (err) {
      // Non-fatal — QRCode was saved; just fall back to showing the full payload.
      console.error('createQRCode: Failed to persist short-link:', err);
      return { success: true, qrString, qrId };
    }

    console.log(`createQRCode: Created ${input.type} QR ${qrId} for org ${input.organizationId} → shortId ${shortId}`);
    return { success: true, qrString, qrId, shortUrl };
  } catch (error) {
    console.error('createQRCode: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
