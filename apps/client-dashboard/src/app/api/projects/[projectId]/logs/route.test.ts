export {};

/**
 * Tests for GET /api/projects/[projectId]/logs
 * Phase 6: project-scoped scan log feed (live logs)
 */

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    constructor(url: string) { this.url = url; }
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
    scanLog: {
      findMany: jest.fn(),
    },
  },
}));

import { GET } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

const mockClaims = { orgId: 'org_1', sub: 'user_1', role: 'MANAGER' };

const mockLog = {
  id: 'log_1',
  scannedAt: new Date('2026-01-01T12:00:00Z'),
  status: 'SUCCESS',
  gate: { id: 'gate_1', name: 'Main Gate' },
  qrCode: { id: 'qr_1', code: 'abc123', guestName: 'John Doe', guestEmail: null },
  user: { id: 'user_1', name: 'Guard A' },
};

describe('GET /api/projects/[projectId]/logs', () => {
  beforeEach(() => {
    (getSessionClaims as jest.Mock).mockResolvedValue(mockClaims);
    (prisma.scanLog.findMany as jest.Mock).mockResolvedValue([mockLog]);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/projects/proj_1/logs') as any;
    const res = await GET(req, { params: { projectId: 'proj_1' } });
    expect((res as any).status).toBe(401);
  });

  it('scopes logs to project and org (no cross-org leaks)', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/logs') as any;
    await GET(req, { params: { projectId: 'proj_1' } });
    expect(prisma.scanLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          gate: {
            projectId: 'proj_1',
            organizationId: 'org_1',
          },
        },
      })
    );
  });

  it('returns paginated logs with success response', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/logs?limit=20') as any;
    const res = await GET(req, { params: { projectId: 'proj_1' } });
    const body = await (res as any).json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('log_1');
  });

  it('includes nextCursor when result equals limit', async () => {
    const logs = Array.from({ length: 50 }, (_, i) => ({ ...mockLog, id: `log_${i}` }));
    (prisma.scanLog.findMany as jest.Mock).mockResolvedValue(logs);
    const req = new NextRequest('http://localhost/api/projects/proj_1/logs?limit=50') as any;
    const res = await GET(req, { params: { projectId: 'proj_1' } });
    const body = await (res as any).json();
    expect(body.nextCursor).toBe('log_49');
  });

  it('returns null nextCursor when result is fewer than limit', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/logs?limit=50') as any;
    const res = await GET(req, { params: { projectId: 'proj_1' } });
    const body = await (res as any).json();
    expect(body.nextCursor).toBeNull();
  });

  it('respects custom limit parameter (max 100)', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/logs?limit=200') as any;
    await GET(req, { params: { projectId: 'proj_1' } });
    expect(prisma.scanLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }) // capped at 100
    );
  });

  it('orders logs by scannedAt descending (most recent first)', async () => {
    const req = new NextRequest('http://localhost/api/projects/proj_1/logs') as any;
    await GET(req, { params: { projectId: 'proj_1' } });
    expect(prisma.scanLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { scannedAt: 'desc' } })
    );
  });
});
