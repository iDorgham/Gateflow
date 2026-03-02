import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/** Escape CSV cell to prevent formula injection (prefix = + - @ with ') */
function escapeCsvCell(value: string): string {
  const s = String(value).replace(/"/g, '""');
  if (/^[=+\-@\t]/.test(s)) return `'${s}'`;
  return `"${s}"`;
}

const ExportQRCodesQuerySchema = z.object({
  ids: z
    .string()
    .optional()
    .transform((s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : undefined)),
  sortBy: z
    .enum([
      'createdAt',
      'expiresAt',
      'code',
      'type',
      'scansCount',
      'gateName',
      'projectName',
    ])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  createdFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  createdTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expiresFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expiresTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  lastScanFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  lastScanTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  projectId: z.string().optional(),
  gateId: z.string().optional(),
});

function computeStatus(qr: { isActive: boolean; expiresAt: Date | null; maxUses: number | null; currentUses: number }): string {
  const now = new Date();
  if (!qr.isActive) return 'INACTIVE';
  if (qr.expiresAt && qr.expiresAt < now) return 'EXPIRED';
  if (qr.maxUses != null && qr.currentUses >= qr.maxUses) return 'MAX_USES_REACHED';
  return 'ACTIVE';
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

    // Rate limit exports (user-scoped)
    const rl = await checkRateLimit(`qrcodes-export:${claims.sub}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many export requests. Please retry shortly.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = ExportQRCodesQuerySchema.safeParse({
      ids: searchParams.get('ids') ?? undefined,
      sortBy: searchParams.get('sortBy') ?? undefined,
      sortOrder: searchParams.get('sortOrder') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      createdFrom: searchParams.get('createdFrom') ?? undefined,
      createdTo: searchParams.get('createdTo') ?? undefined,
      expiresFrom: searchParams.get('expiresFrom') ?? undefined,
      expiresTo: searchParams.get('expiresTo') ?? undefined,
      lastScanFrom: searchParams.get('lastScanFrom') ?? undefined,
      lastScanTo: searchParams.get('lastScanTo') ?? undefined,
      projectId: searchParams.get('projectId') ?? undefined,
      gateId: searchParams.get('gateId') ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters', error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      ids,
      sortBy,
      sortOrder,
      search,
      createdFrom,
      createdTo,
      expiresFrom,
      expiresTo,
      lastScanFrom,
      lastScanTo,
      projectId,
      gateId,
    } = parsed.data;

    if (ids?.length && ids.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Too many ids for export (max 500).' },
        { status: 400 }
      );
    }

    const orgId = claims.orgId;
    const dir: 'asc' | 'desc' = sortOrder === 'asc' ? 'asc' : 'desc';
    const orderBy = (() => {
      switch (sortBy) {
        case 'code':
          return [{ code: dir }, { createdAt: 'desc' as const }];
        case 'type':
          return [{ type: dir }, { createdAt: 'desc' as const }];
        case 'expiresAt':
          return [{ expiresAt: dir }, { createdAt: 'desc' as const }];
        case 'gateName':
          return [{ gate: { name: dir } }, { createdAt: 'desc' as const }];
        case 'projectName':
          return [{ project: { name: dir } }, { createdAt: 'desc' as const }];
        case 'scansCount':
          return [{ scanLogs: { _count: dir } }, { createdAt: 'desc' as const }];
        case 'createdAt':
        default:
          return [{ createdAt: dir }, { code: 'asc' as const }];
      }
    })();

    const createdFromValue = createdFrom ? new Date(createdFrom + 'T00:00:00.000Z') : null;
    const createdToValue = createdTo ? new Date(createdTo + 'T23:59:59.999Z') : null;
    const expiresFromValue = expiresFrom ? new Date(expiresFrom + 'T00:00:00.000Z') : null;
    const expiresToValue = expiresTo ? new Date(expiresTo + 'T23:59:59.999Z') : null;
    const lastScanFromValue = lastScanFrom ? new Date(lastScanFrom + 'T00:00:00.000Z') : null;
    const lastScanToValue = lastScanTo ? new Date(lastScanTo + 'T23:59:59.999Z') : null;

    const createdAtFilter =
      createdFromValue || createdToValue
        ? {
            createdAt: {
              ...(createdFromValue ? { gte: createdFromValue } : {}),
              ...(createdToValue ? { lte: createdToValue } : {}),
            },
          }
        : {};
    const expiresAtFilter =
      expiresFromValue || expiresToValue
        ? {
            expiresAt: {
              ...(expiresFromValue ? { gte: expiresFromValue } : {}),
              ...(expiresToValue ? { lte: expiresToValue } : {}),
            },
          }
        : {};
    const lastScanFilter =
      lastScanFromValue || lastScanToValue
        ? {
            scanLogs: {
              some: {
                scannedAt: {
                  ...(lastScanFromValue ? { gte: lastScanFromValue } : {}),
                  ...(lastScanToValue ? { lte: lastScanToValue } : {}),
                },
              },
            },
          }
        : {};
    const searchFilter = search?.trim()
      ? {
          OR: [
            { code: { contains: search.trim(), mode: 'insensitive' as const } },
            { utmSource: { contains: search.trim(), mode: 'insensitive' as const } },
            { utmCampaign: { contains: search.trim(), mode: 'insensitive' as const } },
          ],
        }
      : {};

    const where = {
      organizationId: orgId,
      deletedAt: null,
      ...createdAtFilter,
      ...expiresAtFilter,
      ...lastScanFilter,
      ...searchFilter,
      ...(ids?.length ? { id: { in: ids } } : {}),
      ...(projectId ? { projectId } : {}),
      ...(gateId ? { gateId } : {}),
    };

    const qrCodes = await prisma.qRCode.findMany({
      where,
      orderBy,
      take: 10_000,
      include: {
        _count: { select: { scanLogs: true } },
        gate: { select: { name: true } },
        project: { select: { name: true } },
        scanLogs: {
          orderBy: { scannedAt: 'desc' },
          take: 1,
          select: { scannedAt: true },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: claims.sub,
        action: 'QRCODES_EXPORT',
        entityType: 'QRCode',
        metadata: {
          idsCount: ids?.length ?? null,
          filters: {
            search: search ?? null,
            createdFrom: createdFrom ?? null,
            createdTo: createdTo ?? null,
            expiresFrom: expiresFrom ?? null,
            expiresTo: expiresTo ?? null,
            lastScanFrom: lastScanFrom ?? null,
            lastScanTo: lastScanTo ?? null,
            projectId: projectId ?? null,
            gateId: gateId ?? null,
            sortBy: sortBy ?? 'createdAt',
            sortOrder: sortOrder ?? 'desc',
          },
          returnedRows: qrCodes.length,
        },
      },
    });

    const header = [
      'Code',
      'Type',
      'Status',
      'Created At',
      'Expires At',
      'Scans',
      'Last Scan At',
      'Gate',
      'Project',
      'UTM Source',
      'UTM Campaign',
      'Current Uses',
      'Max Uses',
    ];

    const rows = qrCodes.map((qr) => {
      const status = computeStatus({
        isActive: qr.isActive,
        expiresAt: qr.expiresAt ?? null,
        maxUses: qr.maxUses ?? null,
        currentUses: qr.currentUses,
      });
      const lastScanAt = qr.scanLogs[0]?.scannedAt?.toISOString() ?? '';
      return [
        qr.code,
        qr.type,
        status,
        qr.createdAt.toISOString(),
        qr.expiresAt?.toISOString() ?? '',
        String(qr._count.scanLogs ?? 0),
        lastScanAt,
        qr.gate?.name ?? '',
        qr.project?.name ?? '',
        qr.utmSource ?? '',
        qr.utmCampaign ?? '',
        String(qr.currentUses ?? 0),
        qr.maxUses == null ? '' : String(qr.maxUses),
      ]
        .map(escapeCsvCell)
        .join(',');
    });

    const csv = [header.map(escapeCsvCell).join(','), ...rows].join('\n');
    const filename = `qrcodes-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('GET /api/qrcodes/export error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

