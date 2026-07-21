export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthorized: jest.fn(),
}));
jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: {
      findMany: jest.fn().mockResolvedValue([{ id: 'org1', name: 'Acme' }]),
    },
  },
}));

import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

describe('GET /api/crm/companies', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(false);
    const { GET } = await import('./route');
    const res = await GET(new Request('http://localhost/api/crm/companies'));
    expect(res.status).toBe(401);
    expect(prisma.organization.findMany).not.toHaveBeenCalled();
  });

  it('lists companies when authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    const { GET } = await import('./route');
    const res = await GET(new Request('http://localhost/api/crm/companies'));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { companies: unknown[] };
    expect(Array.isArray(body.companies)).toBe(true);
  });
});
