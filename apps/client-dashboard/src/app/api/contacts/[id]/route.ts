import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, ContactSource } from '@gate-access/db';
import { emitEvent, EventType } from '@/lib/realtime/emit-event';

// ─── PATCH /api/contacts/[id] ─────────────────────────────────────────────────

const UpdateContactSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  birthday: z.string().optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  jobTitle: z.string().max(100).optional().nullable(),
  source: z.nativeEnum(ContactSource).optional().nullable(),
  companyWebsite: z.string().url().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  unitIds: z.array(z.string()).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.contact.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = UpdateContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { unitIds, ...fields } = validation.data;

    const updated = await prisma.$transaction(async (tx) => {
      if (unitIds !== undefined) {
        await tx.contactUnit.deleteMany({ where: { contactId: params.id } });
        if (unitIds.length > 0) {
          await tx.contactUnit.createMany({
            data: unitIds.map((unitId) => ({ contactId: params.id, unitId })),
          });
        }
      }

      return tx.contact.update({
        where: { id: params.id },
        data: {
          ...(fields.firstName !== undefined ? { firstName: fields.firstName.trim() } : {}),
          ...(fields.lastName !== undefined ? { lastName: fields.lastName.trim() } : {}),
          ...(fields.birthday !== undefined ? { birthday: fields.birthday ? new Date(fields.birthday) : null } : {}),
          ...(fields.company !== undefined ? { company: fields.company?.trim() ?? null } : {}),
          ...(fields.phone !== undefined ? { phone: fields.phone?.trim() ?? null } : {}),
          ...(fields.email !== undefined ? { email: fields.email?.trim() ?? null } : {}),
          ...(fields.avatarUrl !== undefined ? { avatarUrl: fields.avatarUrl?.trim() ?? null } : {}),
          ...(fields.jobTitle !== undefined ? { jobTitle: fields.jobTitle?.trim() ?? null } : {}),
          ...(fields.source !== undefined ? { source: fields.source ?? null } : {}),
          ...(fields.companyWebsite !== undefined ? { companyWebsite: fields.companyWebsite?.trim() ?? null } : {}),
          ...(fields.notes !== undefined ? { notes: fields.notes?.trim() ?? null } : {}),
        },
        include: {
          units: { include: { unit: { select: { id: true, name: true } } } },
        },
      });
    });

    emitEvent(claims.orgId, EventType.CONTACT_UPDATED, { contactId: updated.id }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        birthday: updated.birthday?.toISOString().slice(0, 10) ?? null,
        company: updated.company,
        phone: updated.phone,
        email: updated.email,
        avatarUrl: updated.avatarUrl ?? null,
        jobTitle: updated.jobTitle ?? null,
        source: updated.source ?? null,
        companyWebsite: updated.companyWebsite ?? null,
        notes: updated.notes ?? null,
        units: updated.units.map((cu) => ({ id: cu.unit.id, name: cu.unit.name })),
      },
    });
  } catch (error) {
    console.error('PATCH /api/contacts/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/contacts/[id] ────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.contact.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
    }

    await prisma.contact.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/contacts/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
