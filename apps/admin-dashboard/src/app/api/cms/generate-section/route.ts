import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * AI Landing Page Section Generator
 * 
 * Generates high-converting marketing sections in JSON format.
 * Supports HERO, FEATURES, CTA, and more.
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
    const { prompt, sectionType, organizationId } = body;

    if (!prompt || !sectionType) {
      return NextResponse.json({ error: 'prompt and sectionType are required' }, { status: 400 });
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({
        contentEn: z.record(z.any()),
        contentAr: z.record(z.any()),
        strategy: z.string(),
      }),
      prompt: `Generate a landing page section of type ${sectionType} for the following prompt:
      
"${prompt}"

GateFlow is a MENA-focused access control and marketing intelligence platform.
Tone: Premium, Security-first, Innovative.

Requirements:
- contentEn: JSON object with specific fields for ${sectionType} (e.g. title, subtitle, buttons, features list).
- contentAr: High-quality Arabic translation of the content.
- strategy: Reasoning for the marketing copy and tone.`,
    });

    // Log the generation
    await prisma.aiActionLog.create({
      data: {
        organizationId: organizationId || 'gateflow-global',
        action: 'CMS_SECTION_GENERATED',
        prompt,
        reasoning: result.object.strategy,
        result: JSON.stringify(result.object),
        status: 'PENDING_CONFIRMATION',
      }
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[CMS_GENERATE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
