import { z } from 'zod';

export const QRValidateRequestSchema = z.object({
  qrPayload: z.string().min(1),
  scanContext: z
    .object({
      gateId: z.string().optional(),
      deviceId: z.string().optional(),
      location: z.record(z.string(), z.unknown()).optional(),
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
      visitorName: z.string().max(200).optional(),
      visitorPhone: z.string().max(50).optional(),
      visitorIdNumber: z.string().max(100).optional(),
    })
    .optional(),
});

export type QRValidateRequest = z.infer<typeof QRValidateRequestSchema>;

export const QRValidateRejectReason = z.enum([
  'invalid_signature',
  'malformed_payload',
  'expired',
  'max_uses_reached',
  'revoked',
  'inactive',
  'wrong_org',
  'not_found',
  'unknown_version',
  'invalid_format',
  'unauthorized',
  'rate_limited',
  'internal_error',
  'denied',
  'not_on_location',
  'blocked_watchlist',
]);

export type QRValidateRejectReason = z.infer<typeof QRValidateRejectReason>;

export const QRValidateResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('accepted'),
    scanId: z.string(),
    message: z.string().optional(),
  }),
  z.object({
    status: z.literal('rejected'),
    reason: QRValidateRejectReason,
    message: z.string().optional(),
  }),
]);

export type QRValidateResponse = z.infer<typeof QRValidateResponseSchema>;
