import { z } from 'zod';
import { ScanStatus } from './scan-log';

export const ScanEventSchema = z.object({
  id: z.string(),
  qrCode: z.string(),
  gateId: z.string(),
  scannedAt: z.string().datetime(),
  status: z.nativeEnum(ScanStatus),
  retryCount: z.number().int().min(0),
});

export type ScanEvent = z.infer<typeof ScanEventSchema>;

export const QueuedScanSchema = z.object({
  id: z.string(),
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

export const BulkScanResponseSchema = z.object({
  success: z.boolean(),
  synced: z.array(z.string()),
  failed: z.array(z.object({
    id: z.string(),
    error: z.string(),
  })),
});

export type BulkScanResponse = z.infer<typeof BulkScanResponseSchema>;
