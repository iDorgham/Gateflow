/**
 * Helpers for Phase 6 relational seed: signed Visitor QR + ScanLog rows (scanUuid dedupe).
 */

import { createHash } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { QRCodeType as PayloadQRType, signQRPayload } from '@gate-access/types';

/** Entities touched in one `seedRelationalChain` run (project → … → scan). */
export const RELATIONAL_SEED_CHAIN_DEPTH = 7 as const;

/**
 * RFC 4122 UUID v4–shaped id derived from `(seed, index)` for reproducible tests.
 */
export function deterministicScanUuid(seed: number, index: number): string {
  const hash = createHash('sha256')
    .update(`scanUuid:${seed}:${index}`)
    .digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const h = bytes.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/**
 * Prisma filter: scan logs whose QR belongs to the organization (ScanLog has no `organizationId`).
 */
export function scanLogWhereForOrganization(
  organizationId: string
): Prisma.ScanLogWhereInput {
  return {
    qrCode: {
      organizationId,
      deletedAt: null,
    },
  };
}

export type BuildVisitorSignedCodeInput = {
  qrId: string;
  organizationId: string;
  maxUses: number | null;
  expiresAt: string | null;
  issuedAt: string;
  nonce: string;
  secret: string;
};

/** Signs a VISITOR payload (same path as runtime QR creation). */
export function buildSignedVisitorQRCodeString(
  input: BuildVisitorSignedCodeInput
): string {
  return signQRPayload(
    {
      qrId: input.qrId,
      organizationId: input.organizationId,
      type: PayloadQRType.VISITOR,
      maxUses: input.maxUses,
      expiresAt: input.expiresAt,
      issuedAt: input.issuedAt,
      nonce: input.nonce,
    },
    input.secret
  );
}
