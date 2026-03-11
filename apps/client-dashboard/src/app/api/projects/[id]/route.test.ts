/**
 * Unit tests for PATCH /api/projects/[id] and DELETE /api/projects/[id]
 * — Org scoping, soft delete, resource reassignment.
 */
export {};

// ─── next/server mock ─────────────────────────────────────────────────────────
jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    private _body: string;
    nextUrl: { searchParams: URLSearchParams };

    constructor(url: string, init?: { method?: string; body?: string }) {
      this.url = url;
      this._body = init?.body ?? '{}';
      this.nextUrl = { searchParams: new URLSearchParams(new URL(url).search) };
    }

    async json() {
      return JSON.parse(this._body);
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  };
});

// ─── Auth + DB mocks ──────────────────────────────────────────────────────────

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockProjectFindFirst = jest.fn();
const mockProjectUpdate = jest.fn();
const mockProjectCount = jest.fn();
const mockGateUpdateMany = jest.fn();
const mockUnitUpdateMany = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    project: {
      findFirst: (...args: unknown[]) => mockProjectFindFirst(...args),
      update: (...args: unknown[]) => mockProjectUpdate(...args),
      count: (...args: unknown[]) => mockProjectCount(...args),
    },
    gate: {
      updateMany: (...args: unknown[]) => mockGateUpdateMany(...args),
    },
    unit: {
      updateMany: (...args: unknown[]) => mockUnitUpdateMany(...args),
    },
    $transaction: jest.fn((fn: (tx: unknown) => unknown) =>
      fn({
        project: { update: (...a: unknown[]) => mockProjectUpdate(...a) },
        gate: { updateMany: (...a: unknown[]) => mockGateUpdateMany(...a) },
        unit: { updateMany: (...a: unknown[]) => mockUnitUpdateMany(...a) },
      })
    ),
  },
  GateMode: { SINGLE: 'SINGLE', MULTI: 'MULTI' },
}));

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePatchRequest(body: unknown) {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest('http://localhost/api/projects/p_1', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest() {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest('http://localhost/api/projects/p_1', { method: 'DELETE' });
}

const params = Promise.resolve({ id: 'p_1' });

// ─── PATCH tests ──────────────────────────────────────────────────────────────

describe('PATCH /api/projects/[id]', () => {
  let PATCH: (req: unknown, ctx: unknown) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    PATCH = mod.PATCH as typeof PATCH;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await PATCH(makePatchRequest({ name: 'Updated' }), { params });
    expect(res.status).toBe(401);
  });

  it('returns 404 when project not found or wrong org', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'u1', email: 'a@b.com' });
    mockProjectFindFirst.mockResolvedValue(null);
    const res = await PATCH(makePatchRequest({ name: 'Updated' }), { params });
    expect(res.status).toBe(404);
  });

  it('updates project name and scopes by org', async () => {
    const orgId = 'org_patch_1';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1', email: 'a@b.com' });
    mockProjectFindFirst.mockResolvedValue({ id: 'p_1', name: 'Old Name', organizationId: orgId });
    mockProjectUpdate.mockResolvedValue({ id: 'p_1', name: 'New Name', organizationId: orgId });

    const res = await PATCH(makePatchRequest({ name: 'New Name' }), { params });
    expect(res.status).toBe(200);
    const body = await res.json() as { project: { name: string } };
    expect(body.project.name).toBe('New Name');

    // Verify org scoping on findFirst
    const findCall = mockProjectFindFirst.mock.calls[0][0];
    expect(findCall.where.organizationId).toBe(orgId);
  });

  it('reassigns gates to new project', async () => {
    const orgId = 'org_patch_2';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1', email: 'a@b.com' });
    mockProjectFindFirst.mockResolvedValue({ id: 'p_1', organizationId: orgId });
    mockProjectUpdate.mockResolvedValue({ id: 'p_1', name: 'Project', organizationId: orgId });

    await PATCH(makePatchRequest({ name: 'Project', gateIds: ['g_1', 'g_2'] }), { params });

    // Should disassociate gates not in list, then associate new ones
    expect(mockGateUpdateMany).toHaveBeenCalledTimes(2);
  });

  it('returns 400 for invalid body', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'u1', email: 'a@b.com' });
    mockProjectFindFirst.mockResolvedValue({ id: 'p_1', organizationId: 'org_1' });
    const res = await PATCH(makePatchRequest({ name: '' }), { params });
    expect(res.status).toBe(400);
  });
});

// ─── DELETE tests ─────────────────────────────────────────────────────────────

describe('DELETE /api/projects/[id]', () => {
  let DELETE: (req: unknown, ctx: unknown) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    DELETE = mod.DELETE as typeof DELETE;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await DELETE(makeDeleteRequest(), { params });
    expect(res.status).toBe(401);
  });

  it('returns 404 when project not found', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'u1', email: 'a@b.com' });
    mockProjectFindFirst.mockResolvedValue(null);
    const res = await DELETE(makeDeleteRequest(), { params });
    expect(res.status).toBe(404);
  });

  it('returns 400 when attempting to delete the only project', async () => {
    const orgId = 'org_del_1';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1', email: 'a@b.com' });
    mockProjectFindFirst.mockResolvedValue({ id: 'p_1', organizationId: orgId });
    mockProjectCount.mockResolvedValue(1);

    const res = await DELETE(makeDeleteRequest(), { params });
    expect(res.status).toBe(400);
    expect(mockProjectUpdate).not.toHaveBeenCalled();
  });

  it('soft-deletes project (sets deletedAt) when more than one project exists', async () => {
    const orgId = 'org_del_2';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1', email: 'a@b.com' });
    mockProjectFindFirst.mockResolvedValue({ id: 'p_1', organizationId: orgId });
    mockProjectCount.mockResolvedValue(3);
    mockProjectUpdate.mockResolvedValue({ id: 'p_1', deletedAt: new Date() });

    const res = await DELETE(makeDeleteRequest(), { params });
    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean };
    expect(body.success).toBe(true);

    // Verify soft delete (deletedAt set, not hard delete)
    const updateCall = mockProjectUpdate.mock.calls[0][0];
    expect(updateCall.data.deletedAt).toBeInstanceOf(Date);
    expect(updateCall.where.id).toBe('p_1');
  });
});
