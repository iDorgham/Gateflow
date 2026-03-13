export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    private _body: unknown;
    constructor(url: string, init?: { body?: string }) {
      this.url = url;
      this._body = init?.body ? JSON.parse(init.body) : {};
    }
    async json() { return this._body; }
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
const mockScanLogFindFirst   = jest.fn();
const mockScanLogUpdate      = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    visitorQR: { findUnique: (...args: unknown[]) => mockVisitorQRFindUnique(...args) },
    scanLog: {
      findFirst: (...args: unknown[]) => mockScanLogFindFirst(...args),
      update:    (...args: unknown[]) => mockScanLogUpdate(...args),
    },
  },
}));

// Suppress Expo push fetch errors in tests
global.fetch = jest.fn().mockResolvedValue({ ok: true } as Response);

import { POST } from './route';
import { NextRequest } from 'next/server';

const makeReq = (body: object) =>
  new (NextRequest as any)('http://localhost/api/resident/arrived', {
    body: JSON.stringify(body),
  });

const BASE_QR = {
  id: 'vqr1',
  visitorName: 'Ahmed',
  qrCode: { id: 'qr1' },
  unit: { user: { id: 'u1', preferences: { expoPushToken: 'ExponentPushToken[abc]', notifyArrival: true } } },
};

const BASE_SCAN = { id: 'scan1', arrivalNotifiedAt: null };

beforeEach(() => {
  jest.clearAllMocks();
  mockVisitorQRFindUnique.mockResolvedValue(BASE_QR);
  mockScanLogFindFirst.mockResolvedValue(BASE_SCAN);
  mockScanLogUpdate.mockResolvedValue({ id: 'scan1' });
});

describe('POST /api/resident/arrived', () => {
  it('returns 400 when visitorQRId is missing', async () => {
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
  });

  it('returns 404 when visitorQR not found', async () => {
    mockVisitorQRFindUnique.mockResolvedValue(null);
    const res = await POST(makeReq({ visitorQRId: 'missing' }));
    expect(res.status).toBe(404);
  });

  it('returns 409 when no successful scan exists', async () => {
    mockScanLogFindFirst.mockResolvedValue(null);
    const res = await POST(makeReq({ visitorQRId: 'vqr1' }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.message).toContain('No successful scan');
  });

  it('returns 409 when already notified', async () => {
    mockScanLogFindFirst.mockResolvedValue({ id: 'scan1', arrivalNotifiedAt: new Date() });
    const res = await POST(makeReq({ visitorQRId: 'vqr1' }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('already_notified');
  });

  it('marks scan log and returns 200', async () => {
    const res = await POST(makeReq({ visitorQRId: 'vqr1' }));
    expect(res.status).toBe(200);
    expect(mockScanLogUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'scan1' },
      data: expect.objectContaining({ arrivalNotifiedAt: expect.any(Date) }),
    }));
  });

  it('skips push when notifyArrival is false', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as Response);
    mockVisitorQRFindUnique.mockResolvedValue({
      ...BASE_QR,
      unit: { user: { id: 'u1', preferences: { expoPushToken: 'ExponentPushToken[abc]', notifyArrival: false } } },
    });
    const res = await POST(makeReq({ visitorQRId: 'vqr1' }));
    expect(res.status).toBe(200);
    // Push fetch should not have been called with expo endpoint
    const expoCalls = fetchSpy.mock.calls.filter(
      ([url]) => typeof url === 'string' && url.includes('exp.host')
    );
    expect(expoCalls).toHaveLength(0);
    fetchSpy.mockRestore();
  });

  it('skips push when expoPushToken is absent', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as Response);
    mockVisitorQRFindUnique.mockResolvedValue({
      ...BASE_QR,
      unit: { user: { id: 'u1', preferences: {} } },
    });
    const res = await POST(makeReq({ visitorQRId: 'vqr1' }));
    expect(res.status).toBe(200);
    const expoCalls = fetchSpy.mock.calls.filter(
      ([url]) => typeof url === 'string' && url.includes('exp.host')
    );
    expect(expoCalls).toHaveLength(0);
    fetchSpy.mockRestore();
  });
});
