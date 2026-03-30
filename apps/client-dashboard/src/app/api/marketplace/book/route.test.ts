export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    bodyJson: any;
    constructor(url: string, init?: { body?: any }) {
      this.url = url;
      this.bodyJson = init?.body;
    }
    async json() {
      return this.bodyJson;
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

const mockUnitFindFirst = jest.fn();
const mockServiceFindFirst = jest.fn();
const mockServiceBookingCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  ServiceBookingStatus: {
    PENDING: 'PENDING',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED',
  },
  prisma: {
    unit: { findFirst: (...args: unknown[]) => mockUnitFindFirst(...args) },
    service: {
      findFirst: (...args: unknown[]) => mockServiceFindFirst(...args),
    },
    serviceBooking: {
      create: (...args: unknown[]) => mockServiceBookingCreate(...args),
    },
  },
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

function makePostReq(body: any) {
  return new (NextRequest as any)('http://localhost/api/marketplace/book', {
    body,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/marketplace/book', () => {
  it('returns 401 when missing session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makePostReq({ serviceId: 's1' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 on validation failure', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });
    const res = await POST(makePostReq({}));
    expect(res.status).toBe(400);
  });

  it('returns 404 when resident unit is missing', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });
    mockUnitFindFirst.mockResolvedValue(null);

    const res = await POST(makePostReq({ serviceId: 's1' }));
    expect(res.status).toBe(404);
    expect(mockServiceFindFirst).not.toHaveBeenCalled();
  });

  it('returns 404 when service is missing', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });
    mockUnitFindFirst.mockResolvedValue({ id: 'unit1' });
    mockServiceFindFirst.mockResolvedValue(null);

    const res = await POST(makePostReq({ serviceId: 's1' }));
    expect(res.status).toBe(404);
    expect(mockServiceBookingCreate).not.toHaveBeenCalled();
  });

  it('creates a PAID booking (org-scoped)', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });
    mockUnitFindFirst.mockResolvedValue({ id: 'unit1' });
    mockServiceFindFirst.mockResolvedValue({
      id: 's1',
      priceCents: 2500,
      currency: 'USD',
    });
    mockServiceBookingCreate.mockResolvedValue({
      id: 'b1',
      status: 'PAID',
      priceCents: 2500,
      currency: 'USD',
      createdAt: new Date('2026-03-30T10:00:00Z'),
    });

    const res = await POST(makePostReq({ serviceId: 's1' }));
    expect(res.status).toBe(200);

    const callArg = mockServiceBookingCreate.mock.calls[0][0];
    expect(callArg.data.organizationId).toBe('org1');
    expect(callArg.data.unitId).toBe('unit1');
    expect(callArg.data.userId).toBe('u1');
    expect(callArg.data.serviceId).toBe('s1');
    expect(callArg.data.status).toBe('PAID');
    expect(callArg.data.priceCents).toBe(2500);
    expect(callArg.data.currency).toBe('USD');

    const unitWhere = mockUnitFindFirst.mock.calls[0][0].where;
    expect(unitWhere.organizationId).toBe('org1');
    expect(unitWhere.deletedAt).toBeNull();
    expect(unitWhere.isActive).toBe(true);
  });
});
