import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Task Management API
 * GET /api/tasks?orgId=...&department=...
 */
export async function GET(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  const department = searchParams.get('department');

  if (!orgId || !department) {
    return NextResponse.json(
      { error: 'Missing orgId or department' },
      { status: 400 }
    );
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        organizationId: orgId,
        department: department as any,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        board: true,
        assignee: { select: { name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
