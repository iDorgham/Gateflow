import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, Prisma } from '@gate-access/db';
import { UnitType } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const UNIT_QUOTA_DEFAULTS: Record<UnitType, number> = {
  STUDIO: 3,
  ONE_BR: 5,
  TWO_BR: 8,
  THREE_BR: 10,
  FOUR_BR: 12,
  VILLA: 20,
  PENTHOUSE: 20,
  COMMERCIAL: 5,
};

/** Escape CSV cell to prevent formula injection (prefix = + - @ with ') */
function escapeCsvCell(value: string): string {
  const s = String(value).replace(/"/g, '""');
  if (/^[=+\-@\t]/.test(s)) return `'${s}'`;
  return `"${s}"`;
}

const GetUnitsQuerySchema = z.object({
  projectId: z.string().optional(),
  format: z.enum(['json', 'csv']).optional(),
  search: z.string().optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === 'false' ? false : val === 'true' ? true : undefined
    ),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  unitType: z.string().optional(),
  gateId: z.string().optional(),
  contactId: z.string().optional(),
  sort: z
    .enum([
      'name',
      'type',
      'visitsInRange',
      'passesInRange',
      'lastVisitInRange',
    ])
    .optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
  page: z
    .string()
    .optional()
    .transform((s) => Math.max(1, parseInt(s ?? '1', 10) || 1)),
  pageSize: z
    .string()
    .optional()
    .transform((s) =>
      Math.min(100, Math.max(1, parseInt(s ?? '25', 10) || 25))
    ),
});

// ─── GET /api/units ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await getSessionClaims();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }

  const orgId = auth.orgId;
  if (!orgId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const validation = GetUnitsQuerySchema.safeParse(rawQuery);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid query parameters',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      projectId,
      format,
      search,
      isActive,
      dateFrom,
      dateTo,
      from,
      to,
      unitType,
      gateId,
      contactId,
      sort,
      sortDir,
      page,
      pageSize,
    } = validation.data;

    const fromDate = dateFrom ?? from;
    const toDate = dateTo ?? to;
    const dateFromValue = fromDate
      ? new Date(fromDate + 'T00:00:00.000Z')
      : null;
    const dateToValue = toDate ? new Date(toDate + 'T23:59:59.999Z') : null;

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

    const where = {
      organizationId: orgId,
      deletedAt: null,
      ...(projectId ? { projectId } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(unitType ? { type: unitType as UnitType } : {}),
      ...(contactId ? { contacts: { some: { contactId } } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { building: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const dir = sortDir === 'desc' ? 'desc' : 'asc';
    const sortByVisitMetric =
      sort === 'visitsInRange' ||
      sort === 'passesInRange' ||
      sort === 'lastVisitInRange';
    const orderBy =
      sort === 'type'
        ? [{ type: dir }, { name: 'asc' }]
        : sortByVisitMetric
          ? [{ name: 'asc' }]
          : [{ name: dir }];

    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: {
          contacts: {
            include: {
              contact: {
                include: {
                  contactTags: {
                    where: { tag: { deletedAt: null } },
                    include: { tag: { select: { name: true } } },
                  },
                },
              },
            },
          },
          project: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: orderBy as Parameters<
          typeof prisma.unit.findMany
        >[0]['orderBy'],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.unit.count({ where }),
    ]);

    if (format === 'csv') {
      const rows = [
        ['Name', 'Type', 'QR Quota', 'Project', 'Residents']
          .map(escapeCsvCell)
          .join(','),
        ...units.map((u) =>
          [
            u.name,
            u.type,
            String(u.qrQuota),
            u.project?.name ?? '',
            u.contacts
              .map((cu) => `${cu.contact.firstName} ${cu.contact.lastName}`)
              .join('; '),
          ]
            .map((v) => escapeCsvCell(v))
            .join(',')
        ),
      ].join('\n');

      // Audit log — non-fatal: export still returns even if log write fails
      try {
        await prisma.auditLog.create({
          data: {
            organizationId: orgId,
            userId: auth.sub ?? null,
            action: 'UNITS_EXPORT',
            entityType: 'Unit',
            metadata: {
              rowCount: units.length,
              filters: {
                search: search ?? null,
                projectId: projectId ?? null,
                unitType: unitType ?? null,
                gateId: gateId ?? null,
                contactId: contactId ?? null,
                isActive: isActive ?? null,
                dateFrom: fromDate ?? null,
                dateTo: toDate ?? null,
              },
            },
          },
        });
      } catch (auditErr) {
        console.error('[units CSV] audit log failed (non-fatal):', auditErr);
      }

      return new NextResponse(rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="units.csv"',
        },
      });
    }

    let unitAggregates: Map<
      string,
      {
        visitsInRange: number;
        passesInRange: number;
        lastVisitInRange: string | null;
      }
    > = new Map();
    if (dateFromValue && dateToValue) {
      try {
        const gateCondition = gateId
          ? Prisma.sql`AND sl."gateId" = ${gateId}`
          : Prisma.empty;
        const aggRows = await prisma.$queryRaw<
          {
            unitId: string;
            visitsInRange: number;
            passesInRange: number;
            lastVisitInRange: Date | null;
          }[]
        >`
          SELECT vqr."unitId", 
            COUNT(*) FILTER (WHERE sl.status = 'SUCCESS')::int AS "visitsInRange",
            COUNT(*)::int AS "passesInRange",
            MAX(sl."scannedAt") AS "lastVisitInRange"
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          JOIN "VisitorQR" vqr ON vqr."qrCodeId" = qr.id
          JOIN "Unit" u ON vqr."unitId" = u.id
          WHERE sl."scannedAt" >= ${dateFromValue} AND sl."scannedAt" <= ${dateToValue}
            AND qr."organizationId" = ${orgId} AND qr."deletedAt" IS NULL
            AND u."organizationId" = ${orgId}
            ${gateCondition}
          GROUP BY vqr."unitId"
        `;
        unitAggregates = new Map(
          aggRows.map((r) => [
            r.unitId,
            {
              visitsInRange: r.visitsInRange,
              passesInRange: r.passesInRange,
              lastVisitInRange: r.lastVisitInRange?.toISOString() ?? null,
            },
          ])
        );
      } catch {
        // VisitorQR table may not exist yet (e.g. before Phase 2 migration); leave aggregates empty
      }
    }

    let vacancySuccessCounts: Map<string, number> = new Map();
    try {
      const vacancyCutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      const rows = await prisma.$queryRaw<
        { unitId: string; successCount: number }[]
      >`
        SELECT vqr."unitId",
          COUNT(*) FILTER (WHERE sl.status = 'SUCCESS')::int AS "successCount"
        FROM "ScanLog" sl
        JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
        JOIN "VisitorQR" vqr ON vqr."qrCodeId" = qr.id
        JOIN "Unit" u ON vqr."unitId" = u.id
        WHERE sl."scannedAt" >= ${vacancyCutoff}
          AND qr."organizationId" = ${orgId} AND qr."deletedAt" IS NULL
          AND u."organizationId" = ${orgId}
        GROUP BY vqr."unitId"
      `;
      vacancySuccessCounts = new Map(
        rows.map((r) => [r.unitId, r.successCount])
      );
    } catch {
      // VisitorQR may be unavailable in older DBs; omit vacancy flag in that case.
    }

    const data = units.map((u) => {
      const agg = unitAggregates.get(u.id);
      const tagCounts: Record<string, number> = {};
      for (const cu of u.contacts) {
        for (const ct of cu.contact.contactTags ?? []) {
          const name = ct.tag?.name;
          if (name) tagCounts[name] = (tagCounts[name] ?? 0) + 1;
        }
      }
      const tagSummary =
        Object.keys(tagCounts).length === 0
          ? null
          : Object.entries(tagCounts)
              .map(([name, count]) => `${count} ${name}`)
              .join(', ');
      return {
        id: u.id,
        name: u.name,
        type: u.type,
        sizeSqm: u.sizeSqm ?? null,
        qrQuota: u.qrQuota,
        projectId: u.projectId,
        projectName: u.project?.name ?? null,
        userId: u.user?.id ?? null,
        user: u.user
          ? { id: u.user.id, name: u.user.name, email: u.user.email }
          : null,
        contacts: u.contacts.map((cu) => ({
          id: cu.contact.id,
          firstName: cu.contact.firstName,
          lastName: cu.contact.lastName,
        })),
        lat: u.lat ?? null,
        lng: u.lng ?? null,
        visitsInRange: agg?.visitsInRange ?? 0,
        passesInRange: agg?.passesInRange ?? 0,
        lastVisitInRange: agg?.lastVisitInRange ?? null,
        linkedContactCount: u.contacts.length,
        potentialVacancy: (vacancySuccessCounts.get(u.id) ?? 0) === 0,
        tagSummary,
      };
    });

    const sortedData = sortByVisitMetric
      ? [...data].sort((a, b) => {
          const dir = sortDir === 'desc' ? -1 : 1;
          if (sort === 'lastVisitInRange') {
            const aMissing = !a.lastVisitInRange;
            const bMissing = !b.lastVisitInRange;
            // Keep null/empty values at the end for both sort directions.
            if (aMissing && bMissing) return 0;
            if (aMissing) return 1;
            if (bMissing) return -1;
            return a.lastVisitInRange < b.lastVisitInRange
              ? -dir
              : a.lastVisitInRange > b.lastVisitInRange
                ? dir
                : 0;
          }
          const aVal =
            sort === 'passesInRange'
              ? (a.passesInRange ?? 0)
              : (a.visitsInRange ?? 0);
          const bVal =
            sort === 'passesInRange'
              ? (b.passesInRange ?? 0)
              : (b.visitsInRange ?? 0);
          return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
        })
      : data;

    return NextResponse.json({
      success: true,
      data: sortedData,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET /api/units error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── POST /api/units ──────────────────────────────────────────────────────────

const CreateUnitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.nativeEnum(UnitType),
  sizeSqm: z.number().int().positive().optional().nullable(),
  qrQuota: z.number().int().positive().optional(),
  projectId: z.string().optional().nullable(),
  contactIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await getSessionClaims();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }

  const orgId = auth.orgId;
  if (!orgId) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = CreateUnitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, type, sizeSqm, qrQuota, projectId, contactIds } =
      validation.data;
    const quota = qrQuota ?? UNIT_QUOTA_DEFAULTS[type];

    const unit = await prisma.unit.create({
      data: {
        name: name.trim(),
        type,
        sizeSqm: sizeSqm ?? null,
        qrQuota: quota,
        organizationId: orgId,
        projectId: projectId ?? null,
        contacts: contactIds?.length
          ? { create: contactIds.map((contactId) => ({ contactId })) }
          : undefined,
      },
      include: {
        contacts: {
          include: {
            contact: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: unit.id,
          name: unit.name,
          type: unit.type,
          sizeSqm: unit.sizeSqm ?? null,
          qrQuota: unit.qrQuota,
          projectId: unit.projectId,
          projectName: unit.project?.name ?? null,
          contacts: unit.contacts.map((cu) => ({
            id: cu.contact.id,
            firstName: cu.contact.firstName,
            lastName: cu.contact.lastName,
          })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/units error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
