import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/dashboard-auth';
import { AiActionService } from '@/lib/ai/ai-action-service';

const FeedbackSchema = z.object({
  feedback: z.enum(['THUMBS_UP', 'THUMBS_DOWN']),
});

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await requireAuth();
    if (!session || !session.user.organizationId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const parsed = FeedbackSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    const updated = await AiActionService.submitFeedback({
      actionId: params.id,
      organizationId: session.user.organizationId,
      userId: session.user.id,
      feedback: parsed.data.feedback,
    });
    if (!updated) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('>>> [AiFeedback API] Fatal Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
