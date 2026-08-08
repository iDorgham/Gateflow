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

function escapeCsvCell(value: string | number): string {
  const s = String(value).replace(/"/g, '""');
  if (/^[=+\-@\t]/.test(s)) return `'${s}'`;
  return `"${s}"`;
}

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

    const projectCondClick = projectId
      ? Prisma.sql`AND qr."projectId" = ${projectId}`
      : Prisma.empty;
    const projectCondScan = projectId
      ? Prisma.sql`AND qr."projectId" = ${projectId}`
      : Prisma.empty;

    type RawRow = {
      campaign: string;
      source: string;
      medium: string;
      clicks: bigint;
      scans: bigint;
      qualified_leads: bigint;
      first_scans: bigint;
    };

    const matrix = await prisma.$queryRaw<RawRow[]>(Prisma.sql`
      WITH clicks AS (
        SELECT 
          COALESCE(qr."utmCampaign", '(no campaign)') as campaign,
          COALESCE(slc."utmSource", '(direct)') as source,
          COALESCE(slc."utmMedium", '(none)') as medium,
          COUNT(*)::bigint as count
        FROM "ShortLinkClick" slc
        LEFT JOIN "QrShortLink" qsl ON slc."shortLinkId" = qsl.id
        LEFT JOIN "QRCode" qr ON qsl."qrCodeId" = qr.id
        WHERE slc."organizationId" = ${orgId}
          AND slc."clickedAt" >= ${dateFromDate} AND slc."clickedAt" <= ${dateToDate}
          ${projectCondClick}
        GROUP BY qr."utmCampaign", slc."utmSource", slc."utmMedium"
      ),
      scans AS (
        SELECT 
          COALESCE(qr."utmCampaign", '(no campaign)') as campaign,
          COALESCE(qr."utmSource", '(direct)') as source,
          COALESCE(qr."utmMedium", '(none)') as medium,
          COUNT(*)::bigint as count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL AND sl."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
          ${projectCondScan}
        GROUP BY qr."utmCampaign", qr."utmSource", qr."utmMedium"
      ),
      qualified AS (
        SELECT
          COALESCE(qr."utmCampaign", '(no campaign)') AS campaign,
          COUNT(DISTINCT qr."contactId")::bigint AS qualified_leads
        FROM "QRCode" qr
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL
          AND qr."createdAt" >= ${dateFromDate} AND qr."createdAt" <= ${dateToDate}
          AND qr."contactId" IS NOT NULL
          ${projectCondClick}
        GROUP BY qr."utmCampaign"
      ),
      first_scan AS (
        SELECT
          COALESCE(qr."utmCampaign", '(no campaign)') AS campaign,
          COUNT(DISTINCT qr."contactId")::bigint AS first_scans
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
          AND qr."contactId" IS NOT NULL
          ${projectCondScan}
        GROUP BY qr."utmCampaign"
      )
      SELECT 
        COALESCE(c.campaign, s.campaign) as campaign,
        COALESCE(c.source, s.source) as source,
        COALESCE(c.medium, s.medium) as medium,
        COALESCE(c.count, 0) as clicks,
        COALESCE(s.count, 0) as scans,
        COALESCE(q.qualified_leads, 0) as qualified_leads,
        COALESCE(fs.first_scans, 0) as first_scans
      FROM clicks c
      FULL OUTER JOIN scans s ON c.campaign = s.campaign AND c.source = s.source AND c.medium = s.medium
      LEFT JOIN qualified q ON COALESCE(c.campaign, s.campaign) = q.campaign
      LEFT JOIN first_scan fs ON COALESCE(c.campaign, s.campaign) = fs.campaign
      ORDER BY clicks DESC, scans DESC
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

    const headers = [
      'Campaign',
      'Source',
      'Medium',
      'Clicks',
      'Arrivals',
      'CVR %',
      'Qualified Leads',
      'First Scans',
      'Lead->First Scan Linkage %',
      'Attribution Gap',
    ];
    const rows = matrix.map((r) => {
      const clicks = Number(r.clicks);
      const scans = Number(r.scans);
      const cvr = clicks > 0 ? (scans / clicks) * 100 : 0;
      const qualifiedLeads = Number(r.qualified_leads);
      const firstScans = Number(r.first_scans);
      const linkageRate =
        qualifiedLeads > 0 ? (firstScans / qualifiedLeads) * 100 : 0;
      const attributionGap = Math.max(qualifiedLeads - firstScans, 0);
      return [
        r.campaign,
        r.source,
        r.medium,
        clicks,
        scans,
        cvr.toFixed(1) + '%',
        qualifiedLeads,
        firstScans,
        linkageRate.toFixed(1) + '%',
        attributionGap,
      ]
        .map((v) => escapeCsvCell(v))
        .join(',');
    });

    const diagnosticsRows = [
      ['Diagnostics', '', '', '', '', '', '', '', '', ''],
      [
        'Qualified Leads Without Campaign',
        '',
        '',
        '',
        '',
        '',
        qualifiedWithoutCampaign,
        '',
        '',
        '',
      ],
      [
        'Scans Without Campaign',
        '',
        '',
        '',
        '',
        '',
        '',
        scansWithoutCampaign,
        '',
        '',
      ],
    ].map((row) => row.map((v) => escapeCsvCell(v)).join(','));

    const csv = [
      headers.map((h) => escapeCsvCell(h)).join(','),
      ...rows,
      '',
      ...diagnosticsRows,
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="marketing-attribution-report-${dateFrom}-to-${dateTo}.csv"`,
      },
    });
  } catch (error) {
    console.error('GET /api/analytics/export/marketing error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
