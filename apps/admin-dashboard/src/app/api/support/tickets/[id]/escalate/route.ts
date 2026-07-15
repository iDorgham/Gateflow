import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * POST /api/support/tickets/[id]/escalate
 *
 * Escalates a ticket by creating a linked task in the Task Manager (Phase 3).
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { department = 'SUPPORT', priority = 'HIGH' } = body;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Find the default board for the department
    const board = await prisma.taskBoard.findFirst({
      where: {
        organizationId: ticket.organizationId || undefined,
        department: department as any,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'No task board found for this department' },
        { status: 400 }
      );
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        title: `Escalated Ticket: ${ticket.subject}`,
        description: `Source: Support Hub\nTicket ID: ${ticket.id}\nAI Summary: ${ticket.aiTriageSummary || 'N/A'}`,
        status: 'TODO',
        priority: priority as any,
        department: department as any,
        boardId: board.id,
        organizationId: ticket.organizationId!,
        createdById:
          (
            await prisma.user.findFirst({
              where: { role: { name: 'SUPER_ADMIN' } },
            })
          )?.id || '', // System user fallback
        linkedType: 'SUPPORT_TICKET',
        linkedId: ticket.id,
      },
    });

    // Update ticket status
    await prisma.supportTicket.update({
      where: { id },
      data: { status: 'ASSIGNED' },
    });

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
