import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {
  parseLocale,
  LOCALE_COOKIE_NAME,
  LEGACY_LOCALE_COOKIE_NAME,
} from '@gate-access/i18n/cookie';

function getLocale(request: NextRequest): string {
  try {
    // 1. Check shared gf_locale or legacy NEXT_LOCALE cookie
    const cookieValue =
      request.cookies.get(LOCALE_COOKIE_NAME)?.value ||
      request.cookies.get(LEGACY_LOCALE_COOKIE_NAME)?.value;
    const parsed = parseLocale(cookieValue);
    if (parsed && (i18n.locales as readonly string[]).includes(parsed)) {
      return parsed;
    }

    // 2. Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      negotiatorHeaders[key] = value;
    });

    const locales: string[] = [...i18n.locales];
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
      locales
    );

    if (!languages || languages.length === 0) {
      return i18n.defaultLocale;
    }

    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Ignore static assets, files, api, and internal routes
    if (
      pathname.includes('.') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname.startsWith('/~partytown') ||
      pathname.startsWith('/icon') ||
      pathname.startsWith('/apple-icon') ||
      pathname.startsWith('/favicon')
    ) {
      return NextResponse.next();
    }

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Marketing Middleware Error]:', error);
    return NextResponse.next();
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/` and known static files
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};
