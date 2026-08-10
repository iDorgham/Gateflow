const mockPrisma = {
  user: {
    findFirst: jest.fn(async (_args?: unknown) => null),
    findUnique: jest.fn(async (_args?: unknown) => null),
    findMany: jest.fn(async (_args?: unknown) => []),
    count: jest.fn(async (_args?: unknown) => 0),
    create: jest.fn(async (_args?: unknown) => ({ id: 'u1' })),
    createMany: jest.fn(async (_args?: unknown) => ({ count: 1 })),
    update: jest.fn(async (_args?: unknown) => ({ id: 'u1' })),
    updateMany: jest.fn(async (_args?: unknown) => ({ count: 1 })),
    upsert: jest.fn(async (_args?: unknown) => ({ id: 'u1' })),
    delete: jest.fn(async (_args?: unknown) => ({ id: 'u1' })),
    deleteMany: jest.fn(async (_args?: unknown) => ({ count: 1 })),
  },
  organization: {
    findFirst: jest.fn(async (_args?: unknown) => null),
    findUnique: jest.fn(async (_args?: unknown) => null),
    findMany: jest.fn(async (_args?: unknown) => []),
  },
  gate: {
    findFirst: jest.fn(async (_args?: unknown) => null),
    findMany: jest.fn(async (_args?: unknown) => []),
    count: jest.fn(async (_args?: unknown) => 0),
  },
  qRCode: {
    findFirst: jest.fn(async (_args?: unknown) => null),
    findMany: jest.fn(async (_args?: unknown) => []),
    count: jest.fn(async (_args?: unknown) => 0),
  },
  scanLog: {
    findMany: jest.fn(async (_args?: unknown) => []),
    count: jest.fn(async (_args?: unknown) => 0),
    create: jest.fn(async (_args?: unknown) => ({ id: 's1' })),
    createMany: jest.fn(async (_args?: unknown) => ({ count: 1 })),
  },
  project: {
    findMany: jest.fn(async (_args?: unknown) => []),
    create: jest.fn(async (_args?: unknown) => ({ id: 'p1' })),
  },
  incident: {
    findFirst: jest.fn(async (_args?: unknown) => null),
    findMany: jest.fn(async (_args?: unknown) => []),
  },
};

import {
  setOrganizationContext,
  getOrganizationContext,
  clearOrganizationContext,
  runWithOrganization,
  runWithOrganizationAsync,
  runPrivileged,
  createTenantScopedClient,
  TenantContextError,
} from './tenant';

const db = createTenantScopedClient(mockPrisma);
const privilegedDb = mockPrisma;

describe('Organization Context Isolation (ALS)', () => {
  beforeEach(() => {
    clearOrganizationContext();
    Object.values(mockPrisma).forEach((model) => {
      Object.values(model).forEach((fn) => {
        if (typeof fn === 'function') {
          (fn as jest.Mock).mockClear();
        }
      });
    });
  });

  afterEach(() => {
    clearOrganizationContext();
  });

  describe('Context Management', () => {
    it('sets and gets organization context', () => {
      setOrganizationContext({ organizationId: 'org-123' });
      expect(getOrganizationContext()).toEqual({ organizationId: 'org-123' });
    });

    it('clears organization context', () => {
      setOrganizationContext({ organizationId: 'org-123' });
      clearOrganizationContext();
      expect(getOrganizationContext()).toEqual({ organizationId: null });
    });

    it('isolates concurrent organizations via AsyncLocalStorage', async () => {
      const seen: string[] = [];
      await Promise.all([
        runWithOrganizationAsync('org-a', async () => {
          await new Promise((r) => setTimeout(r, 20));
          seen.push(`a:${getOrganizationContext().organizationId}`);
          expect(getOrganizationContext().organizationId).toBe('org-a');
        }),
        runWithOrganizationAsync('org-b', async () => {
          await new Promise((r) => setTimeout(r, 5));
          seen.push(`b:${getOrganizationContext().organizationId}`);
          expect(getOrganizationContext().organizationId).toBe('org-b');
        }),
      ]);
      expect(seen).toEqual(expect.arrayContaining(['a:org-a', 'b:org-b']));
    });
  });

  describe('Fail-closed tenant db', () => {
    it('rejects user.findFirst when context is missing', async () => {
      await expect(
        db.user.findFirst({ where: { email: 'test@example.com' } })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
    });

    it('rejects scanLog.findMany when context is missing', async () => {
      await expect(db.scanLog.findMany()).rejects.toBeInstanceOf(
        TenantContextError
      );
    });

    it('filters user.findFirst by organizationId and soft-delete', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.findFirst({ where: { email: 'test@example.com' } });

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'test@example.com',
          organizationId: 'org-123',
          deletedAt: null,
        },
      });
    });

    it('filters user.findMany by organizationId and soft-delete', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.findMany();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-123',
          deletedAt: null,
        },
      });
    });

    it('injects organizationId on create and rejects cross-tenant create', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.create({
        data: { email: 'a@b.com', name: 'A', passwordHash: 'x' },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ organizationId: 'org-123' }),
        })
      );

      await expect(
        db.user.create({
          data: {
            email: 'a@b.com',
            organizationId: 'other-org',
          },
        })
      ).rejects.toBeInstanceOf(TenantContextError);
    });

    it('scopes updates to organizationId', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.update({
        where: { id: 'u1' },
        data: { name: 'n' },
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: 'u1',
            organizationId: 'org-123',
          }),
        })
      );
    });

    it('scopes findUnique with organizationId and soft-delete', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.findUnique({ where: { id: 'u1' } });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'u1',
          organizationId: 'org-123',
          deletedAt: null,
        },
      });
    });

    it('rejects cross-tenant update when record is outside org', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      mockPrisma.user.update.mockRejectedValueOnce(
        Object.assign(new Error('Record to update not found.'), {
          code: 'P2025',
        })
      );

      await expect(
        db.user.update({
          where: { id: 'other-org-user' },
          data: { name: 'n' },
        })
      ).rejects.toMatchObject({ code: 'P2025' });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: 'other-org-user',
            organizationId: 'org-123',
          }),
        })
      );
    });

    it('filters incident.findMany by organizationId and soft-delete', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.incident.findMany();

      expect(mockPrisma.incident.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-123',
          deletedAt: null,
        },
      });
    });

    it('filters scanLog via gate.organizationId', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.scanLog.findMany();

      expect(mockPrisma.scanLog.findMany).toHaveBeenCalledWith({
        where: {
          gate: {
            organizationId: 'org-123',
          },
        },
      });
    });

    it('rejects scanLog.create and scanLog.createMany on the tenant client', async () => {
      setOrganizationContext({ organizationId: 'org-123' });

      await expect(
        db.scanLog.create({ data: { gateId: 'g1' } })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.scanLog.create).not.toHaveBeenCalled();

      await expect(
        db.scanLog.createMany({ data: [{ gateId: 'g1' }] })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.scanLog.createMany).not.toHaveBeenCalled();
    });

    it('injects organizationId on createMany given a single object (Enumerable<T>)', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.createMany({ data: { email: 'a@b.com' } });

      expect(mockPrisma.user.createMany).toHaveBeenCalledWith({
        data: { email: 'a@b.com', organizationId: 'org-123' },
      });
    });

    it('injects organizationId on every row of createMany given an array', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.createMany({
        data: [{ email: 'a@b.com' }, { email: 'b@b.com' }],
      });

      expect(mockPrisma.user.createMany).toHaveBeenCalledWith({
        data: [
          { email: 'a@b.com', organizationId: 'org-123' },
          { email: 'b@b.com', organizationId: 'org-123' },
        ],
      });
    });

    it('rejects createMany with a cross-tenant organizationId in any row', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await expect(
        db.user.createMany({
          data: [
            { email: 'a@b.com' },
            { email: 'b@b.com', organizationId: 'other-org' },
          ],
        })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.user.createMany).not.toHaveBeenCalled();
    });

    it('rejects update attempting to reassign organizationId', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await expect(
        db.user.update({
          where: { id: 'u1' },
          data: { organizationId: 'other-org' },
        })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('strips a no-op same-org organizationId from update data', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.update({
        where: { id: 'u1' },
        data: { name: 'n', organizationId: 'org-123' },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1', organizationId: 'org-123', deletedAt: null },
        data: { name: 'n' },
      });
    });

    it('rejects updateMany attempting to reassign organizationId', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await expect(
        db.user.updateMany({
          where: {},
          data: { organizationId: 'other-org' },
        })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('rejects upsert update-branch attempting to reassign organizationId', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await expect(
        db.user.upsert({
          where: { id: 'u1' },
          create: { email: 'a@b.com' },
          update: { organizationId: 'other-org' },
        })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.user.upsert).not.toHaveBeenCalled();
    });

    it('adds deletedAt: null to update/delete where on soft-delete models', async () => {
      setOrganizationContext({ organizationId: 'org-123' });
      await db.user.update({ where: { id: 'u1' }, data: { name: 'n' } });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1', organizationId: 'org-123', deletedAt: null },
        data: { name: 'n' },
      });
    });

    it('rejects hard delete on soft-delete models', async () => {
      setOrganizationContext({ organizationId: 'org-123' });

      await expect(
        db.user.delete({ where: { id: 'u1' } })
      ).rejects.toBeInstanceOf(TenantContextError);
      expect(mockPrisma.user.delete).not.toHaveBeenCalled();

      await expect(db.user.deleteMany({ where: {} })).rejects.toBeInstanceOf(
        TenantContextError
      );
      expect(mockPrisma.user.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('Privileged client', () => {
    it('allows privilegedDb without organization context', async () => {
      await privilegedDb.user.findMany();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
    });

    it('runPrivileged does not enable tenant db without org', async () => {
      await expect(
        runPrivileged(() => db.user.findMany())
      ).rejects.toBeInstanceOf(TenantContextError);
    });

    it('runWithOrganization enables scoped queries', async () => {
      await runWithOrganization('org-xyz', async () => {
        await db.gate.findMany();
      });
      expect(mockPrisma.gate.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-xyz',
          deletedAt: null,
        },
      });
    });
  });
});
