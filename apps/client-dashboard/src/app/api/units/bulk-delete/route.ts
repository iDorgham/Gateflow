import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const BulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
});

/**
 * POST /api/units/bulk-delete
 * Soft-delete multiple units. All must belong to the caller's organization.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const orgId = claims.orgId;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const parsed = BulkDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { ids } = parsed.data;

    const existing = await prisma.unit.findMany({
      where: {
        id: { in: ids },
        organizationId: orgId,
        deletedAt: null,
      },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((u) => u.id));
    const notFound = ids.filter((id) => !existingIds.has(id));
    if (notFound.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Some units not found or already deleted',
          notFound,
        },
        { status: 400 }
      );
    }

    await prisma.unit.updateMany({
      where: { id: { in: ids }, organizationId: orgId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      deleted: ids.length,
    });
  } catch (error) {
    console.error('POST /api/units/bulk-delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
