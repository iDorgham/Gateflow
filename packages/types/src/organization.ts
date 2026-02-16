import type { User } from './user';
import type { Gate } from './gate';
import type { QRCode } from './qr';

export enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  domain: string | null;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OrganizationWithRelations extends Organization {
  users?: User[];
  gates?: Gate[];
  qrCodes?: QRCode[];
}
