import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { trackAiUsage } from '@/lib/ai-usage-tracker';

/**
 * AI Section Generation API
 * Generates structured JSON for a landing page section (EN & AR).
 * POST /api/cms/generate-section
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { prompt, type, orgId } = await req.json();

  try {
    const { object, usage } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        en: z.object({
          headline: z.string(),
          body: z.string(),
          ctaText: z.string(),
          ctaLink: z.string(),
        }),
        ar: z.object({
          headline: z.string(),
          body: z.string(),
          ctaText: z.string(),
          ctaLink: z.string(),
        }),
      }),
      system: `
        You are a GateFlow Marketing AI.
        Generate high-converting landing page section copy for GateFlow community management platform.
        Section Type: ${type}.
        Market: Saudi Arabia / MENA.
        Tone: Professional, Resilient, Invisible Sentinel.
        Provide copy in both English and Arabic.
      `,
      prompt: `Topic: ${prompt}`,
    });

    // Record AI Cost Tracking
    await trackAiUsage({
      model: 'gemini-1.5-pro',
      usage: {
        promptTokens: (usage as any).promptTokens || 0,
        completionTokens: (usage as any).completionTokens || 0,
      },
      department: 'MARKETING',
      action: 'CMS_SECTION_GENERATED',
    });

    // Log AI Action (HiTL)
    await (prisma as any).aiActionLog.create({
      data: {
        organizationId: orgId || 'GLOBAL',
        action: 'CMS_SECTION_GENERATED',
        status: 'PENDING',
        prompt: `Type: ${type}, Topic: ${prompt}`,
        result: 'AI content generated. Awaiting human confirmation.',
        metadata: JSON.stringify(object),
      },
    });

    return NextResponse.json({ success: true, section: object });
  } catch (error) {
    console.error('[CMS_GENERATE_ERROR]', error);
    return NextResponse.json(
      { error: 'AI generation failed' },
      { status: 500 }
    );
  }
}
