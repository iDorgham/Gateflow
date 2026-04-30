/**
 * Admin portal session (ADMIN_ACCESS_KEY + admin_session cookie), locale redirect,
 * and CSRF protection (double-submit cookie vs x-csrf-token for gf_* session).
 */

import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n, LOCALE_COOKIE } from './lib/i18n/i18n-config';

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

async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
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
  const expected = await sha256Hex(key);
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (session !== expected) {
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
    /\.(ico|png|jpg|jpeg|gif|webp|svg|txt|xml)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = pathnameHasLocale(pathname);

  if (
    !hasLocale &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
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

  const MOVED_PATHS = ['admins', 'authorization-keys', 'settings'];

  if (
    MOVED_PATHS.some(
      (p) => effectivePath === `/${p}` || effectivePath.startsWith(`/${p}/`)
    )
  ) {
    const locale = hasLocale ? pathname.split('/')[1] : DEFAULT_LOCALE;
    const to = effectivePath.startsWith('/')
      ? effectivePath.slice(1)
      : effectivePath;
    return NextResponse.redirect(
      new URL(`/${locale}/redirect?to=${to}`, request.url)
    );
  }

  // Aggressive Sticky Redirection: If we have a sticky org, auto-scope global paths
  const stickyOrgId = request.cookies.get('gf_active_org_id')?.value;
  if (stickyOrgId && !pathname.includes('/organizations/')) {
    const AUTO_SCOPE_PATHS = [
      'analytics',
      'audit-logs',
      'crm',
      'finance',
      'monitoring',
      'intelligence',
      'cms',
      'scans',
      'projects',
      'users',
      'gates',
    ];

    if (
      AUTO_SCOPE_PATHS.some(
        (p) => effectivePath === `/${p}` || effectivePath.startsWith(`/${p}/`)
      )
    ) {
      const locale = hasLocale ? pathname.split('/')[1] : DEFAULT_LOCALE;
      return NextResponse.redirect(
        new URL(
          `/${locale}/organizations/${stickyOrgId}${effectivePath}`,
          request.url
        )
      );
    }
  }

  if (PUBLIC_ROUTES.some((route) => effectivePath.startsWith(route))) {
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

  // Phase 3: RBAC Enforcement for Task Management
  if (pathname.startsWith('/api/tasks')) {
    // In a full implementation, this would decode the gf_access_token JWT
    // and verify department scopes (e.g., SALES_REP can only access SALES boards).
    // For now, we ensure the token exists (checked above) and pass the request.
    // If the user is an Admin (has admin_session), they implicitly have SUPER_ADMIN access.
    const isAdmin = request.cookies.get(ADMIN_COOKIE) !== undefined;

    if (!isAdmin && !authCookie) {
      return NextResponse.json(
        { success: false, message: 'Task management requires authentication' },
        { status: 401 }
      );
    }
  }

  // Sync Sticky Org Context
  const orgIdMatch = pathname.match(/^\/([^/]+)\/organizations\/([^/]+)/);
  if (orgIdMatch && orgIdMatch[2]) {
    const orgId = orgIdMatch[2];
    const response = NextResponse.next();
    response.cookies.set('gf_active_org_id', orgId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
