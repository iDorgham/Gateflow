export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    readonly url: string;
    constructor(url: string) {
      this.url = url;
    }
  }

  class MockNextResponse {
    readonly body: unknown;
    readonly status: number;
    readonly headers: Record<string, string>;

    constructor(
      body: unknown,
      init?: { status?: number; headers?: Record<string, string> }
    ) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = init?.headers ?? {};
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === 'string'
        ? this.body
        : JSON.stringify(this.body);
    }

    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

const mockCheckRateLimit = jest.fn();
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: () => mockCheckRateLimit(),
}));

const mockOrgFindFirst = jest.fn();
const mockUserFindMany = jest.fn();
const mockAuditLogFindMany = jest.fn();
const mockAuditLogFindFirst = jest.fn();
const mockAuditLogCreate = jest.fn();
const mockVerifyAuditLedgerIntegrity = jest.fn();
const mockCreateChainedAuditLog = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    organization: {
      findFirst: (...args: unknown[]) => mockOrgFindFirst(...args),
    },
    user: {
      findMany: (...args: unknown[]) => mockUserFindMany(...args),
    },
    auditLog: {
      findMany: (...args: unknown[]) => mockAuditLogFindMany(...args),
      findFirst: (...args: unknown[]) => mockAuditLogFindFirst(...args),
      create: (...args: unknown[]) => mockAuditLogCreate(...args),
    },
  },
  verifyAuditLedgerIntegrity: (...args: unknown[]) =>
    mockVerifyAuditLedgerIntegrity(...args),
  createChainedAuditLog: (...args: unknown[]) =>
    mockCreateChainedAuditLog(...args),
}));

import { GET } from './route';
import { NextRequest } from 'next/server';

describe('GET /api/security/audit-export', () => {
  const ORG_ID = 'org_test_123';
  const USER_ID = 'usr_admin_001';

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({ allowed: true });
    mockGetSessionClaims.mockResolvedValue({
      sub: USER_ID,
      orgId: ORG_ID,
      role: 'ADMIN',
      permissions: { 'workspace:manage': true },
    });

    mockOrgFindFirst.mockResolvedValue({
      id: ORG_ID,
      name: 'Selena Bay Compound',
      domain: 'selena-bay.gateflow.site',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    mockUserFindMany.mockResolvedValue([
      {
        id: USER_ID,
        name: 'Admin',
        email: 'admin@gateflow.site',
        role: 'ADMIN',
      },
    ]);

    mockAuditLogFindMany.mockResolvedValue([
      {
        id: 'log_01',
        action: 'PASS_CREATED',
        entityType: 'QR_CODE',
        entityId: 'qr_11',
        userId: USER_ID,
        createdAt: new Date('2026-08-26T10:00:00.000Z'),
        metadata: { seq: 1, previousHash: '0000', hash: 'aaaa' },
      },
    ]);

    mockVerifyAuditLedgerIntegrity.mockResolvedValue({
      isValid: true,
      totalEntries: 1,
      checkedAt: '2026-08-26T12:00:00.000Z',
      organizationId: ORG_ID,
      latestHash: 'aaaa',
      tamperedIndex: null,
      tamperedId: null,
      errorReason: null,
    });
  });

  test('rejects unauthenticated requests with 401', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const req = new NextRequest(
      'https://app.gateflow.site/api/security/audit-export'
    );
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  test('rejects requests without workspace:manage permission with 403', async () => {
    mockGetSessionClaims.mockResolvedValue({
      sub: USER_ID,
      orgId: ORG_ID,
      role: 'GUARD',
      permissions: { 'gates:view': true },
    });

    const req = new NextRequest(
      'https://app.gateflow.site/api/security/audit-export'
    );
    const res = await GET(req);

    expect(res.status).toBe(403);
  });

  test('returns JSON compliance export package with integrity seal', async () => {
    const req = new NextRequest(
      'https://app.gateflow.site/api/security/audit-export?format=json'
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.complianceStandard).toBe('EGYPT_LAW_151_SAUDI_PDPL_AUDIT_V1');
    expect(data.organization.name).toBe('Selena Bay Compound');
    expect(data.integritySeal.isValid).toBe(true);
    expect(data.records).toHaveLength(1);
  });

  test('returns CSV compliance export with correct headers and attachment header', async () => {
    const req = new NextRequest(
      'https://app.gateflow.site/api/security/audit-export?format=csv'
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers['Content-Type']).toContain('text/csv');
    expect(res.headers['Content-Disposition']).toContain(
      'gateflow-audit-selena-bay'
    );

    const csvText = await res.text();
    expect(csvText).toContain('# GateFlow MENA Security Compliance Export');
    expect(csvText).toContain('PASS_CREATED');
  });
});
