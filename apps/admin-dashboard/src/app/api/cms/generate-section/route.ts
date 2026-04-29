import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const sectionSchema = z.object({
  en: z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    body: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    items: z
      .array(
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),
  }),
  ar: z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    body: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    items: z
      .array(
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const { prompt, blockType } = await req.json();

    const result = await generateObject({
      model: google('gemini-1.5-pro-latest'),
      schema: sectionSchema,
      prompt: `Generate marketing content for a ${blockType} section. ${prompt}`,
    });

    return NextResponse.json({ section: result.object });
  } catch (error: any) {
    console.error('Failed to generate section:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
