import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { filterVisibleTeamRoles, OrganizationType } from '@gate-access/types';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const org = await prisma.organization.findFirst({
      where: { id: claims.orgId, deletedAt: null },
      select: { type: true },
    });
    const orgType = org?.type ?? OrganizationType.REAL_ESTATE;

    const roles = await prisma.role.findMany({
      where: {
        OR: [{ organizationId: claims.orgId }, { isBuiltIn: true }],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        organizationId: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const data = filterVisibleTeamRoles(roles, orgType).map(
      ({ organizationId: _organizationId, ...role }) => role
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('GET /api/team/roles error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
