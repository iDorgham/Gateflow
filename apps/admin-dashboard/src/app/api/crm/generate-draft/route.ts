import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * AI Lead Follow-up Draft API
 * POST /api/crm/generate-draft
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

    // 1. Fetch Lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId, deletedAt: null },
      include: { organization: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!lead.consentGiven) {
      return NextResponse.json(
        {
          error: 'No consent given for AI follow-up',
        },
        { status: 403 }
      );
    }

    // 2. Generate Draft (No PII in prompt)
    const systemPrompt = `
      You are a senior sales representative for GateFlow. 
      Generate a professional follow-up email draft for a lead.
      The organization type is ${lead.organization.type}.
      The current status is ${lead.status}.
      The AI score for this lead is ${lead.score || 'Not calculated'}.
      
      Requirements:
      - Tone: Professional, helpful, security-focused.
      - Length: Concise (max 150 words).
      - Language: Matches the organization locale (assume English for now).
      - Content: Mention how GateFlow solves access control problems for ${lead.organization.type}.
      
      IMPORTANT: Use [Lead Name] and [Lead Email] as placeholders. Do not include real names or PII.
    `;

    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      system: systemPrompt,
      prompt: 'Draft a compelling follow-up email based on the lead metadata.',
    });

    // 3. Log to AiActionLog as PENDING (HiTL requirement)
    await prisma.aiActionLog.create({
      data: {
        organizationId: lead.organizationId,
        actionType: 'CRM_DRAFT_FOLLOWUP',
        status: 'PENDING',
        prompt: systemPrompt,
        result: text,
        metadata: JSON.stringify({
          leadId,
          actionNeeded: 'CONFIRM_EMAIL_SEND',
        }),
      },
    });

    return NextResponse.json({
      success: true,
      draft: text,
      metadata: {
        leadId,
        status: 'PENDING_CONFIRMATION',
      },
    });
  } catch (error) {
    console.error('[CRM_GENERATE_DRAFT_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
