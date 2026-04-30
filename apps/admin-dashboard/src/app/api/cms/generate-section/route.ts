import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/cms/generate-section
 *
 * Uses AI to generate a structured landing page section based on a prompt.
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
    const { prompt, sectionType, organizationId, locale = 'en' } = body;

    if (!prompt || !sectionType || !organizationId) {
      return NextResponse.json(
        { error: 'prompt, sectionType, and organizationId are required' },
        { status: 400 }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

    // Define different schemas based on sectionType
    let sectionSchema: any;
    let systemPrompt: string;

    switch (sectionType) {
      case 'HERO':
        sectionSchema = z.object({
          heroTitle: z.string(),
          heroSubtitle: z.string(),
          ctaText: z.string(),
          imageUrl: z.string().optional(),
          imagePrompt: z.string(), // For imageGenerate tool / future use
        });
        systemPrompt = `Generate a Hero section for a landing page. Theme: ${prompt}.
        Language: ${locale === 'ar' ? 'Arabic (MENA market tone)' : 'English (Premium SaaS tone)'}.
        The imagePrompt should be a detailed prompt for an AI image generator like DALL-E.`;
        break;

      case 'FEATURES':
        sectionSchema = z.object({
          title: z.string(),
          features: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              icon: z.string(), // Lucide icon name
            })
          ),
        });
        systemPrompt = `Generate a Features section with 3-4 items. Theme: ${prompt}.
        Language: ${locale === 'ar' ? 'Arabic' : 'English'}.`;
        break;

      case 'CTA':
        sectionSchema = z.object({
          title: z.string(),
          subtitle: z.string(),
          buttonText: z.string(),
        });
        systemPrompt = `Generate a high-converting Call to Action section. Theme: ${prompt}.
        Language: ${locale === 'ar' ? 'Arabic' : 'English'}.`;
        break;

      default:
        // Generic schema for other types
        sectionSchema = z.object({
          title: z.string(),
          content: z.string(),
        });
        systemPrompt = `Generate content for a ${sectionType} section. Theme: ${prompt}.
        Language: ${locale === 'ar' ? 'Arabic' : 'English'}.`;
    }

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: sectionSchema,
      prompt: systemPrompt,
    });

    // Log the AI action to the database
    const actionLog = await prisma.aiActionLog.create({
      data: {
        organizationId,
        action: 'CMS_SECTION_GENERATED',
        prompt: `Type: ${sectionType}, Prompt: ${prompt}`,
        result: JSON.stringify(result.object),
        status: 'PENDING_CONFIRMATION',
        metadata: {
          sectionType,
          locale,
        },
      },
    });

    return NextResponse.json({
      success: true,
      section: result.object,
      actionLogId: actionLog.id,
    });
  } catch (error: any) {
    console.error('[CMS_GENERATE_SECTION_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
