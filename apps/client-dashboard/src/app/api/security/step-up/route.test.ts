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

  class MockNextResponse {
    readonly body: unknown;
    readonly status: number;
    constructor(body: unknown, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }
    async json() {
      return this.body;
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

const mockVerifyArgon2 = jest.fn();
jest.mock('@node-rs/argon2', () => ({
  verify: (...args: unknown[]) => mockVerifyArgon2(...args),
}));

const mockUserFindUnique = jest.fn();
const mockAuditLogCreate = jest.fn();
const mockCreateChainedAuditLog = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockUserFindUnique(...args),
    },
    auditLog: {
      create: (...args: unknown[]) => mockAuditLogCreate(...args),
    },
  },
  createChainedAuditLog: (...args: unknown[]) =>
    mockCreateChainedAuditLog(...args),
}));

import { POST } from './route';
import { NextRequest } from 'next/server';

describe('POST /api/security/step-up', () => {
  const USER_ID = 'usr_admin_123';
  const ORG_ID = 'org_selena_456';

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({ allowed: true });
    mockGetSessionClaims.mockResolvedValue({
      sub: USER_ID,
      orgId: ORG_ID,
      role: 'ADMIN',
    });

    mockUserFindUnique.mockResolvedValue({
      id: USER_ID,
      email: 'admin@gateflow.site',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$fakehash',
    });

    mockVerifyArgon2.mockResolvedValue(true);
  });

  test('rejects unauthenticated requests with 401', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const req = new NextRequest(
      'https://app.gateflow.site/api/security/step-up',
      {
        body: JSON.stringify({
          password: 'correct-password',
          action: 'AUDIT_EXPORT',
        }),
      }
    );
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test('rejects invalid password with 401 and logs failure', async () => {
    mockVerifyArgon2.mockResolvedValue(false);

    const req = new NextRequest(
      'https://app.gateflow.site/api/security/step-up',
      {
        body: JSON.stringify({
          password: 'wrong-password',
          action: 'AUDIT_EXPORT',
        }),
      }
    );
    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Invalid password');
  });

  test('issues step-up token on valid password', async () => {
    const req = new NextRequest(
      'https://app.gateflow.site/api/security/step-up',
      {
        body: JSON.stringify({
          password: 'correct-password',
          action: 'AUDIT_EXPORT',
        }),
      }
    );
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(typeof data.stepUpToken).toBe('string');
    expect(data.expiresInSeconds).toBe(300);
  });
});
