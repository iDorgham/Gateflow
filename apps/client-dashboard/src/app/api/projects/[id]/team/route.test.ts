export {};

/**
 * Tests for GET/POST /api/projects/[id]/team
 * Phase 6: gate assignment with startTime/endTime window + org scoping
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
    gateAssignment: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    gate: {
      findFirst: jest.fn(),
    },
  },
}));

import { GET, POST } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

const mockClaims = { orgId: 'org_1', sub: 'user_1', role: 'MANAGER' };
const mockGate = { id: 'gate_1', name: 'Main Gate', projectId: 'proj_1', organizationId: 'org_1' };
const mockAssignment = {
  id: 'assign_1',
  userId: 'user_1',
  gateId: 'gate_1',
  organizationId: 'org_1',
  startTime: null,
  endTime: null,
  shiftStart: '08:00',
  shiftEnd: '20:00',
  deletedAt: null,
  user: { id: 'user_1', name: 'Guard A', email: 'guard@example.com', avatarUrl: null },
  gate: { id: 'gate_1', name: 'Main Gate' },
};

describe('GET /api/projects/[id]/team', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.gateAssignment.findMany as jest.Mock).mockResolvedValue([mockAssignment]);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/projects/proj_1/team') as any;
    const res = await GET(req, { params: { id: 'proj_1' } });
    expect((res as any).status).toBe(401);
  });

  it('scopes assignments to project and org', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/team') as any;
    await GET(req, { params: { id: 'proj_1' } });
    expect(prisma.gateAssignment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          organizationId: 'org_1',
          gate: { projectId: 'proj_1' },
          deletedAt: null,
        }),
      })
    );
  });

  it('returns team assignments with user and gate data', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/team') as any;
    const res = await GET(req, { params: { id: 'proj_1' } });
    const body = await (res as any).json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].user.name).toBe('Guard A');
  });

  it('excludes soft-deleted assignments', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/team') as any;
    await GET(req, { params: { id: 'proj_1' } });
    const call = (prisma.gateAssignment.findMany as jest.Mock).mock.calls[0][0];
    expect(call.where.deletedAt).toBe(null);
  });
});

describe('POST /api/projects/[id]/team', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.gate.findFirst as jest.Mock).mockResolvedValue(mockGate);
    (prisma.gateAssignment.upsert as jest.Mock).mockResolvedValue(mockAssignment);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/projects/proj_1/team', {
      body: JSON.stringify({ userId: 'user_1', gateId: 'gate_1' }),
    }) as any;
    const res = await POST(req, { params: { id: 'proj_1' } });
    expect((res as any).status).toBe(401);
  });

  it('returns 400 when gate does not belong to project/org', async () => {
    (prisma.gate.findFirst as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/projects/proj_1/team', {
      body: JSON.stringify({ userId: 'user_1', gateId: 'gate_other' }),
    }) as any;
    const res = await POST(req, { params: { id: 'proj_1' } });
    expect((res as any).status).toBe(400);
  });

  it('verifies gate ownership using org and projectId', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/team', {
      body: JSON.stringify({ userId: 'user_1', gateId: 'gate_1' }),
    }) as any;
    await POST(req, { params: { id: 'proj_1' } });
    expect(prisma.gate.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'gate_1', projectId: 'proj_1', organizationId: 'org_1' },
      })
    );
  });

  it('upserts assignment with organizationId from session', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/team', {
      body: JSON.stringify({ userId: 'user_1', gateId: 'gate_1' }),
    }) as any;
    await POST(req, { params: { id: 'proj_1' } });
    expect(prisma.gateAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ organizationId: 'org_1' }),
      })
    );
  });

  it('stores startTime and endTime for time-windowed assignments', async () => {
    const startTime = '2026-04-01T08:00:00Z';
    const endTime = '2026-04-30T20:00:00Z';
    const req = new NextRequest('http://localhost/api/projects/proj_1/team', {
      body: JSON.stringify({ userId: 'user_1', gateId: 'gate_1', startTime, endTime }),
    }) as any;
    await POST(req, { params: { id: 'proj_1' } });
    expect(prisma.gateAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        }),
      })
    );
  });

  it('returns the upserted assignment on success', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/team', {
      body: JSON.stringify({ userId: 'user_1', gateId: 'gate_1' }),
    }) as any;
    const res = await POST(req, { params: { id: 'proj_1' } });
    const body = await (res as any).json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('assign_1');
  });
});
