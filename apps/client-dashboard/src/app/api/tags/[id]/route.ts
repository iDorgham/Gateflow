import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const UpdateTagSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().max(20).optional().nullable(),
});

/** PATCH /api/tags/[id] */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const tag = await prisma.tag.findFirst({
    where: { id, organizationId: claims.orgId, deletedAt: null },
  });
  if (!tag) {
    return NextResponse.json({ success: false, message: 'Tag not found' }, { status: 404 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const validation = UpdateTagSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }
    const updated = await prisma.tag.update({
      where: { id },
      data: {
        ...(validation.data.name !== undefined && { name: validation.data.name.trim() }),
        ...(validation.data.color !== undefined && { color: validation.data.color?.trim() ?? null }),
      },
    });
    return NextResponse.json({
      success: true,
      data: { id: updated.id, name: updated.name, color: updated.color },
    });
  } catch (error) {
    console.error('PATCH /api/tags/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

/** DELETE /api/tags/[id] — soft delete */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const tag = await prisma.tag.findFirst({
    where: { id, organizationId: claims.orgId, deletedAt: null },
  });
  if (!tag) {
    return NextResponse.json({ success: false, message: 'Tag not found' }, { status: 404 });
  }

  try {
    await prisma.tag.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tags/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
