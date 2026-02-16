export enum ScanStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  MAX_USES_REACHED = 'MAX_USES_REACHED',
  INACTIVE = 'INACTIVE',
}

export interface ScanLog {
  id: string;
  status: ScanStatus;
  scannedAt: Date;
  userId: string | null;
  gateId: string;
  qrCodeId: string;
}

export interface ScanLogWithRelations extends ScanLog {
  user?: User | null;
  gate?: Gate;
  qrCode?: QRCode;
}

export type ScanStatusType = keyof typeof ScanStatus;

import type { User } from './user';
import type { Gate } from './gate';
import type { QRCode } from './qr';
