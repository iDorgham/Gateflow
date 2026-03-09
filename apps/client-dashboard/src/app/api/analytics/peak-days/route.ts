/**
 * GET /api/analytics/peak-days
 * Scan count by day of week (0=Sun … 6=Sat).
 * Query: dateFrom, dateTo, projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { AnalyticsQuerySchema, validateAnalyticsQuery, type AnalyticsQueryInput } from '@/lib/analytics/analytics-query';
import type { PeakDaysRow } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type RawRow = { dow: number; count: bigint };

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
        SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY dow
        ORDER BY dow
      `;
    } else if (projectId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY dow
        ORDER BY dow
      `;
    } else if (gateId) {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY dow
        ORDER BY dow
      `;
    } else {
      rows = await prisma.$queryRaw<RawRow[]>`
        SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${ctx.dateFromDate} AND sl."scannedAt" <= ${ctx.dateToDate}
        GROUP BY dow
        ORDER BY dow
      `;
    }

    const byDow = new Map<number, number>();
    for (const r of rows) {
      byDow.set(r.dow, Number(r.count));
    }

    const data: PeakDaysRow[] = Array.from({ length: 7 }, (_, dow) => ({
      dayOfWeek: dow,
      label: DAY_LABELS[dow],
      count: byDow.get(dow) ?? 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/peak-days error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
