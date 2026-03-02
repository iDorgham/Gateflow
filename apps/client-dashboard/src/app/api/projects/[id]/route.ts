import { NextRequest, NextResponse } from 'next/server';
import { prisma, GateMode } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';


const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  externalUrl: z.string().url().max(500).optional().nullable(),
  galleryJson: z.array(z.string().url()).max(20).optional().nullable(),
  gateMode: z.nativeEnum(GateMode).optional(),
  gateIds: z.array(z.string()).optional(),
  unitIds: z.array(z.string()).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);

    const project = await prisma.project.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = UpdateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const data: Record<string, unknown> = { name: parsed.data.name };
    if (parsed.data.description !== undefined) data.description = parsed.data.description;
    if (parsed.data.location !== undefined) data.location = parsed.data.location;
    if (parsed.data.logoUrl !== undefined) data.logoUrl = parsed.data.logoUrl;
    if (parsed.data.coverUrl !== undefined) data.coverUrl = parsed.data.coverUrl;
    if (parsed.data.website !== undefined) data.website = parsed.data.website;
    if (parsed.data.externalUrl !== undefined) data.externalUrl = parsed.data.externalUrl;
    if (parsed.data.galleryJson !== undefined) data.galleryJson = parsed.data.galleryJson ?? null;
    if (parsed.data.gateMode !== undefined) data.gateMode = parsed.data.gateMode;

    const updated = await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id },
        data,
      });

      // Update gate assignments if provided
      if (parsed.data.gateIds !== undefined) {
        // Disassociate gates currently linked to this project but not in the new list
        await tx.gate.updateMany({
          where: { projectId: id, organizationId: claims.orgId, NOT: { id: { in: parsed.data.gateIds } } },
          data: { projectId: null },
        });
        
        // Associate new gates
        if (parsed.data.gateIds.length > 0) {
          await tx.gate.updateMany({
            where: { id: { in: parsed.data.gateIds }, organizationId: claims.orgId },
            data: { projectId: id },
          });
        }
      }

      // Update unit assignments if provided
      if (parsed.data.unitIds !== undefined) {
        // Disassociate units currently linked to this project but not in the new list
        await tx.unit.updateMany({
          where: { projectId: id, organizationId: claims.orgId, NOT: { id: { in: parsed.data.unitIds } } },
          data: { projectId: null },
        });

        // Associate new units
        if (parsed.data.unitIds.length > 0) {
          await tx.unit.updateMany({
            where: { id: { in: parsed.data.unitIds }, organizationId: claims.orgId },
            data: { projectId: id },
          });
        }
      }

      return project;
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/projects');
    return NextResponse.json({ project: updated });

  } catch (error) {
    console.error('[Project PATCH error]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);

    // Verify ownership
    const project = await prisma.project.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Refuse if it's the only project
    const count = await prisma.project.count({
      where: { organizationId: claims.orgId, deletedAt: null },
    });
    if (count <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only project in your organization' },
        { status: 400 }
      );
    }

    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/settings');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Project DELETE error]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
