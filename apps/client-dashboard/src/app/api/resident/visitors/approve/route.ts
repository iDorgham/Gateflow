import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';

export const dynamic = 'force-dynamic';

const ApproveVisitorSchema = z.object({
  visitorQRId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let bodyUnknown: unknown;
    try {
      bodyUnknown = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const parsed = ApproveVisitorSchema.safeParse(bodyUnknown);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { visitorQRId } = parsed.data;

    const visitor = await prisma.visitorQR.findFirst({
      where: {
        id: visitorQRId,
        unit: {
          userId: claims.sub,
          organizationId: claims.orgId,
          deletedAt: null,
        },
        qrCode: {
          organizationId: claims.orgId,
          deletedAt: null,
        },
      },
      include: { qrCode: true },
    });

    if (!visitor?.qrCode) {
      return NextResponse.json(
        { success: false, message: 'Visitor QR not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.qRCode.update({
      where: { id: visitor.qrCodeId },
      data: { isActive: true },
      select: { id: true, isActive: true, organizationId: true },
    });

    void emitEvent(claims.orgId, EventType.QR_UPDATED, {
      qrId: updated.id,
      visitorQRId: visitor.id,
    });

    return NextResponse.json({
      success: true,
      data: {
        visitorQRId: visitor.id,
        qrCodeId: updated.id,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error('[resident/visitors/approve] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
