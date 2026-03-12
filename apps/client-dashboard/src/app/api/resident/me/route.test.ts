export {};

// ── Mock next/server ──────────────────────────────────────────────────────────
jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    constructor(url: string) { this.url = url; }
  }
  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
        _body: body,
      }),
    },
  };
});

// ── Mock auth ─────────────────────────────────────────────────────────────────
const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

// ── Mock db ───────────────────────────────────────────────────────────────────
const mockUnitFindMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    unit: { findMany: (...args: unknown[]) => mockUnitFindMany(...args) },
  },
}));

// ── Mock quota ────────────────────────────────────────────────────────────────
const mockCheckAndConsumeQuota = jest.fn();
jest.mock('@gate-access/db/quota', () => ({
  checkAndConsumeQuota: (...args: unknown[]) => mockCheckAndConsumeQuota(...args),
}));

import { GET } from './route';
import { NextRequest } from 'next/server';

const makeReq = () => new (NextRequest as any)('http://localhost/api/resident/me');

beforeEach(() => {
  jest.clearAllMocks();
  mockCheckAndConsumeQuota.mockResolvedValue({
    allowed: true, used: 2, remaining: 8, quota: 10,
    resetDate: new Date('2026-03-31'),
  });
});

describe('GET /api/resident/me', () => {
  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it('returns 404 when resident has no linked unit', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mockUnitFindMany.mockResolvedValue([]);
    const res = await GET(makeReq());
    expect(res.status).toBe(404);
  });

  it('returns unit with quota for authenticated resident', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mockUnitFindMany.mockResolvedValue([{
      id: 'unit1', name: 'A101', type: 'TWO_BR', building: 'Tower A',
      lat: 25.2, lng: 55.3, isActive: true,
      project: { id: 'proj1', name: 'Palm Hills', location: 'Cairo' },
      createdAt: new Date(),
    }]);

    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('unit1');
    expect(body.data[0].quotaUsed).toBe(2);
    expect(body.data[0].quotaLimit).toBe(10);
    expect(body.data[0].lat).toBe(25.2);
    expect(body.data[0].lng).toBe(55.3);
  });
});
