export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    constructor(url: string) {
      this.url = url;
    }
  }
  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  };
});

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

const mockServiceFindMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    service: { findMany: (...args: unknown[]) => mockServiceFindMany(...args) },
  },
}));

import { GET } from './route';
import { NextRequest } from 'next/server';

const makeGetReq = () =>
  new (NextRequest as any)('http://localhost/api/marketplace/services');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/marketplace/services', () => {
  it('returns 401 when missing orgId', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1' });
    const res = await GET(makeGetReq());
    expect(res.status).toBe(401);
  });

  it('returns org-scoped services with active merchant', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });
    mockServiceFindMany.mockResolvedValue([
      {
        id: 's1',
        name: 'Cleaning',
        description: 'Weekly cleaning',
        category: 'CLEANING',
        priceCents: 2500,
        currency: 'USD',
        durationMins: 60,
        merchant: { id: 'm1', name: 'Sparkle Co' },
      },
    ]);

    const res = await GET(makeGetReq());
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({
      id: 's1',
      name: 'Cleaning',
      priceCents: 2500,
      merchant: { id: 'm1', name: 'Sparkle Co' },
    });

    const callArg = mockServiceFindMany.mock.calls[0][0];
    expect(callArg.where.organizationId).toBe('org1');
    expect(callArg.where.deletedAt).toBeNull();
    expect(callArg.where.isActive).toBe(true);
    expect(callArg.where.merchant.deletedAt).toBeNull();
    expect(callArg.where.merchant.isActive).toBe(true);
  });
});
