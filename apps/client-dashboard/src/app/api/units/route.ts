import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { prisma } from '@gate-access/db';
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

const GetUnitsQuerySchema = z.object({
  projectId: z.string().optional(),
  format: z.enum(['json', 'csv']).optional(),
  search: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === 'false' ? false : val === 'true' ? true : undefined
    ),
});

// ─── GET /api/units ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

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

    const { projectId, format, search, isActive } = validation.data;

    const units = await prisma.unit.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(projectId ? { projectId } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { building: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        contacts: {
          include: {
            contact: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        project: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { name: 'asc' },
    });

    if (format === 'csv') {
      const rows = [
        ['Name', 'Type', 'QR Quota', 'Project', 'Residents'].join(','),
        ...units.map((u) =>
          [
            u.name,
            u.type,
            u.qrQuota,
            u.project?.name ?? '',
            u.contacts
              .map((cu) => `${cu.contact.firstName} ${cu.contact.lastName}`)
              .join('; '),
          ]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(',')
        ),
      ].join('\n');

      return new NextResponse(rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="units.csv"',
        },
      });
    }

    const data = units.map((u) => ({
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
    }));

    return NextResponse.json({ success: true, data });
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
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

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

    const { name, type, sizeSqm, qrQuota, projectId, contactIds } = validation.data;
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
