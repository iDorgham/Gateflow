import { NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { z } from 'zod';

/**
 * GateAI Operations Hub - Tags API
 * Security: Contract §1 (Multi-tenancy), §4 (Auth), §5 (Input validation)
 */

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().optional(),
});

export async function GET(request: Request) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { aiContents: true },
        },
      },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('[Tags GET Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = createTagSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    const { name, color } = result.data;

    // Create the tag scoped to the tenant
    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || '#ED4B00', // token('color.brand','#ED4B00')
        organizationId: claims.orgId,
      },
      include: {
        _count: {
          select: { aiContents: true },
        },
      },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation gracefully
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 409 }
      );
    }
    console.error('[Tags POST Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const purgeAll = searchParams.get('purgeAll') === 'true';

    // Bulk purge requires ADMIN or TENANT_ADMIN (we check role string)
    if (purgeAll) {
      if (
        claims.role !== 'ADMIN' &&
        claims.role !== 'TENANT_ADMIN' &&
        claims.role !== 'MANAGER'
      ) {
        return NextResponse.json(
          { error: 'Forbidden: Insufficient role' },
          { status: 403 }
        );
      }

      const result = await prisma.tag.updateMany({
        where: { organizationId: claims.orgId, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      return NextResponse.json({ success: true, count: result.count });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing tag id' }, { status: 400 });
    }

    // Soft delete a single tag ensuring organization scope (Contract §1)
    await prisma.tag.update({
      where: {
        id,
        organizationId: claims.orgId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    console.error('[Tags DELETE Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
