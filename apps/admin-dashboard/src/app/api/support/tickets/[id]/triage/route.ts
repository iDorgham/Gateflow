import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/support/tickets/[id]/triage
 *
 * Performs AI triage on a support ticket.
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 503 }
      );
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const firstMessage = ticket.messages[0]?.content || 'No content';
    const google = createGoogleGenerativeAI({ apiKey });

    const triageSchema = z.object({
      summary: z.string(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      suggestedAction: z.string(),
      category: z.string(),
      sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'URGENT']),
    });

    const systemPrompt = `You are an expert support triage AI for GateFlow.
    Analyze the following support ticket and provide a structured summary, priority level, and suggested next action.
    
    Subject: ${ticket.subject}
    Content: ${firstMessage}
    
    Priority levels:
    - CRITICAL: System down, security breach, complete access failure.
    - HIGH: Feature broken, urgent request, negative sentiment.
    - MEDIUM: General inquiry, standard configuration, neutral.
    - LOW: Feature request, praise, minor styling issues.
    `;

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: triageSchema,
      prompt: systemPrompt,
    });

    // Update ticket with AI results
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        aiTriageSummary: result.object.summary,
        aiSuggestedAction: result.object.suggestedAction,
        priority: result.object.priority,
        status: 'AI_TRIAGED',
      },
    });

    // Log AI action — skip for general-inquiry tickets (organizationId: null) since
    // AiActionLog.organizationId is a required FK and no 'GLOBAL' Organization row exists.
    if (ticket.organizationId) {
      await prisma.aiActionLog.create({
        data: {
          organizationId: ticket.organizationId,
          actionType: 'SUPPORT_TICKET_TRIAGED',
          prompt: firstMessage,
          result: JSON.stringify(result.object),
          status: 'CONFIRMED', // Triage is automatic in this flow
        },
      });
    }

    return NextResponse.json({
      success: true,
      triage: result.object,
      ticket: updatedTicket,
    });
  } catch (error: any) {
    console.error('[SUPPORT_TRIAGE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
