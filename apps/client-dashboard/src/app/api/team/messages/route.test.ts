import { NextRequest, NextResponse } from 'next/server';

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockChatMessageFindMany = jest.fn();
const mockChatMessageCreate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    chatMessage: {
      findMany: (...args: unknown[]) => mockChatMessageFindMany(...args),
      create: (...args: unknown[]) => mockChatMessageCreate(...args),
    },
  },
}));

describe('Team Messages API', () => {
  let GET: (req: NextRequest) => Promise<NextResponse>;
  let POST: (req: NextRequest) => Promise<NextResponse>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
    POST = mod.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/team/messages', () => {
    it('returns 401 when unauthorized', async () => {
      mockGetSessionClaims.mockResolvedValue(null);
      const res = await GET({ url: 'http://localhost/api/team/messages' } as NextRequest);
      expect(res.status).toBe(401);
    });

    it('scopes messages by organizationId', async () => {
      const orgId = 'org_123';
      mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'user_1' });
      mockChatMessageFindMany.mockResolvedValue([]);

      await GET({ url: 'http://localhost/api/team/messages' } as NextRequest);

      expect(mockChatMessageFindMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { organizationId: orgId }
      }));
    });
  });

  describe('POST /api/team/messages', () => {
    it('returns 401 when unauthorized', async () => {
      mockGetSessionClaims.mockResolvedValue(null);
      const res = await POST({ 
        json: async () => ({ content: 'hello' }) 
      } as NextRequest);
      expect(res.status).toBe(401);
    });

    it('persists message with correct organizationId and senderId', async () => {
      const orgId = 'org_123';
      const userId = 'user_1';
      mockGetSessionClaims.mockResolvedValue({ orgId, sub: userId });
      mockChatMessageCreate.mockResolvedValue({ id: 'msg_1', content: 'hello', userId, organizationId: orgId });

      const res = await POST({ 
        json: async () => ({ content: 'hello' }) 
      } as NextRequest);

      expect(res.status).toBe(200);
      expect(mockChatMessageCreate).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          content: 'hello',
          userId: userId,
          organizationId: orgId
        }
      }));
    });

    it('returns 400 for empty content', async () => {
      mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'user_1' });
      const res = await POST({ 
        json: async () => ({ content: '' }) 
      } as NextRequest);
      expect(res.status).toBe(400);
    });
  });
});
