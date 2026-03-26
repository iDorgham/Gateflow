import type { Organization, Gate, ScanLog, QRCode } from './base';
export * from './base';

export interface QRCodeWithRelations extends QRCode {
  organization?: Organization;
  gate?: Gate | null;
  scanLogs?: ScanLog[];
}
