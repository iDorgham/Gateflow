import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, Prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().optional().default(''),
});

export interface CampaignRow {
  name: string;
  scans: number;
  passRate: number;
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
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const { dateFrom, dateTo, projectId } = parsed.data;
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

    type Agg = { name: string; total: bigint; success: bigint };
    const projectCond = projectId ? Prisma.sql`AND qr."projectId" = ${projectId}` : Prisma.empty;
    const raw = await prisma.$queryRaw<Agg[]>(Prisma.sql`
      SELECT
        COALESCE(qr."utmCampaign", '(no campaign)') AS name,
        COUNT(*)::bigint AS total,
        COUNT(*) FILTER (WHERE sl.status = 'SUCCESS')::bigint AS success
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      WHERE qr."organizationId" = ${orgId}
        AND qr."deletedAt" IS NULL
        AND qr."utmCampaign" IS NOT NULL
        AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
        ${projectCond}
      GROUP BY qr."utmCampaign"
      ORDER BY total DESC
    `);

    const campaigns: CampaignRow[] = raw.map((r) => ({
      name: r.name,
      scans: Number(r.total),
      passRate: r.total > 0n ? Math.round((Number(r.success) / Number(r.total)) * 100) : 0,
    }));

    return NextResponse.json({ success: true, data: { campaigns } });
  } catch (error) {
    console.error('GET /api/analytics/campaigns error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
