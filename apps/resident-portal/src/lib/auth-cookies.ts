import { cookies } from 'next/headers';
import { verifyAccessToken, type AccessTokenClaims } from './auth';

const ACCESS_COOKIE = 'gf_access_token';

export async function getSessionClaims(): Promise<AccessTokenClaims | null> {
  const token = cookies().get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}
