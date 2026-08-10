/**
 * Admin authentication helpers.
 *
 * Strategy: single ADMIN_ACCESS_KEY environment variable (a long random
 * secret set at deploy time). On login the server issues a signed session
 * cookie (HMAC-SHA256, unique jti + expiry). Middleware and server checks
 * verify the signature — never store a static hash of the access key.
 */

import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n/i18n-config';
import { generateSessionToken, verifySessionToken } from './admin-session';

const COOKIE_NAME = 'admin_session';
const SECURE = process.env.NODE_ENV === 'production';
const SESSION_MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

function getAdminAccessKey(): string {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key || key.length < 32) {
    throw new Error(
      '[admin-auth] ADMIN_ACCESS_KEY is missing or too short. ' +
        'Set it to a random string (at least 32 chars) in your .env file.'
    );
  }
  return key;
}

/**
 * Stable fingerprint of the configured access key (for UI display only).
 * Not used as a session cookie value.
 */
export function adminKeyFingerprint(): string {
  return createHash('sha256').update(getAdminAccessKey()).digest('hex');
}

/** @deprecated Use adminKeyFingerprint() — session cookies are no longer static hashes. */
export function expectedSessionToken(): string {
  return adminKeyFingerprint();
}

/** True if the request's admin_session cookie is a valid signed token. */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get(COOKIE_NAME)?.value;
    if (!sessionCookie) return false;
    const payload = await verifySessionToken(
      sessionCookie,
      getAdminAccessKey()
    );
    return payload !== null;
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
  if (await isAdminAuthenticated()) return true;

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
 * Redirects to `/{locale}/login` — the app has no bare `/login` (only `[locale]/login`).
 */
export async function requireAdmin(locale?: Locale): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    const loc =
      locale && (i18n.locales as readonly string[]).includes(locale)
        ? locale
        : i18n.defaultLocale;
    redirect(`/${loc}/login`);
  }
}

/** Sets a signed admin session cookie (unique per login). */
export async function setAdminSession(): Promise<void> {
  const jar = await cookies();
  const token = await generateSessionToken(getAdminAccessKey());
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

/** Clears the admin session cookie. */
export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/**
 * Global-admin forensic query marker.
 *
 * Admin dashboard views (audit logs, scan logs, incidents) intentionally omit
 * `deletedAt` filtering to preserve forensic visibility of soft-deleted records.
 *
 * Context: reset-tenant soft-deletes ScanLog/Incident "for forensic purposes";
 * these admin forensic views are the place where that purpose requires them to
 * stay visible.
 *
 * Usage: Import this constant and reference it in a comment where you would
 * otherwise add a `deletedAt: null` filter, documenting that the omission is
 * intentional and centrally justified here.
 *
 * Callers MUST have already performed admin authorization (requireAdmin or
 * isAdminAuthorized) before building queries that reference this marker.
 */
export const FORENSIC_VIEW_NO_DELETED_AT_FILTER =
  'Global-admin forensic view — soft-deleted records intentionally visible' as const;
