import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { OVERRIDABLE_TOKENS } from '@/lib/branding-css-generator';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ orgId: string }> }
) {
  const params = await props.params;
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { prompt, currentVariables } = await req.json();

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      system: `You are an expert UI/UX Design Engineer. Your task is to translate natural language design requests into CSS token overrides for the GateFlow design system.
      
      Available Tokens (Whitelist):
      ${OVERRIDABLE_TOKENS.join(', ')}
      
      Current Token States:
      ${JSON.stringify(currentVariables)}
      
      Instructions:
      1. ONLY use tokens from the provided whitelist.
      2. Return HEX codes for colors.
      3. For typography, prioritize Arabic-friendly fonts (Cairo, Almarai, Tajawal) if RTL context is implied.
      4. Ensure color combinations maintain high contrast (WCAG AA).
      5. Only return the tokens that need to change.`,
      prompt: prompt,
      schema: z.object({
        updates: z.array(z.object({
          key: z.string().describe('The CSS variable key from the whitelist'),
          value: z.string().describe('The new CSS value (hex color, font-family, or radius)')
        }))
      }),
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('[STYLE_AI_EDIT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
