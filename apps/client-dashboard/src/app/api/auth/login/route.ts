import { NextRequest, NextResponse } from 'next/server';
import { LoginPayloadSchema, TokenResponseSchema } from '@gate-access/types';
import { prisma } from '@gate-access/db';
import {
  signAccessToken,
  verifyPassword,
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
    const rl = await checkRateLimit(`login:${ip}`, 10, 60_000); // 10 requests per minute
    
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
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

    const validation = LoginPayloadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user (not soft-deleted)
    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) {
      // Constant-time: still hash to prevent timing oracle on user existence
      await verifyPassword(
        '$argon2id$v=19$m=65536,t=3,p=4$dummy$dummy',
        password
      ).catch(() => {});
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(user.passwordHash, password);
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Issue access token
    const accessToken = await signAccessToken(
      user.id,
      user.email,
      user.organizationId,
      castUserRole(user.role)
    );

    // Issue refresh token and store in DB
    const refreshTokenValue = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    const tokenResponse = {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 900, // 15 minutes in seconds
      tokenType: 'Bearer' as const,
    };

    // Generate CSRF token for this session
    const csrfToken = generateCsrfToken();

    const response = NextResponse.json({
      success: true,
      data: TokenResponseSchema.parse(tokenResponse),
    });

    // Set CSRF cookie (accessible to client-side JS for double-submit pattern)
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      secure: SECURE,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
