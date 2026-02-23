import { z } from 'zod';
import { ScanStatus } from './scan-log';

export const ScanEventSchema = z.object({
  id: z.string(),
  scanUuid: z.string().uuid(),
  qrCode: z.string(),
  gateId: z.string(),
  scannedAt: z.string().datetime(),
  status: z.nativeEnum(ScanStatus),
  retryCount: z.number().int().min(0),
  deviceId: z.string().optional(),
});

export type ScanEvent = z.infer<typeof ScanEventSchema>;

export const QueuedScanSchema = z.object({
  id: z.string(),
  scanUuid: z.string().uuid(),
  qrCode: z.string(),
  gateId: z.string(),
  scannedAt: z.string().datetime(),
  synced: z.boolean(),
  retryCount: z.number().int().min(0),
});

export type QueuedScan = z.infer<typeof QueuedScanSchema>;

export const SyncPayloadSchema = z.object({
  scans: z.array(ScanEventSchema),
  deviceId: z.string(),
  appVersion: z.string(),
});

export type SyncPayload = z.infer<typeof SyncPayloadSchema>;

export const SyncResponseSchema = z.object({
  synced: z.array(z.string()),
  failed: z.array(z.object({
    id: z.string(),
    error: z.string(),
  })),
});

export type SyncResponse = z.infer<typeof SyncResponseSchema>;

export const BulkScanRequestSchema = z.object({
  scans: z.array(ScanEventSchema),
});

export type BulkScanRequest = z.infer<typeof BulkScanRequestSchema>;

export const AuditTrailEntrySchema = z.object({
  timestamp: z.string().datetime(),
  action: z.string(),
  resolvedBy: z.enum(['lww', 'server', 'client']),
  details: z.record(z.string(), z.unknown()),
});

export type AuditTrailEntry = z.infer<typeof AuditTrailEntrySchema>;

export const BulkScanResponseSchema = z.object({
  success: z.boolean(),
  synced: z.array(z.string()),
  conflicted: z.array(z.object({
    id: z.string(),
    reason: z.string(),
  })),
  failed: z.array(z.object({
    id: z.string(),
    error: z.string(),
  })),
});

export type BulkScanResponse = z.infer<typeof BulkScanResponseSchema>;
