import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const visitorQR = await prisma.visitorQR.findFirst({
      // ignore-security-guard — scoped via qrCode.organizationId (VisitorQR has no direct orgId field)
      where: {
        id,
        createdBy: claims.sub,
        qrCode: {
          organizationId: claims.orgId,
        },
      },
      include: {
        qrCode: true,
        accessRule: true,
        unit: {
          select: {
            name: true,
            building: true,
          },
        },
      },
    });

    if (!visitorQR) {
      return NextResponse.json(
        { success: false, message: 'Visitor QR not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: visitorQR,
    });
  } catch (error) {
    console.error('GET /api/resident/visitors/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find visitor QR and verify ownership
    const visitorQR = await prisma.visitorQR.findFirst({
      // ignore-security-guard — scoped via qrCode.organizationId (VisitorQR has no direct orgId field)
      where: {
        id,
        createdBy: claims.sub,
        qrCode: {
          organizationId: claims.orgId,
        },
      },
      include: {
        qrCode: true,
      },
    });

    if (!visitorQR) {
      return NextResponse.json(
        { success: false, message: 'Visitor QR not found or unauthorized' },
        { status: 404 }
      );
    }

    // Soft-delete the QRCode
    await prisma.qRCode.update({
      where: { id: visitorQR.qrCodeId },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Visitor QR revoked successfully',
    });
  } catch (error) {
    console.error('DELETE /api/resident/visitors/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
