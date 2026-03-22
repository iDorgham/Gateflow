import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, EventType } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const CreateMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        organizationId: claims.orgId,
      },
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    // Return in chronological order
    return NextResponse.json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error) {
    console.error('GET /api/team/messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = CreateMessageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        content: validation.data.content,
        userId: claims.sub,
        organizationId: claims.orgId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    // Update user presence
    await prisma.user.update({
      where: { id: claims.sub },
      data: { lastActiveAt: new Date() },
    }).catch(err => console.error('Presence update failed:', err));

    // Broadcast message via SSE
    await prisma.eventLog.create({
      data: {
        organizationId: claims.orgId,
        type: EventType.TEAM_CHAT_MESSAGE,
        payload: {
          messageId: message.id,
          senderId: message.userId,
          content: message.content,
        },
      },
    }).catch(err => console.error('SSE broadcast failed:', err));
    
    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('POST /api/team/messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
