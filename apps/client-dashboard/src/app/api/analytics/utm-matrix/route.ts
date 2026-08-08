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

export interface UTMMatrixRow {
  source: string;
  medium: string;
  clicks: number;
  scans: number;
  conversionRate: number;
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

    // 1. Get clicks and scans count per source/medium via raw SQL
    const projectCondClick = projectId
      ? Prisma.sql`AND qr."projectId" = ${projectId}`
      : Prisma.empty;
    const projectCondScan = projectId
      ? Prisma.sql`AND qr."projectId" = ${projectId}`
      : Prisma.empty;

    type RawRow = {
      source: string;
      medium: string;
      clicks: bigint;
      scans: bigint;
    };

    // We'll use a UNION or JOIN to get both in one go.
    // Actually, let's just use raw SQL to grouping by source/medium across both tables.

    const matrix = (await prisma.$queryRaw<RawRow[]>(Prisma.sql`
      WITH clicks AS (
        SELECT 
          COALESCE("utmSource", '(direct)') as source,
          COALESCE("utmMedium", '(none)') as medium,
          COUNT(*)::bigint as count
        FROM "ShortLinkClick" slc
        LEFT JOIN "QrShortLink" qsl ON slc."shortLinkId" = qsl.id
        LEFT JOIN "QRCode" qr ON qsl."qrCodeId" = qr.id
        WHERE slc."organizationId" = ${orgId}
          AND slc."clickedAt" >= ${dateFromDate} AND slc."clickedAt" <= ${dateToDate}
          ${projectCondClick}
        GROUP BY "utmSource", "utmMedium"
      ),
      scans AS (
        SELECT 
          COALESCE(qr."utmSource", '(direct)') as source,
          COALESCE(qr."utmMedium", '(none)') as medium,
          COUNT(*)::bigint as count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL AND sl."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
          ${projectCondScan}
        GROUP BY qr."utmSource", qr."utmMedium"
      )
      SELECT 
        COALESCE(c.source, s.source) as source,
        COALESCE(c.medium, s.medium) as medium,
        COALESCE(c.count, 0) as clicks,
        COALESCE(s.count, 0) as scans
      FROM clicks c
      FULL OUTER JOIN scans s ON c.source = s.source AND c.medium = s.medium
      ORDER BY clicks DESC, scans DESC
    `)) as RawRow[];

    const rows: UTMMatrixRow[] = matrix.map((r) => ({
      source: r.source,
      medium: r.medium,
      clicks: Number(r.clicks),
      scans: Number(r.scans),
      conversionRate:
        r.clicks > 0
          ? Math.round((Number(r.scans) / Number(r.clicks)) * 100)
          : 0,
    }));

    return NextResponse.json({ success: true, data: { matrix: rows } });
  } catch (error) {
    console.error('GET /api/analytics/utm-matrix error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
