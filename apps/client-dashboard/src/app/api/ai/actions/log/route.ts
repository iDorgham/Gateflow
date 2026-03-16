
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/dashboard-auth';
import { AiActionService } from '@/lib/ai/ai-action-service';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session || !session.user.organizationId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { actionType, title, intentJson, prompt, metadata } = await req.json();

    const action = await AiActionService.createAction({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      actionType,
      prompt,
      intentJson,
      metadata,
    });

    return NextResponse.json({ success: true, actionId: action.id });

  } catch (error: any) {
    console.error('>>> [AiAction Log API] Fatal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
