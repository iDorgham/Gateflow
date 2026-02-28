/**
 * CSRF Protection Middleware
 *
 * Uses the double-submit cookie pattern:
 * 1. Server sets `gf_csrf_token` as a non-httpOnly cookie on login.
 * 2. Client reads the cookie value and sends it as the `x-csrf-token` header.
 * 3. Middleware compares header vs cookie with a timing-safe comparison.
 *
 * Exemptions:
 * - Public routes (login, auth refresh/logout)
 * - GET / HEAD / OPTIONS (non-mutating)
 * - Next.js Server Actions (have built-in same-origin checking)
 * - Requests with a Bearer Authorization header (scanner app / API clients —
 *   attackers cannot forge Bearer tokens from a cross-origin context)
 */

import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n, LOCALE_COOKIE } from './lib/i18n';

const CSRF_COOKIE = 'gf_csrf_token';
const CSRF_HEADER = 'x-csrf-token';
const AUTH_COOKIE = 'gf_access_token';

// Routes that never need CSRF validation (unauthenticated or use Bearer auth)
const PUBLIC_ROUTES = [
  '/login',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
];

const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Constant-time string comparison to prevent timing side-channel attacks.
 * Returns false immediately on length mismatch (length is not secret here).
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function getLocale(request: NextRequest): string {
  // 1. Check if the user has a locale explicitly set in cookies
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Try to negotiate based on Accept-Language
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

  try {
    return match(languages, locales, i18n.defaultLocale);
  } catch (e) {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if there is any supported locale in the pathname
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Redirect if there is no locale
  if (!pathnameHasLocale && 
      !pathname.startsWith('/api') && 
      !pathname.startsWith('/_next') && 
      !pathname.includes('.')) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // Strip locale from public route matching check
  const pathWithoutLocale = pathnameHasLocale 
    ? pathname.replace(new RegExp(`^/(${i18n.locales.join('|')})`), '') 
    : pathname;
  
  const effectivePath = pathWithoutLocale === '' ? '/' : pathWithoutLocale;

  // 2. Public / unauthenticated routes — always allow
  if (PUBLIC_ROUTES.some((route) => effectivePath.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Non-mutating methods — no CSRF risk
  if (!CSRF_PROTECTED_METHODS.includes(request.method)) {
    return NextResponse.next();
  }

  // 3. Next.js Server Actions carry a same-origin origin check built-in
  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }

  // 4. Bearer-token requests (scanner app, API clients) — CSRF exempt because
  //    cross-origin attackers cannot obtain or inject a Bearer token.
  if (request.headers.get('authorization')?.startsWith('Bearer ')) {
    return NextResponse.next();
  }

  // From here on we are dealing with cookie-authenticated dashboard requests.

  const authCookie = request.cookies.get(AUTH_COOKIE);
  const csrfCookie = request.cookies.get(CSRF_COOKIE);

  // 5. Not authenticated (no session cookie) — let the route handler return 401.
  //    CSRF middleware only enforces token validity; auth is enforced in route handlers.
  if (!authCookie) {
    return NextResponse.next();
  }

  // 6. Authenticated but CSRF cookie absent — reject (prevents CSRF on sessions
  //    where the token was never issued or was manually cleared).
  if (!csrfCookie) {
    return NextResponse.json(
      { success: false, message: 'CSRF token missing' },
      { status: 403 },
    );
  }

  // 7. CSRF header must be present
  const requestToken = request.headers.get(CSRF_HEADER);
  if (!requestToken) {
    return NextResponse.json(
      { success: false, message: 'CSRF token missing' },
      { status: 403 },
    );
  }

  // 8. Timing-safe comparison
  if (!timingSafeEqual(requestToken, csrfCookie.value)) {
    return NextResponse.json(
      { success: false, message: 'CSRF token invalid' },
      { status: 403 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static assets.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
