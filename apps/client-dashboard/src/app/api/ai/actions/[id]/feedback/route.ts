
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/dashboard-auth';
import { AiActionService } from '@/lib/ai/ai-action-service';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await requireAuth();
    if (!session || !session.user.organizationId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { feedback } = await req.json();

    if (!['THUMBS_UP', 'THUMBS_DOWN'].includes(feedback)) {
      return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 });
    }

    await AiActionService.submitFeedback(params.id, feedback);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('>>> [AiFeedback API] Fatal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
