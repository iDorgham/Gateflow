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

const mockUserFindUnique = jest.fn();
const mockUserUpdate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockUserFindUnique(...args),
      update: (...args: unknown[]) => mockUserUpdate(...args),
    },
  },
}));

import { POST, DELETE } from './route';
import { NextRequest } from 'next/server';

const makePostReq = (body: object) =>
  new (NextRequest as any)('http://localhost/api/resident/push-token', {
    body: JSON.stringify(body),
  });

beforeEach(() => {
  jest.clearAllMocks();
  mockUserFindUnique.mockResolvedValue({ id: 'u1' });
  mockUserUpdate.mockResolvedValue({ id: 'u1' });
});

describe('POST /api/resident/push-token', () => {
  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makePostReq({ pushToken: 'ExponentPushToken[xxx]' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 when pushToken is missing', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1' });
    const res = await POST(makePostReq({}));
    expect(res.status).toBe(400);
  });

  it('stores push token in user preferences', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1' });
    const res = await POST(makePostReq({ pushToken: 'ExponentPushToken[abc]', deviceId: 'dev1' }));
    expect(res.status).toBe(200);
    expect(mockUserUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'u1' },
      data: expect.objectContaining({
        preferences: expect.objectContaining({ expoPushToken: 'ExponentPushToken[abc]' }),
      }),
    }));
  });
});

describe('DELETE /api/resident/push-token', () => {
  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const req = new (NextRequest as any)('http://localhost/api/resident/push-token');
    const res = await DELETE(req);
    expect(res.status).toBe(401);
  });

  it('clears push token on DELETE', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'u1' });
    const req = new (NextRequest as any)('http://localhost/api/resident/push-token');
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    expect(mockUserUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'u1' },
      data: expect.objectContaining({
        preferences: expect.objectContaining({ expoPushToken: null }),
      }),
    }));
  });
});
