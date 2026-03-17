export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthenticated: jest.fn(),
  isAdminAuthorized: jest.fn(),
}));
jest.mock('@gate-access/db', () => ({
  prisma: {
    scanLog: {
      count: jest.fn().mockResolvedValue(0),
      groupBy: jest.fn().mockResolvedValue([]),
    },
    organization: {
      groupBy: jest.fn().mockResolvedValue([{ plan: 'FREE', _count: { id: 2 } }]),
      findMany: jest.fn().mockResolvedValue([]),
    },
    gate: { findMany: jest.fn().mockResolvedValue([]) },
  },
}));

import { isAdminAuthorized } from '@/lib/admin-auth';

class MockNextRequest {
  url: string;
  constructor(url: string) { this.url = url; }
}

describe('GET /api/admin/analytics', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 if not authenticated', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(false);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/analytics') as never);
    expect(res.status).toBe(401);
  });

  it('returns analytics data when authenticated', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    const { GET } = await import('./route');
    const res = await GET(new MockNextRequest('http://localhost/en/api/admin/analytics') as never);
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean; scanTrend: unknown; orgGrowth: unknown; planDistribution: unknown; topOrgs: unknown };
    expect(body.success).toBe(true);
    expect(body).toHaveProperty('scanTrend');
    expect(body).toHaveProperty('orgGrowth');
    expect(body).toHaveProperty('planDistribution');
  });
});
