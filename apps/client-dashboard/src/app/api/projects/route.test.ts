/**
 * Unit tests for GET /api/projects and POST /api/projects
 * — Phase 1 CRM fields: externalUrl, galleryJson, gateMode.
 *
 * Also verifies org scoping and soft-delete enforcement.
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

const mockProjectCreate = jest.fn();
const mockProjectFindMany = jest.fn();
const mockGateCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    project: {
      create: (...args: unknown[]) => mockProjectCreate(...args),
      findMany: (...args: unknown[]) => mockProjectFindMany(...args),
    },
    gate: {
      create: (...args: unknown[]) => mockGateCreate(...args),
    },
    $transaction: jest.fn((fn: (tx: unknown) => unknown) =>
      fn({
        project: { create: (...a: unknown[]) => mockProjectCreate(...a) },
        gate: { create: (...a: unknown[]) => mockGateCreate(...a) },
      })
    ),
  },
  GateMode: {
    SINGLE: 'SINGLE',
    MULTI: 'MULTI',
  },
}));

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePostRequest(body: unknown) {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest('http://localhost/api/projects', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── POST tests ───────────────────────────────────────────────────────────────

describe('POST /api/projects — CRM fields', () => {
  let POST: (req: unknown) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    POST = mod.POST as typeof POST;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makePostRequest({ name: 'MyProject' }));
    expect(res.status).toBe(401);
    expect(mockProjectCreate).not.toHaveBeenCalled();
  });

  it('persists externalUrl, galleryJson, gateMode and returns project', async () => {
    const orgId = 'org_proj_1';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1', email: 'a@b.com' });

    const createdProject = {
      id: 'p_1',
      name: 'Skyline Tower',
      description: null,
      logoUrl: null,
      coverUrl: null,
      website: null,
      socialMedia: null,
      location: null,
      externalUrl: 'https://skylinetower.ae',
      galleryJson: ['https://cdn.example.com/img1.jpg'],
      gateMode: 'SINGLE',
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProjectCreate.mockResolvedValue(createdProject);
    mockGateCreate.mockResolvedValue({ id: 'g_1' });

    const res = await POST(
      makePostRequest({
        name: 'Skyline Tower',
        externalUrl: 'https://skylinetower.ae',
        galleryJson: ['https://cdn.example.com/img1.jpg'],
        gateMode: 'SINGLE',
      })
    );

    expect(res.status).toBe(201);
    const body = await res.json() as { project: Record<string, unknown> };
    expect(body.project.externalUrl).toBe('https://skylinetower.ae');
    expect(body.project.galleryJson).toEqual(['https://cdn.example.com/img1.jpg']);
    expect(body.project.gateMode).toBe('SINGLE');

    // Org scoping
    const createCall = mockProjectCreate.mock.calls[0][0];
    expect(createCall.data.organizationId).toBe(orgId);
    expect(createCall.data.externalUrl).toBe('https://skylinetower.ae');
  });

  it('returns 400 when externalUrl is not a valid URL', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'u1', email: 'a@b.com' });

    const res = await POST(makePostRequest({ name: 'Bad Project', externalUrl: 'not-a-url' }));

    expect(res.status).toBe(400);
    expect(mockProjectCreate).not.toHaveBeenCalled();
  });

  it('returns 400 when gateMode value is invalid', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'u1', email: 'a@b.com' });

    const res = await POST(makePostRequest({ name: 'Bad Project', gateMode: 'TRIPLE' }));

    expect(res.status).toBe(400);
    expect(mockProjectCreate).not.toHaveBeenCalled();
  });
});

// ─── GET tests ────────────────────────────────────────────────────────────────

describe('GET /api/projects — org scoping', () => {
  let GET: () => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET as typeof GET;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(mockProjectFindMany).not.toHaveBeenCalled();
  });

  it('scopes project list by organizationId and excludes soft-deleted', async () => {
    const orgId = 'org_proj_2';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u2', email: 'b@c.com' });
    mockProjectFindMany.mockResolvedValue([
      {
        id: 'p_2',
        name: 'Desert Estate',
        externalUrl: 'https://desert.ae',
        galleryJson: [],
        gateMode: 'MULTI',
        _count: { gates: 2, qrCodes: 10 },
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json() as { projects: Array<Record<string, unknown>> };
    expect(body.projects).toHaveLength(1);
    expect(body.projects[0].gateMode).toBe('MULTI');

    const findManyCall = mockProjectFindMany.mock.calls[0][0];
    expect(findManyCall.where).toEqual({ organizationId: orgId, deletedAt: null });
  });
});
