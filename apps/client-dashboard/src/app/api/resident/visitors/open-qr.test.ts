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

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

const mocks = {
  visitorQRFindMany:  jest.fn().mockResolvedValue([]),
  unitFindFirst:      jest.fn().mockResolvedValue({ id: 'unit1', userId: 'u1' }),
  qrCreate:           jest.fn().mockResolvedValue({ id: 'qr1', code: 'signed-qr-string' }),
  accessRuleCreate:   jest.fn().mockResolvedValue({ id: 'ar1', type: 'PERMANENT' }),
  visitorQRCreate:    jest.fn().mockResolvedValue({
    id: 'vqr1', qrCodeId: 'qr1', isOpenQR: true,
    qrCode: { id: 'qr1', code: 'signed-qr-string' },
    accessRule: { id: 'ar1', type: 'PERMANENT' },
  }),
};

jest.mock('@gate-access/db', () => ({
  prisma: {
    visitorQR: { findMany: mocks.visitorQRFindMany },
    unit: { findFirst: mocks.unitFindFirst },
    $transaction: jest.fn().mockImplementation(async (cb) => {
      const txMock = {
        qRCode: { create: mocks.qrCreate },
        accessRule: { create: mocks.accessRuleCreate },
        visitorQR: { create: mocks.visitorQRCreate },
      };
      return await cb(txMock);
    }),
  },
  QRCodeType: { VISITOR: 'VISITOR', OPEN: 'OPEN', RECURRING: 'RECURRING' },
  AccessRuleType: { ONETIME: 'ONETIME', DATERANGE: 'DATERANGE', RECURRING: 'RECURRING', PERMANENT: 'PERMANENT' },
}));

jest.mock('@gate-access/types', () => ({
  signQRPayload: jest.fn().mockReturnValue('signed-qr-string'),
  QRCodeType: { VISITOR: 'VISITOR', OPEN: 'OPEN', RECURRING: 'RECURRING' },
}));

const mockCheckAndConsumeQuota = jest.fn().mockResolvedValue({
  allowed: true, remaining: 8, used: 2, quota: 10, resetDate: new Date(),
});
const mockCanCreateOpenQR = jest.fn().mockResolvedValue(true);
jest.mock('@gate-access/db/quota', () => ({
  checkAndConsumeQuota: (...args: unknown[]) => mockCheckAndConsumeQuota(...args),
  canCreateOpenQR:      (...args: unknown[]) => mockCanCreateOpenQR(...args),
}));

jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: jest.fn().mockResolvedValue(undefined),
  EventType: { VISITOR_QR_CREATED: 'VISITOR_QR_CREATED' },
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

const makePostReq = (body: object) =>
  new (NextRequest as any)('http://localhost/api/resident/visitors', {
    body: JSON.stringify(body),
  });

beforeAll(() => {
  process.env.QR_SIGNING_SECRET = 'test-secret-key-that-is-long-enough-32';
});

beforeEach(() => {
  jest.clearAllMocks();
  mocks.unitFindFirst.mockResolvedValue({ id: 'unit1', userId: 'u1' });
  mocks.qrCreate.mockResolvedValue({ id: 'qr1', code: 'signed-qr-string' });
  mocks.accessRuleCreate.mockResolvedValue({ id: 'ar1', type: 'PERMANENT' });
  mocks.visitorQRCreate.mockResolvedValue({
    id: 'vqr1', qrCodeId: 'qr1', isOpenQR: true,
    qrCode: { id: 'qr1', code: 'signed-qr-string' },
    accessRule: { id: 'ar1', type: 'PERMANENT' },
  });
  mockCheckAndConsumeQuota.mockResolvedValue({ allowed: true, remaining: 8, used: 2, quota: 10, resetDate: new Date() });
  mockCanCreateOpenQR.mockResolvedValue(true);
});

describe('POST /api/resident/visitors — isOpenQR', () => {
  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makePostReq({ unitId: 'unit1', isOpenQR: true, type: 'PERMANENT' }));
    expect(res.status).toBe(401);
  });

  it('creates open QR successfully', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    const res = await POST(makePostReq({ unitId: 'unit1', isOpenQR: true, type: 'PERMANENT' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.isOpenQR).toBe(true);
  });

  it('returns 403 when unit type does not allow open QR', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mockCanCreateOpenQR.mockResolvedValue(false);
    const res = await POST(makePostReq({ unitId: 'unit1', isOpenQR: true, type: 'PERMANENT' }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.message).toContain('not allowed');
  });

  it('returns 403 when monthly quota is exceeded', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mockCheckAndConsumeQuota.mockResolvedValue({ allowed: false, remaining: 0, used: 10, quota: 10, resetDate: new Date() });
    const res = await POST(makePostReq({ unitId: 'unit1', isOpenQR: true, type: 'PERMANENT' }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.message).toContain('quota');
  });

  it('returns 400 when visitorName is missing for non-open QR', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    const res = await POST(makePostReq({ unitId: 'unit1', isOpenQR: false, type: 'ONETIME' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('Visitor name');
  });
});
