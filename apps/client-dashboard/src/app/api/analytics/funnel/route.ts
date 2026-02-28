import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().optional().default(''),
  utmCampaign: z.string().optional().default(''),
});

export interface FunnelStage {
  name: string;
  count: number;
  dropoffRate?: number;
}

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
      utmCampaign: searchParams.get('utmCampaign') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const { dateFrom, dateTo, projectId, utmCampaign } = parsed.data;
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

    const qrWhere = {
      organizationId: orgId,
      deletedAt: null,
      createdAt: { gte: dateFromDate, lte: dateToDate },
      ...(projectId ? { projectId } : {}),
      ...(utmCampaign ? { utmCampaign } : {}),
    };

    const [qrCreated, qrScanned] = await Promise.all([
      prisma.qRCode.count({ where: qrWhere }),
      prisma.scanLog.count({
        where: {
          qrCode: {
            organizationId: orgId,
            deletedAt: null,
            ...(projectId ? { projectId } : {}),
            ...(utmCampaign ? { utmCampaign } : {}),
          },
          scannedAt: { gte: dateFromDate, lte: dateToDate },
        },
      }),
    ]);

    const stages: FunnelStage[] = [
      { name: 'QR Created', count: qrCreated },
      {
        name: 'QR Scanned',
        count: qrScanned,
        dropoffRate: qrCreated > 0 ? Math.round(((qrCreated - qrScanned) / qrCreated) * 100) : 0,
      },
    ];

    return NextResponse.json({ success: true, data: { stages } });
  } catch (error) {
    console.error('GET /api/analytics/funnel error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
