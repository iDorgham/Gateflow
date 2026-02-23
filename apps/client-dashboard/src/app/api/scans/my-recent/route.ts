import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { prisma } from '@gate-access/db';

const MAX_RECENT = 100;

/**
 * GET /api/scans/my-recent
 *
 * Returns the last MAX_RECENT scans created by the authenticated scanner
 * operator (Bearer JWT). Used by the scanner app History tab to supplement
 * or verify local scan history.
 *
 * Response:
 *   { success: true, scans: ScanSummary[] }
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const userId = auth.sub;
  const orgId = auth.orgId;
  if (!userId || !orgId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const scans = await prisma.scanLog.findMany({
      where: {
        userId,
        qrCode: { organizationId: orgId },
      },
      orderBy: { scannedAt: 'desc' },
      take: MAX_RECENT,
      select: {
        id: true,
        scanUuid: true,
        scannedAt: true,
        status: true,
        deviceId: true,
        qrCode: { select: { code: true, type: true } },
        gate: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, scans });
  } catch (error) {
    console.error('my-recent scans error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
