import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { prisma } from '@gate-access/db';
import { trackAiUsage } from '@/lib/ai-usage-tracker';

/**
 * AI Blog Draft Generator API
 * Generates full blog post Markdown, SEO, and slugs (EN & AR).
 * POST /api/cms/generate-blog
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthorized(req))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { title, topic, orgId } = await req.json();

  try {
    const { object, usage } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        en: z.object({
          title: z.string(),
          slug: z.string(),
          content: z.string(), // Markdown
          excerpt: z.string(),
          metaTitle: z.string(),
          metaDesc: z.string(),
        }),
        ar: z.object({
          title: z.string(),
          slug: z.string(),
          content: z.string(), // Markdown
          excerpt: z.string(),
          metaTitle: z.string(),
          metaDesc: z.string(),
        }),
      }),
      system: `
        You are a Senior Content Strategist for GateFlow.
        Generate industry-leading, SEO-optimized blog posts for the community management and access control sector.
        Market: Saudi Arabia / UAE / MENA.
        Tone: Authoritative, Visionary, Smart.
        Provide full drafts in both English and Arabic.
        Enable Markdown structure (H2, H3, bold, lists).
        Arabic version must be culturally localized, not just translated.
      `,
      prompt: `Title Suggestion: ${title}. Topic: ${topic}`,
    });

    // Record AI Cost Tracking
    await trackAiUsage({
      model: 'gemini-1.5-pro',
      usage: {
        promptTokens: (usage as any).promptTokens || 0,
        completionTokens: (usage as any).completionTokens || 0,
      },
      department: 'MARKETING',
      action: 'BLOG_DRAFT_GENERATED',
    });

    // Log AI Action (HiTL)
    await (prisma as any).aiActionLog.create({
      data: {
        organizationId: orgId || 'GLOBAL',
        action: 'BLOG_DRAFT_GENERATED',
        status: 'PENDING',
        prompt: `Title: ${title}, Topic: ${topic}`,
        result: 'Full draft ready for review.',
        metadata: JSON.stringify(object),
      },
    });

    return NextResponse.json({ success: true, draft: object });
  } catch (error) {
    console.error('[BLOG_GENERATE_ERROR]', error);
    return NextResponse.json(
      { error: 'AI generation failed' },
      { status: 500 }
    );
  }
}
