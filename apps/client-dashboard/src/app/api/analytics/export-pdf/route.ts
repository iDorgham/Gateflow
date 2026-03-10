/**
 * GET /api/analytics/export-pdf
 * Generate a PDF summary report for the analytics dashboard.
 * Query: dateFrom, dateTo (YYYY-MM-DD), projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import {
  AnalyticsQuerySchema,
  validateAnalyticsQuery,
  type AnalyticsQueryInput,
} from '@/lib/analytics/analytics-query';

export const dynamic = 'force-dynamic';

interface SummaryMetrics {
  totalVisits: number;
  passRate: number;
  peakHour: number;
  deniedCount: number;
  attributedScans: number;
}

type VisitsRow = { date: string; count: bigint };

async function fetchSummary(
  orgId: string,
  ctx: Awaited<ReturnType<typeof validateAnalyticsQuery>> extends { ok: true; ctx: infer C } ? C : never
): Promise<SummaryMetrics> {
  const { dateFromDate, dateToDate, projectId, gateId } = ctx;

  const qrFilter = {
    organizationId: orgId,
    deletedAt: null as null,
    ...(projectId ? { projectId } : {}),
  };

  const scanFilter = {
    qrCode: qrFilter,
    scannedAt: { gte: dateFromDate, lte: dateToDate },
    ...(gateId ? { gateId } : {}),
  };

  const attributedFilter = {
    ...scanFilter,
    qrCode: { ...scanFilter.qrCode, utmCampaign: { not: null } },
  };

  const [totalVisits, successCount, deniedCount, attributedScans] = await Promise.all([
    prisma.scanLog.count({ where: scanFilter }),
    prisma.scanLog.count({ where: { ...scanFilter, status: 'SUCCESS' } }),
    prisma.scanLog.count({ where: { ...scanFilter, status: 'DENIED' } }),
    prisma.scanLog.count({ where: attributedFilter }),
  ]);

  const passRate = totalVisits > 0 ? Math.round((successCount / totalVisits) * 100) : 0;

  // Approximate peak hour from ScanLog (optional; keep simple)
  const peakHourRow = await prisma.scanLog.groupBy({
    by: ['scannedAt'],
    where: scanFilter,
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 1,
  });
  const peakHour =
    peakHourRow.length > 0 ? new Date(peakHourRow[0].scannedAt).getHours() : -1;

  return {
    totalVisits,
    passRate,
    peakHour,
    deniedCount,
    attributedScans,
  };
}

async function fetchVisitsSeries(
  orgId: string,
  ctx: Awaited<ReturnType<typeof validateAnalyticsQuery>> extends { ok: true; ctx: infer C } ? C : never
): Promise<{ date: string; count: number }[]> {
  const { projectId, gateId, dateFromDate, dateToDate } = ctx;

  let rows: VisitsRow[];
  if (projectId && gateId) {
    rows = await prisma.$queryRaw<VisitsRow[]>`
      SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      JOIN "Gate" g ON sl."gateId" = g.id
      WHERE qr."organizationId" = ${orgId}
        AND qr."projectId" = ${projectId}
        AND sl."gateId" = ${gateId}
        AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
        AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
      GROUP BY (sl."scannedAt"::date)
      ORDER BY date
    `;
  } else if (projectId) {
    rows = await prisma.$queryRaw<VisitsRow[]>`
      SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      JOIN "Gate" g ON sl."gateId" = g.id
      WHERE qr."organizationId" = ${orgId}
        AND qr."projectId" = ${projectId}
        AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
        AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
      GROUP BY (sl."scannedAt"::date)
      ORDER BY date
    `;
  } else if (gateId) {
    rows = await prisma.$queryRaw<VisitsRow[]>`
      SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      JOIN "Gate" g ON sl."gateId" = g.id
      WHERE qr."organizationId" = ${orgId}
        AND sl."gateId" = ${gateId}
        AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
        AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
      GROUP BY (sl."scannedAt"::date)
      ORDER BY date
    `;
  } else {
    rows = await prisma.$queryRaw<VisitsRow[]>`
      SELECT (sl."scannedAt"::date)::text AS date, COUNT(*)::bigint AS count
      FROM "ScanLog" sl
      JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
      JOIN "Gate" g ON sl."gateId" = g.id
      WHERE qr."organizationId" = ${orgId}
        AND g."deletedAt" IS NULL AND qr."deletedAt" IS NULL
        AND sl."scannedAt" >= ${dateFromDate} AND sl."scannedAt" <= ${dateToDate}
      GROUP BY (sl."scannedAt"::date)
      ORDER BY date
    `;
  }

  const byDate = new Map<string, number>();
  for (const r of rows) {
    byDate.set(r.date, Number(r.count));
  }

  const series: { date: string; count: number }[] = [];
  for (let d = new Date(dateFromDate); d <= dateToDate; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: byDate.get(key) ?? 0 });
  }
  return series;
}

function createPdfBuffer(
  orgName: string,
  dateFrom: string,
  dateTo: string,
  summary: SummaryMetrics,
  visits: { date: string; count: number }[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk as Buffer));
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on('error', (err) => reject(err));

    // Header
    doc.fontSize(18).text('GateFlow Analytics Report', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#555555');
    doc.text(`Workspace: ${orgName}`);
    doc.text(`Date range: ${dateFrom} → ${dateTo}`);
    doc.moveDown(1);

    // KPI section
    doc.fontSize(12).fillColor('#000000').text('Key metrics', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Total visits: ${summary.totalVisits.toLocaleString()}`);
    doc.text(`Pass rate: ${summary.passRate}%`);
    doc.text(`Peak hour: ${summary.peakHour >= 0 ? summary.peakHour + 'h' : '—'}`);
    doc.text(`Denied scans: ${summary.deniedCount.toLocaleString()}`);
    doc.text(`Attributed scans: ${summary.attributedScans.toLocaleString()}`);
    doc.moveDown(1);

    // Visits over time (simple table)
    doc.fontSize(12).text('Visits over time', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(9);
    const maxRows = 31;
    const rows = visits.slice(0, maxRows);
    rows.forEach((row) => {
      doc.text(`${row.date}: ${row.count.toLocaleString()} scans`);
    });
    if (visits.length > maxRows) {
      doc.text(`… and ${visits.length - maxRows} more days`, { oblique: true });
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#777777');
    doc.text(
      `Generated at ${new Date().toISOString()}`,
      50,
      doc.page.height - 50,
      { align: 'left' }
    );

    doc.end();
  });
}

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
      unitType: searchParams.get('unitType') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const validation = await validateAnalyticsQuery(
      claims.orgId,
      parsed.data as AnalyticsQueryInput
    );
    if (!validation.ok) {
      const msg = (validation as { ok: false; message: string }).message;
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }
    const { ctx } = validation;

    // Fetch org for display name
    const org = await prisma.organization.findUnique({
      where: { id: claims.orgId },
      select: { name: true },
    });

    const [summary, visits] = await Promise.all([
      fetchSummary(claims.orgId, ctx),
      fetchVisitsSeries(claims.orgId, ctx),
    ]);

    const buffer = await createPdfBuffer(
      org?.name ?? 'Workspace',
      ctx.dateFrom,
      ctx.dateTo,
      summary,
      visits
    );

    const filename = `analytics-${ctx.dateFrom}-to-${ctx.dateTo}.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('GET /api/analytics/export-pdf error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

