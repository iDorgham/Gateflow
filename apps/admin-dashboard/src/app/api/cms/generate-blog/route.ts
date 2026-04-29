import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * AI Blog Post Generator
 * 
 * Generates high-quality editorial content from a topic or title.
 * Produces parallel EN/AR drafts with SEO metadata.
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { topic, organizationId } = body;

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        titleEn: z.string(),
        titleAr: z.string(),
        slugEn: z.string(),
        slugAr: z.string(),
        contentEn: z.string(),
        contentAr: z.string(),
        excerptEn: z.string(),
        excerptAr: z.string(),
        metaTitleEn: z.string(),
        metaTitleAr: z.string(),
        metaDescEn: z.string(),
        metaDescAr: z.string(),
        strategy: z.string(),
      }),
      prompt: `Write a professional blog post for the GateFlow platform about: "${topic}".
      
GateFlow is a MENA-focused access control and marketing intelligence platform.
Tone: Thought leadership, Professional, Regional expertise.

Requirements:
- contentEn: Full markdown content with H2s, bullet points, and a conclusion.
- contentAr: High-quality Arabic translation maintaining the same structure and tone.
- strategy: Reasoning for the content structure and SEO keywords targetted.`,
    });

    // Log the draft generation
    await prisma.aiActionLog.create({
      data: {
        organizationId: organizationId || 'gateflow-global',
        action: 'CMS_BLOG_DRAFT_GENERATED',
        prompt: topic,
        reasoning: result.object.strategy,
        result: JSON.stringify(result.object),
        status: 'PENDING_CONFIRMATION',
      }
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[CMS_BLOG_GENERATE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
