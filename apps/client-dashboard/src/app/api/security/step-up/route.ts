import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { issueStepUpToken } from '@/lib/security/step-up-guard';
import { logAuditAction } from '@/lib/audit';
import { verify as verifyArgon2 } from '@node-rs/argon2';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/security/step-up
 * Issues a signed 5-minute step-up verification token after password re-authentication.
 */
export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.sub || !claims.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit step-up attempts (5 attempts per minute per user)
  const rateCheck = await checkRateLimit(`step-up:${claims.sub}`, 5, 60_000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many failed verification attempts. Please wait 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { password, action } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required for step-up verification' },
        { status: 400 }
      );
    }

    const targetAction =
      typeof action === 'string' && action ? action : 'GENERAL_SENSITIVE_OP';

    // 1. Fetch user password hash
    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: { id: true, passwordHash: true, email: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'User credential not found' },
        { status: 404 }
      );
    }

    // 2. Verify password with argon2
    const isValid = await verifyArgon2(user.passwordHash, password);
    if (!isValid) {
      await logAuditAction({
        action: 'STEP_UP_CHALLENGE_FAILED',
        entityType: 'USER',
        entityId: user.id,
        userId: user.id,
        orgId: claims.orgId,
        metadata: { targetAction },
      });

      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 3. Issue step-up token
    const token = issueStepUpToken({
      userId: user.id,
      orgId: claims.orgId,
      action: targetAction,
    });

    await logAuditAction({
      action: 'STEP_UP_CHALLENGE_SUCCESS',
      entityType: 'USER',
      entityId: user.id,
      userId: user.id,
      orgId: claims.orgId,
      metadata: { targetAction },
    });

    return NextResponse.json({
      success: true,
      stepUpToken: token,
      expiresInSeconds: 300,
    });
  } catch (error) {
    console.error('[StepUp] Challenge failed:', error);
    return NextResponse.json(
      { error: 'Failed to process step-up verification' },
      { status: 500 }
    );
  }
}
