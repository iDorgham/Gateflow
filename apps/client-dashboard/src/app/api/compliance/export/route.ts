/**
 * GET /api/compliance/export
 * MENA data-protection compliance export (Egypt Law 151 / Saudi PDPL).
 * Query: regime (EGYPT_LAW_151 | SAUDI_PDPL), format (csv | pdf), dateFrom, dateTo.
 *
 * Returns the tenant's retained PII + processing evidence as a machine-readable
 * CSV (or a printable PDF posture report). Admin-ish operator endpoints guard via
 * session claims; here we require an authenticated org session like the analytics
 * export route.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { isSupportedRegime, getRegime } from '@/lib/compliance/regimes';
import {
  collectComplianceRows,
  renderCsv,
  renderPdf,
  buildEvidence,
  type ComplianceExportData,
  type ComplianceRegime,
} from '@/lib/compliance/export-engine';

export const dynamic = 'force-dynamic';

function parseDateOnly(
  value: string | null,
  fallback: (d: Date) => string
): Date {
  const parsed = value ? new Date(`${value}T00:00:00.000Z`) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
  return new Date(fallback(new Date()));
}

function clampRange(from: Date, to: Date): { from: Date; to: Date } {
  if (Number.isNaN(to.getTime()) || to < from) return { from, to };
  return { from, to };
}

function safeRegime(value: string | null): ComplianceRegime | null {
  return value && isSupportedRegime(value) ? value : null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const regime = safeRegime(searchParams.get('regime'));
    if (!regime) {
      return NextResponse.json(
        { success: false, message: 'Invalid or unsupported regime' },
        { status: 400 }
      );
    }
    const format = searchParams.get('format') === 'pdf' ? 'pdf' : 'csv';

    const def = getRegime(regime);
    const to = parseDateOnly(searchParams.get('dateTo'), () =>
      new Date().toISOString().slice(0, 10)
    );
    const from = parseDateOnly(searchParams.get('dateFrom'), () => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().slice(0, 10);
    });
    const range = clampRange(from, to);

    const [org, rows] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: claims.orgId },
        select: { name: true },
      }),
      collectComplianceRows(claims.orgId, range.from, range.to),
    ]);

    const evidence = buildEvidence(rows);
    const payload: ComplianceExportData = {
      regime,
      orgName: org?.name ?? 'Workspace',
      generatedAt: new Date().toISOString(),
      window: {
        from: range.from.toISOString().slice(0, 10),
        to: range.to.toISOString().slice(0, 10),
      },
      evidence,
      contacts: rows.contacts,
      processingEvents: rows.processingEvents,
      auditEvents: rows.auditEvents,
    };

    if (format === 'pdf') {
      const buffer = await renderPdf(payload);
      const filename = `compliance-${def.id}-${payload.window.from}-to-${payload.window.to}.pdf`;
      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    const csv = renderCsv(rows);
    const filename = `compliance-${def.id}-${payload.window.from}-to-${payload.window.to}.csv`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('GET /api/compliance/export error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
