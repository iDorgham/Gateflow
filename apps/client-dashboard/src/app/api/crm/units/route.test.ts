export {};

/**
 * Tests for /api/crm/units
 * Phase 5: CRM Units — GET (paginated/filtered), POST (create + org scope)
 */

// ── next/server mock ────────────────────────────────────────────────────────
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

// ── auth mock ────────────────────────────────────────────────────────────────
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: jest.fn(),
}));

// ── prisma mock ─────────────────────────────────────────────────────────────
jest.mock('@gate-access/db', () => ({
  prisma: {
    unit: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
    },
    contact: {
      findMany: jest.fn(),
    },
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

import { GET, POST } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

const mockClaims = { orgId: 'org_1', sub: 'user_1', role: 'MANAGER' };

const mockUnit = {
  id: 'unit_1',
  name: 'A-101',
  type: 'APARTMENT',
  building: 'Tower A',
  sizeSqm: 90,
  projectId: 'proj_1',
  organizationId: 'org_1',
  deletedAt: null,
  project: { id: 'proj_1', name: 'Sunset Towers' },
  contacts: [],
};

const mockProject = { id: 'proj_1', name: 'Sunset Towers', organizationId: 'org_1' };

describe('GET /api/crm/units', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.unit.findMany as jest.Mock).mockResolvedValue([mockUnit]);
    (prisma.unit.count as jest.Mock).mockResolvedValue(1);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units') as any;
    const res = await GET(req);
    expect((res as any).status).toBe(401);
  });

  it('returns paginated units for the org', async () => {
    const req = new NextRequest('http://localhost/api/crm/units?page=1&pageSize=25') as any;
    const res = await GET(req);
    const body = await (res as any).json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.total).toBe(1);
  });

  it('scopes query to organizationId (multi-tenancy)', async () => {
    const req = new NextRequest('http://localhost/api/crm/units') as any;
    await GET(req);
    expect(prisma.unit.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: 'org_1', deletedAt: null }),
      })
    );
  });

  it('filters by projectId when provided', async () => {
    const req = new NextRequest('http://localhost/api/crm/units?projectId=proj_1') as any;
    await GET(req);
    expect(prisma.unit.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ projectId: 'proj_1' }),
      })
    );
  });

  it('excludes soft-deleted units', async () => {
    const req = new NextRequest('http://localhost/api/crm/units') as any;
    await GET(req);
    const call = (prisma.unit.findMany as jest.Mock).mock.calls[0][0];
    expect(call.where.deletedAt).toBe(null);
  });
});

describe('POST /api/crm/units', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);
    (prisma.unit.create as jest.Mock).mockResolvedValue(mockUnit);
    (prisma.contact.findMany as jest.Mock).mockResolvedValue([]);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units', {
      method: 'POST',
      body: JSON.stringify({ name: 'A-101', type: 'APARTMENT', projectId: 'proj_1' }),
    }) as any;
    const res = await POST(req);
    expect((res as any).status).toBe(401);
  });

  it('returns 400 for missing required fields', async () => {
    const req = new NextRequest('http://localhost/api/crm/units', {
      method: 'POST',
      body: JSON.stringify({ name: 'A-101' }), // missing type and projectId
    }) as any;
    const res = await POST(req);
    expect((res as any).status).toBe(400);
  });

  it('returns 403 when project does not belong to org', async () => {
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/units', {
      method: 'POST',
      body: JSON.stringify({ name: 'A-101', type: 'APARTMENT', projectId: 'proj_other' }),
    }) as any;
    const res = await POST(req);
    expect((res as any).status).toBe(403);
  });

  it('creates unit with organizationId from session', async () => {
    const req = new NextRequest('http://localhost/api/crm/units', {
      method: 'POST',
      body: JSON.stringify({ name: 'A-101', type: 'APARTMENT', projectId: 'proj_1' }),
    }) as any;
    await POST(req);
    expect(prisma.unit.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ organizationId: 'org_1' }),
      })
    );
  });

  it('returns 201 on successful creation', async () => {
    const req = new NextRequest('http://localhost/api/crm/units', {
      method: 'POST',
      body: JSON.stringify({ name: 'A-101', type: 'APARTMENT', projectId: 'proj_1' }),
    }) as any;
    const res = await POST(req);
    expect((res as any).status).toBe(201);
  });

  it('prevents creating unit for foreign-org project', async () => {
    (prisma.project.findFirst as jest.Mock).mockImplementation(({ where }: any) => {
      // Only return project if orgId matches
      return where.organizationId === 'org_1' ? mockProject : null;
    });

    const req = new NextRequest('http://localhost/api/crm/units', {
      method: 'POST',
      body: JSON.stringify({ name: 'B-202', type: 'VILLA', projectId: 'proj_1' }),
    }) as any;
    await POST(req);
    // Should pass (same org)
    expect(prisma.unit.create).toHaveBeenCalled();
  });
});
