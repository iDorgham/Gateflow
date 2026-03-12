/**
 * Unit tests for POST /api/qrcodes/bulk-delete
 * — Phase 10 bulk selection delete: soft delete + audit log.
 */
export {};

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

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockCheckRateLimit = jest.fn();
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

const mockUpdateMany = jest.fn();
const mockAuditCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    qRCode: { updateMany: (...args: unknown[]) => mockUpdateMany(...args) },
    auditLog: { create: (...args: unknown[]) => mockAuditCreate(...args) },
  },
  EventType: {
    QR_CREATED: 'QR_CREATED',
    QR_UPDATED: 'QR_UPDATED',
    QR_DELETED: 'QR_DELETED',
    SCAN_RECORDED: 'SCAN_RECORDED',
    CONTACT_CREATED: 'CONTACT_CREATED',
    CONTACT_UPDATED: 'CONTACT_UPDATED',
    VISITOR_QR_CREATED: 'VISITOR_QR_CREATED',
    VISITOR_QR_DELETED: 'VISITOR_QR_DELETED',
  },
}));

function makePostRequest(body: unknown) {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest('http://localhost/api/qrcodes/bulk-delete', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/qrcodes/bulk-delete', () => {
  let POST: (
    req: unknown
  ) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    POST = mod.POST as typeof POST;
  });

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when no session', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makePostRequest({ ids: ['qr1'] }));
    expect(res.status).toBe(401);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it('soft deletes ids and writes audit log', async () => {
    const orgId = 'org_bulk_1';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'u1' });
    mockCheckRateLimit.mockResolvedValue({ allowed: true });
    mockUpdateMany.mockResolvedValue({ count: 2 });

    const res = await POST(makePostRequest({ ids: ['qr1', 'qr2'] }));
    expect(res.status).toBe(200);

    const call = mockUpdateMany.mock.calls[0]?.[0] as {
      where: { organizationId: string; deletedAt: null; id: { in: string[] } };
    };
    expect(call.where.organizationId).toBe(orgId);
    expect(call.where.deletedAt).toBeNull();
    expect(call.where.id.in).toEqual(['qr1', 'qr2']);
    expect(mockAuditCreate).toHaveBeenCalled();

    const body = await res.json();
    const json = body as { success: boolean; deletedCount: number };
    expect(json.success).toBe(true);
    expect(json.deletedCount).toBe(2);
  });
});
