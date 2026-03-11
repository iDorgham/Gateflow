import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    // Resolve resident unit(s)
    const units = await prisma.unit.findMany({
      where: {
        userId: claims.sub,
        organizationId: claims.orgId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (units.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const unitIds = units.map((u) => u.id);

    const scans = await prisma.scanLog.findMany({
      where: {
        qrCode: {
          organizationId: claims.orgId,
          visitorQR: {
            unitId: { in: unitIds },
          },
        },
        ...(fromDate || toDate
          ? {
              scannedAt: {
                ...(fromDate ? { gte: fromDate } : {}),
                ...(toDate ? { lte: toDate } : {}),
              },
            }
          : {}),
      },
      include: {
        qrCode: {
          include: {
            visitorQR: true,
          },
        },
        gate: true,
      },
      orderBy: { scannedAt: 'desc' },
      take: 100,
    });

    const data = scans.map((scan) => ({
      id: scan.id,
      status: scan.status,
      scannedAt: scan.scannedAt,
      gateName: scan.gate.name,
      visitorName: scan.qrCode.visitorQR?.visitorName ?? 'Open Access QR',
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/resident/history error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

