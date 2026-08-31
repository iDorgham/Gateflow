import { POST, GET, DELETE } from './route';
import { NextRequest } from 'next/server';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockRequireAdminApi = jest.fn();
jest.mock('@/lib/require-admin-api', () => ({
  requireAdminApi: (...args: unknown[]) => mockRequireAdminApi(...args),
}));

const mockOrgCreate = jest.fn();
const mockOrgFindMany = jest.fn();
const mockOrgFindFirst = jest.fn();
const mockOrgUpdate = jest.fn();
const mockUnitCreateMany = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: {
      create: (...args: unknown[]) => mockOrgCreate(...args),
      findMany: (...args: unknown[]) => mockOrgFindMany(...args),
      findFirst: (...args: unknown[]) => mockOrgFindFirst(...args),
      update: (...args: unknown[]) => mockOrgUpdate(...args),
    },
    unit: {
      createMany: (...args: unknown[]) => mockUnitCreateMany(...args),
    },
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(
  method: string,
  body?: unknown,
  url = 'http://localhost/api/admin/sandbox/provision'
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-key': 'test-key' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// ─── POST Tests ───────────────────────────────────────────────────────────────

describe('POST /api/admin/sandbox/provision', () => {
  const validPayload = {
    organizationName: 'Sunset Heights Demo',
    contactEmail: 'demo@sunset-heights.com',
    gateCount: 2,
    unitCount: 50,
    trialDays: 14,
    locale: 'en',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Admin authorized by default
    mockRequireAdminApi.mockResolvedValue(null);
    mockOrgCreate.mockResolvedValue({
      id: 'org-1',
      name: 'Sunset Heights Demo',
      email: 'demo@sunset-heights.com',
    });
    mockOrgUpdate.mockResolvedValue({ id: 'org-1' });
    mockUnitCreateMany.mockResolvedValue({ count: 10 });
  });

  it('returns 201 with sandbox details on valid payload', async () => {
    const req = makeRequest('POST', validPayload);
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.sandbox.organizationId).toBe('org-1');
    expect(json.sandbox.dashboardUrl).toContain('org-1');
    expect(json.sandbox.trialDays).toBe(14);
  });

  it('returns 401 when admin auth fails', async () => {
    const { NextResponse } = await import('next/server');
    mockRequireAdminApi.mockResolvedValue(
      NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    );
    const req = makeRequest('POST', validPayload);
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 422 on missing required field (no contactEmail)', async () => {
    const req = makeRequest('POST', { organizationName: 'X' });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toBe('Validation failed');
  });

  it('returns 422 on invalid email', async () => {
    const req = makeRequest('POST', {
      ...validPayload,
      contactEmail: 'not-an-email',
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it('returns 422 when trialDays exceeds 30', async () => {
    const req = makeRequest('POST', { ...validPayload, trialDays: 99 });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it('returns 500 on database error', async () => {
    mockOrgCreate.mockRejectedValue(new Error('DB connection failed'));
    const req = makeRequest('POST', validPayload);
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('seeds Arabic unit names when locale is ar', async () => {
    const req = makeRequest('POST', { ...validPayload, locale: 'ar' });
    await POST(req);
    expect(mockUnitCreateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            name: expect.stringMatching(/فيلا|شقة|بنتهاوس|استوديو|جناح/),
          }),
        ]),
      })
    );
  });

  it('creates org with isSandbox=true', async () => {
    const req = makeRequest('POST', validPayload);
    await POST(req);
    expect(mockOrgCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isSandbox: true }),
      })
    );
  });
});

// ─── GET Tests ────────────────────────────────────────────────────────────────

describe('GET /api/admin/sandbox/provision', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminApi.mockResolvedValue(null);
    mockOrgFindMany.mockResolvedValue([
      {
        id: 'org-1',
        name: 'Demo Org',
        email: 'demo@org.com',
        sandboxExpiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        _count: { units: 10, users: 1 },
      },
    ]);
  });

  it('returns 200 with list of active sandbox orgs', async () => {
    const req = makeRequest('GET');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.sandboxOrgs).toHaveLength(1);
  });

  it('returns 401 when not admin', async () => {
    const { NextResponse } = await import('next/server');
    mockRequireAdminApi.mockResolvedValue(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const req = makeRequest('GET');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

// ─── DELETE Tests ─────────────────────────────────────────────────────────────

describe('DELETE /api/admin/sandbox/provision', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminApi.mockResolvedValue(null);
    mockOrgFindFirst.mockResolvedValue({ id: 'org-1', isSandbox: true });
    mockOrgUpdate.mockResolvedValue({ id: 'org-1' });
  });

  it('returns 200 and expires the org', async () => {
    const req = makeRequest(
      'DELETE',
      undefined,
      'http://localhost/api/admin/sandbox/provision?orgId=org-1'
    );
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.orgId).toBe('org-1');
    expect(mockOrgUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'org-1' } })
    );
  });

  it('returns 400 when orgId is missing', async () => {
    const req = makeRequest('DELETE');
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when sandbox org not found', async () => {
    mockOrgFindFirst.mockResolvedValue(null);
    const req = makeRequest(
      'DELETE',
      undefined,
      'http://localhost/api/admin/sandbox/provision?orgId=unknown'
    );
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });

  it('returns 401 when not admin', async () => {
    const { NextResponse } = await import('next/server');
    mockRequireAdminApi.mockResolvedValue(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const req = makeRequest(
      'DELETE',
      undefined,
      'http://localhost/api/admin/sandbox/provision?orgId=org-1'
    );
    const res = await DELETE(req);
    expect(res.status).toBe(401);
  });
});
