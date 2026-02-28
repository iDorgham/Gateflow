import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  projectId: z.string().optional().default(''),
  gateId: z.string().optional().default(''),
  unitType: z.string().optional().default(''),
  search: z.string().optional().default(''),
});

/** Escape CSV cell to prevent formula injection (prefix = + - @ with ') */
function escapeCsvCell(value: string): string {
  const s = String(value).replace(/"/g, '""');
  if (/^[=+\-@\t]/.test(s)) return `'${s}'`;
  return `"${s}"`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const orgId = claims.orgId;

    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.safeParse({
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo: searchParams.get('dateTo') ?? undefined,
      projectId: searchParams.get('projectId') ?? '',
      gateId: searchParams.get('gateId') ?? '',
      unitType: searchParams.get('unitType') ?? '',
      search: searchParams.get('search') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid query params' }, { status: 400 });
    }

    const { dateFrom, dateTo, projectId, gateId, unitType, search } = parsed.data;

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

    const unitFilter =
      unitType || projectId
        ? {
            units: {
              some: {
                unit: {
                  ...(unitType ? { type: unitType as 'STUDIO' | 'ONE_BR' | 'TWO_BR' | 'THREE_BR' | 'FOUR_BR' | 'VILLA' | 'PENTHOUSE' | 'COMMERCIAL' } : {}),
                  ...(projectId ? { projectId } : {}),
                },
              },
            },
          }
        : {};

    const where = {
      organizationId: orgId,
      deletedAt: null,
      ...unitFilter,
      ...(search?.trim()
        ? {
            OR: [
              { firstName: { contains: search.trim(), mode: 'insensitive' as const } },
              { lastName: { contains: search.trim(), mode: 'insensitive' as const } },
              { email: { contains: search.trim(), mode: 'insensitive' as const } },
              { company: { contains: search.trim(), mode: 'insensitive' as const } },
              { phone: { contains: search.trim(), mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const contacts = await prisma.contact.findMany({
      where,
      include: {
        units: { include: { unit: { select: { id: true, name: true } } } },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    const header = ['First Name', 'Last Name', 'Birthday', 'Company', 'Phone', 'Email', 'Units'];
    const rows = contacts.map((c) =>
      [
        c.firstName,
        c.lastName,
        c.birthday ? c.birthday.toISOString().slice(0, 10) : '',
        c.company ?? '',
        c.phone ?? '',
        c.email ?? '',
        c.units.map((cu) => cu.unit.name).join('; '),
      ].map(escapeCsvCell).join(',')
    );

    const csv = [header.map(escapeCsvCell).join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="analytics-audience-export.csv"',
      },
    });
  } catch (error) {
    console.error('GET /api/analytics/export error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
