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

type CampaignLinkageRow = {
  campaign: string;
  qualifiedLeads: number;
  firstScans: number;
  linkageRate: number;
  attributionGap: number;
};

type Diagnostics = {
  qualifiedWithoutCampaign: number;
  scansWithoutCampaign: number;
  campaignsMissingFirstScan: string[];
};

type RawCampaignRow = {
  campaign: string;
  qualified_leads: bigint;
  first_scans: bigint;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const orgId = claims.orgId;

    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.safeParse({
      dateFrom: searchParams.get('dateFrom') ?? '',
      dateTo: searchParams.get('dateTo') ?? '',
      projectId: searchParams.get('projectId') ?? '',
    });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid query params' },
        { status: 400 }
      );
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
        return NextResponse.json(
          { success: false, message: 'Invalid project' },
          { status: 400 }
        );
      }
    }

    const projectCond = projectId
      ? Prisma.sql`AND qr."projectId" = ${projectId}`
      : Prisma.empty;

    const rows = await prisma.$queryRaw<RawCampaignRow[]>(Prisma.sql`
      WITH qualified AS (
        SELECT
          COALESCE(qr."utmCampaign", '(no campaign)') AS campaign,
          qr."contactId" AS contact_id
        FROM "QRCode" qr
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL
          AND qr."createdAt" >= ${dateFromDate}
          AND qr."createdAt" <= ${dateToDate}
          AND qr."contactId" IS NOT NULL
          ${projectCond}
      ),
      first_scan AS (
        SELECT
          COALESCE(qr."utmCampaign", '(no campaign)') AS campaign,
          qr."contactId" AS contact_id,
          MIN(sl."scannedAt") AS first_scanned_at
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL
          AND sl."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate}
          AND sl."scannedAt" <= ${dateToDate}
          AND qr."contactId" IS NOT NULL
          ${projectCond}
        GROUP BY COALESCE(qr."utmCampaign", '(no campaign)'), qr."contactId"
      )
      SELECT
        q.campaign AS campaign,
        COUNT(DISTINCT q.contact_id)::bigint AS qualified_leads,
        COUNT(DISTINCT fs.contact_id)::bigint AS first_scans
      FROM qualified q
      LEFT JOIN first_scan fs
        ON q.campaign = fs.campaign
       AND q.contact_id = fs.contact_id
      GROUP BY q.campaign
      ORDER BY qualified_leads DESC
    `);

    const qualifiedWithoutCampaign = await prisma.qRCode.count({
      where: {
        organizationId: orgId,
        deletedAt: null,
        createdAt: { gte: dateFromDate, lte: dateToDate },
        contactId: { not: null },
        utmCampaign: null,
        ...(projectId ? { projectId } : {}),
      },
    });

    const scansWithoutCampaign = await prisma.scanLog.count({
      where: {
        deletedAt: null,
        scannedAt: { gte: dateFromDate, lte: dateToDate },
        qrCode: {
          organizationId: orgId,
          deletedAt: null,
          utmCampaign: null,
          ...(projectId ? { projectId } : {}),
        },
      },
    });

    const campaigns: CampaignLinkageRow[] = rows.map((row) => {
      const qualifiedLeads = Number(row.qualified_leads);
      const firstScans = Number(row.first_scans);
      const attributionGap = Math.max(qualifiedLeads - firstScans, 0);
      return {
        campaign: row.campaign,
        qualifiedLeads,
        firstScans,
        linkageRate:
          qualifiedLeads > 0
            ? Math.round((firstScans / qualifiedLeads) * 100)
            : 0,
        attributionGap,
      };
    });

    const diagnostics: Diagnostics = {
      qualifiedWithoutCampaign,
      scansWithoutCampaign,
      campaignsMissingFirstScan: campaigns
        .filter((c) => c.qualifiedLeads > 0 && c.firstScans === 0)
        .map((c) => c.campaign),
    };

    return NextResponse.json({
      success: true,
      data: { campaigns, diagnostics },
    });
  } catch (error) {
    console.error('GET /api/analytics/campaign-first-scan error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
