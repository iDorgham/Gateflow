import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/cms/generate-blog
 *
 * Generates a full multi-lingual blog post draft based on a topic.
 */
export async function POST(request: Request) {
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
    const { topic, organizationId } = body;

    if (!topic || !organizationId) {
      return NextResponse.json(
        { error: 'topic and organizationId are required' },
        { status: 400 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const blogSchema = z.object({
      titleEn: z.string(),
      titleAr: z.string(),
      slugEn: z.string(),
      slugAr: z.string(),
      excerptEn: z.string(),
      excerptAr: z.string(),
      contentEn: z.string(), // Clean HTML
      contentAr: z.string(),
      metaTitleEn: z.string(),
      metaTitleAr: z.string(),
      metaDescEn: z.string(),
      metaDescAr: z.string(),
    });

    const systemPrompt = `You are an expert SaaS content writer and SEO specialist. 
    Generate a high-quality, long-form blog post for "GateFlow" (a premium smart gate access and facility management platform).
    
    Topic: ${topic}
    
    Requirements:
    1. Generate mirror versions in English (Premium SaaS tone) and Arabic (Modern Standard Arabic for MENA business market).
    2. Provide a compelling title and a concise excerpt for both.
    3. Content must be rich, informative, and formatted in clean HTML (h2, p, ul, li, strong). Avoid h1 as it's reserved for the page title.
    4. Include SEO metadata (meta title and meta description) optimized for high-volume keywords related to the topic.
    5. Generate short, clean slugs for both languages.
    6. Ensure technical accuracy regarding facility management and gate access security.`;

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: blogSchema,
      prompt: systemPrompt,
    });

    // Log the AI action to the database for audit and HiTL
    await prisma.aiActionLog.create({
      data: {
        organizationId,
        action: 'BLOG_POST_GENERATED',
        prompt: topic,
        result: JSON.stringify(result.object),
        status: 'PENDING_CONFIRMATION',
        metadata: {
          topic,
        },
      },
    });

    return NextResponse.json({
      success: true,
      post: result.object,
    });
  } catch (error: any) {
    console.error('[CMS_GENERATE_BLOG_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
