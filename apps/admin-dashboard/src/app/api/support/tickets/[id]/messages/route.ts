import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * GET /api/support/tickets/[id]/messages
 *
 * List messages for a ticket.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdminAuthorized(request))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const messages = await prisma.supportMessage.findMany({
      where: { ticketId: params.id },
      include: {
        sender: {
          select: { name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/support/tickets/[id]/messages
 *
 * Send a message.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdminAuthorized(request))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { content, senderId, senderType } = body;

  if (!content) {
    return NextResponse.json(
      { success: false, message: 'Content is required' },
      { status: 400 }
    );
  }

  try {
    const message = await prisma.supportMessage.create({
      data: {
        content,
        ticketId: params.id,
        senderId: senderId || null,
        senderType: senderType || 'USER',
      },
    });

    // Update ticket's updatedAt
    await prisma.supportTicket.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
