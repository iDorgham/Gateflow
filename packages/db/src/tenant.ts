import { prisma } from './client';

export type OrganizationContext = {
  organizationId: string | null;
};

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

const defaultInclude = {
  organization: true,
};

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
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.user.findFirst({ ...query, where }, ...rest);
    },
    findMany: async (...args: Parameters<typeof prisma.user.findMany>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.user.findMany({ ...query, where }, ...rest);
    },
    count: async (...args: Parameters<typeof prisma.user.count>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.user.count({ ...query, where }, ...rest);
    },
  },

  gate: {
    ...prisma.gate,
    findFirst: async (...args: Parameters<typeof prisma.gate.findFirst>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.gate.findFirst({ ...query, where }, ...rest);
    },
    findMany: async (...args: Parameters<typeof prisma.gate.findMany>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.gate.findMany({ ...query, where }, ...rest);
    },
    count: async (...args: Parameters<typeof prisma.gate.count>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.gate.count({ ...query, where }, ...rest);
    },
    create: async (...args: Parameters<typeof prisma.gate.create>) => {
      const [data, ...rest] = args;
      return prisma.gate.create(
        {
          ...data,
          data: {
            ...data.data,
            organizationId: data.data.organizationId ?? organizationContext.organizationId ?? '',
          },
        },
        ...rest
      );
    },
  },

  qRCode: {
    ...prisma.qRCode,
    findFirst: async (...args: Parameters<typeof prisma.qRCode.findFirst>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.qRCode.findFirst({ ...query, where }, ...rest);
    },
    findMany: async (...args: Parameters<typeof prisma.qRCode.findMany>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.qRCode.findMany({ ...query, where }, ...rest);
    },
    count: async (...args: Parameters<typeof prisma.qRCode.count>) => {
      const [query, ...rest] = args;
      const where = {
        ...query?.where,
        organizationId: organizationContext.organizationId,
      };
      return prisma.qRCode.count({ ...query, where }, ...rest);
    },
    create: async (...args: Parameters<typeof prisma.qRCode.create>) => {
      const [data, ...rest] = args;
      return prisma.qRCode.create(
        {
          ...data,
          data: {
            ...data.data,
            organizationId: data.data.organizationId ?? organizationContext.organizationId ?? '',
          },
        },
        ...rest
      );
    },
  },

  scanLog: {
    ...prisma.scanLog,
    findMany: async (...args: Parameters<typeof prisma.scanLog.findMany>) => {
      const [query, ...rest] = args;
      if (organizationContext.organizationId) {
        const where = {
          ...query?.where,
          gate: {
            organizationId: organizationContext.organizationId,
          },
        };
        return prisma.scanLog.findMany({ ...query, where }, ...rest);
      }
      return prisma.scanLog.findMany(...args);
    },
    count: async (...args: Parameters<typeof prisma.scanLog.count>) => {
      const [query, ...rest] = args;
      if (organizationContext.organizationId) {
        const where = {
          ...query?.where,
          gate: {
            organizationId: organizationContext.organizationId,
          },
        };
        return prisma.scanLog.count({ ...query, where }, ...rest);
      }
      return prisma.scanLog.count(...args);
    },
  },
};

export type DbClient = typeof db;
