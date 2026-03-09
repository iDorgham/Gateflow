/**
 * GET /api/analytics/top-gates
 * Top gates by scan count.
 * Query: dateFrom, dateTo, projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { AnalyticsQuerySchema, validateAnalyticsQuery } from '@/lib/analytics/analytics-query';
import type { TopGatesRow } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

type RawRow = { gateId: string; gateName: string; count: bigint };

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = AnalyticsQuerySchema.safeParse({
      dateFrom: searchParams.get('dateFrom') ?? '',
      dateTo: searchParams.get('dateTo') ?? '',
      projectId: searchParams.get('projectId') ?? '',
      gateId: searchParams.get('gateId') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const validation = await validateAnalyticsQuery(claims.orgId, parsed.data);
    if (!validation.ok) {
      return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
    }
    const { ctx } = validation;

    const { orgId, projectId, gateId } = ctx;
    let rows: RawRow[];
    if (projectId && gateId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    } else if (projectId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    } else if (gateId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    } else {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    }

    const data: TopGatesRow[] = rows.map((r) => ({
      gateId: r.gateId,
      gateName: r.gateName,
      count: Number(r.count),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/top-gates error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
