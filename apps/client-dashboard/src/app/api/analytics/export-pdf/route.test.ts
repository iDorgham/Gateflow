/**
 * Unit tests for GET /api/analytics/export-pdf
 * Covers: unauth, invalid filters, happy path (pdf headers), locale=ar labels.
 */
export {};

import { GET } from './route';

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

// Minimal PDFKit mock that captures written text and returns a Buffer.
const pdfTexts: string[] = [];
jest.mock('pdfkit', () => {
  class MockPDFDocument {
    page = { height: 842 };
    private handlers: Record<string, ((arg?: unknown) => void)[]> = {};

    on(event: string, cb: (arg?: unknown) => void) {
      this.handlers[event] = this.handlers[event] ?? [];
      this.handlers[event].push(cb);
      return this;
    }
    fontSize() {
      return this;
    }
    fillColor() {
      return this;
    }
    moveDown() {
      return this;
    }
    text(value: string) {
      pdfTexts.push(value);
      return this;
    }
    end() {
      const dataHandlers = this.handlers['data'] ?? [];
      const endHandlers = this.handlers['end'] ?? [];
      dataHandlers.forEach((h) => h(Buffer.from('%PDF-1.4 mock')));
      endHandlers.forEach((h) => h());
    }
  }
  return { __esModule: true, default: MockPDFDocument };
});

const mockValidateAnalyticsQuery = jest.fn();
const mockAnalyticsQuerySchemaSafeParse = jest.fn();
jest.mock('@/lib/analytics/analytics-query', () => ({
  AnalyticsQuerySchema: {
    safeParse: (...args: unknown[]) => mockAnalyticsQuerySchemaSafeParse(...args),
  },
  validateAnalyticsQuery: (...args: unknown[]) => mockValidateAnalyticsQuery(...args),
}));

const mockOrgFindUnique = jest.fn();
const mockScanLogCount = jest.fn();
const mockScanLogGroupBy = jest.fn();
const mockQueryRaw = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: { findUnique: (...args: unknown[]) => mockOrgFindUnique(...args) },
    scanLog: {
      count: (...args: unknown[]) => mockScanLogCount(...args),
      groupBy: (...args: unknown[]) => mockScanLogGroupBy(...args),
    },
    $queryRaw: (...args: unknown[]) => mockQueryRaw(...args),
  },
}));

function makeReq(url: string) {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest(url);
}

beforeEach(() => {
  jest.clearAllMocks();
  pdfTexts.length = 0;

  mockGetSessionClaims.mockResolvedValue({ orgId: 'org-1' });
  mockAnalyticsQuerySchemaSafeParse.mockReturnValue({
    success: true,
    data: {
      dateFrom: '2026-03-01',
      dateTo: '2026-03-02',
      projectId: '',
      gateId: '',
      unitType: '',
    },
  });
  mockValidateAnalyticsQuery.mockResolvedValue({
    ok: true,
    ctx: {
      orgId: 'org-1',
      dateFrom: '2026-03-01',
      dateTo: '2026-03-02',
      projectId: '',
      gateId: '',
      unitType: '',
      dateFromDate: new Date('2026-03-01T00:00:00.000Z'),
      dateToDate: new Date('2026-03-02T23:59:59.999Z'),
    },
  });
  mockOrgFindUnique.mockResolvedValue({ name: 'Test Workspace' });

  // Summary query calls.
  mockScanLogCount.mockResolvedValue(10);
  mockScanLogGroupBy.mockResolvedValue([{ scannedAt: new Date('2026-03-01T05:00:00.000Z') }]);
  // Visits series raw query.
  mockQueryRaw.mockResolvedValue([
    { date: '2026-03-01', count: BigInt(7) },
    { date: '2026-03-02', count: BigInt(3) },
  ]);
});

describe('GET /api/analytics/export-pdf', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = (await GET(
      makeReq('http://localhost/api/analytics/export-pdf?dateFrom=2026-03-01&dateTo=2026-03-02')
    )) as unknown as { status: number; json: () => Promise<unknown> };
    expect(res.status).toBe(401);
    const body = (await res.json()) as unknown;
    expect(body).toEqual({ success: false, message: 'Unauthorized' });
  });

  it('returns 400 when query params invalid', async () => {
    mockAnalyticsQuerySchemaSafeParse.mockReturnValue({ success: false });
    const res = (await GET(
      makeReq('http://localhost/api/analytics/export-pdf?dateFrom=bad&dateTo=bad')
    )) as unknown as { status: number; json: () => Promise<unknown> };
    expect(res.status).toBe(400);
    const body = (await res.json()) as unknown;
    expect(body).toEqual({ success: false, message: 'Invalid query params' });
  });

  it('returns a PDF with headers on success (en)', async () => {
    const res = (await GET(
      makeReq('http://localhost/api/analytics/export-pdf?dateFrom=2026-03-01&dateTo=2026-03-02')
    )) as unknown as { status: number; headers: { get: (k: string) => string | null } };
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
    expect(res.headers.get('Content-Disposition')).toContain('analytics-2026-03-01-to-2026-03-02.pdf');
  });

  it('writes Arabic title when locale=ar', async () => {
    await GET(
      makeReq(
        'http://localhost/api/analytics/export-pdf?dateFrom=2026-03-01&dateTo=2026-03-02&locale=ar'
      )
    );
    expect(pdfTexts.some((t) => t.includes('تقرير'))).toBe(true);
  });
});

