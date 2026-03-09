/**
 * GET /api/analytics/visitor-type
 * Scan count by QRCode type (SINGLE, RECURRING, PERMANENT, VISITOR, OPEN).
 * Query: dateFrom, dateTo, projectId?, gateId?
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { AnalyticsQuerySchema, validateAnalyticsQuery, buildScanLogWhere, type AnalyticsQueryInput } from '@/lib/analytics/analytics-query';
import type { VisitorTypeRow } from '@/lib/analytics/types';

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

    const validation = await validateAnalyticsQuery(claims.orgId, parsed.data as AnalyticsQueryInput);
    if (!validation.ok) {
      const msg = (validation as { ok: false; message: string }).message;
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }
    const { ctx } = validation;

    const where = buildScanLogWhere(ctx);

    const rows = await prisma.scanLog.groupBy({
      by: ['qrCodeId'],
      where,
      _count: { id: true },
    });

    const qrIds = rows.map((r) => r.qrCodeId);
    const qrCodes = await prisma.qRCode.findMany({
      where: { id: { in: qrIds } },
      select: { id: true, type: true },
    });
    const typeByQr = new Map(qrCodes.map((q) => [q.id, q.type]));

    const byType = new Map<string, number>();
    for (const r of rows) {
      const t = typeByQr.get(r.qrCodeId) ?? 'UNKNOWN';
      byType.set(t, (byType.get(t) ?? 0) + r._count.id);
    }

    const data: VisitorTypeRow[] = Array.from(byType.entries()).map(([type, count]) => ({
      type,
      count,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/analytics/visitor-type error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
