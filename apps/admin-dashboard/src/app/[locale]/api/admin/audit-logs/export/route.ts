import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@gate-access/db';

const COOKIE_NAME = 'admin_session';

function expectedToken(): string {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[admin/export] ADMIN_ACCESS_KEY is not set');
    }
    return createHash('sha256').update('dev-admin-key-change-in-production').digest('hex');
  }
  return createHash('sha256').update(key).digest('hex');
}

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Prefix formula-injection trigger characters so spreadsheet apps don't execute them.
  // See OWASP: https://owasp.org/www-community/attacks/CSV_Injection
  const sanitized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  if (sanitized.includes(',') || sanitized.includes('"') || sanitized.includes('\n')) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (session !== expectedToken()) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const orgFilter = sp.get('org')?.trim() ?? '';
  const statusFilter = sp.get('status') ?? '';
  const uuidFilter = sp.get('q')?.trim() ?? '';
  const fromDate = sp.get('from') ? new Date(sp.get('from')!) : undefined;
  const toDate = sp.get('to') ? new Date(sp.get('to')! + 'T23:59:59') : undefined;

  const VALID_STATUSES = new Set(['SUCCESS', 'DENIED', 'FAILED', 'EXPIRED', 'MAX_USES_REACHED', 'INACTIVE']);
  const where: Record<string, unknown> = {};
  if (statusFilter && VALID_STATUSES.has(statusFilter)) where.status = statusFilter;
  if (uuidFilter) where.scanUuid = { contains: uuidFilter, mode: 'insensitive' };
  if (fromDate || toDate) {
    where.scannedAt = {
      ...(fromDate ? { gte: fromDate } : {}),
      ...(toDate ? { lte: toDate } : {}),
    };
  }
  if (orgFilter) {
    where.qrCode = { organization: { name: { contains: orgFilter, mode: 'insensitive' } } };
  }

  const logs = await prisma.scanLog.findMany({
    where,
    orderBy: { scannedAt: 'desc' },
    take: 10_000,
    select: {
      id: true,
      scanUuid: true,
      status: true,
      scannedAt: true,
      deviceId: true,
      gate: { select: { name: true, location: true } },
      qrCode: {
        select: {
          type: true,
          code: true,
          organization: { select: { name: true } },
        },
      },
      user: { select: { name: true, email: true, role: true } },
    },
  });

  const headers = [
    'ID',
    'Scan UUID',
    'Status',
    'Organization',
    'Gate',
    'Gate Location',
    'QR Type',
    'QR Code',
    'Scanner Name',
    'Scanner Email',
    'Scanner Role',
    'Device ID',
    'Scanned At',
  ];

  const rows = logs.map((log) => [
    log.id,
    log.scanUuid ?? '',
    log.status,
    log.qrCode?.organization?.name ?? '',
    log.gate?.name ?? '',
    log.gate?.location ?? '',
    log.qrCode?.type ?? '',
    log.qrCode?.code ?? '',
    log.user?.name ?? '',
    log.user?.email ?? '',
    log.user?.role ?? '',
    log.deviceId ?? '',
    log.scannedAt.toISOString(),
  ]);

  const csvLines = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ];

  const csv = csvLines.join('\n');
  const filename = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
