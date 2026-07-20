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
    findFirst: async (
      ...args: Parameters<typeof prisma.organization.findFirst>
    ) => {
      return prisma.organization.findFirst(...(args as [any]));
    },
    findUnique: async (
      ...args: Parameters<typeof prisma.organization.findUnique>
    ) => {
      return prisma.organization.findUnique(...(args as [any]));
    },
    findMany: async (
      ...args: Parameters<typeof prisma.organization.findMany>
    ) => {
      return prisma.organization.findMany(...(args as [any]));
    },
  },

  user: {
    ...prisma.user,
    findFirst: async (args?: Parameters<typeof prisma.user.findFirst>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.findFirst(args as any);
      return prisma.user.findFirst({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
    findMany: async (args?: Parameters<typeof prisma.user.findMany>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.findMany(args as any);
      return prisma.user.findMany({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
    count: async (args?: Parameters<typeof prisma.user.count>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.user.count(args as any);
      return prisma.user.count({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
  },

  gate: {
    ...prisma.gate,
    findFirst: async (args?: Parameters<typeof prisma.gate.findFirst>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.findFirst(args as any);
      return prisma.gate.findFirst({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
    findMany: async (args?: Parameters<typeof prisma.gate.findMany>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.findMany(args as any);
      return prisma.gate.findMany({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
    count: async (args?: Parameters<typeof prisma.gate.count>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.gate.count(args as any);
      return prisma.gate.count({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
  },

  qRCode: {
    ...prisma.qRCode,
    findFirst: async (args?: Parameters<typeof prisma.qRCode.findFirst>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.findFirst(args as any);
      return prisma.qRCode.findFirst({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
    findMany: async (args?: Parameters<typeof prisma.qRCode.findMany>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.findMany(args as any);
      return prisma.qRCode.findMany({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
    count: async (args?: Parameters<typeof prisma.qRCode.count>[0]) => {
      const orgFilter = getOrgFilter();
      if (!orgFilter) return prisma.qRCode.count(args as any);
      return prisma.qRCode.count({
        ...args,
        where: {
          ...args?.where,
          organizationId: orgFilter,
        },
      } as any);
    },
  },

  scanLog: {
    ...prisma.scanLog,
    findMany: async (args?: Parameters<typeof prisma.scanLog.findMany>[0]) => {
      const orgId = organizationContext.organizationId;
      if (!orgId) return prisma.scanLog.findMany(args as any);
      return prisma.scanLog.findMany({
        ...args,
        where: {
          ...args?.where,
          gate: {
            ...(args?.where?.gate as any),
            organizationId: orgId,
          },
        },
      } as any);
    },
    count: async (args?: Parameters<typeof prisma.scanLog.count>[0]) => {
      const orgId = organizationContext.organizationId;
      if (!orgId) return prisma.scanLog.count(args as any);
      return prisma.scanLog.count({
        ...args,
        where: {
          ...args?.where,
          gate: {
            ...(args?.where?.gate as any),
            organizationId: orgId,
          },
        },
      } as any);
    },
  },
};

export type DbClient = typeof db;
