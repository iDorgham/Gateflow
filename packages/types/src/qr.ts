import type { Organization } from './organization';
import type { Gate } from './gate';
import type { ScanLog } from './scan-log';

export enum QRCodeType {
  SINGLE = 'SINGLE',
  RECURRING = 'RECURRING',
  PERMANENT = 'PERMANENT',
  VISITOR = 'VISITOR',
  OPEN = 'OPEN',
}

export interface QRCode {
  id: string;
  code: string;
  type: QRCodeType;
  organizationId: string;
  gateId: string | null;
  maxUses: number | null;
  currentUses: number;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface QRCodeWithRelations extends QRCode {
  organization?: Organization;
  gate?: Gate | null;
  scanLogs?: ScanLog[];
}

export type QRCodeTypeType = keyof typeof QRCodeType;
