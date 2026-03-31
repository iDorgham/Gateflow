import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const eventPayloadSchema = z.object({
  eventVersion: z.string().min(1),
  eventId: z.string().min(1),
  occurredAt: z.string().min(1),
  intent: z.enum(['demo', 'pilot', 'migration', 'consult']),
  locale: z.enum(['en', 'ar-EG']),
  surface: z.string().min(1),
  funnelStage: z.enum([
    'landing',
    'cta_click',
    'lead_submit',
    'qualified',
    'first_scan',
  ]),
  organizationId: z.string().nullable(),
  leadId: z.string().nullable(),
  scanId: z.string().nullable(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .default({}),
});

const bodySchema = z.object({
  eventName: z.enum(['mkt_intent_cta_clicked', 'mkt_funnel_stage_progressed']),
  payload: eventPayloadSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid intent event payload' },
        { status: 400 }
      );
    }

    // Phase 02 contract: emit standardized events now, wire persistence in later phases.
    console.info(
      '[marketing-intent-event]',
      parsed.data.eventName,
      parsed.data.payload
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[marketing-intent-event] failed', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process intent event' },
      { status: 500 }
    );
  }
}
