/**
 * Admin portal session (signed admin_session cookie), locale redirect,
 * and CSRF protection (double-submit cookie vs x-csrf-token for gf_* session).
 */

import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n, LOCALE_COOKIE } from './lib/i18n/i18n-config';
import { verifySessionToken } from './lib/admin-session';

const ADMIN_COOKIE = 'admin_session';
const CSRF_COOKIE = 'gf_csrf_token';
const CSRF_HEADER = 'x-csrf-token';
const AUTH_COOKIE = 'gf_access_token';
const MIN_ADMIN_KEY_LENGTH = 32;
const DEFAULT_LOCALE = 'en';

const PUBLIC_ROUTES = [
  '/login',
  '/api/admin/login',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
];

const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (
    cookieLocale &&
    (i18n.locales as readonly string[]).includes(cookieLocale)
  ) {
    return cookieLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  try {
    return match(languages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

function pathnameHasLocale(pathname: string): boolean {
  return i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

function loginPathForRequest(request: NextRequest, pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (
    segments.length >= 1 &&
    (i18n.locales as readonly string[]).includes(segments[0]!)
  ) {
    return `/${segments[0]}/login`;
  }
  return `/${DEFAULT_LOCALE}/login`;
}

function requiresAdminPortalAuth(pathname: string): boolean {
  if (pathname.startsWith('/api/admin/')) {
    return !pathname.startsWith('/api/admin/login');
  }
  if (!pathnameHasLocale(pathname)) {
    return false;
  }
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/(${i18n.locales.join('|')})`), '') || '/';
  const effective = pathWithoutLocale === '' ? '/' : pathWithoutLocale;
  if (effective === '/login' || effective.startsWith('/login/')) {
    return false;
  }
  return true;
}

function isAdminAccessKeyConfigured(): boolean {
  const key = process.env.ADMIN_ACCESS_KEY;
  return Boolean(key && key.length >= MIN_ADMIN_KEY_LENGTH);
}

async function enforceAdminPortalSession(
  request: NextRequest,
  pathname: string
): Promise<NextResponse | null> {
  if (!requiresAdminPortalAuth(pathname)) {
    return null;
  }

  if (!isAdminAccessKeyConfigured()) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          success: false,
          message:
            'ADMIN_ACCESS_KEY is missing or shorter than 32 characters. Set a secure random value (≥32 chars) to use the admin portal.',
        },
        { status: 503 }
      );
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = loginPathForRequest(request, pathname);
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  const key = process.env.ADMIN_ACCESS_KEY!;
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  const payload = session ? await verifySessionToken(session, key) : null;
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Admin session required.' },
        { status: 401 }
      );
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = loginPathForRequest(request, pathname);
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    /\.(ico|png|jpg|jpeg|gif|webp|svg|txt|xml)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = pathnameHasLocale(pathname);

  if (
    !hasLocale &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/icon') &&
    !pathname.startsWith('/apple-icon') &&
    !pathname.includes('.')
  ) {
    const locale = getLocale(request);
    const newUrl = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    );
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  const adminGate = await enforceAdminPortalSession(request, pathname);
  if (adminGate) {
    return adminGate;
  }

  const pathWithoutLocale = hasLocale
    ? pathname.replace(new RegExp(`^/(${i18n.locales.join('|')})`), '')
    : pathname;

  const effectivePath = pathWithoutLocale === '' ? '/' : pathWithoutLocale;

  if (
    PUBLIC_ROUTES.some((route) => effectivePath.startsWith(route)) ||
    effectivePath === '/icon' ||
    effectivePath === '/apple-icon'
  ) {
    return NextResponse.next();
  }

  if (!CSRF_PROTECTED_METHODS.includes(request.method)) {
    return NextResponse.next();
  }

  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }

  if (request.headers.get('authorization')?.startsWith('Bearer ')) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE);
  const csrfCookie = request.cookies.get(CSRF_COOKIE);

  if (!authCookie) {
    return NextResponse.next();
  }

  if (!csrfCookie) {
    return NextResponse.json(
      { success: false, message: 'CSRF token missing' },
      { status: 403 }
    );
  }

  const requestToken = request.headers.get(CSRF_HEADER);
  if (!requestToken) {
    return NextResponse.json(
      { success: false, message: 'CSRF token missing' },
      { status: 403 }
    );
  }

  if (!timingSafeEqual(requestToken, csrfCookie.value)) {
    return NextResponse.json(
      { success: false, message: 'CSRF token invalid' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml).*)',
  ],
};
