import { prisma } from './client';
import type { Prisma } from '@prisma/client';

export type OrganizationContext = {
  organizationId: string | null;
};

// WARNING: This is module-level mutable state shared across all requests in the same
// Node.js process. Under concurrent Server Component rendering, one request's
// setOrganizationContext() can bleed into another's DB queries before
// clearOrganizationContext() runs.
//
// Callers MUST call clearOrganizationContext() in a finally block.
// For a safer alternative, consider Node.js AsyncLocalStorage.
const organizationContext: OrganizationContext = {
  organizationId: null,
};

export function setOrganizationContext(context: OrganizationContext): void {
  organizationContext.organizationId = context.organizationId;
}

export function getOrganizationContext(): OrganizationContext {
  return organizationContext;
}

export function clearOrganizationContext(): void {
  organizationContext.organizationId = null;
}

function getOrgFilter(): Prisma.StringFilter | undefined {
  const orgId = organizationContext.organizationId;
  if (!orgId) return undefined;
  return { equals: orgId };
}

export const db = {
  ...prisma,

  organization: {
    ...prisma.organization,
    findFirst: async (...args: Parameters<typeof prisma.organization.findFirst>) => {
      return prisma.organization.findFirst(...args);
    },
    findUnique: async (...args: Parameters<typeof prisma.organization.findUnique>) => {
      return prisma.organization.findUnique(...args);
    },
    findMany: async (...args: Parameters<typeof prisma.organization.findMany>) => {
      return prisma.organization.findMany(...args);
    },
  },

  user: {
    ...prisma.user,
    findFirst: async (...args: Parameters<typeof prisma.user.findFirst>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.findFirst(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.user.findFirst({ ...query, where }, ...rest);
    },
    findMany: async (...args: Parameters<typeof prisma.user.findMany>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.findMany(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.user.findMany({ ...query, where }, ...rest);
    },
    count: async (...args: Parameters<typeof prisma.user.count>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.count(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.user.count({ ...query, where }, ...rest);
    },
  },

  gate: {
    ...prisma.gate,
    findFirst: async (...args: Parameters<typeof prisma.gate.findFirst>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.findFirst(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.gate.findFirst({ ...query, where }, ...rest);
    },
    findMany: async (...args: Parameters<typeof prisma.gate.findMany>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.findMany(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.gate.findMany({ ...query, where }, ...rest);
    },
    count: async (...args: Parameters<typeof prisma.gate.count>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.count(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.gate.count({ ...query, where }, ...rest);
    },
  },

  qRCode: {
    ...prisma.qRCode,
    findFirst: async (...args: Parameters<typeof prisma.qRCode.findFirst>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.findFirst(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.qRCode.findFirst({ ...query, where }, ...rest);
    },
    findMany: async (...args: Parameters<typeof prisma.qRCode.findMany>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.findMany(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.qRCode.findMany({ ...query, where }, ...rest);
    },
    count: async (...args: Parameters<typeof prisma.qRCode.count>) => {
      const [query, ...rest] = args;
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.count(...args);
      const where = {
        ...query?.where,
        organizationId: orgFilter,
      };
      return prisma.qRCode.count({ ...query, where }, ...rest);
    },
  },

  scanLog: {
    ...prisma.scanLog,
    findMany: async (...args: Parameters<typeof prisma.scanLog.findMany>) => {
      const [query, ...rest] = args;
      const orgId = organizationContext.organizationId;
      if (!orgId) return prisma.scanLog.findMany(...args);
      const where = {
        ...query?.where,
        gate: {
          organizationId: orgId,
        },
      };
      return prisma.scanLog.findMany({ ...query, where }, ...rest);
    },
    count: async (...args: Parameters<typeof prisma.scanLog.count>) => {
      const [query, ...rest] = args;
      const orgId = organizationContext.organizationId;
      if (!orgId) return prisma.scanLog.count(...args);
      const where = {
        ...query?.where,
        gate: {
          organizationId: orgId,
        },
      };
      return prisma.scanLog.count({ ...query, where }, ...rest);
    },
  },
};

export type DbClient = typeof db;
