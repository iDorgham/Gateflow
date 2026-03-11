import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, TaskStatus } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

/** PATCH /api/tasks/[id] */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await Promise.resolve(params);

  const existing = await prisma.task.findFirst({
    where: { id, organizationId: claims.orgId, deletedAt: null },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const parsed = UpdateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) data.title = parsed.data.title;
  if (parsed.data.description !== undefined) data.description = parsed.data.description;
  if (parsed.data.status !== undefined) data.status = parsed.data.status;
  if (parsed.data.dueDate !== undefined) data.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;
  if (parsed.data.assignedTo !== undefined) data.assignedTo = parsed.data.assignedTo;

  const task = await prisma.task.update({ where: { id }, data });
  return NextResponse.json({
    success: true,
    data: { ...task, dueDate: task.dueDate?.toISOString() ?? null, createdAt: task.createdAt.toISOString(), updatedAt: task.updatedAt.toISOString() },
  });
}

/** DELETE /api/tasks/[id] — soft delete */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await Promise.resolve(params);

  const existing = await prisma.task.findFirst({
    where: { id, organizationId: claims.orgId, deletedAt: null },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ success: true });
}
