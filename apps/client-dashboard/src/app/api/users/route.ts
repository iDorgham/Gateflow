import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/users?role=RESIDENT
 * Returns org users filtered by role. Used for "Link Resident" dropdown.
 * Role comparison is case-insensitive (handles both 'RESIDENT' and 'Resident').
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get('role') || undefined;

  const users = await prisma.user.findMany({
    where: {
      organizationId: claims.orgId,
      deletedAt: null,
      ...(roleFilter
        ? {
            role: {
              name: { equals: roleFilter, mode: 'insensitive' },
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: { select: { name: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({
    success: true,
    data: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role.name,
    })),
  });
}
