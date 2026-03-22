import { NextRequest, NextResponse } from 'next/server';

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockUserFindMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    user: {
      findMany: (...args: unknown[]) => mockUserFindMany(...args),
    },
  },
}));

describe('Team Members API', () => {
  let GET: (req: NextRequest) => Promise<NextResponse>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/team/members', () => {
    it('returns 401 when unauthorized', async () => {
      mockGetSessionClaims.mockResolvedValue(null);
      const res = await GET({ url: 'http://localhost/api/team/members' } as NextRequest);
      expect(res.status).toBe(401);
    });

    it('scopes members by organizationId and excludes deleted users', async () => {
      const orgId = 'org_123';
      mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'user_1' });
      mockUserFindMany.mockResolvedValue([]);

      await GET({ url: 'http://localhost/api/team/members' } as NextRequest);

      expect(mockUserFindMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { 
          organizationId: orgId,
          deletedAt: null
        }
      }));
    });
  });
});
