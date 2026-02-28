import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().optional().default(''),
  gateId: z.string().optional().default(''),
});

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
      gateId: searchParams.get('gateId') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const { dateFrom, dateTo, projectId, gateId } = parsed.data;
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
    if (gateId) {
      const gate = await prisma.gate.findFirst({
        where: { id: gateId, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (!gate) {
        return NextResponse.json({ success: false, message: 'Invalid gate' }, { status: 400 });
      }
    }

    const qrFilter = {
      organizationId: orgId,
      deletedAt: null,
      ...(projectId ? { projectId } : {}),
    };

    const scanFilter = {
      qrCode: qrFilter,
      scannedAt: { gte: dateFromDate, lte: dateToDate },
      ...(gateId ? { gateId } : {}),
    };

    const runHeatmap = async (): Promise<{ dow: number; hour: number; count: bigint }[]> => {
      type H = { dow: number; hour: number; count: bigint };
      if (projectId && gateId) {
        return prisma.$queryRaw<H[]>`
          SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, EXTRACT(HOUR FROM sl."scannedAt")::int AS hour, COUNT(*)::bigint AS count
          FROM "ScanLog" sl JOIN "QRCode" qr ON sl."qrCodeId" = qr.id JOIN "Gate" g ON sl."gateId" = g.id
          WHERE qr."organizationId" = ${orgId} AND qr."projectId" = ${projectId} AND sl."gateId" = ${gateId}
            AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
            AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
          GROUP BY dow, hour
        `;
      }
      if (projectId) {
        return prisma.$queryRaw<H[]>`
          SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, EXTRACT(HOUR FROM sl."scannedAt")::int AS hour, COUNT(*)::bigint AS count
          FROM "ScanLog" sl JOIN "QRCode" qr ON sl."qrCodeId" = qr.id JOIN "Gate" g ON sl."gateId" = g.id
          WHERE qr."organizationId" = ${orgId} AND qr."projectId" = ${projectId}
            AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
            AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
          GROUP BY dow, hour
        `;
      }
      if (gateId) {
        return prisma.$queryRaw<H[]>`
          SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, EXTRACT(HOUR FROM sl."scannedAt")::int AS hour, COUNT(*)::bigint AS count
          FROM "ScanLog" sl JOIN "QRCode" qr ON sl."qrCodeId" = qr.id JOIN "Gate" g ON sl."gateId" = g.id
          WHERE qr."organizationId" = ${orgId} AND sl."gateId" = ${gateId}
            AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
            AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
          GROUP BY dow, hour
        `;
      }
      return prisma.$queryRaw<H[]>`
        SELECT EXTRACT(DOW FROM sl."scannedAt")::int AS dow, EXTRACT(HOUR FROM sl."scannedAt")::int AS hour, COUNT(*)::bigint AS count
        FROM "ScanLog" sl JOIN "QRCode" qr ON sl."qrCodeId" = qr.id JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
        GROUP BY dow, hour
      `;
    };

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const attributedFilter = {
      ...scanFilter,
      qrCode: { ...scanFilter.qrCode, utmCampaign: { not: null } },
    };

    const [totalVisits, successCount, deniedCount, heatmapRaw, lastHourCount, attributedScans] = await Promise.all([
      prisma.scanLog.count({ where: scanFilter }),
      prisma.scanLog.count({ where: { ...scanFilter, status: 'SUCCESS' } }),
      prisma.scanLog.count({ where: { ...scanFilter, status: 'DENIED' } }),
      runHeatmap(),
      prisma.scanLog.count({
        where: {
          ...scanFilter,
          scannedAt: { gte: oneHourAgo, lte: now },
        },
      }),
      prisma.scanLog.count({ where: attributedFilter }),
    ]);

    const passRate = totalVisits > 0 ? Math.round((successCount / totalVisits) * 100) : 0;

    const heatmapRows = heatmapRaw as { dow: number; hour: number; count: bigint }[];
    const hourCounts = new Map<number, number>();
    for (const r of heatmapRows) {
      const c = typeof r.count === 'bigint' ? Number(r.count) : r.count;
      hourCounts.set(r.hour, (hourCounts.get(r.hour) ?? 0) + c);
    }
    let peakHour = -1;
    let maxCount = 0;
    for (const [h, c] of Array.from(hourCounts.entries())) {
      if (c > maxCount) {
        maxCount = c;
        peakHour = h;
      }
    }

    const totalDays = Math.ceil((dateToDate.getTime() - dateFromDate.getTime()) / (24 * 60 * 60 * 1000)) || 1;
    const totalHourBuckets = totalDays * 24;
    const hourlyAvg = totalVisits / totalHourBuckets;

    const data = {
      totalVisits,
      passRate,
      peakHour,
      uniqueVisitors: -1,
      deniedCount,
      attributedScans,
      lastHourCount,
      hourlyAvg,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/summary error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
