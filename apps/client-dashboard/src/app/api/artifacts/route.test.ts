/**
 * Artifacts API tests — org scoping, cross-org denial.
 */

// Mock NextRequest to support request.json() in tests
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
    scanAttachment: { create: jest.fn() },
    scanLog: { findFirst: jest.fn() },
    incident: { findFirst: jest.fn() },
  },
}));

const VALID_CUID = 'cjld2cyuq0000t3rmniod1foy';

function mockRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/artifacts', {
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
    permissions: { 'gates:manage': true },
  });
  mockHasPermission.mockReturnValue(true);
});

describe('POST /api/artifacts', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);

    const res = await POST(mockRequest({ scanLogId: VALID_CUID, type: 'id_front', contentBase64: 'base64data' }));
    expect(res.status).toBe(401);
    expect(prisma.scanAttachment.create).not.toHaveBeenCalled();
  });

  it('returns 403 when user lacks gates:manage', async () => {
    mockHasPermission.mockReturnValue(false);

    const res = await POST(mockRequest({ scanLogId: VALID_CUID, type: 'id_front', contentBase64: 'base64data' }));
    expect(res.status).toBe(403);
  });

  it('returns 400 when neither scanLogId nor incidentId provided', async () => {
    const res = await POST(mockRequest({ type: 'id_front', contentBase64: 'data' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when scan belongs to another org', async () => {
    (prisma.scanLog.findFirst as jest.Mock).mockResolvedValue({
      id: VALID_CUID,
      gate: { organizationId: 'other-org' },
    });

    const res = await POST(mockRequest({ scanLogId: VALID_CUID, type: 'id_front', contentBase64: 'data' }));
    expect(res.status).toBe(404);
    expect(prisma.scanAttachment.create).not.toHaveBeenCalled();
  });

  it('creates attachment and returns 201 when scan belongs to same org', async () => {
    (prisma.scanLog.findFirst as jest.Mock).mockResolvedValue({
      id: VALID_CUID,
      gate: { organizationId: 'org-1' },
    });
    (prisma.scanAttachment.create as jest.Mock).mockResolvedValue({
      id: 'att-1',
      type: 'id_front',
      scanLogId: VALID_CUID,
      incidentId: null,
      createdAt: new Date(),
    });

    const res = await POST(mockRequest({ scanLogId: VALID_CUID, type: 'id_front', contentBase64: 'data' }));
    expect(res.status).toBe(201);
    expect(prisma.scanAttachment.create).toHaveBeenCalledWith({
      data: {
        organizationId: 'org-1',
        scanLogId: VALID_CUID,
        incidentId: null,
        type: 'id_front',
        contentBase64: 'data',
      },
      select: expect.any(Object),
    });
  });
});
