import { GET } from './route';
import { NextRequest } from 'next/server';

const mockRequireAdminApi = jest.fn();
jest.mock('@/lib/require-admin-api', () => ({
  requireAdminApi: (...args: unknown[]) => mockRequireAdminApi(...args),
}));

const mockCredFindMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    integrationCredential: {
      findMany: (...args: unknown[]) => mockCredFindMany(...args),
    },
  },
}));

function makeRequest(url = 'http://localhost/api/admin/integrations/health') {
  return new NextRequest(url, { headers: { 'x-admin-key': 'test-key' } });
}

describe('GET /api/admin/integrations/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminApi.mockResolvedValue(null);
  });

  it('returns 401 when admin auth fails', async () => {
    const { NextResponse } = await import('next/server');
    mockRequireAdminApi.mockResolvedValue(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    expect(mockCredFindMany).not.toHaveBeenCalled();
  });

  it('returns provider grouping with distinct org coverage', async () => {
    const now = Date.now();
    mockCredFindMany.mockResolvedValue([
      {
        id: 'c1',
        provider: 'HUBSPOT',
        organizationId: 'org-1',
        createdAt: new Date(now - 86400000),
        updatedAt: new Date(now - 3600000),
        deletedAt: null,
      },
      {
        id: 'c2',
        provider: 'HUBSPOT',
        organizationId: 'org-2',
        createdAt: new Date(now - 86400000),
        updatedAt: new Date(now - 3600000),
        deletedAt: null,
      },
      {
        id: 'c3',
        provider: 'TWILIO',
        organizationId: 'org-1',
        createdAt: new Date(now - 86400000),
        updatedAt: new Date(now - 7200000),
        deletedAt: null,
      },
      {
        id: 'c4',
        provider: 'RESEND',
        organizationId: 'org-3',
        createdAt: new Date(now - 86400000),
        updatedAt: new Date(now - 90000000),
        deletedAt: null,
      },
    ]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    expect(json.totals.totalCredentials).toBe(4);
    expect(json.totals.providerCount).toBe(3);
    expect(json.totals.orgCount).toBe(3);

    const hubspot = json.providers.find(
      (p: { provider: string }) => p.provider === 'HUBSPOT'
    );
    expect(hubspot.count).toBe(2);
    expect(hubspot.orgCount).toBe(2);
  });

  it('excludes soft-deleted credentials from the query', async () => {
    mockCredFindMany.mockResolvedValue([]);
    await GET(makeRequest());
    const arg = mockCredFindMany.mock.calls[0][0];
    expect(arg.where).toEqual({ deletedAt: null });
  });

  it('returns 500 on database error', async () => {
    mockCredFindMany.mockRejectedValue(new Error('DB down'));
    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
  });
});
