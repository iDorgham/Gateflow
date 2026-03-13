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

const mockUnitFindMany = jest.fn();
const mockScanLogFindMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    unit: { findMany: (...args: unknown[]) => mockUnitFindMany(...args) },
    scanLog: { findMany: (...args: unknown[]) => mockScanLogFindMany(...args) },
  },
}));

import { GET } from './route';
import { NextRequest } from 'next/server';

const makeGetReq = (search = '') =>
  new (NextRequest as any)(`http://localhost/api/resident/history${search}`);

beforeEach(() => {
  jest.clearAllMocks();
  mockUnitFindMany.mockResolvedValue([{ id: 'unit1' }]);
  mockScanLogFindMany.mockResolvedValue([]);
});

describe('GET /api/resident/history', () => {
  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET(makeGetReq());
    expect(res.status).toBe(401);
  });

  it('returns empty array when resident has no units', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mockUnitFindMany.mockResolvedValue([]);
    const res = await GET(makeGetReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  it('returns scan history for resident units', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mockUnitFindMany.mockResolvedValue([{ id: 'unit1' }]);
    mockScanLogFindMany.mockResolvedValue([
      {
        id: 'scan1',
        status: 'SUCCESS',
        scannedAt: new Date('2026-03-01T10:00:00Z'),
        gate: { name: 'Main Gate' },
        qrCode: { visitorQR: { visitorName: 'Ahmed' } },
      },
    ]);
    const res = await GET(makeGetReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].visitorName).toBe('Ahmed');
    expect(body.data[0].gateName).toBe('Main Gate');
    expect(body.data[0].status).toBe('SUCCESS');
  });

  it('uses "Open Access QR" as visitor name when visitorQR is null', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mockScanLogFindMany.mockResolvedValue([
      {
        id: 'scan2',
        status: 'SUCCESS',
        scannedAt: new Date('2026-03-01T11:00:00Z'),
        gate: { name: 'Side Gate' },
        qrCode: { visitorQR: null },
      },
    ]);
    const res = await GET(makeGetReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data[0].visitorName).toBe('Open Access QR');
  });

  it('passes date range params to query', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    await GET(makeGetReq('?from=2026-03-01&to=2026-03-31'));
    const call = mockScanLogFindMany.mock.calls[0][0];
    expect(call.where.scannedAt).toBeDefined();
    expect(call.where.scannedAt.gte).toBeInstanceOf(Date);
    expect(call.where.scannedAt.lte).toBeInstanceOf(Date);
  });
});
