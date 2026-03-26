import type { Organization, QRCode, ScanLog, Gate } from './base';
export * from './base';

export interface GateWithRelations extends Gate {
  organization?: Organization;
  qrCodes?: QRCode[];
  scanLogs?: ScanLog[];
}
