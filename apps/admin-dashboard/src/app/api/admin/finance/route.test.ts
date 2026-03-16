export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthenticated: jest.fn(),
  isAdminAuthorized: jest.fn(),
}));
jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: {
      groupBy: jest.fn().mockResolvedValue([
        { plan: 'FREE', _count: { id: 3 } },
        { plan: 'PRO', _count: { id: 2 } },
      ]),
      findMany: jest.fn().mockResolvedValue([]),
    },
    scanLog: { groupBy: jest.fn().mockResolvedValue([]) },
    gate: { findMany: jest.fn().mockResolvedValue([]) },
  },
}));

const { isAdminAuthenticated, isAdminAuthorized } = require('@/lib/admin-auth');

class MockNextRequest {
  url: string;
  constructor(url: string) { this.url = url; }
}

describe('GET /api/admin/finance', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 if not authenticated', async () => {
    isAdminAuthorized.mockResolvedValue(false);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/finance') as never);
    expect(res.status).toBe(401);
  });

  it('returns finance data with MRR when authenticated', async () => {
    isAdminAuthorized.mockResolvedValue(true);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/finance') as never);
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean; data: { planCounts: Record<string, number>; mrr: number } };
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('planCounts');
    expect(body.data).toHaveProperty('mrr');
    // MRR = 2 PRO * $49 = $98
    expect(body.data.mrr).toBe(98);
  });
});
