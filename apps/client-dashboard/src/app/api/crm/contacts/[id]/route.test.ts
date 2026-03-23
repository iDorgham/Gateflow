export {};

/**
 * Tests for PATCH/DELETE /api/crm/contacts/[id]
 * Phase 5: soft delete + org-scoped update
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

jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: jest.fn().mockResolvedValue(undefined),
  EventType: { CONTACT_UPDATED: 'CONTACT_UPDATED' },
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    contact: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    contactUnit: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    unit: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import { PATCH, DELETE } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

const mockClaims = { orgId: 'org_1', sub: 'user_1', role: 'MANAGER' };
const mockContact = {
  id: 'contact_1',
  firstName: 'Jane',
  lastName: 'Doe',
  organizationId: 'org_1',
  deletedAt: null,
  units: [],
};

describe('PATCH /api/crm/contacts/[id]', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.contact.findFirst as jest.Mock).mockResolvedValue(mockContact);
    (prisma.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      const tx = {
        contactUnit: { deleteMany: jest.fn(), createMany: jest.fn() },
        unit: { findMany: jest.fn().mockResolvedValue([]) },
        contact: { update: jest.fn().mockResolvedValue({ ...mockContact, jobTitle: 'Director', units: [] }) },
      };
      return fn(tx);
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_1', {
      body: JSON.stringify({ jobTitle: 'Director' }),
    }) as any;
    const res = await PATCH(req, { params: Promise.resolve({ id: 'contact_1' }) });
    expect((res as any).status).toBe(401);
  });

  it('returns 404 when contact not found in org', async () => {
    (prisma.contact.findFirst as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_x', {
      body: JSON.stringify({ jobTitle: 'Director' }),
    }) as any;
    const res = await PATCH(req, { params: Promise.resolve({ id: 'contact_x' }) });
    expect((res as any).status).toBe(404);
  });

  it('scopes findFirst to organizationId (prevents cross-org update)', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_1', {
      body: JSON.stringify({ jobTitle: 'Director' }),
    }) as any;
    await PATCH(req, { params: Promise.resolve({ id: 'contact_1' }) });
    expect(prisma.contact.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: 'org_1' }),
      })
    );
  });

  it('updates contact fields successfully', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_1', {
      body: JSON.stringify({ jobTitle: 'Director' }),
    }) as any;
    const res = await PATCH(req, { params: Promise.resolve({ id: 'contact_1' }) });
    const body = await (res as any).json();
    expect(body.success).toBe(true);
  });
});

describe('DELETE /api/crm/contacts/[id]', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.contact.findFirst as jest.Mock).mockResolvedValue(mockContact);
    (prisma.contact.update as jest.Mock).mockResolvedValue({ ...mockContact, deletedAt: new Date() });
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_1') as any;
    const res = await DELETE(req, { params: Promise.resolve({ id: 'contact_1' }) });
    expect((res as any).status).toBe(401);
  });

  it('returns 404 when contact not found', async () => {
    (prisma.contact.findFirst as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_x') as any;
    const res = await DELETE(req, { params: Promise.resolve({ id: 'contact_x' }) });
    expect((res as any).status).toBe(404);
  });

  it('performs soft delete (sets deletedAt, does not hard delete)', async () => {
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_1') as any;
    const res = await DELETE(req, { params: Promise.resolve({ id: 'contact_1' }) });
    expect(prisma.contact.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'contact_1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      })
    );
    const body = await (res as any).json();
    expect(body.success).toBe(true);
  });

  it('prevents deleting contact from another org', async () => {
    (prisma.contact.findFirst as jest.Mock).mockResolvedValue(null); // org check fails
    const req = new NextRequest('http://localhost/api/crm/contacts/contact_other') as any;
    const res = await DELETE(req, { params: Promise.resolve({ id: 'contact_other' }) });
    expect((res as any).status).toBe(404);
    expect(prisma.contact.update).not.toHaveBeenCalled();
  });
});
