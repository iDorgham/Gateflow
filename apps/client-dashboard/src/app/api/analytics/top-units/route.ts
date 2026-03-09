/**
 * GET /api/analytics/top-units
 * Top 10 units by scan count (resident-created QRs via VisitorQR only).
 * Query: dateFrom, dateTo, projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { AnalyticsQuerySchema, validateAnalyticsQuery, type AnalyticsQueryInput } from '@/lib/analytics/analytics-query';
import type { TopUnitsRow } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

type RawRow = { unitId: string; unitName: string; count: bigint };

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

    const validation = await validateAnalyticsQuery(claims.orgId, parsed.data as AnalyticsQueryInput);
    if (!validation.ok) {
      const msg = (validation as { ok: false; message: string }).message;
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }
    const { ctx } = validation;

    const { orgId, projectId, gateId } = ctx;

    let rows: RawRow[];
    if (projectId && gateId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT u.id AS "unitId", u.name AS "unitName", COUNT(*)::bigint AS count
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
        GROUP BY u.id, u.name
        ORDER BY count DESC
        LIMIT 10
      `;
    } else if (projectId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT u.id AS "unitId", u.name AS "unitName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON qr.id = vqr."qrCodeId"
        JOIN "Unit" u ON vqr."unitId" = u.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND qr."deletedAt" IS NULL AND g."deletedAt" IS NULL AND u."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY u.id, u.name
        ORDER BY count DESC
        LIMIT 10
      `;
    } else if (gateId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT u.id AS "unitId", u.name AS "unitName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON qr.id = vqr."qrCodeId"
        JOIN "Unit" u ON vqr."unitId" = u.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."gateId" = ${gateId}
          AND qr."deletedAt" IS NULL AND g."deletedAt" IS NULL AND u."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY u.id, u.name
        ORDER BY count DESC
        LIMIT 10
      `;
    } else {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT u.id AS "unitId", u.name AS "unitName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON qr.id = vqr."qrCodeId"
        JOIN "Unit" u ON vqr."unitId" = u.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."deletedAt" IS NULL AND g."deletedAt" IS NULL AND u."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY u.id, u.name
        ORDER BY count DESC
        LIMIT 10
      `;
    }

    const data: TopUnitsRow[] = rows.map((r) => ({
      unitId: r.unitId,
      unitName: r.unitName,
      count: Number(r.count),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/top-units error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
