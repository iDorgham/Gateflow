/**
 * Unit tests for GET /api/units — CSV export audit logging.
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

  class MockNextResponse {
    status: number;
    private _body: unknown;
    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this._body = body;
      this.status = init?.status ?? 200;
    }
    async json() { return this._body; }
    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, { status: init?.status ?? 200 });
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// ─── Auth + DB mocks ──────────────────────────────────────────────────────────

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockUnitFindMany = jest.fn();
const mockUnitCount = jest.fn();
const mockProjectFindFirst = jest.fn();
const mockGateFindFirst = jest.fn();
const mockContactFindFirst = jest.fn();
const mockAuditLogCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    unit: {
      findMany: (...args: unknown[]) => mockUnitFindMany(...args),
      count: (...args: unknown[]) => mockUnitCount(...args),
    },
    project: {
      findFirst: (...args: unknown[]) => mockProjectFindFirst(...args),
    },
    gate: {
      findFirst: (...args: unknown[]) => mockGateFindFirst(...args),
    },
    contact: {
      findFirst: (...args: unknown[]) => mockContactFindFirst(...args),
    },
    auditLog: {
      create: (...args: unknown[]) => mockAuditLogCreate(...args),
    },
    $queryRaw: jest.fn().mockResolvedValue([]),
  },
  Prisma: { sql: jest.fn(), empty: '', raw: jest.fn() },
  UnitType: {
    STUDIO: 'STUDIO',
    ONE_BR: 'ONE_BR',
    TWO_BR: 'TWO_BR',
    THREE_BR: 'THREE_BR',
    VILLA: 'VILLA',
    PENTHOUSE: 'PENTHOUSE',
    COMMERCIAL: 'COMMERCIAL',
  },
}));

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeGetRequest(qs = '') {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest(`http://localhost/api/units${qs}`);
}

const UNIT_ROW = {
  id: 'u_1',
  name: '101',
  type: 'STUDIO',
  building: 'Block A',
  qrQuota: 5,
  isActive: true,
  project: null,
  contacts: [],
  visitorQRs: [],
  _count: { visitorQRs: 0 },
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/units?format=csv — audit logging', () => {
  let GET: (req: unknown) => Promise<{ status: number; json?: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET as typeof GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditLogCreate.mockResolvedValue({});
    mockUnitFindMany.mockResolvedValue([UNIT_ROW]);
    mockUnitCount.mockResolvedValue(1);
    mockProjectFindFirst.mockResolvedValue(null);
    mockGateFindFirst.mockResolvedValue(null);
    mockContactFindFirst.mockResolvedValue(null);
  });

  it('creates UNITS_EXPORT audit log on CSV export', async () => {
    const orgId = 'org_units_csv_1';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u_1', email: 'a@b.com' });

    const res = await GET(makeGetRequest('?format=csv'));

    expect(res.status).toBe(200);
    expect(mockAuditLogCreate).toHaveBeenCalledTimes(1);

    const auditCall = mockAuditLogCreate.mock.calls[0][0];
    expect(auditCall.data.organizationId).toBe(orgId);
    expect(auditCall.data.action).toBe('UNITS_EXPORT');
    expect(auditCall.data.entityType).toBe('Unit');
    expect(typeof auditCall.data.metadata.rowCount).toBe('number');
  });

  it('does NOT create audit log for JSON requests', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_units_json', sub: 'u_2', email: 'b@c.com' });

    await GET(makeGetRequest('?format=json'));

    expect(mockAuditLogCreate).not.toHaveBeenCalled();
  });

  it('returns 401 and no audit log when unauthenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);

    const res = await GET(makeGetRequest('?format=csv'));

    expect(res.status).toBe(401);
    expect(mockAuditLogCreate).not.toHaveBeenCalled();
  });

  it('metadata contains rowCount and filter scalars only', async () => {
    const orgId = 'org_units_csv_2';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u_3', email: 'c@d.com' });

    await GET(makeGetRequest('?format=csv&unitType=STUDIO'));

    const auditCall = mockAuditLogCreate.mock.calls[0][0];
    const meta = auditCall.data.metadata;
    expect(meta.rowCount).toBeDefined();
    expect(meta.filters).toBeDefined();
    // No PII — unit names, contact names should not appear in filters
    expect(JSON.stringify(meta.filters)).not.toContain('101');
  });
});
