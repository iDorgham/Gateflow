import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, Prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

/** Escape CSV cell to prevent formula injection (prefix = + - @ with ') */
function escapeCsvCell(value: string): string {
  const s = String(value).replace(/"/g, '""');
  if (/^[=+\-@\t]/.test(s)) return `'${s}'`;
  return `"${s}"`;
}

const GetContactsQuerySchema = z.object({
  unitId: z.string().optional(),
  format: z.enum(['json', 'csv']).optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  search: z.string().optional(),
  unitType: z.string().optional(),
  gateId: z.string().optional(),
  projectId: z.string().optional(),
  tagIds: z
    .string()
    .optional()
    .transform((s) => (s ? s.split(',').filter(Boolean) : undefined)),
  sort: z
    .enum([
      'firstName',
      'lastName',
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

// ─── GET /api/contacts ────────────────────────────────────────────────────────

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
    const parsed = GetContactsQuerySchema.safeParse({
      unitId: searchParams.get('unitId') ?? undefined,
      format: searchParams.get('format') ?? undefined,
      from: searchParams.get('from') ?? undefined,
      to: searchParams.get('to') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      unitType: searchParams.get('unitType') ?? undefined,
      gateId: searchParams.get('gateId') ?? undefined,
      projectId: searchParams.get('projectId') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      sortDir: searchParams.get('sortDir') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
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
      unitId,
      format,
      from,
      to,
      search,
      unitType,
      gateId,
      projectId,
      tagIds,
      sort,
      sortDir,
      page,
      pageSize,
    } = parsed.data;

    const dateFrom = from ? new Date(from + 'T00:00:00.000Z') : null;
    const dateTo = to ? new Date(to + 'T23:59:59.999Z') : null;

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

    const unitFilter =
      unitId || unitType || projectId
        ? {
            units: {
              some: {
                unit: {
                  ...(unitId && { id: unitId }),
                  ...(unitType && {
                    type: unitType as
                      | 'STUDIO'
                      | 'ONE_BR'
                      | 'TWO_BR'
                      | 'THREE_BR'
                      | 'FOUR_BR'
                      | 'VILLA'
                      | 'PENTHOUSE'
                      | 'COMMERCIAL',
                  }),
                  ...(projectId && { projectId }),
                },
              },
            },
          }
        : {};
    const tagFilter = tagIds?.length
      ? { contactTags: { some: { tagId: { in: tagIds } } } }
      : {};
    const where = {
      organizationId: orgId,
      deletedAt: null,
      ...unitFilter,
      ...tagFilter,
      ...(search?.trim()
        ? {
            OR: [
              {
                firstName: {
                  contains: search.trim(),
                  mode: 'insensitive' as const,
                },
              },
              {
                lastName: {
                  contains: search.trim(),
                  mode: 'insensitive' as const,
                },
              },
              {
                email: {
                  contains: search.trim(),
                  mode: 'insensitive' as const,
                },
              },
              {
                company: {
                  contains: search.trim(),
                  mode: 'insensitive' as const,
                },
              },
              {
                phone: {
                  contains: search.trim(),
                  mode: 'insensitive' as const,
                },
              },
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
      sort === 'lastName'
        ? [{ lastName: dir }, { firstName: 'asc' }]
        : sortByVisitMetric
          ? [{ firstName: 'asc' }]
          : [{ firstName: dir }, { lastName: 'asc' }];

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          units: { include: { unit: { select: { id: true, name: true } } } },
          contactTags: {
            include: { tag: { select: { id: true, name: true, color: true } } },
          },
        },
        orderBy: orderBy as Parameters<
          typeof prisma.contact.findMany
        >[0]['orderBy'],
        ...(sortByVisitMetric
          ? {}
          : { skip: (page - 1) * pageSize, take: pageSize }),
      }),
      prisma.contact.count({ where }),
    ]);

    if (format === 'csv') {
      const rows = [
        [
          'First Name',
          'Last Name',
          'Birthday',
          'Company',
          'Phone',
          'Email',
          'Units',
        ]
          .map(escapeCsvCell)
          .join(','),
        ...contacts.map((c) =>
          [
            c.firstName,
            c.lastName,
            c.birthday ? c.birthday.toISOString().slice(0, 10) : '',
            c.company ?? '',
            c.phone ?? '',
            c.email ?? '',
            c.units.map((cu) => cu.unit.name).join('; '),
          ]
            .map((v) => escapeCsvCell(String(v)))
            .join(',')
        ),
      ].join('\n');

      return new NextResponse(rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="contacts.csv"',
        },
      });
    }

    let unitAggregates: Map<
      string,
      { visitsInRange: number; lastVisitInRange: string | null }
    > = new Map();
    if (dateFrom && dateTo) {
      try {
        const gateCondition = gateId
          ? Prisma.sql`AND sl."gateId" = ${gateId}`
          : Prisma.empty;
        const aggRows = await prisma.$queryRaw<
          {
            unitId: string;
            visitsInRange: number;
            lastVisitInRange: Date | null;
          }[]
        >`
          SELECT vqr."unitId", COUNT(*)::int AS "visitsInRange", MAX(sl."scannedAt") AS "lastVisitInRange"
          FROM "ScanLog" sl
          JOIN "QRCode" qr ON sl."qrCodeId" = qr.id
          JOIN "VisitorQR" vqr ON vqr."qrCodeId" = qr.id
          JOIN "Unit" u ON vqr."unitId" = u.id
          WHERE sl.status = 'SUCCESS'
            AND sl."scannedAt" >= ${dateFrom} AND sl."scannedAt" <= ${dateTo}
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
              lastVisitInRange: r.lastVisitInRange?.toISOString() ?? null,
            },
          ])
        );
      } catch {
        // VisitorQR table may not exist yet (e.g. before Phase 2 migration); leave aggregates empty
      }
    }

    const data = contacts.map((c) => {
      const unitIds = c.units.map((cu) => cu.unit.id);
      let visitsInRange = 0;
      let lastVisitInRange: string | null = null;
      for (const uid of unitIds) {
        const agg = unitAggregates.get(uid);
        if (agg) {
          visitsInRange += agg.visitsInRange;
          if (
            agg.lastVisitInRange &&
            (!lastVisitInRange || agg.lastVisitInRange > lastVisitInRange)
          ) {
            lastVisitInRange = agg.lastVisitInRange;
          }
        }
      }
      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        birthday: c.birthday?.toISOString().slice(0, 10) ?? null,
        company: c.company,
        phone: c.phone,
        email: c.email,
        avatarUrl: c.avatarUrl ?? null,
        units: c.units.map((cu) => ({ id: cu.unit.id, name: cu.unit.name })),
        tags: c.contactTags.map((ct) => ({
          id: ct.tag.id,
          name: ct.tag.name,
          color: ct.tag.color,
        })),
        visitsInRange,
        passesInRange: visitsInRange,
        lastVisitInRange,
      };
    });

    const sorted = sortByVisitMetric
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

    const paged = sortByVisitMetric
      ? sorted.slice((page - 1) * pageSize, page * pageSize)
      : sorted;

    return NextResponse.json({
      success: true,
      data: paged,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET /api/contacts error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── POST /api/contacts ───────────────────────────────────────────────────────

const CreateContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  birthday: z.string().optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  unitIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = CreateContactSchema.safeParse(body);
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

    const {
      firstName,
      lastName,
      birthday,
      company,
      phone,
      email,
      avatarUrl,
      unitIds,
    } = validation.data;

    const contact = await prisma.contact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthday: birthday ? new Date(birthday) : null,
        company: company?.trim() ?? null,
        phone: phone?.trim() ?? null,
        email: email?.trim() ?? null,
        avatarUrl: avatarUrl?.trim() ?? null,
        organizationId: claims.orgId,
        units: unitIds?.length
          ? { create: unitIds.map((unitId) => ({ unitId })) }
          : undefined,
      },
      include: {
        units: { include: { unit: { select: { id: true, name: true } } } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          birthday: contact.birthday?.toISOString().slice(0, 10) ?? null,
          company: contact.company,
          phone: contact.phone,
          email: contact.email,
          avatarUrl: contact.avatarUrl ?? null,
          units: contact.units.map((cu) => ({
            id: cu.unit.id,
            name: cu.unit.name,
          })),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/contacts error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
