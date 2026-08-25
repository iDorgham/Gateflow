export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    _body: unknown;
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

const mockUnitFindFirst = jest.fn();
const mockCreateExpressInviteTransaction = jest.fn();
const mockCreateSecureInviteSignature = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    unit: { findFirst: (...args: unknown[]) => mockUnitFindFirst(...args) },
  },
  createExpressInviteTransaction: (...args: unknown[]) =>
    mockCreateExpressInviteTransaction(...args),
  createSecureInviteSignature: (...args: unknown[]) =>
    mockCreateSecureInviteSignature(...args),
}));

const mockCheckAndConsumeQuota = jest.fn();
jest.mock('@gate-access/db/quota', () => ({
  checkAndConsumeQuota: (...args: unknown[]) =>
    mockCheckAndConsumeQuota(...args),
}));

const mockEmitEvent = jest.fn();
jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: (...args: unknown[]) => mockEmitEvent(...args),
  EventType: { QR_CREATED: 'qr_created' },
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

const makePostReq = (body: unknown) =>
  new (NextRequest as any)('http://localhost/api/resident/express-invite', {
    body: JSON.stringify(body),
  });

beforeEach(() => {
  jest.clearAllMocks();
  mockUnitFindFirst.mockResolvedValue({ id: 'unit1', projectId: 'proj1' });
  mockCheckAndConsumeQuota.mockResolvedValue({ allowed: true });
  mockCreateExpressInviteTransaction.mockResolvedValue({
    qrCode: { id: 'qr1', expiresAt: new Date(Date.now() + 86400000) },
    shortLink: { shortId: 'abc12345' },
  });
  mockCreateSecureInviteSignature.mockReturnValue('sig123');
  mockEmitEvent.mockResolvedValue(undefined);
});

describe('POST /api/resident/express-invite', () => {
  it('returns 401 when no authenticated session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makePostReq({}));
    expect(res.status).toBe(401);
  });

  it('returns 403 when unit is not found for resident', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'user1', orgId: 'org1' });
    mockUnitFindFirst.mockResolvedValue(null);
    const res = await POST(makePostReq({}));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.message).toMatch(/unit not found/i);
  });

  it('returns 403 when monthly quota is exhausted', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'user1', orgId: 'org1' });
    mockCheckAndConsumeQuota.mockResolvedValue({
      allowed: false,
      remaining: 0,
    });
    const res = await POST(makePostReq({}));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.message).toMatch(/quota reached/i);
  });

  it('successfully creates an HMAC-signed express invite link', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'user1', orgId: 'org1' });
    const res = await POST(makePostReq({ delegateToAi: false }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.shortId).toBe('abc12345');
    expect(body.data.shareUrl).toContain('/s/abc12345?sig=sig123');
    expect(mockCreateExpressInviteTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org1',
        unitId: 'unit1',
        projectId: 'proj1',
        expiresInHours: 24,
      })
    );
  });
});
