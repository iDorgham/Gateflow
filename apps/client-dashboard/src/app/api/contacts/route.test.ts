/**
 * Unit tests for POST /api/contacts and GET /api/contacts
 * — Phase 1 CRM fields: jobTitle, source, companyWebsite, notes.
 *
 * Also verifies that org scoping and soft-delete enforcement are maintained.
 */
export {};

// ─── next/server mock (needed so NextRequest.json() works in node test env) ──
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

const mockContactCreate = jest.fn();
const mockContactFindMany = jest.fn();
const mockContactCount = jest.fn();
const mockProjectFindFirst = jest.fn();
const mockGateFindFirst = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    contact: {
      create: (...args: unknown[]) => mockContactCreate(...args),
      findMany: (...args: unknown[]) => mockContactFindMany(...args),
      count: (...args: unknown[]) => mockContactCount(...args),
    },
    project: {
      findFirst: (...args: unknown[]) => mockProjectFindFirst(...args),
    },
    gate: {
      findFirst: (...args: unknown[]) => mockGateFindFirst(...args),
    },
    $queryRaw: jest.fn().mockResolvedValue([]),
  },
  Prisma: { sql: jest.fn(), empty: '', raw: jest.fn() },
  ContactSource: {
    MANUAL: 'MANUAL',
    IMPORT: 'IMPORT',
    QR_SCAN: 'QR_SCAN',
    REFERRAL: 'REFERRAL',
    OTHER: 'OTHER',
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePostRequest(body: unknown) {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest('http://localhost/api/contacts', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function makeGetRequest(qs = '') {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest(`http://localhost/api/contacts${qs}`);
}

// ─── POST tests ───────────────────────────────────────────────────────────────

describe('POST /api/contacts — CRM fields', () => {
  let POST: (req: unknown) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    POST = mod.POST as typeof POST;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makePostRequest({ firstName: 'Ali', lastName: 'Hassan' }));
    expect(res.status).toBe(401);
    expect(mockContactCreate).not.toHaveBeenCalled();
  });

  it('persists new CRM fields and returns them in response', async () => {
    const orgId = 'org_crm_1';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1', email: 'a@b.com' });

    const createdContact = {
      id: 'c_1',
      firstName: 'Sara',
      lastName: 'Ali',
      birthday: null,
      company: 'Acme Corp',
      phone: null,
      email: 'sara@acme.com',
      avatarUrl: null,
      jobTitle: 'Engineering Manager',
      source: 'MANUAL',
      companyWebsite: 'https://acme.com',
      notes: 'Met at Gate Summit 2026',
      units: [],
    };
    mockContactCreate.mockResolvedValue(createdContact);

    const res = await POST(
      makePostRequest({
        firstName: 'Sara',
        lastName: 'Ali',
        company: 'Acme Corp',
        email: 'sara@acme.com',
        jobTitle: 'Engineering Manager',
        source: 'MANUAL',
        companyWebsite: 'https://acme.com',
        notes: 'Met at Gate Summit 2026',
      })
    );

    expect(res.status).toBe(201);
    const body = await res.json() as { success: boolean; data: Record<string, unknown> };
    expect(body.success).toBe(true);
    expect(body.data.jobTitle).toBe('Engineering Manager');
    expect(body.data.source).toBe('MANUAL');
    expect(body.data.companyWebsite).toBe('https://acme.com');
    expect(body.data.notes).toBe('Met at Gate Summit 2026');

    // Org scoping
    const createCall = mockContactCreate.mock.calls[0][0];
    expect(createCall.data.organizationId).toBe(orgId);
  });

  it('returns 400 when source value is invalid', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'u1', email: 'a@b.com' });

    const res = await POST(
      makePostRequest({ firstName: 'X', lastName: 'Y', source: 'UNKNOWN_SOURCE' })
    );

    expect(res.status).toBe(400);
    expect(mockContactCreate).not.toHaveBeenCalled();
  });

  it('returns 400 when companyWebsite is not a valid URL', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'u1', email: 'a@b.com' });

    const res = await POST(
      makePostRequest({ firstName: 'X', lastName: 'Y', companyWebsite: 'not-a-url' })
    );

    expect(res.status).toBe(400);
    expect(mockContactCreate).not.toHaveBeenCalled();
  });
});

// ─── GET tests ────────────────────────────────────────────────────────────────

describe('GET /api/contacts — CRM fields in list response', () => {
  let GET: (req: unknown) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET as typeof GET;
  });

  beforeEach(() => jest.clearAllMocks());

  it('includes CRM fields in returned contact objects', async () => {
    const orgId = 'org_crm_2';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1', email: 'a@b.com' });

    const contactRow = {
      id: 'c_2',
      firstName: 'Khalid',
      lastName: 'Nasser',
      birthday: null,
      company: null,
      phone: null,
      email: null,
      avatarUrl: null,
      jobTitle: 'Property Manager',
      source: 'IMPORT',
      companyWebsite: null,
      notes: 'Imported from legacy system',
      units: [],
      contactTags: [],
    };
    mockContactFindMany.mockResolvedValue([contactRow]);
    mockContactCount.mockResolvedValue(1);

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);

    const body = await res.json() as { success: boolean; data: Array<Record<string, unknown>> };
    expect(body.success).toBe(true);
    expect(body.data[0].jobTitle).toBe('Property Manager');
    expect(body.data[0].source).toBe('IMPORT');
    expect(body.data[0].notes).toBe('Imported from legacy system');

    // Org scoping
    const findManyCall = mockContactFindMany.mock.calls[0][0];
    expect(findManyCall.where.organizationId).toBe(orgId);
    expect(findManyCall.where.deletedAt).toBeNull();
  });
});
