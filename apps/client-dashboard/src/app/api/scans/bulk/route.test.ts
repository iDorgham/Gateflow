jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    init: any;

    constructor(url: string, init: any) {
      this.url = url;
      this.init = init;
    }

    async json() {
      return JSON.parse(this.init.body);
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: any, init?: any) => ({
        status: init?.status || 200,
        json: async () => body,
        headers: new Map(Object.entries(init?.headers || {})),
      }),
    },
  };
});

/**
 * Unit tests for POST /api/scans/bulk (Integration with processBulkScans)
 */

process.env.NEXTAUTH_SECRET = 'test-jwt-secret-must-be-long-enough-for-hmac256';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRequireAuth = jest.fn();
const mockCheckRateLimit = jest.fn();
const mockProcessBulkScans = jest.fn();

jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (v: unknown): boolean => {
    if (v === null || typeof v !== 'object') return false;
    const obj = v as { status?: unknown; json?: unknown };
    return typeof obj.status === 'number' && typeof obj.json === 'function';
  },
}));

jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    $transaction: (fn: (tx: unknown) => Promise<unknown>) => fn('mockTx'),
  },
}));

jest.mock('@gate-access/types', () => jest.requireActual('@gate-access/types'));

jest.mock('@/lib/scans/bulk-sync', () => ({
  processBulkScans: (...args: unknown[]) => mockProcessBulkScans(...args),
}));

const mockOrgHasAssignments = jest.fn();
const mockGetUserAssignedGateIds = jest.fn();
jest.mock('@/lib/gate-assignment', () => ({
  orgHasAssignments: (...args: unknown[]) => mockOrgHasAssignments(...args),
  getUserAssignedGateIds: (...args: unknown[]) => mockGetUserAssignedGateIds(...args),
}));

import { NextRequest, NextResponse } from 'next/server';

const AUTH_CLAIMS = { sub: 'user_1', email: 'test@test.com', orgId: 'org_1', role: 'TENANT_USER' };

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/scans/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    body: JSON.stringify(body),
  });
}

function makeScan(overrides: Record<string, unknown> = {}) {
  return {
    id: 'local_id_1',
    scanUuid: '550e8400-e29b-41d4-a716-446655440000',
    qrCode: 'gateflow:1:testpayload.sig',
    gateId: 'gate_1',
    scannedAt: new Date().toISOString(),
    status: 'SUCCESS',
    retryCount: 0,
    ...overrides,
  };
}

let POST: (req: NextRequest) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('./route');
  POST = mod.POST;
});

beforeEach(() => {
  jest.clearAllMocks();
  mockRequireAuth.mockResolvedValue(AUTH_CLAIMS);
  mockCheckRateLimit.mockResolvedValue({ allowed: true, limit: 30, remaining: 29, retryAfterMs: 0 });
  mockProcessBulkScans.mockResolvedValue({ synced: [], conflicted: [], failed: [] });
  mockOrgHasAssignments.mockResolvedValue(false); // no assignments by default
});

describe('POST /api/scans/bulk', () => {
  it('returns 401 when not authenticated', async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    );
    const res = await POST(makeRequest({ scans: [] }));
    expect(res.status).toBe(401);
  });

  it('returns 400 for an invalid request body', async () => {
    const res = await POST(makeRequest({ scans: 'not-an-array' }));
    expect(res.status).toBe(400);
  });

  it('returns 429 when rate-limited', async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: false, limit: 30, remaining: 0, retryAfterMs: 30000 });
    const res = await POST(makeRequest({ scans: [] }));
    expect(res.status).toBe(429);
  });

  it('calls processBulkScans and returns result', async () => {
    mockProcessBulkScans.mockResolvedValue({
      synced: ['local_id_1'],
      conflicted: [{ id: 'local_id_2', reason: 'foo' }],
      failed: [],
    });

    const res = await POST(makeRequest({
      scans: [makeScan({ id: 'local_id_1' }), makeScan({ id: 'local_id_2' })]
    }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(mockProcessBulkScans).toHaveBeenCalledWith(expect.any(Array), 'mockTx');
    expect(data.data.synced).toContain('local_id_1');
    expect(data.data.conflicted[0].id).toBe('local_id_2');
  });

  it('returns 403 when org has assignments and user scans at unassigned gate', async () => {
    mockOrgHasAssignments.mockResolvedValue(true);
    mockGetUserAssignedGateIds.mockResolvedValue(new Set(['gate_1']));
    const res = await POST(makeRequest({
      scans: [makeScan({ gateId: 'gate_1' }), makeScan({ gateId: 'gate_2' })]
    }));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.message).toMatch(/not allowed to scan at one or more gates/);
    expect(data.unassignedGateIds).toContain('gate_2');
    expect(mockProcessBulkScans).not.toHaveBeenCalled();
  });
});
