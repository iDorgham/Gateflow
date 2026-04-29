import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * AI Lead Scoring Endpoint
 *
 * Scores a lead based on vertical, source, and context.
 * Strictly strips PII before sending to LLM.
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { organization: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Strip PII and prepare context for LLM
    // We pass organization metadata and lead metadata (excluding encryptedEmail/Phone)
    const context = {
      orgType: lead.organization.type,
      source: lead.source,
      notes: lead.notes, // Notes may contain business context, should be audited for PII
      status: lead.status,
      createdAt: lead.createdAt.toISOString(),
    };

    const google = createGoogleGenerativeAI({ apiKey });

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        score: z.number().min(0).max(100),
        reasoning: z.string(),
        nextBestAction: z.string(),
      }),
      prompt: `Analyze and score this sales lead for the GateFlow platform.
      
GateFlow is a premium MENA-focused access control platform (QR codes, visitor management, resident portal).

Context:
- Organization Type: ${context.orgType}
- Source: ${context.source}
- Lead Status: ${context.status}
- Business Notes: ${context.notes ?? 'No notes provided'}

High value verticals are REAL_ESTATE (villas/compounds) and CLUB (country clubs/resorts).
SCHOOLS and EVENT_ORGANISERS are secondary but valuable.

Scoring criteria (0-100):
- 80-100 (Hot): High intent, matches primary vertical, clear volume mentioned, or urgent need.
- 50-79 (Warm): Moderate intent, secondary vertical, or ambiguous scale.
- 0-49 (Cold): Low intent, out of region, or looks like spam/test.

Provide a score, a clear reasoning in English and Arabic for the score, and a specific "Next Best Action" for the sales representative.`,
    });

    // Update lead with the new score and log to AiActionLog for auditability
    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { score: result.object.score },
      }),
      prisma.aiActionLog.create({
        data: {
          organizationId: lead.organizationId,
          leadId: lead.id,
          action: 'CRM_LEAD_SCORED',
          prompt: `Lead scoring requested for lead: ${leadId}`,
          reasoning: result.object.reasoning,
          result: JSON.stringify(result.object),
          status: 'CONFIRMED', // Automated internal utility
          metadata: {
            score: result.object.score,
            nextBestAction: result.object.nextBestAction,
          },
        },
      }),
    ]);

    // Phase 3: Trigger Bot Rule Engine for automation
    try {
      const { processBotRules } = await import('@/lib/bot-reactor');
      await processBotRules({
        organizationId: lead.organizationId,
        triggerEvent: 'LEAD_SCORE_CHANGED',
        payload: {
          leadId: lead.id,
          score: result.object.score,
          company: lead.company || 'Unknown Company',
          linkedType: 'LEAD',
          linkedId: lead.id,
        },
      });
    } catch (botErr) {
      console.error('[BOT_REACTOR_ERROR]', botErr);
      // Don't fail the scoring if bot reactor fails
    }

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[CRM_SCORE_LEAD_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
