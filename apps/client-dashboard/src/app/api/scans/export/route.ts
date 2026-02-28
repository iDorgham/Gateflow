import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import type { ScanStatus } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = new Set<string>([
  'SUCCESS',
  'FAILED',
  'EXPIRED',
  'MAX_USES_REACHED',
  'INACTIVE',
  'DENIED',
]);

// Escape a single CSV cell value.
// Prefixes formula-injection trigger characters to prevent CSV injection.
// See OWASP: https://owasp.org/www-community/attacks/CSV_Injection
function csvCell(value: string | null | undefined): string {
  const s = value ?? '';
  const sanitized = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  if (sanitized.includes(',') || sanitized.includes('"') || sanitized.includes('\n')) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
}

function buildRow(cells: (string | null | undefined)[]): string {
  return cells.map(csvCell).join(',');
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const orgId = claims.orgId;

    // Parse + sanitise filter params (mirrors page.tsx)
    const rawStatus = searchParams.get('status') ?? '';
    const statusFilter = VALID_STATUSES.has(rawStatus) ? (rawStatus as ScanStatus) : undefined;
    const gateFilter = searchParams.get('gate') || undefined;
    const qFilter = searchParams.get('q')?.trim() || undefined;
    const dateFromRaw = searchParams.get('dateFrom');
    const dateToRaw = searchParams.get('dateTo');
    const dateFrom = dateFromRaw ? new Date(dateFromRaw) : undefined;
    const dateTo = dateToRaw
      ? new Date(new Date(dateToRaw).setHours(23, 59, 59, 999))
      : undefined;
    const userIdFilter = searchParams.get('userId') || undefined;
    const deviceIdFilter = searchParams.get('deviceId')?.trim() || undefined;

    // Project filter — 'all' sentinel means no project filter
    const rawProject = searchParams.get('project') || undefined;
    const projectFilter =
      rawProject && rawProject !== 'all' ? rawProject : undefined;

    // Validate project belongs to this org when provided
    if (projectFilter) {
      const projectExists = await prisma.project.findFirst({
        where: { id: projectFilter, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (!projectExists) {
        return NextResponse.json(
          { success: false, message: 'Project not found' },
          { status: 404 },
        );
      }
    }

    // Validate dates
    if (dateFrom && isNaN(dateFrom.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid dateFrom' }, { status: 400 });
    }
    if (dateTo && isNaN(dateTo.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid dateTo' }, { status: 400 });
    }

    const where = {
      qrCode: {
        organizationId: orgId,
        ...(projectFilter ? { projectId: projectFilter } : {}),
        ...(qFilter ? { code: { contains: qFilter } } : {}),
      },
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(gateFilter ? { gateId: gateFilter } : {}),
      ...(userIdFilter ? { userId: userIdFilter } : {}),
      ...(deviceIdFilter ? { deviceId: { contains: deviceIdFilter } } : {}),
      ...(dateFrom || dateTo
        ? {
            scannedAt: {
              ...(dateFrom ? { gte: dateFrom } : {}),
              ...(dateTo ? { lte: dateTo } : {}),
            },
          }
        : {}),
    };

    // Cap at 50,000 rows to avoid OOM on large exports
    const MAX_ROWS = 50_000;
    const count = await prisma.scanLog.count({ where });

    if (count > MAX_ROWS) {
      return NextResponse.json(
        {
          success: false,
          message: `Export exceeds ${MAX_ROWS.toLocaleString()} rows. Apply additional filters to narrow the result.`,
        },
        { status: 422 },
      );
    }

    // Generator function for batched fetching
    const scanGenerator = async function* () {
      const BATCH_SIZE = 1000;
      let cursor: string | undefined;

      while (true) {
        const batch = await prisma.scanLog.findMany({
          take: BATCH_SIZE,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          where,
          orderBy: [
            { scannedAt: 'desc' },
            { id: 'desc' }, // Stable sort for cursor pagination
          ],
          include: {
            qrCode: {
              select: {
                code: true,
                type: true,
                project: { select: { name: true } },
              },
            },
            gate: { select: { name: true } },
            user: { select: { name: true, email: true } },
          },
        });

        if (batch.length === 0) break;

        for (const scan of batch) {
          yield scan;
        }

        if (batch.length < BATCH_SIZE) break;
        cursor = batch[batch.length - 1].id;
      }
    };

    const iterator = scanGenerator();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Enqueue CSV Header
        const header = buildRow([
          'Scan ID',
          'Scan UUID',
          'Date/Time (UTC)',
          'Status',
          'Project',
          'QR Code',
          'QR Type',
          'Gate',
          'Operator Name',
          'Operator Email',
          'Device ID',
        ]);
        controller.enqueue(encoder.encode(header + '\r\n'));

        try {
          for await (const s of iterator) {
            const row = buildRow([
              s.id,
              s.scanUuid ?? '',
              s.scannedAt.toISOString(),
              s.status,
              s.qrCode?.project?.name ?? '',
              s.qrCode?.code ?? '',
              s.qrCode?.type ?? '',
              s.gate?.name ?? '',
              s.user?.name ?? '',
              s.user?.email ?? '',
              s.deviceId ?? '',
            ]);
            controller.enqueue(encoder.encode(row + '\r\n'));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    const today = new Date().toISOString().slice(0, 10);
    const suffix = projectFilter ? `_${projectFilter.slice(0, 8)}` : '';
    const filename = `scans_export_${today}${suffix}.csv`;

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('Scans export error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
