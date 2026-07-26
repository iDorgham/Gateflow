export {};

import crypto from 'crypto';

jest.mock('next/server', () => {
  class MockNextRequest {
    headers: { get: (key: string) => string | null };
    private readonly body: string;

    constructor(
      _url: string,
      init?: { body?: string; headers?: Record<string, string> }
    ) {
      this.body = init?.body ?? '{}';
      const headers = init?.headers ?? {};
      this.headers = {
        get: (key: string) => headers[key.toLowerCase()] ?? null,
      };
    }

    async text() {
      return this.body;
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

const mockAuditFindFirst = jest.fn();
const mockAuditCreate = jest.fn();
const mockExecuteRaw = jest.fn();
const mockUnitFindFirstTx = jest.fn();
const mockAccessRuleCreate = jest.fn();
const mockQRCodeCreate = jest.fn();
const mockVisitorQRCreate = jest.fn();
const mockUnitFindFirst = jest.fn();
const mockTransaction = jest.fn(async (callback: (tx: unknown) => unknown) =>
  callback({
    $executeRaw: mockExecuteRaw,
    auditLog: {
      findFirst: mockAuditFindFirst,
      create: mockAuditCreate,
    },
    unit: { findFirst: mockUnitFindFirstTx },
    accessRule: { create: mockAccessRuleCreate },
    qRCode: { create: mockQRCodeCreate },
    visitorQR: { create: mockVisitorQRCreate },
  })
);

jest.mock('@gate-access/db', () => ({
  prisma: {
    $transaction: (...args: unknown[]) => mockTransaction(...args),
    unit: { findFirst: (...args: unknown[]) => mockUnitFindFirst(...args) },
  },
  QRCodeType: {
    VISITOR: 'VISITOR',
    OPEN: 'OPEN',
    RECURRING: 'RECURRING',
  },
  AccessRuleType: {
    ONETIME: 'ONETIME',
    DATERANGE: 'DATERANGE',
    RECURRING: 'RECURRING',
    PERMANENT: 'PERMANENT',
  },
}));

const mockCheckQuota = jest.fn();
jest.mock('@gate-access/db/quota', () => ({
  checkAndConsumeQuota: (...args: unknown[]) => mockCheckQuota(...args),
}));

jest.mock('@gate-access/types', () => ({
  signQRPayload: jest.fn(() => 'signed-qr'),
  QRCodeType: {
    VISITOR: 'VISITOR',
    OPEN: 'OPEN',
    RECURRING: 'RECURRING',
  },
}));

const mockEmitEvent = jest.fn();
jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: (...args: unknown[]) => mockEmitEvent(...args),
  EventType: { QR_CREATED: 'QR_CREATED' },
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

const SECRET = 'whatsapp-webhook-secret-at-least-32-chars';
const EVENT_ID = 'wa_event_12345';
const BODY = {
  organizationId: 'org-1',
  unitId: 'unit-1',
  visitorName: 'Guest',
  type: 'ONETIME',
};

function request(timestamp: string, eventId = EVENT_ID) {
  const rawBody = JSON.stringify(BODY);
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${timestamp}.${eventId}.${rawBody}`)
    .digest('hex');

  return new NextRequest('http://localhost/api/webhooks/whatsapp', {
    body: rawBody,
    headers: {
      'x-gf-event-id': eventId,
      'x-gf-signature': signature,
      'x-gf-timestamp': timestamp,
    },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.WHATSAPP_WEBHOOK_SECRET = SECRET;
  process.env.QR_SIGNING_SECRET =
    'test-qr-signing-secret-that-is-at-least-32-characters';
  mockAuditFindFirst.mockResolvedValue(null);
  mockAuditCreate.mockResolvedValue({ id: 'audit-1' });
  mockExecuteRaw.mockResolvedValue(1);
  mockUnitFindFirstTx.mockResolvedValue({ userId: 'resident-1' });
  mockAccessRuleCreate.mockResolvedValue({ id: 'rule-1' });
  mockQRCodeCreate.mockResolvedValue({ id: 'qr-1' });
  mockVisitorQRCreate.mockResolvedValue({
    id: 'visitor-qr-1',
    qrCodeId: 'qr-1',
  });
  mockCheckQuota.mockResolvedValue({
    allowed: true,
    quota: 5,
    remaining: 4,
    resetDate: new Date(),
    used: 1,
  });
  mockUnitFindFirst.mockResolvedValue(null);
});

describe('POST /api/webhooks/whatsapp', () => {
  it('rejects a correctly signed stale event before database access', async () => {
    const stale = new Date(Date.now() - 10 * 60_000).toISOString();

    const response = await POST(request(stale));

    expect(response.status).toBe(401);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('acknowledges a durable duplicate without recreating a visitor QR', async () => {
    mockAuditFindFirst.mockResolvedValue({ id: 'audit-existing' });

    const response = await POST(request(new Date().toISOString()));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, duplicate: true });
    expect(mockUnitFindFirstTx).not.toHaveBeenCalled();
    expect(mockVisitorQRCreate).not.toHaveBeenCalled();
  });

  it('creates the replay marker in the same transaction as the visitor QR', async () => {
    const response = await POST(request(new Date().toISOString()));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      data: {
        visitorQRId: 'visitor-qr-1',
        qrCodeId: 'qr-1',
        status: 'PENDING_APPROVAL',
      },
    });
    expect(mockCheckQuota).toHaveBeenCalledWith('unit-1', expect.anything());
    expect(mockVisitorQRCreate).toHaveBeenCalledTimes(1);
    expect(mockAuditCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'WEBHOOK_EVENT_PROCESSED',
        entityId: EVENT_ID,
        organizationId: 'org-1',
      }),
    });
  });
});
