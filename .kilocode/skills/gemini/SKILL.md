# SKILL: Google Gemini & Vercel AI SDK Integration

## Purpose
Standardize the implementation of AI-driven features in GateFlow v9.0 using Google Gemini 1.5 Flash and the Vercel AI SDK.

## Core Principles
1.  **Context-Aware Intelligence**: Always inject relevant operational context (Mission ID, Org IDs, Recent Logs) into the prompt to ensure accurate responses.
2.  **Streaming UI**: Utilize the Vercel AI SDK `useChat` and `useCompletion` hooks to provide an instant, streaming AI experience.
3.  **Function Calling (Tools)**: Leverage Gemini's tool-calling capabilities to perform real-world actions (e.g., "List Scans", "Get Mission Status").

## Implementation Rules
- **Model**: `gemini-1.5-flash` for the best balance of speed and intelligence.
- **Safety**: Apply strict safety filters and system prompt instructions to prevent halluniciations and off-topic responses.
- **UI Interaction**: Use the `gf-ai-ux-patterns` to handle structured AI responses (charts, cards, chips).

## Anti-Patterns
- Passing unvalidated user input directly to the prompt.
- Synchronous (non-streaming) AI responses in the UI (feels slow).
- Allowing the AI to perform destructive DB operations without a separate confirmation layer.

## Code Examples

### Vercel AI SDK API Route (Gemini)
```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: google('models/gemini-1.5-flash'),
    messages,
    system: "You are GateAI, the intelligent operations assistant for GateFlow. You help security managers with mission data and real-time alerts.",
  });

  return result.toDataStreamResponse();
}
```

### Function Calling (Tools) Definition
```typescript
const tools = {
  get_gate_status: {
    description: "Get the current lock/unlock status of a specific gate",
    parameters: z.object({ gateId: z.string() }),
    execute: async ({ gateId }) => { /* ... */ }
  }
};
```
