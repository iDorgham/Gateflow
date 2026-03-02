/**
 * Unit tests for GET /api/qrcodes
 * — Phase 8 filtering: search + date ranges.
 *
 * Verifies org scoping, soft-delete enforcement, and query param validation.
 */
export {};

// ─── next/server mock ─────────────────────────────────────────────────────────
jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    nextUrl: { searchParams: URLSearchParams };

    constructor(url: string) {
      this.url = url;
      this.nextUrl = { searchParams: new URLSearchParams(new URL(url).search) };
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

const mockQRCodeFindMany = jest.fn();
const mockQRCodeCount = jest.fn();
const mockProjectFindFirst = jest.fn();
const mockGateFindFirst = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    qRCode: {
      findMany: (...args: unknown[]) => mockQRCodeFindMany(...args),
      count: (...args: unknown[]) => mockQRCodeCount(...args),
    },
    project: {
      findFirst: (...args: unknown[]) => mockProjectFindFirst(...args),
    },
    gate: {
      findFirst: (...args: unknown[]) => mockGateFindFirst(...args),
    },
  },
}));

function makeGetRequest(qs = '') {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest(`http://localhost/api/qrcodes${qs}`);
}

describe('GET /api/qrcodes — filtering & org scope', () => {
  let GET: (req: unknown) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET as typeof GET;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(401);
    expect(mockQRCodeFindMany).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid date format', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });
    const res = await GET(makeGetRequest('?createdFrom=2026-3-2'));
    expect(res.status).toBe(400);
    expect(mockQRCodeFindMany).not.toHaveBeenCalled();
  });

  it('applies org scope + deletedAt + search + created/expires/lastScan filters', async () => {
    const orgId = 'org_qr_1';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1' });

    mockQRCodeFindMany.mockResolvedValue([]);
    mockQRCodeCount.mockResolvedValue(0);

    const qs =
      '?page=1&pageSize=25' +
      '&search=abc' +
      '&createdFrom=2026-03-01&createdTo=2026-03-02' +
      '&expiresFrom=2026-03-03&expiresTo=2026-03-04' +
      '&lastScanFrom=2026-03-05&lastScanTo=2026-03-06';

    const res = await GET(makeGetRequest(qs));
    expect(res.status).toBe(200);

    const call = mockQRCodeFindMany.mock.calls[0]?.[0] as {
      where: {
        organizationId: string;
        deletedAt: null;
        OR?: unknown[];
        createdAt?: unknown;
        expiresAt?: unknown;
        scanLogs?: { some?: { scannedAt?: unknown } };
      };
    };
    expect(call.where.organizationId).toBe(orgId);
    expect(call.where.deletedAt).toBeNull();

    // Search OR includes code, utmSource, utmCampaign
    expect((call.where.OR ?? []).length).toBeGreaterThanOrEqual(1);

    // Date filters exist
    expect(call.where.createdAt).toBeDefined();
    expect(call.where.expiresAt).toBeDefined();
    expect(call.where.scanLogs?.some?.scannedAt).toBeDefined();

    const body = (await res.json()) as { success: boolean; data: unknown[] };
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  it('applies server-side pagination and allowlisted sorting', async () => {
    const orgId = 'org_qr_2';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1' });

    mockQRCodeFindMany.mockResolvedValue([]);
    mockQRCodeCount.mockResolvedValue(0);

    const res = await GET(
      makeGetRequest('?page=2&pageSize=10&sortBy=code&sortOrder=asc')
    );
    expect(res.status).toBe(200);

    const call = mockQRCodeFindMany.mock.calls[0]?.[0] as {
      skip: number;
      take: number;
      orderBy: Array<Record<string, unknown>>;
      where: { organizationId: string; deletedAt: null };
    };
    expect(call.skip).toBe(10);
    expect(call.take).toBe(10);
    expect(call.orderBy?.[0]).toEqual({ code: 'asc' });
    expect(call.where.organizationId).toBe(orgId);
    expect(call.where.deletedAt).toBeNull();
  });
});

