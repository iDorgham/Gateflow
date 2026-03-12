export {};

jest.mock('@/lib/admin-auth', () => ({ isAdminAuthenticated: jest.fn() }));
jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: {
      count: jest.fn().mockResolvedValue(3),
      findMany: jest.fn().mockResolvedValue([
        { id: 'org1', name: 'Acme', email: 'a@acme.com', plan: 'PRO', deletedAt: null, createdAt: new Date(), _count: { users: 5, qrCodes: 10, gates: 2 } },
      ]),
    },
  },
}));

const { isAdminAuthenticated } = require('@/lib/admin-auth');

class MockNextRequest {
  url: string;
  constructor(url: string) { this.url = url; }
}

describe('GET /api/admin/organizations', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 if not authenticated', async () => {
    isAdminAuthenticated.mockReturnValue(false);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/organizations') as never);
    expect(res.status).toBe(401);
  });

  it('returns org list when authenticated', async () => {
    isAdminAuthenticated.mockReturnValue(true);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/organizations') as never);
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean; data: unknown[]; total: number };
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.total).toBe('number');
  });
});
