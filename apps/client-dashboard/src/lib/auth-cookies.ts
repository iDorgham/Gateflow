import { cookies, headers } from 'next/headers';
import { verifyAccessToken, type AccessTokenClaims } from './auth';

const ACCESS_COOKIE = 'gf_access_token';
const REFRESH_COOKIE = 'gf_refresh_token';
const CSRF_COOKIE = 'gf_csrf_token';
const SECURE = process.env.NODE_ENV === 'production';

/**
 * Parent cookie domain for cross-subdomain SSO (app ↔ portal).
 * Production should set `AUTH_COOKIE_DOMAIN=.gateflow.site`.
 * Omit locally so cookies remain host-only on localhost.
 */
export function resolveAuthCookieDomain(
  env: NodeJS.ProcessEnv = process.env
): string | undefined {
  const raw = env.AUTH_COOKIE_DOMAIN?.trim();
  if (!raw) return undefined;
  return raw.startsWith('.') ? raw : `.${raw}`;
}

function withAuthCookieDomain<T extends Record<string, unknown>>(
  options: T
): T & { domain?: string } {
  const domain = resolveAuthCookieDomain();
  return domain ? { ...options, domain } : options;
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const jar = await cookies();
  jar.set(
    ACCESS_COOKIE,
    accessToken,
    withAuthCookieDomain({
      httpOnly: true,
      secure: SECURE,
      sameSite: 'lax' as const,
      maxAge: 60 * 15, // 15 min — matches JWT expiry
      path: '/',
    })
  );
  jar.set(
    REFRESH_COOKIE,
    refreshToken,
    withAuthCookieDomain({
      httpOnly: true,
      secure: SECURE,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
  );
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  const domain = resolveAuthCookieDomain();
  // Delete host-only leftovers (pre-Domain fix) and parent-domain cookies.
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE]) {
    jar.delete(name);
    if (domain) {
      jar.delete({ name, path: '/', domain });
    }
  }
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function getSessionClaims(): Promise<AccessTokenClaims | null> {
  // 1. Check Authorization header (for mobile apps / API clients)
  let authHeaderStr: string | null = null;
  try {
    const reqHeaders = await headers();
    authHeaderStr =
      reqHeaders.get('authorization') || reqHeaders.get('Authorization');
  } catch {
    // Context where headers() might not be available, continue to cookies
  }

  if (authHeaderStr && authHeaderStr.startsWith('Bearer ')) {
    const token = authHeaderStr.substring(7);
    try {
      return await verifyAccessToken(token);
    } catch {
      return null;
    }
  }

  // 2. Check cookies (for web dashboard)
  let token: string | undefined;
  try {
    token = (await cookies()).get(ACCESS_COOKIE)?.value;
  } catch {
    // Context where cookies() might not be available
  }

  if (!token) return null;
  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}
