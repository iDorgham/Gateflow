import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Task Update API
 * PATCH /api/tasks/[taskId]
 */
export async function PATCH(
  req: Request,
  props: { params: Promise<{ taskId: string }> }
) {
  const params = await props.params;
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { taskId } = params;
  const data = await req.json();

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
