import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';

export const dynamic = 'force-dynamic';

const UpdateContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  unitIds: z.array(z.string()).optional(),
});

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.contact.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });

    const body = await request.json();
    const validation = UpdateContactSchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ success: false, error: validation.error.flatten() }, { status: 400 });

    const { unitIds, ...data } = validation.data;

    const contact = await prisma.$transaction(async (tx) => {

      if (unitIds !== undefined) {
        await tx.contactUnit.deleteMany({ where: { contactId: params.id } });
        if (unitIds.length > 0) {
          const verifiedUnitIds = await tx.unit.findMany({
            where: { id: { in: unitIds }, organizationId: claims.orgId },
            select: { id: true }
          }).then(units => units.map(u => u.id));

          if (verifiedUnitIds.length > 0) {
            await tx.contactUnit.createMany({
              data: verifiedUnitIds.map((unitId) => ({ contactId: params.id, unitId })),
            });
          }
        }
      }

      return tx.contact.update({
        where: { id: params.id },
        data,
        include: {
          units: { include: { unit: { select: { id: true, name: true, projectId: true } } } },
        },
      });
    });

    emitEvent(claims.orgId, EventType.CONTACT_UPDATED, { contactId: contact.id }).catch(() => {});

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('CRM CONTACTS PATCH error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.contact.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });

    await prisma.contact.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CRM CONTACTS DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
