import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * GET /api/support/tickets
 *
 * List support tickets.
 */
export async function GET(request: Request) {
  const isAuth = await isAdminAuthorized(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('orgId');
  const status = searchParams.get('status');

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: {
        organizationId: orgId || undefined,
        status: status ? (status as any) : undefined,
      },
      include: {
        organization: {
          select: { name: true },
        },
        assignee: {
          select: { name: true, avatarUrl: true },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/support/tickets
 *
 * Create a new support ticket.
 * Triggers AI Triage.
 */
export async function POST(request: Request) {
  // Can be called by users (client dashboard) or admins
  const body = await request.json();
  const { subject, message, organizationId, source, userId } = body;

  if (!subject || !message) {
    return NextResponse.json(
      { success: false, message: 'Subject and message are required' },
      { status: 400 }
    );
  }

  try {
    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        organizationId,
        source: source || 'MANUAL',
        status: 'OPEN',
        priority: 'MEDIUM',
        messages: {
          create: {
            content: message,
            senderId: userId || null,
            senderType: userId ? 'USER' : 'AI', // If no userId, assume initiated by system/AI
          },
        },
      },
    });

    // In a real scenario, we'd trigger an AI triage background job here
    // For this phase, we'll implement a mock or simple triage logic in the UI or separate route

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
