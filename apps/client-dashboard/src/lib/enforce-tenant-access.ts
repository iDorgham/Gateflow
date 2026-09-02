/**
 * Per-tenant / per-IP access enforcer.
 *
 * Combines tenant IP allow-list enforcement with Upstash-backed sliding-window
 * rate limiting, so public entry points can deny-by-IP-allowlist and throttle
 * per (tenant, IP) together.
 */
import { NextRequest } from 'next/server';
import { prisma } from '@gate-access/db';
import { checkRateLimit, type RateLimitResult } from './rate-limit';
import {
  isIpAllowed,
  normalizeAllowList,
  type AllowListNormalization,
} from './allow-list';

export type AccessDecision =
  | {
      decision: 'allow';
      reason: string;
      rateLimit: RateLimitResult;
      allowListed: boolean;
    }
  | { decision: 'deny_allowlist'; reason: string; ip: string }
  | { decision: 'rate_limited'; reason: string; rateLimit: RateLimitResult };

export interface EnforceTenantAccessOptions {
  orgId: string;
  /** Namespace prefix for the rate-limit key (e.g. 'validate', 'bulk'). */
  keyPrefix: string;
  /** Optional explicit allow-list; when omitted it is loaded from the tenant. */
  allowList?: string[];
  max?: number;
  windowMs?: number;
}

const FORWARDED_FOR = 'x-forwarded-for';
const REAL_IP = 'x-real-ip';
const CLOUDFLARE_IP = 'cf-connecting-ip';

/** Best-effort client IP resolution from trusted proxy headers. */
export function getClientIp(request: Pick<NextRequest, 'headers'>): string {
  const hdrs = request.headers;
  const cf = hdrs.get(CLOUDFLARE_IP);
  if (cf) return cf.trim();
  const real = hdrs.get(REAL_IP);
  if (real) return real.trim();
  const ff = hdrs.get(FORWARDED_FOR);
  if (ff) {
    const first = ff.split(',')[0]?.trim();
    if (first) return first;
  }
  return '0.0.0.0';
}

/** Validate + normalize a tenant allow-list payload. */
export function validateAllowListInput(value: unknown): AllowListNormalization {
  return normalizeAllowList(value);
}

/**
 * Read the org's configured IP allow-list from its `scannerConfig` JSON.
 * Returns an empty array when none is configured (allow all).
 * Only reads values under `security.ipAllowlist` to keep it namespaced.
 */
export async function loadOrgAllowList(orgId: string): Promise<string[]> {
  const org = await prisma.organization.findFirst({
    where: { id: orgId, deletedAt: null },
    select: { scannerConfig: true },
  });
  const config = org?.scannerConfig as
    { security?: { ipAllowlist?: unknown } } | null | undefined;
  const raw = config?.security?.ipAllowlist;
  const normalized = normalizeAllowList(raw);
  return normalized.valid ? normalized.entries : [];
}

/**
 * Enforce tenant IP allow-list then rate limit per (tenant, IP).
 *   - Returns deny_allowlist when the caller's IP is blocked.
 *   - Returns rate_limited when the sliding window is exhausted.
 *   - Returns allow otherwise (with rate-limit metadata for headers).
 */
export async function enforceTenantAccess(
  request: Pick<NextRequest, 'headers'>,
  options: EnforceTenantAccessOptions
): Promise<AccessDecision> {
  const ip = getClientIp(request);

  const allowList =
    options.allowList ?? (await loadOrgAllowList(options.orgId));

  if (!isIpAllowed(ip, allowList)) {
    return { decision: 'deny_allowlist', reason: 'IP not allowed', ip };
  }

  const rateLimit = await checkRateLimit(
    `${options.keyPrefix}:${options.orgId}:${ip}`,
    options.max,
    options.windowMs
  );
  if (!rateLimit.allowed) {
    return {
      decision: 'rate_limited',
      reason: 'Rate limit exceeded',
      rateLimit,
    };
  }

  return {
    decision: 'allow',
    reason: 'allowed',
    rateLimit,
    allowListed: allowList.length === 0 || isIpAllowed(ip, allowList),
  };
}
