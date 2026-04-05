# @gateflow/ai

AI-first presentation toolkit for the GateFlow design system.

Focuses on streaming-aware components, tool invocation UI, and accessible chat layouts.

## Features

- **Streaming-Aware**: Native `StreamingIndicator` for assistant responses.
- **Tool-First**: `ToolCallCard` for displaying status and results of LLM tool usage.
- **RTL-Safe**: Designed for bidirectional layout and logical alignment.
- **Vendor-Neutral**: Decoupled from specific LLM providers; compatible with Vercel AI SDK or custom streams.

## Installation

```bash
pnpm add @gateflow/ai
```

## Basic Usage

```tsx
import {
  Conversation,
  Message,
  MessageAvatar,
  ChatInputShell,
} from '@gateflow/ai';

export function ChatView() {
  return (
    <Conversation>
      <Message
        role="assistant"
        content="Hello! How can I help you today?"
        timestamp="10:00 AM"
      />
      <Message
        role="user"
        content="Can you show me the last system report?"
        timestamp="10:01 AM"
      />
    </Conversation>
  );
}
```

## Tool Incarnation Example

```tsx
import { ToolCallCard } from '@gateflow/ai';
import { Database } from 'lucide-react';

<ToolCallCard
  name="query_workspace_db"
  status="success"
  icon={Database}
  arguments={{ query: 'SELECT * FROM metrics' }}
  result={<Table data={...} />}
/>
```

## Peer Dependencies

While the core is headless, this toolkit works best when paired with `@gateflow/ui` (primitives) and `@gateflow/theme` (ThemeProvider).

Optional peer dependencies:

- `ai` / `@ai-sdk/react` (for seamless integration with Vercel AI)
