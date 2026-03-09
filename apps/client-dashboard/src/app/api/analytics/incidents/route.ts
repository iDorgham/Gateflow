/**
 * GET /api/analytics/incidents
 * Denied scans (status=DENIED) by gate and optionally by operator (userId).
 * Query: dateFrom, dateTo, projectId?, gateId?, groupBy=gate|operator
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { AnalyticsQuerySchema, validateAnalyticsQuery } from '@/lib/analytics/analytics-query';
import type { IncidentsByGateRow, IncidentsByOperatorRow } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

type GateRow = { gateId: string; gateName: string; count: bigint };
type OpRow = { userId: string | null; userName: string | null; count: bigint };

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get('groupBy') ?? 'gate';
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

    if (groupBy === 'operator') {
      let opRows: OpRow[];
      if (projectId && gateId) {
        opRows = await prisma.$queryRaw<OpRow[]>`
          SELECT sl."userId" AS "userId", u.name AS "userName", COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          JOIN "Gate" g ON sl."gateId" = g.id
          LEFT JOIN "User" u ON sl."userId" = u.id
          WHERE qr."organizationId" = ${orgId}
            AND qr."projectId" = ${projectId}
            AND sl."gateId" = ${gateId}
            AND sl.status = 'DENIED'
            AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
            AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
          GROUP BY sl."userId", u.name
          ORDER BY count DESC
        `;
      } else if (projectId) {
        opRows = await prisma.$queryRaw<OpRow[]>`
          SELECT sl."userId" AS "userId", u.name AS "userName", COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          JOIN "Gate" g ON sl."gateId" = g.id
          LEFT JOIN "User" u ON sl."userId" = u.id
          WHERE qr."organizationId" = ${orgId}
            AND qr."projectId" = ${projectId}
            AND sl.status = 'DENIED'
            AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
            AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
          GROUP BY sl."userId", u.name
          ORDER BY count DESC
        `;
      } else if (gateId) {
        opRows = await prisma.$queryRaw<OpRow[]>`
          SELECT sl."userId" AS "userId", u.name AS "userName", COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          JOIN "Gate" g ON sl."gateId" = g.id
          LEFT JOIN "User" u ON sl."userId" = u.id
          WHERE qr."organizationId" = ${orgId}
            AND sl."gateId" = ${gateId}
            AND sl.status = 'DENIED'
            AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
            AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
          GROUP BY sl."userId", u.name
          ORDER BY count DESC
        `;
      } else {
        opRows = await prisma.$queryRaw<OpRow[]>`
          SELECT sl."userId" AS "userId", u.name AS "userName", COUNT(*)::bigint AS count
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          JOIN "Gate" g ON sl."gateId" = g.id
          LEFT JOIN "User" u ON sl."userId" = u.id
          WHERE qr."organizationId" = ${orgId}
            AND sl.status = 'DENIED'
            AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
            AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
          GROUP BY sl."userId", u.name
          ORDER BY count DESC
        `;
      }

      const data: IncidentsByOperatorRow[] = opRows.map((r) => ({
        userId: r.userId ?? '',
        userName: r.userName ?? 'Unknown',
        count: Number(r.count),
      }));

      return NextResponse.json({ success: true, data });
    }

    let gateRows: GateRow[];
    if (projectId && gateId) {
      gateRows = await prisma.$queryRaw<GateRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND sl."gateId" = ${gateId}
          AND sl.status = 'DENIED'
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    } else if (projectId) {
      gateRows = await prisma.$queryRaw<GateRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND sl.status = 'DENIED'
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    } else if (gateId) {
      gateRows = await prisma.$queryRaw<GateRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."gateId" = ${gateId}
          AND sl.status = 'DENIED'
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    } else {
      gateRows = await prisma.$queryRaw<GateRow[]>`
        SELECT g.id AS "gateId", g.name AS "gateName", COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl.status = 'DENIED'
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY g.id, g.name
        ORDER BY count DESC
      `;
    }

    const data: IncidentsByGateRow[] = gateRows.map((r) => ({
      gateId: r.gateId,
      gateName: r.gateName,
      count: Number(r.count),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/incidents error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
