import type { User, Gate, QRCode, Organization } from './base';
export * from './base';

export interface OrganizationWithRelations extends Organization {
  users?: User[];
  gates?: Gate[];
  qrCodes?: QRCode[];
}
