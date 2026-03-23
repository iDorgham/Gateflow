import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, UnitType } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const GetUnitsQuerySchema = z.object({
  projectId: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional().transform(s => Math.max(1, parseInt(s ?? '1', 10) || 1)),
  pageSize: z.string().optional().transform(s => Math.min(100, Math.max(1, parseInt(s ?? '25', 10) || 25))),
  sort: z.enum(['name', 'type', 'createdAt']).optional().default('name'),
  sortDir: z.enum(['asc', 'desc']).optional().default('asc'),
});

const CreateUnitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(UnitType),
  projectId: z.string().min(1, 'Project ID is required'),
  building: z.string().optional().nullable(),
  sizeSqm: z.number().optional().nullable(),
  contactIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const parsed = GetUnitsQuerySchema.safeParse(Object.fromEntries(searchParams));
    
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });

    const { projectId, search, page, pageSize, sort, sortDir } = parsed.data;

    const where: any = {
      organizationId: claims.orgId,
      deletedAt: null,
      ...(projectId ? { projectId } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { building: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
    };

    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: {
          project: { select: { id: true, name: true } },
          contacts: { include: { contact: { select: { id: true, firstName: true, lastName: true } } } },
        },
        orderBy: { [sort]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.unit.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: units, total, page, pageSize });
  } catch (error) {
    console.error('CRM UNITS GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const validation = CreateUnitSchema.safeParse(body);

    if (!validation.success) return NextResponse.json({ success: false, error: validation.error.flatten() }, { status: 400 });

    const { contactIds, ...rest } = validation.data;

    // Verify project belongs to organization
    const project = await prisma.project.findFirst({
      where: { id: rest.projectId, organizationId: claims.orgId }
    });
    if (!project) return NextResponse.json({ success: false, message: 'Invalid Project or Access Denied' }, { status: 403 });

    const unit = await prisma.unit.create({
      data: {
        name: rest.name,
        type: rest.type,
        projectId: rest.projectId,
        building: rest.building,
        sizeSqm: rest.sizeSqm,
        organizationId: claims.orgId,
        contacts: contactIds?.length ? {
          create: await prisma.contact.findMany({
            where: { id: { in: contactIds }, organizationId: claims.orgId },
            select: { id: true }
          }).then(contacts => contacts.map(c => ({ contactId: c.id })))
        } : undefined,
      },
      include: {
        project: true,
        contacts: { include: { contact: true } }
      }
    });

    return NextResponse.json({ success: true, data: unit }, { status: 201 });
  } catch (error) {
    console.error('CRM UNITS POST error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
