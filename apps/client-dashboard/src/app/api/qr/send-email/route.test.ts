export {};

jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {},
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockQrFindFirst = jest.fn();
const mockOrganizationFindFirst = jest.fn();
const mockAuditCreate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    qRCode: { findFirst: (...args: unknown[]) => mockQrFindFirst(...args) },
    organization: {
      findFirst: (...args: unknown[]) => mockOrganizationFindFirst(...args),
    },
    auditLog: { create: (...args: unknown[]) => mockAuditCreate(...args) },
  },
}));

const mockToBuffer = jest.fn();
jest.mock('qrcode', () => ({
  __esModule: true,
  default: { toBuffer: (...args: unknown[]) => mockToBuffer(...args) },
}));

const mockSendMail = jest.fn();
jest.mock('@/lib/email', () => ({
  getTransporter: () => ({
    sendMail: (...args: unknown[]) => mockSendMail(...args),
  }),
  buildEmailHtml: jest.fn(() => '<html>safe</html>'),
}));

const mockCheckRateLimit = jest.fn();
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

jest.mock('nodemailer', () => ({}));

import { POST } from './route';

const STORED_QR = {
  id: 'qr-1',
  code: 'signed-db-credential',
  expiresAt: new Date('2026-08-01T00:00:00.000Z'),
};

function request(body: unknown) {
  return { json: async () => body } as never;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionClaims.mockResolvedValue({ orgId: 'org-1', sub: 'user-1' });
  mockCheckRateLimit.mockResolvedValue({
    allowed: true,
    limit: 10,
    remaining: 9,
    retryAfterMs: 0,
  });
  mockQrFindFirst.mockResolvedValue(STORED_QR);
  mockOrganizationFindFirst.mockResolvedValue({ name: 'Safe Residence' });
  mockToBuffer.mockResolvedValue(Buffer.from('png'));
  mockAuditCreate
    .mockResolvedValueOnce({ id: 'audit-attempt-1' })
    .mockResolvedValueOnce({ id: 'audit-success-1' });
  mockSendMail.mockResolvedValue({ messageId: 'provider-message-1' });
});

describe('POST /api/qr/send-email', () => {
  it('uses the tenant-owned stored credential and writes append-only delivery receipts', async () => {
    const response = await POST(
      request({
        qrId: 'qr-1',
        qrString: 'attacker-controlled-credential',
        recipientEmail: 'resident@example.com',
        recipientName: 'Resident',
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, data: { sent: true } });
    expect(mockQrFindFirst).toHaveBeenCalledWith({
      where: {
        id: 'qr-1',
        organizationId: 'org-1',
        deletedAt: null,
      },
      select: { id: true, code: true, expiresAt: true },
    });
    expect(mockToBuffer).toHaveBeenCalledWith(
      'signed-db-credential',
      expect.any(Object)
    );
    expect(mockAuditCreate).toHaveBeenNthCalledWith(1, {
      data: {
        action: 'QR_EMAIL_DELIVERY_ATTEMPTED',
        entityType: 'QRCode',
        entityId: 'qr-1',
        organizationId: 'org-1',
        userId: 'user-1',
        metadata: { channel: 'email' },
      },
    });
    expect(mockAuditCreate).toHaveBeenNthCalledWith(2, {
      data: {
        action: 'QR_EMAIL_DELIVERY_SUCCEEDED',
        entityType: 'QRCode',
        entityId: 'qr-1',
        organizationId: 'org-1',
        userId: 'user-1',
        metadata: {
          attemptAuditId: 'audit-attempt-1',
          channel: 'email',
        },
      },
    });
    expect(JSON.stringify(mockAuditCreate.mock.calls)).not.toContain(
      'resident@example.com'
    );
    expect(JSON.stringify(mockAuditCreate.mock.calls)).not.toContain(
      'signed-db-credential'
    );
    expect(JSON.stringify(mockAuditCreate.mock.calls)).not.toContain(
      'attacker-controlled-credential'
    );
  });

  it('accepts the single-create client email field without trusting its short URL', async () => {
    const response = await POST(
      request({
        qrId: 'qr-1',
        email: 'resident@example.com',
        shortUrl: 'https://attacker.example/qr',
      })
    );

    expect(response.status).toBe(200);
    expect(mockToBuffer).toHaveBeenCalledWith(
      'signed-db-credential',
      expect.any(Object)
    );
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: {
          name: 'resident@example.com',
          address: 'resident@example.com',
        },
      })
    );
  });

  it('does not send or audit a foreign or missing QR code', async () => {
    mockQrFindFirst.mockResolvedValue(null);

    const response = await POST(
      request({ qrId: 'qr-foreign', recipientEmail: 'resident@example.com' })
    );

    expect(response.status).toBe(404);
    expect(mockSendMail).not.toHaveBeenCalled();
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  it('rate limits email delivery per tenant actor before resolving a QR', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      limit: 10,
      remaining: 0,
      retryAfterMs: 30_000,
    });

    const response = await POST(
      request({ qrId: 'qr-1', recipientEmail: 'resident@example.com' })
    );

    expect(response.status).toBe(429);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(
      'qr-email:org-1:user-1',
      10,
      60_000
    );
    expect(mockQrFindFirst).not.toHaveBeenCalled();
  });

  it('appends a non-sensitive failure receipt and returns a generic error', async () => {
    mockSendMail.mockRejectedValue(
      new Error('SMTP rejected resident@example.com using password hunter2')
    );
    mockAuditCreate
      .mockReset()
      .mockResolvedValueOnce({ id: 'audit-attempt-1' })
      .mockResolvedValueOnce({ id: 'audit-failure-1' });

    const response = await POST(
      request({ qrId: 'qr-1', recipientEmail: 'resident@example.com' })
    );
    const json = await response.json();

    expect(response.status).toBe(502);
    expect(json).toEqual({
      success: false,
      message: 'Email delivery failed',
    });
    expect(mockAuditCreate).toHaveBeenNthCalledWith(2, {
      data: {
        action: 'QR_EMAIL_DELIVERY_FAILED',
        entityType: 'QRCode',
        entityId: 'qr-1',
        organizationId: 'org-1',
        userId: 'user-1',
        metadata: {
          attemptAuditId: 'audit-attempt-1',
          channel: 'email',
          errorType: 'Error',
        },
      },
    });
    expect(JSON.stringify(mockAuditCreate.mock.calls)).not.toContain('hunter2');
    expect(JSON.stringify(json)).not.toContain('resident@example.com');
  });

  it('does not misclassify a delivered email when the success receipt fails', async () => {
    mockAuditCreate
      .mockReset()
      .mockResolvedValueOnce({ id: 'audit-attempt-1' })
      .mockRejectedValueOnce(new Error('audit unavailable'));

    const response = await POST(
      request({ qrId: 'qr-1', recipientEmail: 'resident@example.com' })
    );

    expect(response.status).toBe(500);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(
      mockAuditCreate.mock.calls.some(
        ([arg]) =>
          (arg as { data?: { action?: string } }).data?.action ===
          'QR_EMAIL_DELIVERY_FAILED'
      )
    ).toBe(false);
  });
});
