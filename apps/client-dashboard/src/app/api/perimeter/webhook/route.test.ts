/**
 * Unit tests for POST /api/perimeter/webhook
 */
export {};

import crypto from 'crypto';

import { PerimeterEventType } from '@/lib/types/perimeter';

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    headers: { get: (k: string) => string | null };
    private _body: string;
    nextUrl: { searchParams: URLSearchParams };

    constructor(
      url: string,
      init?: {
        method?: string;
        body?: string;
        headers?: Record<string, string>;
      }
    ) {
      this.url = url;
      this._body = init?.body ?? '{}';

      const headers = init?.headers ?? {};
      this.headers = {
        get: (key: string) => {
          const lower = key.toLowerCase();
          return headers[lower] ?? headers[key] ?? null;
        },
      };

      this.nextUrl = { searchParams: new URLSearchParams(new URL(url).search) };
    }

    async text() {
      return this._body;
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

const mockScanLogFindFirst = jest.fn();
const mockIncidentFindFirst = jest.fn();
const mockIncidentCreate = jest.fn();
const mockEventLogCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    scanLog: {
      findFirst: (...args: unknown[]) => mockScanLogFindFirst(...args),
    },
    incident: {
      findFirst: (...args: unknown[]) => mockIncidentFindFirst(...args),
      create: (...args: unknown[]) => mockIncidentCreate(...args),
    },
    eventLog: { create: (...args: unknown[]) => mockEventLogCreate(...args) },
  },
  EventType: {
    WATCHLIST_ALERT: 'WATCHLIST_ALERT',
    SCAN_RECORDED: 'SCAN_RECORDED',
  },
  IncidentStatus: {
    UNDER_REVIEW: 'UNDER_REVIEW',
  },
}));

function makePostRequest(rawBody: string, headers: Record<string, string>) {
  const { NextRequest } = jest.requireMock(
    'next/server'
  ) as typeof import('next/server');
  return new NextRequest('http://localhost/api/perimeter/webhook', {
    method: 'POST',
    body: rawBody,
    headers,
  });
}

describe('POST /api/perimeter/webhook', () => {
  let POST: (
    req: unknown
  ) => Promise<{ status: number; json: () => Promise<unknown> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    POST = mod.POST as typeof POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockScanLogFindFirst.mockResolvedValue(null);
    mockIncidentFindFirst.mockResolvedValue(null);
    mockIncidentCreate.mockImplementation(async (args: any) => ({
      id: 'inc_test',
      reason: args?.data?.reason ?? 'test reason',
    }));
    mockEventLogCreate.mockResolvedValue({ id: 'evt_test' });
  });

  it('returns 401 when signature headers are missing', async () => {
    process.env.PERIMETER_WEBHOOK_SECRET = 'test_secret';

    const rawBody = JSON.stringify({
      organizationId: 'org_1',
      projectId: 'proj_1',
      gateId: 'gate_1',
      type: PerimeterEventType.TAILGATING,
      payload: { foo: 'bar' },
      timestamp: '2026-03-30T00:00:00.000Z',
    });

    const res = await POST(
      makePostRequest(rawBody, {
        'x-gf-timestamp': '2026-03-30T00:00:00.000Z',
      })
    );

    expect(res.status).toBe(401);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.message).toBe('Missing signature headers');
  });

  it('returns 401 for an invalid signature', async () => {
    process.env.PERIMETER_WEBHOOK_SECRET = 'test_secret';

    const headerTimestamp = '2026-03-30T00:00:00.000Z';
    const rawBody = JSON.stringify({
      organizationId: 'org_1',
      projectId: 'proj_1',
      gateId: 'gate_1',
      type: PerimeterEventType.TAILGATING,
      payload: { foo: 'bar' },
      timestamp: '2026-03-30T00:00:00.000Z',
    });

    const expectedSigHex = crypto
      .createHmac('sha256', process.env.PERIMETER_WEBHOOK_SECRET as string)
      .update(`${headerTimestamp}.${rawBody}`)
      .digest('hex');

    const invalidSigHex = `${expectedSigHex.slice(0, -1)}0`;

    const res = await POST(
      makePostRequest(rawBody, {
        'x-gf-signature': invalidSigHex,
        'x-gf-timestamp': headerTimestamp,
      })
    );

    expect(res.status).toBe(401);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.message).toBe('Invalid signature');
  });

  it('creates an incident + emits SSE alert on tailgating anomaly', async () => {
    process.env.PERIMETER_WEBHOOK_SECRET = 'test_secret';

    const orgId = 'org_1';
    const gateId = 'gate_1';
    const headerTimestamp = '2026-03-30T00:00:00.000Z';

    const body = {
      organizationId: orgId,
      projectId: 'proj_1',
      gateId,
      type: PerimeterEventType.TAILGATING,
      payload: { foo: 'bar' },
      timestamp: '2026-03-30T00:00:00.000Z',
    };

    const rawBody = JSON.stringify(body);

    const sigHex = crypto
      .createHmac('sha256', process.env.PERIMETER_WEBHOOK_SECRET as string)
      .update(`${headerTimestamp}.${rawBody}`)
      .digest('hex');

    // Tailgating anomaly: no recent success scan.
    mockScanLogFindFirst.mockResolvedValue(null);
    mockIncidentFindFirst.mockResolvedValue(null);

    const res = await POST(
      makePostRequest(rawBody, {
        'x-gf-signature': sigHex,
        'x-gf-timestamp': headerTimestamp,
      })
    );

    expect(res.status).toBe(200);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.success).toBe(true);

    // Org-scoped scan query must include qrCode.organizationId
    const scanWhere = mockScanLogFindFirst.mock.calls[0]?.[0]?.where as any;
    expect(scanWhere.gateId).toBe(gateId);
    expect(scanWhere.qrCode.organizationId).toBe(orgId);

    expect(mockIncidentCreate).toHaveBeenCalledTimes(1);

    // First eventLog.create should be WATCHLIST_ALERT (incident toast)
    const firstEvent = mockEventLogCreate.mock.calls[0]?.[0]?.data as any;
    expect(firstEvent.type).toBe('WATCHLIST_ALERT');
    expect(firstEvent.payload.severity).toBe('CRITICAL');
    expect(firstEvent.payload.gateId).toBe(gateId);

    // Second eventLog.create should be SCAN_RECORDED (analytics)
    const secondEvent = mockEventLogCreate.mock.calls[1]?.[0]?.data as any;
    expect(secondEvent.type).toBe('SCAN_RECORDED');
    expect(secondEvent.payload.gateId).toBe(gateId);
  });

  it('suppresses duplicate incidents within 10 seconds', async () => {
    process.env.PERIMETER_WEBHOOK_SECRET = 'test_secret';

    const orgId = 'org_1';
    const gateId = 'gate_1';
    const headerTimestamp = '2026-03-30T00:00:00.000Z';

    const body = {
      organizationId: orgId,
      projectId: 'proj_1',
      gateId,
      type: PerimeterEventType.TAILGATING,
      payload: { foo: 'bar' },
      timestamp: '2026-03-30T00:00:00.000Z',
    };

    const rawBody = JSON.stringify(body);

    const sigHex = crypto
      .createHmac('sha256', process.env.PERIMETER_WEBHOOK_SECRET as string)
      .update(`${headerTimestamp}.${rawBody}`)
      .digest('hex');

    mockScanLogFindFirst.mockResolvedValue(null);
    mockIncidentFindFirst.mockResolvedValue({ id: 'inc_existing' });

    const res = await POST(
      makePostRequest(rawBody, {
        'x-gf-signature': sigHex,
        'x-gf-timestamp': headerTimestamp,
      })
    );

    expect(res.status).toBe(200);
    expect(mockIncidentCreate).not.toHaveBeenCalled();

    // Only the generic SCAN_RECORDED event should be emitted.
    expect(mockEventLogCreate).toHaveBeenCalledTimes(1);
    const event = mockEventLogCreate.mock.calls[0]?.[0]?.data as any;
    expect(event.type).toBe('SCAN_RECORDED');
  });
});
