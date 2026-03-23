export {};

/**
 * Tests for /api/crm/contacts
 * Phase 5: CRM Contacts — GET (paginated/filtered), POST (create + org scope)
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

// ── realtime mock ────────────────────────────────────────────────────────────
jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: jest.fn().mockResolvedValue(undefined),
  EventType: { CONTACT_CREATED: 'CONTACT_CREATED', CONTACT_UPDATED: 'CONTACT_UPDATED' },
}));

// ── prisma mock ─────────────────────────────────────────────────────────────
jest.mock('@gate-access/db', () => ({
  prisma: {
    contact: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    unit: {
      findMany: jest.fn(),
    },
  },
  ContactSource: {
    MANUAL: 'MANUAL',
    IMPORT: 'IMPORT',
    QR_SCAN: 'QR_SCAN',
    REFERRAL: 'REFERRAL',
    OTHER: 'OTHER',
  },
}));

import { GET, POST } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

const mockClaims = { orgId: 'org_1', sub: 'user_1', role: 'MANAGER' };

const mockContact = {
  id: 'contact_1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '+1234567890',
  jobTitle: 'Manager',
  company: 'Acme',
  organizationId: 'org_1',
  deletedAt: null,
  units: [],
};

describe('GET /api/crm/contacts', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.contact.findMany as jest.Mock).mockResolvedValue([mockContact]);
    (prisma.contact.count as jest.Mock).mockResolvedValue(1);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/contacts') as any;
    const res = await GET(req);
    expect((res as any).status).toBe(401);
  });

  it('returns paginated contacts for the org', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts?page=1&pageSize=25') as any;
    const res = await GET(req);
    const body = await (res as any).json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.total).toBe(1);
  });

  it('scopes query to organizationId (multi-tenancy)', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts') as any;
    await GET(req);
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: 'org_1', deletedAt: null }),
      })
    );
  });

  it('filters by projectId when provided', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts?projectId=proj_1') as any;
    await GET(req);
    expect(prisma.contact.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          units: { some: { unit: { projectId: 'proj_1' } } },
        }),
      })
    );
  });

  it('applies search filter across name/email/phone', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts?search=jane') as any;
    await GET(req);
    const call = (prisma.contact.findMany as jest.Mock).mock.calls[0][0];
    expect(call.where.OR).toBeDefined();
    expect(call.where.OR).toHaveLength(4);
  });

  it('excludes soft-deleted contacts', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts') as any;
    await GET(req);
    const call = (prisma.contact.findMany as jest.Mock).mock.calls[0][0];
    expect(call.where.deletedAt).toBe(null);
  });
});

describe('POST /api/crm/contacts', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.contact.create as jest.Mock).mockResolvedValue(mockContact);
    (prisma.unit.findMany as jest.Mock).mockResolvedValue([]);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/contacts', {
      method: 'POST',
      body: JSON.stringify({ firstName: 'Jane', lastName: 'Doe' }),
    }) as any;
    const res = await POST(req);
    expect((res as any).status).toBe(401);
  });

  it('returns 400 for missing required fields', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts', {
      method: 'POST',
      body: JSON.stringify({ firstName: 'Jane' }), // missing lastName
    }) as any;
    const res = await POST(req);
    expect((res as any).status).toBe(400);
  });

  it('creates contact with organizationId from session', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts', {
      method: 'POST',
      body: JSON.stringify({ firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }),
    }) as any;
    const res = await POST(req);
    const body = await (res as any).json();
    expect(body.success).toBe(true);
    expect(prisma.contact.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ organizationId: 'org_1' }),
      })
    );
  });

  it('returns 201 on successful creation', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts', {
      method: 'POST',
      body: JSON.stringify({ firstName: 'Jane', lastName: 'Doe' }),
    }) as any;
    const res = await POST(req);
    expect((res as any).status).toBe(201);
  });

  it('validates unit ownership when unitIds provided', async () => {
    (prisma.unit.findMany as jest.Mock).mockResolvedValue([{ id: 'unit_1' }]);
    const req = new NextRequest('http://localhost/api/crm/contacts', {
      method: 'POST',
      body: JSON.stringify({ firstName: 'Jane', lastName: 'Doe', unitIds: ['unit_1'] }),
    }) as any;
    await POST(req);
    // Unit lookup scoped to same orgId
    expect(prisma.unit.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: 'org_1' }),
      })
    );
  });
});
