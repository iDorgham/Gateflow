/**
 * Admin authentication helpers.
 *
 * Strategy: single ADMIN_ACCESS_KEY environment variable (a long random
 * secret set at deploy time). When the admin enters it on the login page,
 * the server stores sha256(key) in an httpOnly cookie. On every request the
 * middleware compares the cookie against sha256(env key).
 *
 * No JWT libraries required — standard Node.js crypto is sufficient for
 * an internal single-admin tool.
 */

import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin_session';
const SECURE = process.env.NODE_ENV === 'production';

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Returns the expected cookie value for the configured access key. */
export function expectedSessionToken(): string {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key || key.length < 32) {
    throw new Error(
      '[admin-auth] ADMIN_ACCESS_KEY is missing or too short. ' +
      'Set it to a random string (at least 32 chars) in your .env file.'
    );
  }
  return createHash('sha256').update(key).digest('hex');
}

/** True if the request's admin_session cookie is valid. */
export function isAdminAuthenticated(): boolean {
  try {
    const jar = cookies();
    const sessionCookie = jar.get(COOKIE_NAME)?.value;
    return sessionCookie === expectedSessionToken();
  } catch {
    return false;
  }
}

/**
 * Checks authentication for API route handlers.
 * Accepts either:
 *   1. A valid admin_session cookie (browser sessions), OR
 *   2. An `Authorization: Bearer <key>` header validated against
 *      the AdminAuthorizationKey table in the database.
 *
 * Returns true if authenticated, false otherwise.
 */
export async function isAdminAuthorized(request: Request): Promise<boolean> {
  // 1. Cookie-based session (browser)
  if (isAdminAuthenticated()) return true;

  // 2. Bearer token (programmatic API access)
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.slice(7).trim();
  if (!token) return false;

  const tokenHash = createHash('sha256').update(token).digest('hex');

  try {
    const { prisma } = await import('@gate-access/db');
    const keyRecord = await prisma.adminAuthorizationKey.findUnique({
      where: { keyHash: tokenHash },
      select: { id: true, expiresAt: true },
    });

    if (!keyRecord) return false;

    // Check expiry
    if (keyRecord.expiresAt && keyRecord.expiresAt <= new Date()) return false;

    // Update lastUsedAt (fire-and-forget)
    void prisma.adminAuthorizationKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
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
  cookies().set(COOKIE_NAME, expectedSessionToken(), {
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
