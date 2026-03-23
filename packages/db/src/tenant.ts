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
    findFirst: async (args?: Prisma.UserFindFirstArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.findFirst(args);
      return prisma.user.findFirst({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
    findMany: async (args?: Prisma.UserFindManyArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.findMany(args);
      return prisma.user.findMany({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
    count: async (args?: Prisma.UserCountArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.count(args);
      return prisma.user.count({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
  },

  gate: {
    ...prisma.gate,
    findFirst: async (args?: Prisma.GateFindFirstArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.findFirst(args);
      return prisma.gate.findFirst({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
    findMany: async (args?: Prisma.GateFindManyArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.findMany(args);
      return prisma.gate.findMany({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
    count: async (args?: Prisma.GateCountArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.count(args);
      return prisma.gate.count({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
  },

  qRCode: {
    ...prisma.qRCode,
    findFirst: async (args?: Prisma.QRCodeFindFirstArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.findFirst(args);
      return prisma.qRCode.findFirst({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
    findMany: async (args?: Prisma.QRCodeFindManyArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.findMany(args);
      return prisma.qRCode.findMany({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
    count: async (args?: Prisma.QRCodeCountArgs) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.count(args);
      return prisma.qRCode.count({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      });
    },
  },

  scanLog: {
    ...prisma.scanLog,
    findMany: async (args?: Prisma.ScanLogFindManyArgs) => {
      const orgId = organizationContext.organizationId;
      if (!orgId) return prisma.scanLog.findMany(args);
      return prisma.scanLog.findMany({
        ...args,
        where: {
          ...args?.where,
          gate: {
            ...(args?.where?.gate as Prisma.GateWhereInput),
            organizationId: orgId,
          },
        } as Prisma.ScanLogWhereInput,
      });
    },
    count: async (args?: Prisma.ScanLogCountArgs) => {
      const orgId = organizationContext.organizationId;
      if (!orgId) return prisma.scanLog.count(args);
      return prisma.scanLog.count({
        ...args,
        where: {
          ...args?.where,
          gate: {
            ...(args?.where?.gate as Prisma.GateWhereInput),
            organizationId: orgId,
          },
        } as Prisma.ScanLogWhereInput,
      });
    },
  },
};

export type DbClient = typeof db;
