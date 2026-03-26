import type { User, Gate, QRCode, ScanLog } from './base';
export * from './base';

export interface ScanLogWithRelations extends ScanLog {
  user?: User | null;
  gate?: Gate;
  qrCode?: QRCode;
}
