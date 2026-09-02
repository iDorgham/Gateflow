import { GET } from './route';
import { NextRequest } from 'next/server';

const mockRequireAdminApi = jest.fn();
jest.mock('@/lib/require-admin-api', () => ({
  requireAdminApi: (...args: unknown[]) => mockRequireAdminApi(...args),
}));

const mockAiLogFindMany = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    aiActionLog: {
      findMany: (...args: unknown[]) => mockAiLogFindMany(...args),
    },
  },
}));

function makeRequest(url = 'http://localhost/api/admin/analytics/ai-cost') {
  return new NextRequest(url, {
    headers: { 'x-admin-key': 'test-key' },
  });
}

describe('GET /api/admin/analytics/ai-cost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminApi.mockResolvedValue(null);
  });

  it('returns 401 when admin auth fails', async () => {
    const { NextResponse } = await import('next/server');
    mockRequireAdminApi.mockResolvedValue(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    expect(mockAiLogFindMany).not.toHaveBeenCalled();
  });

  it('returns aggregate totals over the window', async () => {
    const now = Date.now();
    const dayAgo = new Date(now - 86400000);
    mockAiLogFindMany.mockResolvedValue([
      {
        id: 'a1',
        createdAt: new Date(now),
        totalTokens: 100,
        completionTokens: 40,
        promptTokens: 60,
        estimatedCost: 0.05,
        actionType: 'CHAT',
      },
      {
        id: 'a2',
        createdAt: new Date(now - 3600000),
        totalTokens: 200,
        completionTokens: 120,
        promptTokens: 80,
        estimatedCost: 0.12,
        actionType: 'CHAT',
      },
      {
        id: 'a3',
        createdAt: dayAgo,
        totalTokens: 300,
        completionTokens: 150,
        promptTokens: 150,
        estimatedCost: 0.2,
        actionType: 'IMAGE',
      },
    ]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    expect(json.totals.totalTokens).toBe(600);
    expect(json.totals.totalCost).toBeCloseTo(0.37, 5);
    expect(json.totals.totalActions).toBe(3);

    // Two distinct days should be represented in the series
    expect(json.series).toHaveLength(2);
  });

  it('normalizes NaN/incomplete cost and token records defensively', async () => {
    // A record with missing cost/tokens must not break the aggregate
    mockAiLogFindMany.mockResolvedValue([
      {
        id: 'x1',
        createdAt: new Date(),
        totalTokens: null,
        estimatedCost: null,
        actionType: 'CHAT',
      },
      {
        id: 'x2',
        createdAt: new Date(),
        totalTokens: 10,
        estimatedCost: 0.01,
        actionType: 'CHAT',
      },
    ]);
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.totals.totalTokens).toBe(10);
    expect(json.totals.totalCost).toBeCloseTo(0.01, 5);
    expect(json.totals.totalActions).toBe(2);
  });

  it('scopes the query to the requested lookback window', async () => {
    mockAiLogFindMany.mockResolvedValue([]);
    await GET(
      makeRequest('http://localhost/api/admin/analytics/ai-cost?days=7')
    );
    const arg = mockAiLogFindMany.mock.calls[0][0];
    expect(arg.where.createdAt.gte).toBeInstanceOf(Date);
  });

  it('returns 500 on database error', async () => {
    mockAiLogFindMany.mockRejectedValue(new Error('DB down'));
    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
  });
});
