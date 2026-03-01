import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { getCached, setCached, cacheKey } from '@/lib/analytics-cache';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().optional().default(''),
  gateId: z.string().optional().default(''),
});

type Row = { dow: number; hour: number; count: bigint };

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

    // Validate projectId and gateId belong to org; when both provided, gate must belong to project
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
        where: {
          id: gateId,
          organizationId: orgId,
          deletedAt: null,
          ...(projectId ? { projectId } : {}),
        },
        select: { id: true },
      });
      if (!gate) {
        return NextResponse.json(
          { success: false, message: projectId ? 'Gate must belong to the selected project' : 'Invalid gate' },
          { status: 400 }
        );
      }
    }

    const key = cacheKey('analytics:heatmap', {
      orgId,
      dateFrom,
      dateTo,
      projectId: projectId ?? '',
      gateId: gateId ?? '',
    });

    const cached = await getCached<{ dow: number; hour: number; count: number }[]>(key);
    if (cached) {
      return NextResponse.json({ success: true, data: cached });
    }

    // Build raw SQL — use Prisma tagged template for safe params
    let rows: Row[];
    if (projectId && gateId) {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT
          EXTRACT(DOW FROM sl."scannedAt")::int AS dow,
          EXTRACT(HOUR FROM sl."scannedAt")::int AS hour,
          COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL
          AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate}
          AND sl."scannedAt" <= ${dateToDate}
        GROUP BY dow, hour
      `;
    } else if (projectId) {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT
          EXTRACT(DOW FROM sl."scannedAt")::int AS dow,
          EXTRACT(HOUR FROM sl."scannedAt")::int AS hour,
          COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND qr."projectId" = ${projectId}
          AND g."deletedAt" IS NULL
          AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate}
          AND sl."scannedAt" <= ${dateToDate}
        GROUP BY dow, hour
      `;
    } else if (gateId) {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT
          EXTRACT(DOW FROM sl."scannedAt")::int AS dow,
          EXTRACT(HOUR FROM sl."scannedAt")::int AS hour,
          COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND sl."gateId" = ${gateId}
          AND g."deletedAt" IS NULL
          AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate}
          AND sl."scannedAt" <= ${dateToDate}
        GROUP BY dow, hour
      `;
    } else {
      rows = await prisma.$queryRaw<Row[]>`
        SELECT
          EXTRACT(DOW FROM sl."scannedAt")::int AS dow,
          EXTRACT(HOUR FROM sl."scannedAt")::int AS hour,
          COUNT(*)::bigint AS count
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "Gate" g ON sl."gateId" = g.id
        WHERE qr."organizationId" = ${orgId}
          AND g."deletedAt" IS NULL
          AND qr."deletedAt" IS NULL
          AND sl."scannedAt" >= ${dateFromDate}
          AND sl."scannedAt" <= ${dateToDate}
        GROUP BY dow, hour
      `;
    }

    const data = rows.map((r) => ({ dow: r.dow, hour: r.hour, count: Number(r.count) }));
    await setCached(key, data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/heatmap error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
