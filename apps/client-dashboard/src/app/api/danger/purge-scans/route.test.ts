export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    private readonly body: unknown;

    constructor(_url: string, init?: { body?: string }) {
      this.body = init?.body ? JSON.parse(init.body) : {};
    }

    async json() {
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

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockScanLogDeleteMany = jest.fn();
const mockScanLogUpdateMany = jest.fn();
const mockAuditLogCreate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    scanLog: {
      deleteMany: (...args: unknown[]) => mockScanLogDeleteMany(...args),
      updateMany: (...args: unknown[]) => mockScanLogUpdateMany(...args),
    },
    auditLog: {
      create: (...args: unknown[]) => mockAuditLogCreate(...args),
    },
  },
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

function request(body: object) {
  return new NextRequest('http://localhost/api/danger/purge-scans', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionClaims.mockResolvedValue({
    orgId: 'org-1',
    sub: 'admin-1',
    permissions: { 'workspace:manage': true },
  });
  mockScanLogUpdateMany.mockResolvedValue({ count: 3 });
  mockAuditLogCreate.mockResolvedValue({ id: 'audit-1' });
});

describe('POST /api/danger/purge-scans', () => {
  it('rejects the destructive legacy confirmation phrase', async () => {
    const response = await POST(
      request({ confirmation: 'PURGE SCANS', olderThanDays: 90 })
    );

    expect(response.status).toBe(400);
    expect(mockScanLogDeleteMany).not.toHaveBeenCalled();
    expect(mockScanLogUpdateMany).not.toHaveBeenCalled();
  });

  it('redacts only optional attribution metadata and preserves scan evidence', async () => {
    const response = await POST(
      request({
        confirmation: 'REDACT SCAN METADATA',
        olderThanDays: 90,
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, redactedCount: 3 });
    expect(mockScanLogDeleteMany).not.toHaveBeenCalled();
    expect(mockScanLogUpdateMany).toHaveBeenCalledWith({
      where: {
        gate: { organizationId: 'org-1' },
        scannedAt: { lt: expect.any(Date) },
        OR: [
          { utmCampaign: { not: null } },
          { utmContent: { not: null } },
          { utmMedium: { not: null } },
          { utmSource: { not: null } },
          { utmTerm: { not: null } },
        ],
      },
      data: {
        utmCampaign: null,
        utmContent: null,
        utmMedium: null,
        utmSource: null,
        utmTerm: null,
      },
    });
  });

  it('records an organization-scoped redaction receipt without scan content', async () => {
    await POST(
      request({
        confirmation: 'REDACT SCAN METADATA',
        olderThanDays: 180,
      })
    );

    expect(mockAuditLogCreate).toHaveBeenCalledWith({
      data: {
        action: 'SCAN_LOG_METADATA_REDACTED',
        entityType: 'ScanLog',
        organizationId: 'org-1',
        userId: 'admin-1',
        metadata: {
          cutoff: expect.any(String),
          fields: [
            'utmCampaign',
            'utmContent',
            'utmMedium',
            'utmSource',
            'utmTerm',
          ],
          olderThanDays: 180,
          redactedCount: 3,
        },
      },
    });
  });

  it('rejects cross-tenant-capable access when organization context is absent', async () => {
    mockGetSessionClaims.mockResolvedValue({
      orgId: null,
      sub: 'admin-1',
      permissions: { 'workspace:manage': true },
    });

    const response = await POST(
      request({
        confirmation: 'REDACT SCAN METADATA',
        olderThanDays: 90,
      })
    );

    expect(response.status).toBe(401);
    expect(mockScanLogUpdateMany).not.toHaveBeenCalled();
    expect(mockAuditLogCreate).not.toHaveBeenCalled();
  });
});
