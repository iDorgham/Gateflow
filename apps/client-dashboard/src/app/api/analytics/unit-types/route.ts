/**
 * GET /api/analytics/unit-types
 * Visit count by unit type (from Unit via VisitorQR — resident-created QRs only).
 * Query: dateFrom, dateTo, projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { AnalyticsQuerySchema, validateAnalyticsQuery } from '@/lib/analytics/analytics-query';
import type { UnitTypesRankingRow } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

type RawRow = { unitType: string; count: bigint };

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
        SELECT u.type::text AS "unitType", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON qr.id = vqr."qrCodeId"
        JOIN "Unit" u ON vqr."unitId" = u.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND sl."gateId" = ${gateId}
          AND qr."deletedAt" IS NULL AND g."deletedAt" IS NULL AND u."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY u.type
        ORDER BY count DESC
      `;
    } else if (projectId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT u.type::text AS "unitType", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON qr.id = vqr."qrCodeId"
        JOIN "Unit" u ON vqr."unitId" = u.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND qr."deletedAt" IS NULL AND g."deletedAt" IS NULL AND u."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY u.type
        ORDER BY count DESC
      `;
    } else if (gateId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT u.type::text AS "unitType", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON qr.id = vqr."qrCodeId"
        JOIN "Unit" u ON vqr."unitId" = u.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."gateId" = ${gateId}
          AND qr."deletedAt" IS NULL AND g."deletedAt" IS NULL AND u."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY u.type
        ORDER BY count DESC
      `;
    } else {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT u.type::text AS "unitType", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON qr.id = vqr."qrCodeId"
        JOIN "Unit" u ON vqr."unitId" = u.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL AND g."deletedAt" IS NULL AND u."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY u.type
        ORDER BY count DESC
      `;
    }

    const data: UnitTypesRankingRow[] = rows.map((r) => ({
      unitType: r.unitType,
      count: Number(r.count),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/unit-types error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
