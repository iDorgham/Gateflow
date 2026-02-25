import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';
import { UnitType } from '@gate-access/db';

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

// ─── GET /api/units ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const format = searchParams.get('format');

    const units = await prisma.unit.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
        ...(projectId ? { projectId } : {}),
      },
      include: {
        contacts: {
          include: {
            contact: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        project: { select: { id: true, name: true } },
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
            u.contacts.map((cu) => `${cu.contact.firstName} ${cu.contact.lastName}`).join('; '),
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
      qrQuota: u.qrQuota,
      projectId: u.projectId,
      projectName: u.project?.name ?? null,
      contacts: u.contacts.map((cu) => ({
        id: cu.contact.id,
        firstName: cu.contact.firstName,
        lastName: cu.contact.lastName,
      })),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/units error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/units ──────────────────────────────────────────────────────────

const CreateUnitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.nativeEnum(UnitType),
  qrQuota: z.number().int().positive().optional(),
  projectId: z.string().optional().nullable(),
  contactIds: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = CreateUnitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, type, qrQuota, projectId, contactIds } = validation.data;
    const quota = qrQuota ?? UNIT_QUOTA_DEFAULTS[type];

    const unit = await prisma.unit.create({
      data: {
        name: name.trim(),
        type,
        qrQuota: quota,
        organizationId: claims.orgId,
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

    return NextResponse.json({
      success: true,
      data: {
        id: unit.id,
        name: unit.name,
        type: unit.type,
        qrQuota: unit.qrQuota,
        projectId: unit.projectId,
        projectName: unit.project?.name ?? null,
        contacts: unit.contacts.map((cu) => ({
          id: cu.contact.id,
          firstName: cu.contact.firstName,
          lastName: cu.contact.lastName,
        })),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/units error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
