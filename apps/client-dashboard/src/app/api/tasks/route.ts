import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { ensureSupportBoard } from '@/lib/ensure-support-board';

export const dynamic = 'force-dynamic';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

/** GET /api/tasks — list org tasks (not deleted), newest first */
export async function GET(): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    success: true,
    data: tasks.map((t) => ({
      ...t,
      dueDate: t.dueDate?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
  });
}

/** POST /api/tasks — create a task */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = CreateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.assignedTo) {
    // Prevent assigning tasks to a user outside this org (tenant isolation) —
    // assigneeId's FK only validates the user exists globally, not org membership.
    const assignee = await prisma.user.findFirst({
      where: {
        id: parsed.data.assignedTo,
        organizationId: claims.orgId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!assignee) {
      return NextResponse.json(
        { error: 'assignedTo user not found in this organization' },
        { status: 400 }
      );
    }
  }

  // Client-dashboard tasks aren't organized into boards by the user; lazily
  // provision a single default board per org to satisfy Task's required boardId/department.
  const board = await ensureSupportBoard(claims.orgId);

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      assigneeId: parsed.data.assignedTo ?? null,
      organizationId: claims.orgId,
      createdById: claims.sub,
      boardId: board.id,
      department: board.department,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        ...task,
        dueDate: task.dueDate?.toISOString() ?? null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    },
    { status: 201 }
  );
}
