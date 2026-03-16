export {};

// Mock dependencies before imports
jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthenticated: jest.fn(),
  isAdminAuthorized: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    $queryRaw: jest.fn().mockResolvedValue([]),
    scanLog: {
      count: jest.fn().mockResolvedValue(0),
      groupBy: jest.fn().mockResolvedValue([]),
    },
    organization: { count: jest.fn().mockResolvedValue(5) },
    user: { count: jest.fn().mockResolvedValue(20) },
  },
}));

const { isAdminAuthenticated, isAdminAuthorized } = require('@/lib/admin-auth');

// Mock NextRequest
class MockNextRequest {
  url: string;
  constructor(url: string) { this.url = url; }
}

describe('GET /api/admin/health', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('returns 401 if not authenticated', async () => {
    isAdminAuthorized.mockResolvedValue(false);
    const { GET } = await import('./route');
    const req = new MockNextRequest('http://localhost/en/api/admin/health');
    const res = await GET(req as never);
    expect(res.status).toBe(401);
  });

  it('returns health data when authenticated', async () => {
    isAdminAuthorized.mockResolvedValue(true);
    const { GET } = await import('./route');
    const req = new MockNextRequest('http://localhost/en/api/admin/health');
    const res = await GET(req as never);
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean; services: unknown; metrics: unknown; platform: unknown };
    expect(body.success).toBe(true);
    expect(body).toHaveProperty('services');
    expect(body).toHaveProperty('metrics');
    expect(body).toHaveProperty('platform');
  });
});
