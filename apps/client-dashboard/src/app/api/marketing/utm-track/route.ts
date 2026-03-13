import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

/**
 * Track UTM parameters when QR code is accessed
 * Updates QRCode record with attribution data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrCodeId, utmParams } = body as {
      qrCodeId: string;
      utmParams?: {
        utm_source?: string;
        utm_campaign?: string;
        utm_medium?: string;
        utm_term?: string;
        utm_content?: string;
      };
    };

    if (!qrCodeId) {
      return NextResponse.json(
        { success: false, message: 'QR code ID required' },
        { status: 400 }
      );
    }

    // Update QR code with UTM attribution (only if not already set)
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrCodeId },
      select: { id: true, utmSource: true, utmCampaign: true },
    });

    if (!qrCode) {
      return NextResponse.json(
        { success: false, message: 'QR code not found' },
        { status: 404 }
      );
    }

    // Only update if UTM params are provided and not already set
    if (utmParams && (!qrCode.utmSource || !qrCode.utmCampaign)) {
      await prisma.qRCode.update({
        where: { id: qrCodeId },
        data: {
          utmSource: utmParams.utm_source || qrCode.utmSource,
          utmCampaign: utmParams.utm_campaign || qrCode.utmCampaign,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('UTM tracking error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
