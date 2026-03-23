import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, UnitType } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const UpdateUnitSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  type: z.nativeEnum(UnitType).optional(),
  projectId: z.string().optional(),
  building: z.string().optional().nullable(),
  sizeSqm: z.number().optional().nullable(),
  contactIds: z.array(z.string()).optional(),
});

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.unit.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) return NextResponse.json({ success: false, message: 'Unit not found' }, { status: 404 });

    const body = await request.json();
    const validation = UpdateUnitSchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ success: false, error: validation.error.flatten() }, { status: 400 });

    const { contactIds, ...data } = validation.data;

    // If project is changing, verify it belongs to org
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, organizationId: claims.orgId, deletedAt: null }
      });
      if (!project) return NextResponse.json({ success: false, message: 'Invalid Project' }, { status: 403 });
    }

    const unit = await prisma.$transaction(async (tx) => {
      if (contactIds !== undefined) {
        await tx.contactUnit.deleteMany({ where: { unitId: params.id } });
        if (contactIds.length > 0) {
          const verifiedContactIds = await tx.contact.findMany({
            where: { id: { in: contactIds }, organizationId: claims.orgId },
            select: { id: true }
          }).then(contacts => contacts.map(c => c.id));

          if (verifiedContactIds.length > 0) {
            await tx.contactUnit.createMany({
              data: verifiedContactIds.map((contactId) => ({ unitId: params.id, contactId })),
            });
          }
        }
      }

      return tx.unit.update({
        where: { id: params.id },
        data,
        include: {
          project: { select: { id: true, name: true } },
          contacts: { include: { contact: { select: { id: true, firstName: true, lastName: true } } } },
        },
      });
    });

    return NextResponse.json({ success: true, data: unit });
  } catch (error) {
    console.error('CRM UNITS PATCH error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.unit.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) return NextResponse.json({ success: false, message: 'Unit not found' }, { status: 404 });

    await prisma.unit.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CRM UNITS DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
