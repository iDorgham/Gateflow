/**
 * POST /api/admin/emulate-traffic — Super Admin, CSRF, rate limit, Zod, org check, runEmulation.
 */

process.env.QR_SIGNING_SECRET =
  process.env.QR_SIGNING_SECRET ||
  'test-qr-signing-secret-that-is-at-least-32-chars!!';

const mockGetSessionClaims = jest.fn();
const mockValidateCsrf = jest.fn();
const mockCheckRateLimit = jest.fn();
const mockOrgFindFirst = jest.fn();
const mockAiActionLogCreate = jest.fn();
const mockRunEmulation = jest.fn();

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

jest.mock('@/lib/csrf', () => ({
  validateCsrfToken: (...args: unknown[]) => mockValidateCsrf(...args),
}));

jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

jest.mock('@gate-access/db', () => ({
  RUSH_SCENARIOS: [
    'luxury-compound',
    'nightclub',
    'private-school',
    'wedding-venue',
  ],
  AiActionStatus: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    EXECUTED: 'EXECUTED',
    FAILED: 'FAILED',
  },
  prisma: {
    organization: {
      findFirst: (...args: unknown[]) => mockOrgFindFirst(...args),
    },
    aiActionLog: {
      create: (...args: unknown[]) => mockAiActionLogCreate(...args),
    },
  },
  runEmulation: (...args: unknown[]) => mockRunEmulation(...args),
}));

import { NextRequest } from 'next/server';
import { BUILT_IN_ROLES } from '@gate-access/types';

const SUPER_CLAIMS = {
  sub: 'super_user_1',
  email: 'super@test.com',
  roleId: 'role_1',
  roleName: BUILT_IN_ROLES.SUPER_ADMIN,
  permissions: {} as Record<string, boolean>,
  orgId: 'org_platform',
};

const VALID_BODY = {
  organizationId: 'org_target',
  scenario: 'luxury-compound',
  pastDays: 7,
  totalScans: 50,
  incidentRate: 0.05,
  randomSeed: 99,
  dryRun: true,
};

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/admin/emulate-traffic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': 'test-csrf',
      Cookie: 'gf_csrf_token=test-csrf',
    },
    body: JSON.stringify(body),
  });
}

let POST: (req: NextRequest) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('./route');
  POST = mod.POST;
});

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionClaims.mockResolvedValue(SUPER_CLAIMS);
  mockValidateCsrf.mockResolvedValue(true);
  mockCheckRateLimit.mockResolvedValue({
    allowed: true,
    limit: 5,
    remaining: 4,
    retryAfterMs: 0,
  });
  mockOrgFindFirst.mockResolvedValue({ id: 'org_target' });
  mockAiActionLogCreate.mockResolvedValue({ id: 'log1' });
});

describe('POST /api/admin/emulate-traffic', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(401);
  });

  it('returns 403 when not Super Admin', async () => {
    mockGetSessionClaims.mockResolvedValue({
      ...SUPER_CLAIMS,
      roleName: BUILT_IN_ROLES.ORG_ADMIN,
    });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(403);
  });

  it('returns 403 when CSRF invalid', async () => {
    mockValidateCsrf.mockResolvedValue(false);
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(403);
  });

  it('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      limit: 5,
      remaining: 0,
      retryAfterMs: 4000,
    });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('4');
  });

  it('returns 400 for invalid body', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, pastDays: 0 }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when organization missing', async () => {
    mockOrgFindFirst.mockResolvedValue(null);
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(404);
  });

  it('returns 500 when QR secret missing and not dry run', async () => {
    const prev = process.env.QR_SIGNING_SECRET;
    delete process.env.QR_SIGNING_SECRET;
    const res = await POST(makeRequest({ ...VALID_BODY, dryRun: false }));
    process.env.QR_SIGNING_SECRET = prev;
    expect(res.status).toBe(500);
  });

  it('returns 200 dry-run and strips signed payload from response', async () => {
    mockRunEmulation.mockResolvedValue({
      dryRun: true,
      organizationId: 'org_target',
      projectId: 'p1',
      gateId: 'g1',
      unitId: 'u1',
      contactId: 'c1',
      createdByUserId: 'staff1',
      scenario: 'luxury-compound',
      pastDays: 7,
      totalScans: 50,
      incidentRate: 0.05,
      randomSeed: 99,
      windowStartIso: '2026-01-01T00:00:00.000Z',
      windowEndIso: '2026-01-08T00:00:00.000Z',
    });

    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.dryRun).toBe(true);
    expect(mockAiActionLogCreate).toHaveBeenCalledTimes(1);
  });

  it('returns 400 on EmulationResolutionError-shaped errors', async () => {
    mockRunEmulation.mockRejectedValue(
      Object.assign(new Error('No unit'), {
        name: 'EmulationResolutionError',
        code: 'NO_UNIT',
      })
    );

    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe('NO_UNIT');
    expect(mockAiActionLogCreate).toHaveBeenCalled();
  });
});
