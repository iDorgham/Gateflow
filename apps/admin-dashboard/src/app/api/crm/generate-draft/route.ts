import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { type NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * AI CRM Follow-up Draft Generator
 *
 * Generates a draft follow-up email/message for a lead.
 * Implements strict HiTL: Creates a PENDING_CONFIRMATION log entry.
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
    const { leadId, tone = 'professional', language = 'en' } = body;

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

    // Security Gate: Consent is mandatory for automated outreach drafting
    if (!lead.consentGiven) {
      return NextResponse.json(
        { error: 'Lead has not given consent for outreach. AI drafting blocked.' },
        { status: 403 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

    // We do NOT send PII to the LLM. We use placeholders.
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      system: `You are an expert sales representative for GateFlow, the leading MENA access control platform.
Your goal is to draft a compelling follow-up email for a high-value lead.
Tone: ${tone}
Language: ${language}

Key Selling Points of GateFlow:
1. Seamless QR-based visitor entry (RTL support, WhatsApp integration).
2. Hardware-agnostic scanner app for security guards.
3. White-label resident portal for community management.
4. Compliant with regional data privacy laws (PDPL/PDPPL).

Instructions:
- Use [Lead Name] and [My Name] as placeholders.
- Do NOT include any specific PII from the prompt.
- Focus on the ${lead.organization.type} vertical needs.
- Keep the call to action clear: "Schedule a 15-minute demo".`,
      prompt: `Lead context: Inbound inquiry from ${lead.organization.type} sector.
Source: ${lead.source ?? 'Direct inquiry'}.
Notes: ${lead.notes ?? 'Interested in modernizing community access'}.
Lead Score: ${lead.score ?? 'Warm'}.`,
    });

    // Create a PENDING_CONFIRMATION log entry for HiTL review
    // The UI will display this draft and wait for a human to confirm/edit before sending.
    const logEntry = await prisma.aiActionLog.create({
      data: {
        organizationId: lead.organizationId,
        leadId: lead.id,
        action: 'CRM_FOLLOWUP_DRAFT',
        prompt: `Generate ${tone} follow-up in ${language}`,
        result: result.text,
        status: 'PENDING_CONFIRMATION',
        payload: {
          leadId: lead.id,
          tone,
          language,
          vertical: lead.organization.type,
        },
        metadata: {
          model: 'gemini-1.5-flash',
          finishReason: result.finishReason,
          usage: result.usage,
        },
      },
    });

    return NextResponse.json({
      draft: result.text,
      logId: logEntry.id,
      status: 'PENDING_CONFIRMATION',
    });
  } catch (error) {
    console.error('[CRM_GENERATE_DRAFT_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
