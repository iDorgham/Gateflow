# @gateflow/ai

Agentic AI UI components and patterns for the GateFlow Design System.
Designed for **Vercel AI SDK** integration.

## Installation

```bash
npm install @gateflow/ai @gateflow/ui @gateflow/tokens @gateflow/theme ai @ai-sdk/react
```

## Usage

### Chat Interfaces

```tsx
import { useChat } from 'ai/react';
import { ChatPanel, MessageCard, ThinkingIndicator } from '@gateflow/ai';

function MyAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <ChatPanel>
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          role={message.role}
          content={message.content}
        />
      ))}
      {isLoading && <ThinkingIndicator text="Sentinel is thinking..." />}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </ChatPanel>
  );
}
```

## Features

- **Agentic Patterns**: Specialized UI for streaming, reasoning, and tool call outputs.
- **Vercel AI Compatibility**: First-class support for `ai` and `@ai-sdk/react`.
- **Localized AI**: RTL support for Arabic chat interfaces and
  MENA-friendly typography.
- **Glassmorphism**: Premium, futuristic UI cards for intelligent assistants.
- **Safety**: Built-in interaction patterns for human-in-the-loop verification.
