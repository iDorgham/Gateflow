import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const COOKIE_NAME = 'admin_session';
const PUBLIC_PATHS = ['/login', '/api/admin/login'];

function expectedToken(): string {
  const key = process.env.ADMIN_ACCESS_KEY ?? 'dev-admin-key-change-in-production';
  return createHash('sha256').update(key).digest('hex');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and Next.js internals
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (session !== expectedToken()) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
