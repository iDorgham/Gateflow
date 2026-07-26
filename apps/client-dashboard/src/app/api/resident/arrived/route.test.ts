export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    private _body: unknown;
    headers: { get: (name: string) => string | null };
    constructor(
      url: string,
      init?: { body?: string; headers?: Record<string, string> }
    ) {
      this.url = url;
      this._body = init?.body ? JSON.parse(init.body) : {};
      this.headers = {
        get: (name: string) =>
          init?.headers?.[name] ?? init?.headers?.[name.toLowerCase()] ?? null,
      };
    }
    async json() {
      return this._body;
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

const mockVisitorQRFindUnique = jest.fn();
const mockScanLogFindFirst = jest.fn();
const mockScanLogUpdateMany = jest.fn();
const mockCheckRateLimit = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    visitorQR: {
      findUnique: (...args: unknown[]) => mockVisitorQRFindUnique(...args),
    },
    scanLog: {
      findFirst: (...args: unknown[]) => mockScanLogFindFirst(...args),
      updateMany: (...args: unknown[]) => mockScanLogUpdateMany(...args),
    },
  },
}));
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

// Suppress Expo push fetch errors in tests
global.fetch = jest.fn().mockResolvedValue({ ok: true } as Response);

import { POST } from './route';
import { createArrivalCapability } from '@/lib/arrival-capability';
import { NextRequest } from 'next/server';

const SECRET = 'test-arrival-capability-secret-at-least-32-characters';
const capabilityFor = (visitorQRId: string) =>
  createArrivalCapability(visitorQRId, SECRET);
const makeReq = (body: object) =>
  new (NextRequest as any)('http://localhost/api/resident/arrived', {
    body: JSON.stringify(body),
    headers: { 'x-forwarded-for': '203.0.113.10' },
  });

const BASE_QR = {
  id: 'vqr1',
  visitorName: 'Ahmed',
  qrCode: { id: 'qr1' },
  unit: {
    user: {
      id: 'u1',
      preferences: {
        expoPushToken: 'ExponentPushToken[abc]',
        notifyArrival: true,
      },
    },
  },
};

const BASE_SCAN = {
  id: 'scan1',
  arrivalNotifiedAt: null,
  scannedAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.QR_SIGNING_SECRET = SECRET;
  mockVisitorQRFindUnique.mockResolvedValue(BASE_QR);
  mockScanLogFindFirst.mockResolvedValue(BASE_SCAN);
  mockScanLogUpdateMany.mockResolvedValue({ count: 1 });
  mockCheckRateLimit.mockResolvedValue({
    allowed: true,
    limit: 5,
    remaining: 4,
    retryAfterMs: 0,
  });
});

describe('POST /api/resident/arrived', () => {
  it('returns 400 when capability is missing', async () => {
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
  });

  it('returns 404 when visitorQR not found', async () => {
    mockVisitorQRFindUnique.mockResolvedValue(null);
    const res = await POST(makeReq({ capability: capabilityFor('missing') }));
    expect(res.status).toBe(404);
  });

  it('returns 409 when no successful scan exists', async () => {
    mockScanLogFindFirst.mockResolvedValue(null);
    const res = await POST(makeReq({ capability: capabilityFor('vqr1') }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.message).toContain('No successful scan');
  });

  it('returns 409 when already notified', async () => {
    mockScanLogFindFirst.mockResolvedValue({
      id: 'scan1',
      arrivalNotifiedAt: new Date(),
    });
    const res = await POST(makeReq({ capability: capabilityFor('vqr1') }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('already_notified');
  });

  it('marks scan log and returns 200', async () => {
    const res = await POST(makeReq({ capability: capabilityFor('vqr1') }));
    expect(res.status).toBe(200);
    expect(mockScanLogUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 'scan1',
          arrivalNotifiedAt: null,
          scannedAt: expect.objectContaining({ gte: expect.any(Date) }),
        }),
        data: expect.objectContaining({ arrivalNotifiedAt: expect.any(Date) }),
      })
    );
  });

  it('rejects a raw visitor QR ID without a signed capability', async () => {
    const res = await POST(makeReq({ visitorQRId: 'vqr1' }));

    expect(res.status).toBe(400);
    expect(mockVisitorQRFindUnique).not.toHaveBeenCalled();
  });

  it('rejects a capability whose visitor ID was tampered', async () => {
    const capability = capabilityFor('vqr1');
    const res = await POST(makeReq({ capability: `${capability}x` }));

    expect(res.status).toBe(401);
    expect(mockVisitorQRFindUnique).not.toHaveBeenCalled();
  });

  it('returns 429 before database access when rate limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      limit: 5,
      remaining: 0,
      retryAfterMs: 30_000,
    });

    const res = await POST(makeReq({ capability: capabilityFor('vqr1') }));

    expect(res.status).toBe(429);
    expect(mockVisitorQRFindUnique).not.toHaveBeenCalled();
  });

  it('requires a successful scan within the freshness window', async () => {
    mockScanLogFindFirst.mockResolvedValue(null);

    await POST(makeReq({ capability: capabilityFor('vqr1') }));

    expect(mockScanLogFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          scannedAt: expect.objectContaining({ gte: expect.any(Date) }),
        }),
      })
    );
  });

  it('uses an atomic claim and rejects a concurrent duplicate', async () => {
    mockScanLogUpdateMany.mockResolvedValue({ count: 0 });

    const res = await POST(makeReq({ capability: capabilityFor('vqr1') }));

    expect(res.status).toBe(409);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('skips push when notifyArrival is false', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true } as Response);
    mockVisitorQRFindUnique.mockResolvedValue({
      ...BASE_QR,
      unit: {
        user: {
          id: 'u1',
          preferences: {
            expoPushToken: 'ExponentPushToken[abc]',
            notifyArrival: false,
          },
        },
      },
    });
    const res = await POST(makeReq({ capability: capabilityFor('vqr1') }));
    expect(res.status).toBe(200);
    // Push fetch should not have been called with expo endpoint
    const expoCalls = fetchSpy.mock.calls.filter(
      ([url]) => typeof url === 'string' && url.includes('exp.host')
    );
    expect(expoCalls).toHaveLength(0);
    fetchSpy.mockRestore();
  });

  it('skips push when expoPushToken is absent', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true } as Response);
    mockVisitorQRFindUnique.mockResolvedValue({
      ...BASE_QR,
      unit: { user: { id: 'u1', preferences: {} } },
    });
    const res = await POST(makeReq({ capability: capabilityFor('vqr1') }));
    expect(res.status).toBe(200);
    const expoCalls = fetchSpy.mock.calls.filter(
      ([url]) => typeof url === 'string' && url.includes('exp.host')
    );
    expect(expoCalls).toHaveLength(0);
    fetchSpy.mockRestore();
  });
});
