import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { requireAuth } from '@/lib/dashboard-auth';
import { getOrganizationContext } from '@/lib/ai/context-providers';

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

    // 2. Fetch real-time data context for the organization
    const orgContext = await getOrganizationContext(session.user.organizationId);

    // 3. Initialize the Gemini model
    const model = google('gemini-1.5-flash');

    // 4. Enhanced System prompt for GateAI (data-aware)
    const systemPrompt = `You are GateAI, an intelligent operations agent for GateFlow.
You are helping staff in the organization: ${session.org?.name || 'GateFlow'}.
Your role is to provide factual answers and operational assistance based on the data provided below.

### Organization Context (Real-time Snapshot):
${orgContext ? JSON.stringify(orgContext, null, 2) : 'No data available.'}

### Operational Guidelines:
1. Use the data in the context above to answer factual questions (e.g., scan counts, active gates, project names).
2. If data is unavailable or the answer isn't in the context, politely state that you don't have that specific information yet.
3. You are currently in "Read-only" mode. You can explain how GateFlow works and report on data, but you cannot perform actions (mutations) yet.
4. If asked to perform an action (e.g., "create a QR" or "delete a project"), politely explain that mutation capabilities are coming in future phases.
5. Your tone is helpful, professional, and efficient. 
6. Speak in the user's language (supported: Arabic, English).`;

    // 5. Stream the text back to the client
    const result = streamText({
      model,
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('GateAI Error:', error);
    return new Response('AI Assistant Error', { status: 500 });
  }
}
