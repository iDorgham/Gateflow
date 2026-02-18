import { z } from 'zod';
import { QRCodeType } from './qr';

/** Version prefix for all GateFlow QR codes */
export const QR_PREFIX = 'gateflow';
export const QR_VERSION = 1;

/**
 * Inner payload embedded in every signed QR code.
 * No PII — only IDs, constraints, and a unique nonce.
 */
export const QRPayloadSchema = z.object({
  /** QRCode record ID (cuid) */
  qrId: z.string(),
  /** Issuing organization ID */
  organizationId: z.string(),
  /** QR usage type */
  type: z.nativeEnum(QRCodeType),
  /** Max allowed scans (null = unlimited for PERMANENT) */
  maxUses: z.number().int().positive().nullable(),
  /** Expiration timestamp (null = never expires) */
  expiresAt: z.string().datetime().nullable(),
  /** Issuance timestamp */
  issuedAt: z.string().datetime(),
  /** Unique nonce per issuance — prevents replay */
  nonce: z.string().uuid(),
});

export type QRPayload = z.infer<typeof QRPayloadSchema>;

/** The full signed QR string: "gateflow:1:<base64url(payload)>.<hex signature>" */
export const SignedQRStringSchema = z.string().regex(
  /^gateflow:1:[A-Za-z0-9_-]+=*\.[0-9a-f]{64}$/,
  'Invalid GateFlow QR format'
);

export type SignedQRString = z.infer<typeof SignedQRStringSchema>;

export type QRVerificationResult =
  | { valid: true; payload: QRPayload }
  | { valid: false; reason: QRRejectReason; details?: string };

export type QRRejectReason =
  | 'INVALID_FORMAT'
  | 'INVALID_SIGNATURE'
  | 'EXPIRED'
  | 'NONCE_REUSED'
  | 'MALFORMED_PAYLOAD'
  | 'UNKNOWN_VERSION';
