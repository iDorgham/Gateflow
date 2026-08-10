/**
 * Workspace restore API tests — auth, permissions, and org scoping.
 */

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    init: { body?: string };

    constructor(
      url: string,
      init?: { body?: string; headers?: Record<string, string> }
    ) {
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
// scopedIdSet() resolves claimed FKs via tx.<model>.findMany, scoped to the
// caller's org — defaults to resolving nothing, so a test that doesn't
// override these exercises the "claimed FK belongs to another org" path.
const mockTxProjectFindMany = jest.fn().mockResolvedValue([]);
const mockTxGateFindMany = jest.fn().mockResolvedValue([]);
const mockTxUnitFindMany = jest.fn().mockResolvedValue([]);
const mockTxContactFindMany = jest.fn().mockResolvedValue([]);
const mockTxQrCodeFindMany = jest.fn().mockResolvedValue([]);

const mockTxGateCreateMany = jest.fn().mockResolvedValue({ count: 0 });
const mockTxUnitCreateMany = jest.fn().mockResolvedValue({ count: 0 });
const mockTxContactUnitCreateMany = jest.fn().mockResolvedValue({ count: 0 });
const mockTxQrCodeCreateMany = jest.fn().mockResolvedValue({ count: 0 });
const mockTxScanLogCreateMany = jest.fn().mockResolvedValue({ count: 0 });

jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: { findFirst: jest.fn() },
    $transaction: jest.fn((fn: (tx: unknown) => Promise<unknown>) =>
      fn({
        project: {
          createMany: jest.fn().mockResolvedValue({ count: 0 }),
          findMany: (...args: unknown[]) => mockTxProjectFindMany(...args),
        },
        gate: {
          createMany: (...args: unknown[]) => mockTxGateCreateMany(...args),
          findMany: (...args: unknown[]) => mockTxGateFindMany(...args),
        },
        unit: {
          createMany: (...args: unknown[]) => mockTxUnitCreateMany(...args),
          findMany: (...args: unknown[]) => mockTxUnitFindMany(...args),
        },
        contact: {
          createMany: jest.fn().mockResolvedValue({ count: 0 }),
          findMany: (...args: unknown[]) => mockTxContactFindMany(...args),
        },
        contactUnit: {
          createMany: (...args: unknown[]) =>
            mockTxContactUnitCreateMany(...args),
        },
        qRCode: {
          createMany: (...args: unknown[]) => mockTxQrCodeCreateMany(...args),
          findMany: (...args: unknown[]) => mockTxQrCodeFindMany(...args),
        },
        scanLog: {
          createMany: (...args: unknown[]) => mockTxScanLogCreateMany(...args),
        },
        role: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        tag: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        residentLimit: {
          createMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
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

  it('nulls or drops cross-org foreign keys instead of trusting a crafted backup payload', async () => {
    // None of these FKs resolve under the caller's org (the tx.*.findMany
    // mocks default to []), simulating a backup payload that claims IDs
    // belonging to a different tenant.
    const payload = {
      ...basePayload,
      gates: [{ id: 'g1', name: 'Gate 1', projectId: 'other-org-project' }],
      units: [
        {
          id: 'u1',
          name: 'Unit 1',
          projectId: 'other-org-project',
          userId: 'other-org-user',
        },
      ],
      contactUnits: [
        { contactId: 'other-org-contact', unitId: 'other-org-unit' },
      ],
      qrCodes: [
        {
          id: 'q1',
          code: 'QR1',
          gateId: 'other-org-gate',
          projectId: 'other-org-project',
          contactId: 'other-org-contact',
        },
      ],
      scanLogs: [
        {
          id: 's1',
          gateId: 'other-org-gate',
          qrCodeId: 'other-org-qr',
          userId: 'other-org-user',
          status: 'SUCCESS',
          scannedAt: new Date().toISOString(),
        },
      ],
    };

    const res = await POST(mockRequest(payload));
    expect(res.status).toBe(200);

    // gate.projectId: claimed project doesn't resolve under this org -> nulled
    expect(mockTxGateCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          id: 'g1',
          organizationId: 'org-1',
          projectId: null,
        }),
      ],
      skipDuplicates: true,
    });

    // unit.projectId nulled; unit.userId always stripped, even if it resolved
    expect(mockTxUnitCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          id: 'u1',
          organizationId: 'org-1',
          projectId: null,
          userId: undefined,
        }),
      ],
      skipDuplicates: true,
    });

    // qrCode: all three cross-entity FKs null out independently
    expect(mockTxQrCodeCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          id: 'q1',
          organizationId: 'org-1',
          gateId: null,
          projectId: null,
          contactId: null,
        }),
      ],
      skipDuplicates: true,
    });

    // contactUnit and scanLog: neither side of the FK resolves, so the
    // record is dropped entirely rather than inserted with a null/partial FK.
    expect(mockTxContactUnitCreateMany).not.toHaveBeenCalled();
    expect(mockTxScanLogCreateMany).not.toHaveBeenCalled();
  });
});
