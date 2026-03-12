export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    private _body: unknown;
    constructor(url: string, init?: { body?: string }) {
      this.url = url;
      this._body = init?.body ? JSON.parse(init.body) : {};
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

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

const mocks = {
  visitorQRFindMany: jest.fn().mockResolvedValue([]),
  unitFindFirst: jest
    .fn()
    .mockResolvedValue({ id: 'unit1', userId: 'u1', organizationId: 'org1' }),
  qrCreate: jest
    .fn()
    .mockResolvedValue({ id: 'qr1', code: 'signed-qr-string' }),
  accessRuleCreate: jest.fn().mockResolvedValue({ id: 'ar1', type: 'ONETIME' }),
  visitorQRCreate: jest.fn().mockResolvedValue({
    id: 'vqr1',
    qrCodeId: 'qr1',
    visitorName: 'Ahmed',
    qrCode: { id: 'qr1', code: 'signed-qr-string' },
    accessRule: { id: 'ar1', type: 'ONETIME' },
  }),
};

jest.mock('@gate-access/db', () => ({
  prisma: {
    visitorQR: {
      findMany: mocks.visitorQRFindMany,
    },
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
  AccessRuleType: {
    ONETIME: 'ONETIME',
    DATERANGE: 'DATERANGE',
    RECURRING: 'RECURRING',
    PERMANENT: 'PERMANENT',
  },
}));

jest.mock('@gate-access/types', () => ({
  signQRPayload: jest.fn().mockReturnValue('signed-qr-string'),
  QRCodeType: { VISITOR: 'VISITOR', OPEN: 'OPEN', RECURRING: 'RECURRING' },
}));

jest.mock('@gate-access/db/quota', () => ({
  checkAndConsumeQuota: jest.fn().mockResolvedValue({
    allowed: true,
    remaining: 8,
    used: 2,
    quota: 10,
    resetDate: new Date(),
  }),
  canCreateOpenQR: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: jest.fn().mockResolvedValue(undefined),
  EventType: {
    VISITOR_QR_CREATED: 'VISITOR_QR_CREATED',
    VISITOR_QR_DELETED: 'VISITOR_QR_DELETED',
  },
}));

import { GET, POST } from './route';
import { NextRequest } from 'next/server';

const makeGetReq = (search = '') =>
  new (NextRequest as any)(`http://localhost/api/resident/visitors${search}`);

const makePostReq = (body: object) =>
  new (NextRequest as any)('http://localhost/api/resident/visitors', {
    body: JSON.stringify(body),
  });

beforeAll(() => {
  process.env.QR_SIGNING_SECRET = 'test-secret-key-that-is-long-enough-32';
});

beforeEach(() => {
  jest.clearAllMocks();
  mocks.visitorQRFindMany.mockResolvedValue([]);
  mocks.unitFindFirst.mockResolvedValue({
    id: 'unit1',
    userId: 'u1',
    organizationId: 'org1',
  });
  mocks.qrCreate.mockResolvedValue({ id: 'qr1', code: 'signed-qr-string' });
  mocks.accessRuleCreate.mockResolvedValue({ id: 'ar1', type: 'ONETIME' });
  mocks.visitorQRCreate.mockResolvedValue({
    id: 'vqr1',
    qrCodeId: 'qr1',
    visitorName: 'Ahmed',
    qrCode: { id: 'qr1', code: 'signed-qr-string' },
    accessRule: { id: 'ar1', type: 'ONETIME' },
  });
});

describe('GET /api/resident/visitors', () => {
  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET(makeGetReq());
    expect(res.status).toBe(401);
  });

  it('returns visitor QRs for authenticated user', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mocks.visitorQRFindMany.mockResolvedValue([
      { id: 'vqr1', visitorName: 'Ahmed' },
    ]);
    const res = await GET(makeGetReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
  });
});

describe('POST /api/resident/visitors', () => {
  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(
      makePostReq({ unitId: 'u1', visitorName: 'Ahmed', type: 'ONETIME' })
    );
    expect(res.status).toBe(401);
  });

  it('returns 403 when unit does not belong to resident', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });
    mocks.unitFindFirst.mockResolvedValue(null);
    const res = await POST(
      makePostReq({
        unitId: 'other_unit',
        visitorName: 'Ahmed',
        type: 'ONETIME',
      })
    );
    expect(res.status).toBe(403);
  });

  it('creates visitor QR for valid resident request', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1', orgId: 'org1' });

    const res = await POST(
      makePostReq({
        unitId: 'unit1',
        visitorName: 'Ahmed',
        type: 'ONETIME',
      })
    );
    const body = await res.json();
    console.log('POST response:', res.status, JSON.stringify(body));
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.visitorName).toBe('Ahmed');
  });
});
