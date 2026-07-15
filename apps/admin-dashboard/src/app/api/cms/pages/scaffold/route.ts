import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { goal, industry, organizationName } = await req.json();

    const result = await generateObject({
      model: google('gemini-1.5-pro'), // Use Pro for better copy generation
      system: `You are an expert Direct Response Copywriter and Landing Page Architect. 
      Your task is to generate a high-converting landing page structure and copy for a company named "${organizationName}" in the "${industry}" industry.
      The primary goal of this page is: "${goal}".
      
      Instructions:
      1. Generate a logical flow of sections (Hero -> Features -> Social Proof -> Pricing -> FAQ -> CTA).
      2. Provide copy in both English and Arabic.
      3. Use professional, persuasive, and industry-appropriate tone.
      4. Ensure Arabic copy is naturally phrased, not just machine-translated.`,
      prompt: `Scaffold a full landing page for ${organizationName}. Goal: ${goal}.`,
      schema: z.object({
        titleEn: z.string(),
        titleAr: z.string(),
        slug: z.string().describe('URL friendly slug'),
        sections: z.array(z.object({
          type: z.enum(['HERO', 'FEATURES', 'SOCIAL_PROOF', 'CTA', 'PRICING', 'FAQ', 'LEAD_FORM']),
          contentEn: z.any().describe('JSON content for the section in English'),
          contentAr: z.any().describe('JSON content for the section in Arabic'),
        }))
      }),
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[CMS_SCAFFOLD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
