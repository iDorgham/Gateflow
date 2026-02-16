export * from '@prisma/client';
export { prisma, db, default as prismaClient } from './client';
export {
  setOrganizationContext,
  getOrganizationContext,
  clearOrganizationContext,
} from './tenant';
export type { OrganizationContext, DbClient } from './tenant';
