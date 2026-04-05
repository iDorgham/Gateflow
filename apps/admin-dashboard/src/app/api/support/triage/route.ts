import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { trackAiUsage } from '@/lib/ai-usage-tracker';

/**
 * AI Support Triage API
 * Analyzes incoming tickets to provide summaries, priority, and actions.
 * POST /api/support/triage
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { ticketId, content } = await req.json();

  try {
    const { object, usage } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        summary: z.string(),
        suggestedPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
        suggestedAction: z.string(),
        sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'URGENT']),
      }),
      system: `
        You are the GateFlow Support AI.
        Analyze the incoming customer support message.
        Identify the core problem, assess priority based on security or access impact, and suggest a resolution step.
      `,
      prompt: `Message Content: ${content}`,
    });

    // Record AI Cost Tracking
    await trackAiUsage({
      model: 'gemini-1.5-pro',
      usage: {
        promptTokens: (usage as any).promptTokens || 0,
        completionTokens: (usage as any).completionTokens || 0,
      },
      department: 'SUPPORT',
      action: 'SUPPORT_AI_TRIAGED',
    });

    // Update Ticket
    const updatedTicket = await (prisma as any).supportTicket.update({
      where: { id: ticketId },
      data: {
        status: 'AI_TRIAGED',
        priority: object.suggestedPriority,
        aiTriageSummary: object.summary,
        aiSuggestedAction: object.suggestedAction,
      },
    });

    // Log AI Action
    await (prisma as any).aiActionLog.create({
      data: {
        organizationId: updatedTicket.organizationId || 'GLOBAL',
        action: 'SUPPORT_AI_TRIAGED',
        status: 'CONFIRMED',
        prompt: `Triage for ticket: ${ticketId}`,
        result: `Priority: ${object.suggestedPriority}, Action: ${object.suggestedAction}`,
        metadata: JSON.stringify(object),
      },
    });

    return NextResponse.json({ success: true, triage: object });
  } catch (error) {
    console.error('[SUPPORT_TRIAGE_ERROR]', error);
    return NextResponse.json({ error: 'Triage failed' }, { status: 500 });
  }
}
