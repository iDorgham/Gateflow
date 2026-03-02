/**
 * Unit tests for GET /api/gates — org scoping and soft-delete enforcement.
 *
 * Phase 1 (core_security_v6): Asserts that tenant-scoped data is not returned
 * for another org and that soft-deleted entities are excluded from reads.
 */
export {};

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockGateFindMany = jest.fn();
const mockScanLogGroupBy = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findMany: (...args: unknown[]) => mockGateFindMany(...args),
    },
    scanLog: {
      groupBy: (...args: unknown[]) => mockScanLogGroupBy(...args),
    },
  },
}));

describe('GET /api/gates', () => {
  let GET: () => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockScanLogGroupBy.mockResolvedValue([]);
  });

  it('returns 401 when session has no claims', async () => {
    mockGetSessionClaims.mockResolvedValue(null);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toMatch(/[Uu]nauthorized/);
    expect(mockGateFindMany).not.toHaveBeenCalled();
  });

  it('returns 401 when session has no orgId', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'user_1', email: 'test@test.com' });

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(mockGateFindMany).not.toHaveBeenCalled();
  });

  it('scopes gate list by organizationId and excludes soft-deleted gates', async () => {
    const orgId = 'org_secure_123';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'user_1', email: 'a@b.com' });
    mockGateFindMany.mockResolvedValue([
      {
        id: 'gate_1',
        name: 'Main Gate',
        location: 'Lobby',
        isActive: true,
        lastAccessedAt: null,
        createdAt: new Date(),
        _count: { qrCodes: 2, scanLogs: 10 },
      },
    ]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].name).toBe('Main Gate');

    expect(mockGateFindMany).toHaveBeenCalledTimes(1);
    const findManyCall = mockGateFindMany.mock.calls[0][0];
    expect(findManyCall.where).toEqual({
      organizationId: orgId,
      deletedAt: null,
    });
  });

  it('scopes scanLog.groupBy by gate.organizationId', async () => {
    const orgId = 'org_secure_456';
    mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'user_2', email: 'b@c.com' });
    mockGateFindMany.mockResolvedValue([]);

    await GET();

    expect(mockScanLogGroupBy).toHaveBeenCalledTimes(1);
    const groupByCall = mockScanLogGroupBy.mock.calls[0][0];
    expect(groupByCall.where.gate).toEqual({ organizationId: orgId });
  });
});
