import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { trackAiUsage } from '@/lib/ai-usage-tracker';

/**
 * AI Lead Scoring API
 * POST /api/crm/score-lead
 * Body: { leadId: string }
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }

    // 1. Fetch Lead & Organization Metadata (No PII)
    const lead = await prisma.lead.findUnique({
      where: { id: leadId, deletedAt: null },
      include: {
        organization: {
          select: {
            type: true,
            id: true,
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // 2. Prepare AI Prompt (Strictly NO PII)
    // We only pass metadata for scoring
    const systemPrompt = `
      You are an expert SaaS Lead Scoring AI for GateFlow, a specialized security and gate access platform.
      Your task is to score the lead (0-100) based on their business profile and conversion potential.
      
      GateFlow is most valuable for:
      - HIGH score: RESIDENTIAL_COMPOUND, HOSPITALITY, INDUSTRIAL_HUB (high volume, complex needs).
      - MEDIUM score: CORPORATE_PLAZA, COWORKING_SPACE.
      - LOW score: EDUCATIONAL_CAMPUS, PUBLIC_PARK.
      
      Inputs:
      - Organization Type: ${lead.organization.type}
      - Lead Source: ${lead.source || 'Unknown'}
      - Lead Notes Summary: ${lead.notes ? lead.notes.substring(0, 200) : 'None'}
    `;

    // 3. Generate Score using Vercel AI SDK
    const { object, usage } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        score: z.number().min(0).max(100),
        reasoning: z.string(),
        nextBestAction: z.string(),
      }),
      prompt:
        'Analyze the lead potential based on the provided metadata and return a score, reasoning, and next best action.',
      system: systemPrompt,
    });

    // Record AI Cost Tracking
    await (trackAiUsage as any)({
      model: 'gemini-1.5-pro',
      usage: {
        promptTokens: (usage as any).promptTokens || 0,
        completionTokens: (usage as any).completionTokens || 0,
      },
      department: 'CRM',
      action: 'CRM_LEAD_SCORED',
    });

    // 4. Update Database
    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { score: object.score },
      }),
      prisma.aiActionLog.create({
        data: {
          organizationId: lead.organizationId,
          action: 'CRM_LEAD_SCORED',
          status: 'CONFIRMED',
          payload: JSON.stringify({
            leadId,
            score: object.score,
            reasoning: object.reasoning,
          }),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      score: object.score,
      reasoning: object.reasoning,
      nextBestAction: object.nextBestAction,
    });
  } catch (error) {
    console.error('[CRM_SCORE_LEAD_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
