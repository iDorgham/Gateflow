const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    tag: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

import { NextRequest } from 'next/server';

describe('/api/tags', () => {
  let GET: () => Promise<Response>;
  let POST: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
    POST = mod.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns 401 when unauthenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(401);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it('GET returns org-scoped tags', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1' });
    mockFindMany.mockResolvedValue([
      { id: 't1', name: 'family', color: '#22c55e' },
      { id: 't2', name: 'maid', color: '#3b82f6' },
    ]);

    const res = await GET();
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data).toHaveLength(2);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org_1', deletedAt: null },
      })
    );
  });

  it('POST creates tag when valid and unique in org', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1' });
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: 't3', name: 'driver', color: '#a855f7' });

    const req = new NextRequest('http://localhost/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'driver', color: '#a855f7' }),
    });
    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(201);
    expect(payload.success).toBe(true);
    expect(payload.data.name).toBe('driver');
  });
});
