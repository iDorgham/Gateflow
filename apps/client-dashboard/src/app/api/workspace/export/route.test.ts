/**
 * Workspace export API tests — auth, permissions, and basic payload.
 */

// Mock NextRequest to support query params in tests
jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    init: { body?: string };

    constructor(url: string, init?: { body?: string; headers?: Record<string, string> }) {
      this.url = url;
      this.init = init ?? {};
    }

    // For this route we never call request.json(), but keep parity with other tests.
    async json() {
      return JSON.parse(this.init.body ?? '{}');
    }
  }
  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
        headers: new Map(),
      }),
    },
  };
});

import { GET } from './route';
import { prisma } from '@gate-access/db';
import { NextRequest } from 'next/server';

const mockGetSessionClaims = jest.fn();
const mockHasPermission = jest.fn();

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));
jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: { findFirst: jest.fn() },
    project: { findMany: jest.fn() },
    gate: { findMany: jest.fn() },
    unit: { findMany: jest.fn() },
    contact: { findMany: jest.fn() },
    contactUnit: { findMany: jest.fn() },
    qRCode: { findMany: jest.fn() },
    scanLog: { findMany: jest.fn() },
    role: { findMany: jest.fn() },
    tag: { findMany: jest.fn() },
    residentLimit: { findMany: jest.fn() },
  },
}));

function mockRequest(url: string): NextRequest {
  return new NextRequest(url, {
    method: 'GET',
  }) as NextRequest;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionClaims.mockResolvedValue({
    orgId: 'org-1',
    sub: 'user-1',
    permissions: { 'workspace:manage': true },
  });
  mockHasPermission.mockReturnValue(true);

  (prisma.organization.findFirst as jest.Mock).mockResolvedValue({
    id: 'org-1',
    name: 'Test Org',
    email: 'test@example.com',
    deletedAt: null,
  });
  (prisma.project.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.gate.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.unit.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.contact.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.contactUnit.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.qRCode.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.scanLog.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.role.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.tag.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.residentLimit.findMany as jest.Mock).mockResolvedValue([]);
});

describe('GET /api/workspace/export', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);

    const res = await GET(mockRequest('http://localhost/api/workspace/export'));
    expect(res.status).toBe(401);
  });

  it('returns 403 when user lacks workspace:manage', async () => {
    mockHasPermission.mockReturnValue(false);

    const res = await GET(mockRequest('http://localhost/api/workspace/export'));
    expect(res.status).toBe(403);
  });

  it('returns 200 and JSON attachment when authorized', async () => {
    const res = await GET(
      mockRequest('http://localhost/api/workspace/export?scope=organization')
    );

    expect(res.status).toBe(200);
    // Our NextResponse mock exposes headers as a Map; ensure manifest is present.
    const body = (await res.json()) as { manifest: { organizationId: string } };
    expect(body.manifest.organizationId).toBe('org-1');
  });
});

