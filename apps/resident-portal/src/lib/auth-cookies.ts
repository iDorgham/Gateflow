import { cookies } from 'next/headers';
import { verifyAccessToken, type AccessTokenClaims } from './auth';

const ACCESS_COOKIE = 'gf_access_token';
const REFRESH_COOKIE = 'gf_refresh_token';

export async function getSessionClaims(): Promise<AccessTokenClaims | null> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}

/** Clear portal session cookies (client session only; no secrets logged). */
export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete('gf_csrf_token');
}
