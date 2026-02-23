/**
 * CSRF Protection Middleware
 *
 * Uses double-submit cookie pattern:
 * 1. Server sets CSRF token as httpOnly cookie on session init
 * 2. Client reads token from cookie and includes in requests
 * 3. Server validates token matches
 *
 * Excludes: public routes that don't require authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CSRF_COOKIE = 'gf_csrf_token';
const CSRF_HEADER = 'x-csrf-token';

// Public routes that don't require CSRF validation
const PUBLIC_ROUTES = [
  '/login',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/_next', // Next.js internals
  '/favicon.ico',
  '/api/scans/bulk', // Scanner app offline sync
  '/api/qrcodes/validate', // Scanner validates QRs (uses Bearer token auth)
];

// Routes that need CSRF validation
const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip CSRF for public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Skip non-mutating methods
  if (!CSRF_PROTECTED_METHODS.includes(request.method)) {
    return NextResponse.next();
  }

  // Skip if it's a Next.js Server Action (they have built-in CSRF protection)
  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }

  // Skip if no CSRF cookie (not authenticated)
  const csrfCookie = request.cookies.get(CSRF_COOKIE);
  if (!csrfCookie) {
    // Allow - user not authenticated yet
    return NextResponse.next();
  }

  // Validate CSRF token
  const requestToken = request.headers.get(CSRF_HEADER);
  if (!requestToken) {
    return NextResponse.json(
      { success: false, message: 'CSRF token missing' },
      { status: 403 }
    );
  }

  if (requestToken !== csrfCookie.value) {
    return NextResponse.json(
      { success: false, message: 'CSRF token invalid' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
