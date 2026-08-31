import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import {
  buildApplePassDictionary,
  generatePassManifest,
} from '@/lib/wallet/apple-pass-service';
import { createGooglePaySaveUrl } from '@/lib/wallet/google-pass-service';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const format = url.searchParams.get('format'); // 'apple' | 'google'
    const qrId = url.searchParams.get('qrId');

    if (!format || !['apple', 'google'].includes(format)) {
      return NextResponse.json(
        { success: false, message: 'Format must be "apple" or "google"' },
        { status: 400 }
      );
    }

    // Lookup user & active QR code
    const user = await prisma.user.findFirst({
      where: { id: claims.sub, organizationId: claims.orgId, deletedAt: null },
      include: { organization: { select: { name: true } } },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    const qrCode = qrId
      ? await prisma.qRCode.findFirst({
          where: { id: qrId, organizationId: claims.orgId, deletedAt: null },
        })
      : await prisma.qRCode.findFirst({
          where: { organizationId: claims.orgId, deletedAt: null },
          orderBy: { createdAt: 'desc' },
        });

    const qrPayload =
      qrCode?.code || `gateflow://${claims.orgId}/pass/${claims.sub}`;

    const walletPassData = {
      passId: qrCode?.id || `pass_${claims.sub}`,
      organizationName: user.organization.name,
      residentName: user.name || user.email,
      qrPayload,
      expiresAt: qrCode?.expiresAt ? qrCode.expiresAt.toISOString() : undefined,
    };

    if (format === 'google') {
      const saveUrl = createGooglePaySaveUrl(walletPassData);
      return NextResponse.json({
        success: true,
        format: 'google',
        saveUrl,
      });
    }

    // Apple Wallet .pkpass dictionary & manifest response
    const passDict = buildApplePassDictionary(walletPassData);
    const files = { 'pass.json': JSON.stringify(passDict, null, 2) };
    const manifest = generatePassManifest(files);

    return NextResponse.json({
      success: true,
      format: 'apple',
      pass: passDict,
      manifest,
      downloadFilename: `GateFlow-Pass-${walletPassData.passId}.pkpass`,
    });
  } catch (error) {
    console.error('[Wallet Export API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
