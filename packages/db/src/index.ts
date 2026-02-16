export * from '@prisma/client';
export { default as prisma, prisma as db } from './client';

export type {
  Organization,
  User,
  Gate,
  QRCode,
  ScanLog,
  Plan,
  UserRole,
  QRCodeType,
  ScanStatus,
} from '@prisma/client';
