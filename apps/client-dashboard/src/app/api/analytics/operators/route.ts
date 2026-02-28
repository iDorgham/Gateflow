import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().optional().default(''),
  gateId: z.string().optional().default(''),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const orgId = claims.orgId;

    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.safeParse({
      dateFrom: searchParams.get('dateFrom') ?? '',
      dateTo: searchParams.get('dateTo') ?? '',
      projectId: searchParams.get('projectId') ?? '',
      gateId: searchParams.get('gateId') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const { dateFrom, dateTo, projectId, gateId } = parsed.data;
    const dateFromDate = new Date(dateFrom + 'T00:00:00.000Z');
    const dateToDate = new Date(dateTo + 'T23:59:59.999Z');

    if (projectId) {
      const proj = await prisma.project.findFirst({
        where: { id: projectId, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (!proj) {
        return NextResponse.json({ success: false, message: 'Invalid project' }, { status: 400 });
      }
    }
    if (gateId) {
      const gate = await prisma.gate.findFirst({
        where: { id: gateId, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (!gate) {
        return NextResponse.json({ success: false, message: 'Invalid gate' }, { status: 400 });
      }
    }

    const qrFilter = {
      organizationId: orgId,
      deletedAt: null,
      ...(projectId ? { projectId } : {}),
    };

    const scanFilter = {
      qrCode: qrFilter,
      scannedAt: { gte: dateFromDate, lte: dateToDate },
      userId: { not: null },
      ...(gateId ? { gateId } : {}),
    };

    const groups = await prisma.scanLog.groupBy({
      by: ['userId'],
      where: scanFilter,
      _count: true,
      orderBy: { _count: { userId: 'desc' } },
      take: 10,
    });

    if (groups.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const userIds = groups.map((g) => g.userId!).filter(Boolean);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const data = groups.map((g) => {
      const u = userMap.get(g.userId!);
      return {
        userId: g.userId,
        name: u?.name ?? 'Unknown',
        email: u?.email ?? '',
        scanCount: g._count,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/operators error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
