export {};

jest.mock('./rate-limit', () => ({
  checkRateLimit: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: { organization: { findFirst: jest.fn() } },
}));

import { NextRequest } from 'next/server';
import { prisma } from '@gate-access/db';
import { checkRateLimit } from './rate-limit';
import {
  enforceTenantAccess,
  getClientIp,
  validateAllowListInput,
} from './enforce-tenant-access';

const mockCheck = checkRateLimit as jest.Mock;
const mockFindFirst = prisma.organization.findFirst as jest.Mock;

function req(ip: string): NextRequest {
  return new NextRequest('http://localhost/api/x', {
    headers: { 'x-vercel-forwarded-for': ip },
  });
}

describe('enforce-tenant-access', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCheck.mockResolvedValue({
      allowed: true,
      limit: 100,
      remaining: 99,
      retryAfterMs: 0,
    });
  });

  it('resolves the client IP only from Vercel forwarding metadata', () => {
    expect(
      getClientIp(
        new NextRequest('http://localhost/a', {
          headers: {
            'cf-connecting-ip': '1.2.3.4',
            'x-vercel-forwarded-for': '9.9.9.9, 1.1.1.1',
          },
        })
      )
    ).toBe('9.9.9.9');
    expect(
      getClientIp(
        new NextRequest('http://localhost/a', {
          headers: {
            'cf-connecting-ip': '1.2.3.4',
            'x-forwarded-for': '2.3.4.5',
          },
        })
      )
    ).toBe('0.0.0.0');
    expect(getClientIp(new NextRequest('http://localhost/a'))).toBe('0.0.0.0');
  });

  it('denies an IP not in the tenant allow-list', async () => {
    const res = await enforceTenantAccess(req('203.0.113.9'), {
      orgId: 'org-1',
      keyPrefix: 'validate',
      allowList: ['10.0.0.0/8'],
    });
    expect(res.decision).toBe('deny_allowlist');
    expect(mockCheck).not.toHaveBeenCalled();
  });

  it('allows an IP in the tenant allow-list and rate-limits per tenant+IP', async () => {
    const res = await enforceTenantAccess(req('10.1.2.3'), {
      orgId: 'org-1',
      keyPrefix: 'validate',
      allowList: ['10.0.0.0/8'],
    });
    expect(res.decision).toBe('allow');
    expect(mockCheck).toHaveBeenCalledWith(
      'validate:org-1:10.1.2.3',
      undefined,
      undefined
    );
  });

  it('allows when no allow-list is configured', async () => {
    mockFindFirst.mockResolvedValue({ scannerConfig: null });
    const res = await enforceTenantAccess(req('203.0.113.5'), {
      orgId: 'org-1',
      keyPrefix: 'bulk',
    });
    expect(res.decision).toBe('allow');
  });

  it('loads the allow-list from tenant scannerConfig and denies', async () => {
    mockFindFirst.mockResolvedValue({
      scannerConfig: { security: { ipAllowlist: ['198.51.100.0/24'] } },
    });
    const res = await enforceTenantAccess(req('203.0.113.1'), {
      orgId: 'org-1',
      keyPrefix: 'bulk',
    });
    expect(res.decision).toBe('deny_allowlist');
  });

  it('rate-limits when the sliding window is exhausted', async () => {
    mockCheck.mockResolvedValue({
      allowed: false,
      limit: 30,
      remaining: 0,
      retryAfterMs: 40000,
    });
    const res = await enforceTenantAccess(req('203.0.113.5'), {
      orgId: 'org-1',
      keyPrefix: 'validate',
      allowList: [],
      max: 30,
      windowMs: 60000,
    });
    expect(res.decision).toBe('rate_limited');
  });

  it('validates allow-list input payloads', () => {
    const ok = validateAllowListInput(['1.2.3.4']);
    expect(ok.valid).toBe(true);
    const bad = validateAllowListInput('nope');
    expect(bad.valid).toBe(false);
  });
});
