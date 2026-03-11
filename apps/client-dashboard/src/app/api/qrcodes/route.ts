import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const GetQRCodesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((s) => Math.max(1, parseInt(s ?? '1', 10) || 1)),
  pageSize: z
    .string()
    .optional()
    .transform((s) => Math.min(100, Math.max(1, parseInt(s ?? '25', 10) || 25))),
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
  createdFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  createdTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  expiresFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  expiresTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  lastScanFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  lastScanTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  projectId: z.string().optional(),
  gateId: z.string().optional(),
});

/** GET /api/qrcodes — List QR codes for the authenticated org (org-scoped, paginated). */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const orgId = claims.orgId;

    const { searchParams } = new URL(request.url);
    const parsed = GetQRCodesQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
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
        {
          success: false,
          message: 'Invalid query parameters',
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      page,
      pageSize,
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

    const createdFromValue = createdFrom
      ? new Date(createdFrom + 'T00:00:00.000Z')
      : null;
    const createdToValue = createdTo
      ? new Date(createdTo + 'T23:59:59.999Z')
      : null;
    const expiresFromValue = expiresFrom
      ? new Date(expiresFrom + 'T00:00:00.000Z')
      : null;
    const expiresToValue = expiresTo
      ? new Date(expiresTo + 'T23:59:59.999Z')
      : null;
    const lastScanFromValue = lastScanFrom
      ? new Date(lastScanFrom + 'T00:00:00.000Z')
      : null;
    const lastScanToValue = lastScanTo
      ? new Date(lastScanTo + 'T23:59:59.999Z')
      : null;

    if (projectId) {
      const proj = await prisma.project.findFirst({
        where: { id: projectId, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (!proj) {
        return NextResponse.json(
          { success: false, message: 'Invalid projectId' },
          { status: 400 }
        );
      }
    }
    if (gateId) {
      const gate = await prisma.gate.findFirst({
        where: { id: gateId, organizationId: orgId, deletedAt: null },
        select: { id: true },
      });
      if (!gate) {
        return NextResponse.json(
          { success: false, message: 'Invalid gateId' },
          { status: 400 }
        );
      }
    }

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
            { guestName: { contains: search.trim(), mode: 'insensitive' as const } },
            { guestEmail: { contains: search.trim(), mode: 'insensitive' as const } },
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
      ...(projectId ? { projectId } : {}),
      ...(gateId ? { gateId } : {}),
    };

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
          // Prisma relation-aggregate orderBy: scanLogs _count
          return [{ scanLogs: { _count: dir } }, { createdAt: 'desc' as const }];
        case 'createdAt':
        default:
          return [{ createdAt: dir }, { code: 'asc' as const }];
      }
    })();

    const [qrCodes, total] = await Promise.all([
      prisma.qRCode.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { scanLogs: true } },
          gate: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
          scanLogs: {
            orderBy: { scannedAt: 'desc' },
            take: 1,
            select: { scannedAt: true },
          },
        },
      }),
      prisma.qRCode.count({ where }),
    ]);

    const now = new Date();
    const rows = qrCodes.map((qr) => {
      let status: string = 'ACTIVE';
      if (!qr.isActive) status = 'INACTIVE';
      else if (qr.expiresAt && qr.expiresAt < now) status = 'EXPIRED';
      else if (qr.maxUses != null && qr.currentUses >= qr.maxUses)
        status = 'MAX_USES_REACHED';

      const lastScan = qr.scanLogs[0];

      return {
        id: qr.id,
        code: qr.code,
        type: qr.type,
        status,
        createdAt: qr.createdAt.toISOString(),
        expiresAt: qr.expiresAt?.toISOString() ?? null,
        isActive: qr.isActive,
        currentUses: qr.currentUses,
        maxUses: qr.maxUses ?? null,
        scansCount: qr._count.scanLogs,
        lastScanAt: lastScan?.scannedAt.toISOString() ?? null,
        gateName: qr.gate?.name ?? null,
        projectName: qr.project?.name ?? null,
        guestName: qr.guestName ?? null,
        guestEmail: qr.guestEmail ?? null,
        guestPhone: qr.guestPhone ?? null,
        contactId: qr.contactId ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET /api/qrcodes error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
