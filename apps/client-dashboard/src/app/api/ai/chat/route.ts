import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { requireAuth } from '@/lib/dashboard-auth';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Authenticate and get organization context
    const session = await requireAuth();
    if (!session || !session.user.organizationId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    // 2. Initialize the Gemini model
    const model = google('gemini-1.5-flash');

    // 3. System prompt for GateAI (scoping and personality)
    const systemPrompt = `You are GateAI, an intelligent operations agent for GateFlow.
You are helping staff in the organization: ${session.org?.name || 'GateFlow'}.
Your tone is helpful, professional, and efficient. 
You are currently in "Read-only" mode. You can explain how GateFlow works but cannot perform actions or view specific data yet.
If asked to perform an action, politely explain that mutation capabilities are coming in future phases.
Speak in the user's language (supported: Arabic, English).`;

    // 4. Stream the text back to the client
    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      // In future phases, we will add 'tools' here for data fetching
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('GateAI Error:', error);
    return new Response('AI Assistant Error', { status: 500 });
  }
}
