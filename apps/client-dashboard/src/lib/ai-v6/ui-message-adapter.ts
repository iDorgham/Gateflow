export interface TextUIPart {
  type: 'text';
  text: string;
}

export interface ReasoningUIPart {
  type: 'reasoning';
  reasoning: string;
  details?: {
    signature?: string;
  };
}

export interface ToolInvocationUIPart {
  type: 'tool-invocation';
  toolInvocation: {
    toolCallId: string;
    toolName: string;
    args: Record<string, any>;
    state: 'call' | 'result' | 'error';
    result?: any;
    error?: string;
  };
}

export type UIPart = TextUIPart | ReasoningUIPart | ToolInvocationUIPart;

export interface UIMessageV6 {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  parts: UIPart[];
  createdAt?: string;
}

export interface StreamChunk {
  type:
    'text-delta' | 'reasoning-delta' | 'tool-call' | 'tool-result' | 'finish';
  textDelta?: string;
  reasoningDelta?: string;
  toolCallId?: string;
  toolName?: string;
  args?: Record<string, any>;
  result?: any;
  error?: string;
}

/**
 * Applies a stream chunk to an in-flight UIMessageV6, appending or updating parts immutably.
 */
export function applyStreamChunkToMessage(
  currentMessage: UIMessageV6,
  chunk: StreamChunk
): UIMessageV6 {
  const parts = [...currentMessage.parts];

  switch (chunk.type) {
    case 'text-delta': {
      if (!chunk.textDelta) return currentMessage;
      const lastPartIndex = parts.length - 1;
      if (lastPartIndex >= 0 && parts[lastPartIndex].type === 'text') {
        const lastPart = parts[lastPartIndex] as TextUIPart;
        parts[lastPartIndex] = {
          ...lastPart,
          text: lastPart.text + chunk.textDelta,
        };
      } else {
        parts.push({
          type: 'text',
          text: chunk.textDelta,
        });
      }
      break;
    }

    case 'reasoning-delta': {
      if (!chunk.reasoningDelta) return currentMessage;
      const lastPartIndex = parts.length - 1;
      if (lastPartIndex >= 0 && parts[lastPartIndex].type === 'reasoning') {
        const lastPart = parts[lastPartIndex] as ReasoningUIPart;
        parts[lastPartIndex] = {
          ...lastPart,
          reasoning: lastPart.reasoning + chunk.reasoningDelta,
        };
      } else {
        parts.push({
          type: 'reasoning',
          reasoning: chunk.reasoningDelta,
        });
      }
      break;
    }

    case 'tool-call': {
      if (!chunk.toolCallId || !chunk.toolName) return currentMessage;
      parts.push({
        type: 'tool-invocation',
        toolInvocation: {
          toolCallId: chunk.toolCallId,
          toolName: chunk.toolName,
          args: chunk.args || {},
          state: 'call',
        },
      });
      break;
    }

    case 'tool-result': {
      if (!chunk.toolCallId) return currentMessage;
      const toolIndex = parts.findIndex(
        (p) =>
          p.type === 'tool-invocation' &&
          p.toolInvocation.toolCallId === chunk.toolCallId
      );
      if (toolIndex >= 0) {
        const existing = parts[toolIndex] as ToolInvocationUIPart;
        parts[toolIndex] = {
          ...existing,
          toolInvocation: {
            ...existing.toolInvocation,
            state: chunk.error ? 'error' : 'result',
            result: chunk.result,
            error: chunk.error,
          },
        };
      }
      break;
    }

    case 'finish':
      // No-op for chunk accumulation
      break;
  }

  return {
    ...currentMessage,
    parts,
  };
}

/**
 * Converts a legacy flat message { id, role, content } into a normalized multi-part UIMessageV6.
 */
export function convertLegacyMessageToUIMessage(legacy: {
  id?: string;
  role: string;
  content: string;
  createdAt?: Date | string;
}): UIMessageV6 {
  const parts: UIPart[] = [];

  if (legacy.content && legacy.content.trim().length > 0) {
    parts.push({
      type: 'text',
      text: legacy.content,
    });
  }

  const role = (
    ['user', 'assistant', 'system', 'data'].includes(legacy.role)
      ? legacy.role
      : 'assistant'
  ) as UIMessageV6['role'];

  const createdAt = legacy.createdAt
    ? typeof legacy.createdAt === 'string'
      ? legacy.createdAt
      : legacy.createdAt.toISOString()
    : new Date().toISOString();

  return {
    id:
      legacy.id ||
      `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    role,
    parts,
    createdAt,
  };
}

/**
 * Extracts concatenated plain text content from a multi-part UIMessageV6.
 */
export function extractPlainTextFromUIMessage(msg: UIMessageV6): string {
  return msg.parts
    .filter((p): p is TextUIPart => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

/**
 * Extracts combined reasoning content from a multi-part UIMessageV6.
 */
export function extractReasoningTextFromUIMessage(
  msg: UIMessageV6
): string | undefined {
  const reasoningParts = msg.parts.filter(
    (p): p is ReasoningUIPart => p.type === 'reasoning'
  );
  if (reasoningParts.length === 0) return undefined;
  return reasoningParts.map((p) => p.reasoning).join('\n');
}

/**
 * Extracts all tool invocations from a multi-part UIMessageV6.
 */
export function extractToolInvocationsFromUIMessage(
  msg: UIMessageV6
): ToolInvocationUIPart['toolInvocation'][] {
  return msg.parts
    .filter((p): p is ToolInvocationUIPart => p.type === 'tool-invocation')
    .map((p) => p.toolInvocation);
}
