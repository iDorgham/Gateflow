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
// import { castUserRole } from '@/lib/types';
import { checkRateLimit } from '../../../../lib/rate-limit';

const SECURE = process.env.NODE_ENV === 'production';

/**
 * Thrown inside the rotation transaction when the token was already consumed
 * by a concurrent request — signals the outer handler to return 401.
 */
class TokenAlreadyConsumedError extends Error {
  constructor() {
    super('token_already_consumed');
    this.name = 'TokenAlreadyConsumedError';
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const rl = await checkRateLimit(`refresh:${ip}`, 20, 60_000);

    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many refresh attempts. Please try again later.',
        },
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

    // Step 1 — Look up the token with its owner.
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { role: true } } },
    });

    if (!storedToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Step 2 — Reuse detection: if the token was already revoked, an attacker
    // has replayed a previously-issued token.  Burn every active session for
    // this user immediately.
    if (storedToken.revokedAt) {
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

    // Step 3 — Expiry check.
    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });
      return NextResponse.json(
        { success: false, message: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Step 4 — Account status.
    const user = storedToken.user;
    if (user.deletedAt) {
      return NextResponse.json(
        { success: false, message: 'Account deactivated' },
        { status: 401 }
      );
    }

    // Step 5 — Atomic rotation.
    //
    // The findUnique above and the transaction below are NOT in the same DB
    // transaction, so two concurrent requests with the same token can both
    // pass the revokedAt check before either writes.  To close this race we
    // use an interactive transaction with a conditional updateMany:
    //
    //   UPDATE refreshToken SET revokedAt = now()
    //   WHERE id = <id> AND revokedAt IS NULL
    //
    // If another request beat us to it (count === 0) we treat it as a reuse
    // attack and burn all remaining sessions, then return 401.
    const newRefreshTokenValue = generateRefreshToken();

    try {
      await prisma.$transaction(async (tx) => {
        const { count } = await tx.refreshToken.updateMany({
          where: { id: storedToken.id, revokedAt: null },
          data: { revokedAt: new Date() },
        });

        if (count === 0) {
          // Concurrent request already consumed this token.
          // Revoke everything still active and signal the outer handler.
          await tx.refreshToken.updateMany({
            where: { userId: storedToken.userId, revokedAt: null },
            data: { revokedAt: new Date() },
          });
          throw new TokenAlreadyConsumedError();
        }

        await tx.refreshToken.create({
          data: {
            token: newRefreshTokenValue,
            userId: user.id,
            expiresAt: getRefreshTokenExpiry(),
          },
        });
      });
    } catch (err) {
      if (err instanceof TokenAlreadyConsumedError) {
        return NextResponse.json(
          {
            success: false,
            message: 'Token reuse detected — all sessions revoked',
          },
          { status: 401 }
        );
      }
      throw err; // re-throw to the outer catch → 500
    }

    // Step 6 — Issue new access token and rotate CSRF token.
    const accessToken = await signAccessToken(
      user.id,
      user.email,
      user.organizationId,
      {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions as Record<string, boolean>,
      }
    );

    const tokenResponse = {
      accessToken,
      refreshToken: newRefreshTokenValue,
      expiresIn: 900,
      tokenType: 'Bearer' as const,
    };

    const csrfToken = generateCsrfToken();

    const response = NextResponse.json({
      success: true,
      data: TokenResponseSchema.parse(tokenResponse),
    });

    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      secure: SECURE,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
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
