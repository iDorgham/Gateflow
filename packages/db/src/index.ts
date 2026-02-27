export * from '@prisma/client';
export { prisma } from './client';
export { db } from './client';
export { default as prismaClient } from './client';
export * from './quota';
export * from './access';
export {
  setOrganizationContext,
  getOrganizationContext,
  clearOrganizationContext,
} from './tenant';
export type { OrganizationContext, DbClient } from './tenant';
