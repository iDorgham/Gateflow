import type { Organization } from './organization';
import type { QRCode } from './qr';
import type { ScanLog } from './scan-log';

export interface Gate {
  id: string;
  name: string;
  location: string;
  organizationId: string;
  isActive: boolean;
  lastAccessedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface GateWithRelations extends Gate {
  organization?: Organization;
  qrCodes?: QRCode[];
  scanLogs?: ScanLog[];
}
