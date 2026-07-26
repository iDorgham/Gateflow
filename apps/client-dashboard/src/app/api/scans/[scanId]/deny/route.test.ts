export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    private readonly body: string;

    constructor(_url: string, init?: { body?: string }) {
      this.body = init?.body ?? '{}';
    }

    async json() {
      return JSON.parse(this.body);
    }
  }

  class MockNextResponse {
    status: number;
    private readonly body: unknown;

    constructor(body: unknown, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }

    async json() {
      return this.body;
    }

    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }
  }

  return { NextRequest: MockNextRequest, NextResponse: MockNextResponse };
});

const mockRequireAuth = jest.fn();
jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (value: unknown) =>
    Boolean(value && typeof value === 'object' && 'status' in value),
}));

const mockScanLogFindFirst = jest.fn();
const mockScanLogUpdate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    scanLog: {
      findFirst: (...args: unknown[]) => mockScanLogFindFirst(...args),
      update: (...args: unknown[]) => mockScanLogUpdate(...args),
    },
  },
  Prisma: {},
}));

const mockHasPermission = jest.fn();
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));

const mockCheckGateAssignment = jest.fn();
jest.mock('@/lib/gate-assignment', () => ({
  checkGateAssignment: (...args: unknown[]) => mockCheckGateAssignment(...args),
}));

import { NextRequest } from 'next/server';
import { POST } from './route';

const makeRequest = () =>
  new NextRequest('http://localhost/api/scans/scan_1/deny', {
    body: JSON.stringify({ reason: 'operator_denied' }),
  } as never);

const params = { params: Promise.resolve({ scanId: 'scan_1' }) };

describe('POST /api/scans/[scanId]/deny tenant isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScanLogFindFirst.mockResolvedValue({
      id: 'scan_1',
      gateId: 'gate_1',
      status: 'SUCCESS',
      auditTrail: [],
      qrCode: { organizationId: 'org_1' },
    });
    mockScanLogUpdate.mockResolvedValue({ id: 'scan_1' });
    mockHasPermission.mockReturnValue(true);
    mockCheckGateAssignment.mockResolvedValue(null);
  });

  it('rejects an authenticated identity without organization context', async () => {
    mockRequireAuth.mockResolvedValue({ sub: 'platform_user', orgId: null });

    const response = await POST(makeRequest(), params);

    expect(response.status).toBe(403);
    expect(mockScanLogFindFirst).not.toHaveBeenCalled();
    expect(mockScanLogUpdate).not.toHaveBeenCalled();
  });

  it('rejects a scan owned by another organization', async () => {
    mockRequireAuth.mockResolvedValue({ sub: 'operator_1', orgId: 'org_2' });
    mockScanLogFindFirst.mockResolvedValue(null);

    const response = await POST(makeRequest(), params);

    expect(response.status).toBe(404);
    expect(mockScanLogUpdate).not.toHaveBeenCalled();
  });

  it('requires scan override permission', async () => {
    mockRequireAuth.mockResolvedValue({ sub: 'operator_1', orgId: 'org_1' });
    mockHasPermission.mockReturnValue(false);

    const response = await POST(makeRequest(), params);

    expect(response.status).toBe(403);
    expect(mockScanLogFindFirst).not.toHaveBeenCalled();
    expect(mockScanLogUpdate).not.toHaveBeenCalled();
  });

  it('updates a scan owned by the authenticated organization', async () => {
    mockRequireAuth.mockResolvedValue({ sub: 'operator_1', orgId: 'org_1' });

    const response = await POST(makeRequest(), params);

    expect(response.status).toBe(200);
    expect(mockScanLogFindFirst).toHaveBeenCalledWith({
      where: {
        id: 'scan_1',
        qrCode: { organizationId: 'org_1' },
      },
      include: { qrCode: { select: { organizationId: true } } },
    });
    expect(mockCheckGateAssignment).toHaveBeenCalledWith(
      expect.objectContaining({ orgId: 'org_1' }),
      'gate_1'
    );
    expect(mockScanLogUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'scan_1' } })
    );
  });
});
