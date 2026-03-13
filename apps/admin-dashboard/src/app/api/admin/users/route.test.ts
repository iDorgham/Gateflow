export {};

jest.mock('@/lib/admin-auth', () => ({ isAdminAuthenticated: jest.fn() }));
jest.mock('@gate-access/db', () => ({
  prisma: {
    user: {
      count: jest.fn().mockResolvedValue(10),
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}));

const { isAdminAuthenticated } = require('@/lib/admin-auth');

class MockNextRequest {
  url: string;
  constructor(url: string) { this.url = url; }
}

describe('GET /api/admin/users', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 if not authenticated', async () => {
    isAdminAuthenticated.mockReturnValue(false);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/users') as never);
    expect(res.status).toBe(401);
  });

  it('returns user list when authenticated', async () => {
    isAdminAuthenticated.mockReturnValue(true);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/users') as never);
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean; data: unknown[]; total: number };
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
