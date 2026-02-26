/**
 * Admin authentication helpers.
 *
 * Strategy: single ADMIN_ACCESS_KEY environment variable.
 * When the admin enters it on the login page, the server generates a signed session token.
 * On every request the middleware verifies the token signature and expiration.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateSessionToken, verifySessionToken } from './admin-session';

const COOKIE_NAME = 'admin_session';
const SECURE = process.env.NODE_ENV === 'production';

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Returns the secret key for signing sessions. */
function getSecret(): string {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key || key.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[admin-auth] ADMIN_ACCESS_KEY is missing or too short. ' +
        'Set it to a random 64-char string before deploying.'
      );
    }
    // Dev-only fallback — never reachable in production if configured correctly
    return 'dev-admin-key-change-in-production';
  }
  return key;
}

/** True if the request's admin_session cookie is valid. */
export function isAdminAuthenticated(): boolean {
  try {
    const jar = cookies();
    const sessionCookie = jar.get(COOKIE_NAME)?.value;
    if (!sessionCookie) return false;

    const payload = verifySessionToken(sessionCookie, getSecret());
    return !!payload;
  } catch {
    return false;
  }
}

/**
 * Use at the top of every admin server component / action.
 * Redirects to /login if the session is invalid.
 */
export function requireAdmin(): void {
  if (!isAdminAuthenticated()) {
    redirect('/login');
  }
}

/** Sets the admin session cookie. */
export function setAdminSession(): void {
  const token = generateSessionToken(getSecret());
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  });
}

/** Clears the admin session cookie. */
export function clearAdminSession(): void {
  cookies().delete(COOKIE_NAME);
}
