import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      deletedAt: true,
      createdAt: true,
      role: { select: { id: true, name: true } },
      organization: { select: { id: true, name: true, plan: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  // Scan count
  const [scansTotal, scansThisMonth] = await Promise.all([
    prisma.scanLog.count({ where: { userId: user.id } }),
    prisma.scanLog.count({
      where: {
        userId: user.id,
        scannedAt: { gte: new Date(new Date().setDate(1)) },
      },
    }),
  ]);

  // Available roles for role change
  const roles = await prisma.role.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({
    success: true,
    data: {
      ...user,
      deletedAt: user.deletedAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      scansTotal,
      scansThisMonth,
      availableRoles: roles,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const { action, roleId } = body as { action?: string; roleId?: string };

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { role: true },
  });
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  if (action === 'deactivate') {
    // Security: do not deactivate users with ADMIN role (platform admin protection)
    if (user.role?.name === 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Cannot deactivate platform admin users' },
        { status: 403 }
      );
    }
    await prisma.user.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });
    console.log(`[admin-audit] User ${params.id} deactivated`);
    return NextResponse.json({ success: true, action: 'deactivated' });
  }

  if (action === 'reactivate') {
    await prisma.user.update({
      where: { id: params.id },
      data: { deletedAt: null },
    });
    console.log(`[admin-audit] User ${params.id} reactivated`);
    return NextResponse.json({ success: true, action: 'reactivated' });
  }

  if (roleId) {
    // Security: cannot elevate to ADMIN role via this endpoint
    const targetRole = await prisma.role.findUnique({ where: { id: roleId } });
    if (!targetRole) {
      return NextResponse.json({ success: false, message: 'Role not found' }, { status: 404 });
    }
    if (targetRole.name === 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Cannot assign ADMIN role via this endpoint' },
        { status: 403 }
      );
    }
    await prisma.user.update({
      where: { id: params.id },
      data: { roleId },
    });
    console.log(`[admin-audit] User ${params.id} role changed to ${targetRole.name}`);
    return NextResponse.json({ success: true, action: 'role_changed', roleName: targetRole.name });
  }

  return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
}
