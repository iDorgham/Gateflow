import { NextResponse } from 'next/server';
import { clearAuthCookies, getRefreshToken } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export async function GET(request: Request) {
  // Best-effort server-side token revocation
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await prisma.refreshToken
      .updateMany({ where: { token: refreshToken }, data: { revokedAt: new Date() } })
      .catch(() => {});
  }

  clearAuthCookies();
  return NextResponse.redirect(new URL('/login', request.url));
}
