import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

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

    const members = await prisma.user.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        lastActiveAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error('GET /api/team/members error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

const UpdateMemberSchema = z.object({
  id: z.string(),
  roleId: z.string().optional(),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = UpdateMemberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Invalid request body', error: validation.error.flatten() }, { status: 400 });
    }

    const { id, roleId } = validation.data;

    // Verify user belongs to same org
    const target = await prisma.user.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });

    if (!target) {
      return NextResponse.json({ success: false, message: 'User not found in organization' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id },
      data: {
        ...(roleId && { roleId }),
      },
    });

    return NextResponse.json({ success: true, message: 'Member updated effectively' });
  } catch (error) {
    console.error('PATCH /api/team/members error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Target user ID is required' }, { status: 400 });
    }

    // Verify user belongs to same org
    const target = await prisma.user.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
    });

    if (!target) {
      return NextResponse.json({ success: false, message: 'User not found in organization' }, { status: 404 });
    }

    if (id === claims.sub) {
      return NextResponse.json({ success: false, message: 'Cannot remove yourself' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Member removed effectively' });
  } catch (error) {
    console.error('DELETE /api/team/members error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
