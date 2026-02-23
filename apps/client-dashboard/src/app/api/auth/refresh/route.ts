import { NextRequest, NextResponse } from 'next/server';
import {
  RefreshTokenPayloadSchema,
  TokenResponseSchema,
} from '@gate-access/types';
import { prisma } from '@gate-access/db';
import {
  signAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '../../../../lib/auth';
import { CSRF_COOKIE, generateCsrfToken } from '../../../../lib/csrf';
import { castUserRole } from '@/lib/types';
import { checkRateLimit } from '../../../../lib/rate-limit';

const SECURE = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = checkRateLimit(`refresh:${ip}`, 20, 60_000); // 20 requests per minute
    
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many refresh attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rl.retryAfterMs / 1000).toString(),
            'X-RateLimit-Limit': rl.limit.toString(),
            'X-RateLimit-Remaining': rl.remaining.toString(),
          },
        }
      );
    }

    const body = await request.json();

    const validation = RefreshTokenPayloadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { refreshToken } = validation.data;

    // Find the refresh token (not revoked, not expired)
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    if (storedToken.revokedAt) {
      // Token reuse detected — revoke ALL tokens for this user (security measure)
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return NextResponse.json(
        {
          success: false,
          message: 'Token reuse detected — all sessions revoked',
        },
        { status: 401 }
      );
    }

    if (new Date() > storedToken.expiresAt) {
      // Expired — revoke it
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });
      return NextResponse.json(
        { success: false, message: 'Refresh token expired' },
        { status: 401 }
      );
    }

    const user = storedToken.user;
    if (user.deletedAt) {
      return NextResponse.json(
        { success: false, message: 'Account deactivated' },
        { status: 401 }
      );
    }

    // Rotate: revoke old token, issue new pair
    const newRefreshTokenValue = generateRefreshToken();

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshTokenValue,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry(),
        },
      }),
    ]);

    const accessToken = await signAccessToken(
      user.id,
      user.email,
      user.organizationId,
      castUserRole(user.role)
    );

    const tokenResponse = {
      accessToken,
      refreshToken: newRefreshTokenValue,
      expiresIn: 900,
      tokenType: 'Bearer' as const,
    };

    // Generate new CSRF token on refresh (rotation)
    const csrfToken = generateCsrfToken();

    const response = NextResponse.json({
      success: true,
      data: TokenResponseSchema.parse(tokenResponse),
    });

    // Refresh CSRF cookie
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      secure: SECURE,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
