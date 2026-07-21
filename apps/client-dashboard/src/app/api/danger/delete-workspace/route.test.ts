export {};

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: jest.fn(),
}));
jest.mock('@/lib/auth', () => ({
  hasPermission: jest.fn(),
}));
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest
    .fn()
    .mockResolvedValue({
      allowed: true,
      limit: 5,
      remaining: 4,
      retryAfterMs: 0,
    }),
}));
jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    auditLog: { create: jest.fn() },
  },
}));

import { NextRequest } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';

describe('POST /api/danger/delete-workspace', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 without session', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);
    const { POST } = await import('./route');
    const res = await POST(
      new NextRequest('http://localhost/api/danger/delete-workspace', {
        method: 'POST',
        body: JSON.stringify({
          orgNameConfirmation: 'Acme',
          actionConfirmation: 'DELETE WORKSPACE',
        }),
      })
    );
    expect(res.status).toBe(401);
  });

  it('returns 403 without workspace:manage', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue({
      orgId: 'org1',
      sub: 'user1',
      permissions: {},
    });
    (hasPermission as jest.Mock).mockReturnValue(false);
    const { POST } = await import('./route');
    const res = await POST(
      new NextRequest('http://localhost/api/danger/delete-workspace', {
        method: 'POST',
        body: JSON.stringify({
          orgNameConfirmation: 'Acme',
          actionConfirmation: 'DELETE WORKSPACE',
        }),
      })
    );
    expect(res.status).toBe(403);
  });
});
