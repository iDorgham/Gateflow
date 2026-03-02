/**
 * Unit tests for GET /api/qrcodes/export
 * — Phase 10 export: CSV + audit log.
 */
export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    nextUrl: { searchParams: URLSearchParams };

    constructor(url: string) {
      this.url = url;
      this.nextUrl = { searchParams: new URLSearchParams(new URL(url).search) };
    }
  }

  class MockNextResponse {
    status: number;
    headers: Headers;
    body: unknown;

    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = new Headers(init?.headers ?? {});
    }

    static json(body: unknown, init?: { status?: number }) {
      return {
        status: init?.status ?? 200,
        json: async () => body,
      };
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockCheckRateLimit = jest.fn();
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

const mockQRCodeFindMany = jest.fn();
const mockAuditCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    qRCode: { findMany: (...args: unknown[]) => mockQRCodeFindMany(...args) },
    auditLog: { create: (...args: unknown[]) => mockAuditCreate(...args) },
  },
}));

function makeGetRequest(qs = '') {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest(`http://localhost/api/qrcodes/export${qs}`);
}

describe('GET /api/qrcodes/export', () => {
  let GET: (req: unknown) => Promise<unknown>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET as unknown as typeof GET;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const resUnknown = await GET(makeGetRequest());
    const res = resUnknown as { status: number };
    expect(res.status).toBe(401);
    expect(mockQRCodeFindMany).not.toHaveBeenCalled();
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  it('returns CSV and writes audit log', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });
    mockCheckRateLimit.mockResolvedValue({ allowed: true });

    mockQRCodeFindMany.mockResolvedValue([
      {
        id: 'qr1',
        code: 'ABC123',
        type: 'SINGLE',
        createdAt: new Date('2026-03-01T00:00:00.000Z'),
        expiresAt: null,
        isActive: true,
        currentUses: 0,
        maxUses: null,
        utmSource: null,
        utmCampaign: null,
        _count: { scanLogs: 0 },
        gate: { name: 'Main Gate' },
        project: { name: 'Skyline' },
        scanLogs: [],
      },
    ]);

    const resUnknown = await GET(makeGetRequest('?search=ABC&sortBy=code&sortOrder=asc'));
    const res = resUnknown as { status: number; headers: Headers; body: unknown };
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/csv');
    expect(res.headers.get('Content-Disposition')).toContain('qrcodes-');
    expect(mockAuditCreate).toHaveBeenCalled();
    expect(mockQRCodeFindMany).toHaveBeenCalled();
  });
});

