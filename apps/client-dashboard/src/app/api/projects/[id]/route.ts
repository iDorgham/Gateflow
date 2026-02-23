import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { z } from 'zod';

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100),
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

    const updated = await prisma.project.update({
      where: { id },
      data: { name: parsed.data.name },
    });

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Project DELETE error]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
