import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import {
  prisma,
  createExpressInviteTransaction,
  createSecureInviteSignature,
} from '@gate-access/db';
import { checkAndConsumeQuota } from '@gate-access/db/quota';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';

export const dynamic = 'force-dynamic';

/**
 * POST /api/resident/express-invite
 *
 * Generates an HMAC-signed "One-Tap" invitation link.
 * Used by residents to share a link before filling guest details.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { unitId: providedUnitId, delegateToAi } = body;

    // 2. Resolve & Verify Unit
    // Residents usually belong to one unit; if not provided, find the primary one.
    const unit = await prisma.unit.findFirst({
      where: {
        ...(providedUnitId ? { id: providedUnitId } : { userId: claims.sub }),
        organizationId: claims.orgId,
        deletedAt: null,
      },
    });

    if (!unit) {
      return NextResponse.json(
        { success: false, message: 'Authorized unit not found' },
        { status: 403 }
      );
    }

    // 3. Quota Check
    const quotaStatus = await checkAndConsumeQuota(unit.id);
    if (!quotaStatus.allowed) {
      return NextResponse.json(
        { success: false, message: 'Monthly quota reached', quotaStatus },
        { status: 403 }
      );
    }

    // 4. Create Transaction (QRCode + QrShortLink)
    const { qrCode, shortLink } = await createExpressInviteTransaction({
      organizationId: claims.orgId,
      unitId: unit.id,
      projectId: unit.projectId || undefined,
      expiresInHours: 24, // 1-day link
      delegateToAi: !!delegateToAi,
    });

    // 5. Generate Signed Share URL
    const secret =
      process.env.EXPRESS_INVITE_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      'fallback-secret-at-least-16-chars';

    // The link will point to the marketing landing page redesign (Phase 4)
    const baseUrl =
      process.env.NEXT_PUBLIC_MARKETING_URL || 'https://gateflow.io';
    const landingPath = `/s/${shortLink.shortId}`;

    // We sign the shortId to prevent ID enumeration/tampering
    const signature = createSecureInviteSignature(shortLink.shortId, secret);

    const shareUrl = `${baseUrl}${landingPath}?sig=${signature}`;

    // 6. Notify
    emitEvent(claims.orgId, EventType.QR_CREATED, {
      qrId: qrCode.id,
      method: 'express',
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: {
        shortId: shortLink.shortId,
        shareUrl,
        expiresAt: qrCode.expiresAt,
      },
    });
  } catch (error) {
    console.error('POST /api/resident/express-invite error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
