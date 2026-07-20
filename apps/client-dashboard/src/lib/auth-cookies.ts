import { cookies, headers } from 'next/headers';
import { verifyAccessToken, type AccessTokenClaims } from './auth';

const ACCESS_COOKIE = 'gf_access_token';
const REFRESH_COOKIE = 'gf_refresh_token';
const SECURE = process.env.NODE_ENV === 'production';

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 min — matches JWT expiry
    path: '/',
  });
  jar.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete('gf_csrf_token');
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
