import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const CreateTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().max(20).optional().nullable(),
});

/** GET /api/tags — list tags for the org */
export async function GET(): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
    const data = tags.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/tags error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

/** POST /api/tags — create a tag */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const validation = CreateTagSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }
    const { name, color } = validation.data;
    const existing = await prisma.tag.findFirst({
      where: { organizationId: claims.orgId, name: name.trim(), deletedAt: null },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Tag with this name already exists' }, { status: 409 });
    }
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        color: color?.trim() ?? null,
        organizationId: claims.orgId,
      },
    });
    return NextResponse.json(
      { success: true, data: { id: tag.id, name: tag.name, color: tag.color } },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/tags error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
