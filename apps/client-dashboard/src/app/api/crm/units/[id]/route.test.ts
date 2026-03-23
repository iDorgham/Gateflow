export {};

/**
 * Tests for PATCH/DELETE /api/crm/units/[id]
 * Phase 5: soft delete + org-scoped update + project ownership check
 */

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    private _body: string;
    constructor(url: string, init?: { method?: string; body?: string }) {
      this.url = url;
      this._body = init?.body ?? '{}';
    }
    async json() { return JSON.parse(this._body); }
  }
  class MockNextResponse {
    status: number;
    private _body: unknown;
    constructor(body: unknown, init?: { status?: number }) {
      this._body = body;
      this.status = init?.status ?? 200;
    }
    async json() { return this._body; }
    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }
  }
  return { NextRequest: MockNextRequest, NextResponse: MockNextResponse };
});

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    unit: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
    },
    contact: {
      findMany: jest.fn(),
    },
    contactUnit: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  UnitType: {
    STUDIO: 'STUDIO',
    APARTMENT: 'APARTMENT',
    VILLA: 'VILLA',
    OFFICE: 'OFFICE',
    RETAIL: 'RETAIL',
    OTHER: 'OTHER',
  },
}));

import { PATCH, DELETE } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

const mockClaims = { orgId: 'org_1', sub: 'user_1', role: 'MANAGER' };
const mockUnit = {
  id: 'unit_1',
  name: 'A-101',
  type: 'APARTMENT',
  organizationId: 'org_1',
  projectId: 'proj_1',
  deletedAt: null,
};
const mockProject = { id: 'proj_1', organizationId: 'org_1' };

describe('PATCH /api/crm/units/[id]', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.unit.findFirst as jest.Mock).mockResolvedValue(mockUnit);
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);
    (prisma.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        contactUnit: { deleteMany: jest.fn(), createMany: jest.fn() },
        contact: { findMany: jest.fn().mockResolvedValue([]) },
        unit: { update: jest.fn().mockResolvedValue({ ...mockUnit, building: 'Tower B', contacts: [], project: mockProject }) },
      };
      return fn(tx);
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units/unit_1', {
      body: JSON.stringify({ building: 'Tower B' }),
    }) as any;
    const res = await PATCH(req, { params: { id: 'unit_1' } });
    expect((res as any).status).toBe(401);
  });

  it('returns 404 when unit not found in org', async () => {
    (prisma.unit.findFirst as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units/unit_x', {
      body: JSON.stringify({ building: 'Tower B' }),
    }) as any;
    const res = await PATCH(req, { params: { id: 'unit_x' } });
    expect((res as any).status).toBe(404);
  });

  it('returns 403 when updating to a project from another org', async () => {
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(null); // project not found in org
    const req = new NextRequest('http://localhost/api/crm/units/unit_1', {
      body: JSON.stringify({ projectId: 'proj_other' }),
    }) as any;
    const res = await PATCH(req, { params: { id: 'unit_1' } });
    expect((res as any).status).toBe(403);
  });

  it('updates unit fields successfully', async () => {
    const req = new NextRequest('http://localhost/api/crm/units/unit_1', {
      body: JSON.stringify({ building: 'Tower B' }),
    }) as any;
    const res = await PATCH(req, { params: { id: 'unit_1' } });
    const body = await (res as any).json();
    expect(body.success).toBe(true);
  });
});

describe('DELETE /api/crm/units/[id]', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.unit.findFirst as jest.Mock).mockResolvedValue(mockUnit);
    (prisma.unit.update as jest.Mock).mockResolvedValue({ ...mockUnit, deletedAt: new Date() });
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units/unit_1') as any;
    const res = await DELETE(req, { params: { id: 'unit_1' } });
    expect((res as any).status).toBe(401);
  });

  it('returns 404 when unit not found', async () => {
    (prisma.unit.findFirst as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units/unit_x') as any;
    const res = await DELETE(req, { params: { id: 'unit_x' } });
    expect((res as any).status).toBe(404);
  });

  it('performs soft delete (sets deletedAt, does not hard delete)', async () => {
    const req = new NextRequest('http://localhost/api/crm/units/unit_1') as any;
    const res = await DELETE(req, { params: { id: 'unit_1' } });
    expect(prisma.unit.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'unit_1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      })
    );
    const body = await (res as any).json();
    expect(body.success).toBe(true);
  });

  it('prevents deleting unit from another org', async () => {
    (prisma.unit.findFirst as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units/unit_other') as any;
    const res = await DELETE(req, { params: { id: 'unit_other' } });
    expect((res as any).status).toBe(404);
    expect(prisma.unit.update).not.toHaveBeenCalled();
  });
});
