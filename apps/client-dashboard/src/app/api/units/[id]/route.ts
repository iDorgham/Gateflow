import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { UnitType } from '@gate-access/db';

// ─── PATCH /api/units/[id] ────────────────────────────────────────────────────

const UpdateUnitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.nativeEnum(UnitType).optional(),
  sizeSqm: z.number().int().positive().optional().nullable(),
  qrQuota: z.number().int().positive().optional(),
  projectId: z.string().optional().nullable(),
  contactIds: z.array(z.string()).optional(),
  userId: z.string().optional().nullable(), // Link/unlink resident (User with RESIDENT role)
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

    const existing = await prisma.unit.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Unit not found' }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = UpdateUnitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { contactIds, userId, ...fields } = validation.data;

    // Validate userId when linking: user must exist, have RESIDENT role, belong to org, and not be linked to another unit
    if (userId !== undefined && userId !== null) {
      const resident = await prisma.user.findFirst({
        where: {
          id: userId,
          organizationId: claims.orgId,
          deletedAt: null,
          role: { name: { equals: 'RESIDENT', mode: 'insensitive' } },
        },
        select: { id: true },
      });
      if (!resident) {
        return NextResponse.json(
          { success: false, message: 'User not found or does not have RESIDENT role in this organization' },
          { status: 400 }
        );
      }
      // Enforce one unit per resident: no other unit in this org can have this userId
      const otherUnit = await prisma.unit.findFirst({
        where: {
          userId,
          id: { not: params.id },
          organizationId: claims.orgId,
          deletedAt: null,
        },
      });
      if (otherUnit) {
        return NextResponse.json(
          { success: false, message: 'This resident is already linked to another unit' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (contactIds !== undefined) {
        await tx.contactUnit.deleteMany({ where: { unitId: params.id } });
        if (contactIds.length > 0) {
          await tx.contactUnit.createMany({
            data: contactIds.map((contactId) => ({ contactId, unitId: params.id })),
          });
        }
      }

      return tx.unit.update({
        where: { id: params.id },
        data: {
          ...(fields.name !== undefined ? { name: fields.name.trim() } : {}),
          ...(fields.type !== undefined ? { type: fields.type } : {}),
          ...(fields.sizeSqm !== undefined ? { sizeSqm: fields.sizeSqm ?? null } : {}),
          ...(fields.qrQuota !== undefined ? { qrQuota: fields.qrQuota } : {}),
          ...(fields.projectId !== undefined ? { projectId: fields.projectId ?? null } : {}),
          ...(userId !== undefined ? { userId: userId ?? null } : {}),
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
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        type: updated.type,
        sizeSqm: updated.sizeSqm ?? null,
        qrQuota: updated.qrQuota,
        projectId: updated.projectId,
        projectName: updated.project?.name ?? null,
        userId: updated.user?.id ?? null,
        user: updated.user
          ? { id: updated.user.id, name: updated.user.name, email: updated.user.email }
          : null,
        contacts: updated.contacts.map((cu) => ({
          id: cu.contact.id,
          firstName: cu.contact.firstName,
          lastName: cu.contact.lastName,
        })),
      },
    });
  } catch (error) {
    console.error('PATCH /api/units/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/units/[id] ───────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.unit.findFirst({
      where: { id: params.id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Unit not found' }, { status: 404 });
    }

    await prisma.unit.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/units/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
