import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { projectId } = params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10));
    const cursor = searchParams.get('cursor');

    const logs = await prisma.scanLog.findMany({
      where: {
        gate: {
          projectId,
          organizationId: claims.orgId,
        },
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        scannedAt: 'desc',
      },
      include: {
        gate: {
          select: {
            id: true,
            name: true,
          },
        },
        qrCode: {
          select: {
            id: true,
            code: true,
            guestName: true,
            guestEmail: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: logs,
      nextCursor: logs.length === limit ? logs[logs.length - 1].id : null,
    });
  } catch (error) {
    console.error('PROJECT LOGS GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
