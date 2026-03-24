import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, ContactSource } from '@gate-access/db';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';

export const dynamic = 'force-dynamic';

const GetContactsQuerySchema = z.object({
  projectId: z.string().optional(),
  search: z.string().optional(),
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
  sort: z
    .enum(['firstName', 'lastName', 'createdAt'])
    .optional()
    .default('firstName'),
  sortDir: z.enum(['asc', 'desc']).optional().default('asc'),
});

const CreateContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  projectId: z.string().optional(),
  unitIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId)
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );

    const { searchParams } = new URL(request.url);
    const parsed = GetContactsQuerySchema.safeParse(
      Object.fromEntries(searchParams)
    );

    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );

    const { projectId, search, page, pageSize, sort, sortDir } = parsed.data;

    const where: any = {
      organizationId: claims.orgId,
      deletedAt: null,
      ...(projectId ? { units: { some: { unit: { projectId } } } } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        // ignore-security-guard — organizationId in where variable (line 42)
        where,
        include: {
          units: {
            include: {
              unit: { select: { id: true, name: true, projectId: true } },
            },
          },
        },
        orderBy: { [sort]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('CRM CONTACTS GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId)
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );

    const body = await request.json();
    const validation = CreateContactSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(
        { success: false, error: validation.error.flatten() },
        { status: 400 }
      );

    const { unitIds, projectId, ...rest } = validation.data;

    const contact = await prisma.contact.create({
      data: {
        firstName: rest.firstName,
        lastName: rest.lastName,
        email: rest.email,
        phone: rest.phone,
        jobTitle: rest.jobTitle,
        company: rest.company,
        organizationId: claims.orgId,
        units: unitIds?.length
          ? {
              create: await prisma.unit
                .findMany({
                  where: { id: { in: unitIds }, organizationId: claims.orgId },
                  select: { id: true },
                })
                .then((units) => units.map((u) => ({ unitId: u.id }))),
            }
          : undefined,
      },
      include: {
        units: { include: { unit: true } },
      },
    });

    emitEvent(claims.orgId, EventType.CONTACT_CREATED, {
      contactId: contact.id,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    console.error('CRM CONTACTS POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
