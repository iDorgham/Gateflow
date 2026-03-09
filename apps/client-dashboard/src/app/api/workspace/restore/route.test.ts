/**
 * Workspace restore API tests — auth, permissions, and org scoping.
 */

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    init: { body?: string };

    constructor(url: string, init?: { body?: string; headers?: Record<string, string> }) {
      this.url = url;
      this.init = init ?? {};
    }

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

import { POST } from './route';
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
    $transaction: jest.fn((fn: (tx: unknown) => Promise<unknown>) =>
      fn({
        project: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        gate: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        unit: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        contact: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        contactUnit: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        qRCode: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        scanLog: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        role: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        tag: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        residentLimit: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
      })
    ),
  },
}));

function mockRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/workspace/restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
    deletedAt: null,
  });
});

describe('POST /api/workspace/restore', () => {
  const basePayload = {
    manifest: {
      version: 1,
      organizationId: 'org-1',
      scope: 'organization',
      projectIds: [],
      dateFrom: null,
      dateTo: null,
    },
    projects: [],
    gates: [],
    units: [],
    contacts: [],
    contactUnits: [],
    qrCodes: [],
    scanLogs: [],
    roles: [],
    tags: [],
    residentLimits: [],
  };

  it('returns 401 when unauthenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);

    const res = await POST(mockRequest(basePayload));
    expect(res.status).toBe(401);
  });

  it('returns 403 when user lacks workspace:manage', async () => {
    mockHasPermission.mockReturnValue(false);

    const res = await POST(mockRequest(basePayload));
    expect(res.status).toBe(403);
  });

  it('rejects backups from a different organization', async () => {
    const payload = {
      ...basePayload,
      manifest: { ...basePayload.manifest, organizationId: 'other-org' },
    };

    const res = await POST(mockRequest(payload));
    expect(res.status).toBe(400);
  });

  it('restores backup successfully for matching organization', async () => {
    const res = await POST(mockRequest(basePayload));
    expect(res.status).toBe(200);

    const body = (await res.json()) as { success: boolean };
    expect(body.success).toBe(true);
  });
});

