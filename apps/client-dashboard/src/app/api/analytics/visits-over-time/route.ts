/**
 * GET /api/analytics/visits-over-time
 * Time series of scan count by date.
 * Query: dateFrom, dateTo (YYYY-MM-DD), projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { AnalyticsQuerySchema, validateAnalyticsQuery } from '@/lib/analytics/analytics-query';
import type { VisitsOverTimePoint } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

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

    type Row = { date: string; count: bigint };
    let rows: Row[];
    const { orgId, projectId, gateId } = ctx;
    if (projectId && gateId) {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY (sl."scannedAt"::date)
        ORDER BY date
      `;
    } else if (projectId) {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY (sl."scannedAt"::date)
        ORDER BY date
      `;
    } else if (gateId) {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY (sl."scannedAt"::date)
        ORDER BY date
      `;
    } else {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY (sl."scannedAt"::date)
        ORDER BY date
      `;
    }

    const byDate = new Map<string, number>();
    for (const r of rows) {
      byDate.set(r.date, Number(r.count));
    }

    const dates: VisitsOverTimePoint[] = [];
    const start = new Date(ctx.dateFromDate);
    const end = new Date(ctx.dateToDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      dates.push({ date: key, count: byDate.get(key) ?? 0 });
    }

    return NextResponse.json({ success: true, data: dates });
  } catch (error) {
    console.error('GET /api/analytics/visits-over-time error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
