import {
  UIMessageV6,
  StreamChunk,
  applyStreamChunkToMessage,
} from './ui-message-adapter';
import {
  AgenticToolCall,
  createAgenticToolCall,
  ToolExecutionState,
} from './tool-lifecycle-engine';

export type AssistantConnectionStatus =
  'ready' | 'submitted' | 'streaming' | 'error';

export interface ToolCardViewModel {
  toolCallId: string;
  toolName: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  requiresApproval: boolean;
  state: ToolExecutionState;
  badgeColor: string;
}

export interface ClientAssistantState {
  messages: UIMessageV6[];
  status: AssistantConnectionStatus;
  pendingToolCalls: AgenticToolCall[];
  error?: string;
}

/**
 * Initializes the client assistant state.
 */
export function initClientAssistantState(
  initialMessages: UIMessageV6[] = []
): ClientAssistantState {
  return {
    messages: initialMessages,
    status: 'ready',
    pendingToolCalls: [],
  };
}

/**
 * Handles dispatching a new user prompt to the assistant store.
 */
export function handleUserSendMessage(
  state: ClientAssistantState,
  promptText: string
): { state: ClientAssistantState; userMessage: UIMessageV6 } {
  const cleanPrompt = promptText.trim();
  if (!cleanPrompt) {
    return { state, userMessage: state.messages[state.messages.length - 1] };
  }

  const userMessage: UIMessageV6 = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: 'user',
    parts: [{ type: 'text', text: cleanPrompt }],
    createdAt: new Date().toISOString(),
  };

  const placeholderAssistant: UIMessageV6 = {
    id: `ast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: 'assistant',
    parts: [],
    createdAt: new Date().toISOString(),
  };

  return {
    state: {
      ...state,
      messages: [...state.messages, userMessage, placeholderAssistant],
      status: 'submitted',
      error: undefined,
    },
    userMessage,
  };
}

/**
 * Applies an incoming stream chunk to the active assistant message and tracks tool calls.
 */
export function handleAssistantStreamChunk(
  state: ClientAssistantState,
  chunk: StreamChunk
): ClientAssistantState {
  if (state.messages.length === 0) return state;

  const messages = [...state.messages];
  const lastIndex = messages.length - 1;
  const lastMsg = messages[lastIndex];

  if (lastMsg.role !== 'assistant') {
    return state;
  }

  const updatedMsg = applyStreamChunkToMessage(lastMsg, chunk);
  messages[lastIndex] = updatedMsg;

  let pendingToolCalls = [...state.pendingToolCalls];

  if (chunk.type === 'tool-call' && chunk.toolCallId && chunk.toolName) {
    const toolCall = createAgenticToolCall(
      chunk.toolCallId,
      chunk.toolName,
      chunk.args || {}
    );
    pendingToolCalls.push(toolCall);
  } else if (chunk.type === 'tool-result' && chunk.toolCallId) {
    pendingToolCalls = pendingToolCalls.map((tc) =>
      tc.toolCallId === chunk.toolCallId
        ? {
            ...tc,
            state: chunk.error ? 'failed' : 'completed',
            result: chunk.result,
            error: chunk.error,
          }
        : tc
    );
  }

  const status: AssistantConnectionStatus =
    chunk.type === 'finish' ? 'ready' : 'streaming';

  return {
    ...state,
    messages,
    pendingToolCalls,
    status,
  };
}

/**
 * Builds localized presentation view model for interactive tool cards.
 */
export function buildToolCardViewModel(
  call: AgenticToolCall
): ToolCardViewModel {
  let titleEn = 'System Action';
  let titleAr = 'إجراء النظام';
  let descriptionEn = `Invoking ${call.toolName}`;
  let descriptionAr = `تنفيذ ${call.toolName}`;

  switch (call.toolName) {
    case 'issueGuestPass':
      titleEn = 'Issue Guest Access Pass';
      titleAr = 'إصدار تصريح دخول زائر';
      descriptionEn = `Generate signed entry QR for ${call.args.visitorName || 'Visitor'} at Unit ${call.args.unitId || 'N/A'}`;
      descriptionAr = `إنشاء تصريح دخول رقمي للزائر ${call.args.visitorName || ''} للوحدة ${call.args.unitId || ''}`;
      break;

    case 'searchResidents':
      titleEn = 'Resident Directory Search';
      titleAr = 'البحث في دليل السكان';
      descriptionEn = `Query residents matching "${call.args.query || ''}"`;
      descriptionAr = `البحث عن السكان المطابقين لـ "${call.args.query || ''}"`;
      break;

    case 'getGateTelemetry':
      titleEn = 'Gate Telemetry & Health';
      titleAr = 'حالة البوابات والمعدات';
      descriptionEn = `Retrieve live scanner status for ${call.args.gateId || 'all gates'}`;
      descriptionAr = `استعلام الحالة المباشرة للبوابة ${call.args.gateId || 'جميع البوابات'}`;
      break;

    case 'lockdownGate':
      titleEn = 'Gate Perimeter Lockdown';
      titleAr = 'إغلاق أمني للبوابة';
      descriptionEn = `Immediately close barrier at ${call.args.gateId || 'Gate'}`;
      descriptionAr = `إغلاق فوري للحاجز في ${call.args.gateId || 'البوابة'}`;
      break;
  }

  let badgeColor = '#0052CC'; // ADS B400 Blue (Default)
  if (call.state === 'requires-action') {
    badgeColor = '#FFAB00'; // ADS Warning Yellow
  } else if (call.state === 'completed') {
    badgeColor = '#36B37E'; // ADS Success Green
  } else if (call.state === 'failed' || call.state === 'rejected') {
    badgeColor = '#FF5630'; // ADS Danger Red
  }

  return {
    toolCallId: call.toolCallId,
    toolName: call.toolName,
    titleEn,
    titleAr,
    descriptionEn,
    descriptionAr,
    requiresApproval: call.isDangerous && call.state === 'requires-action',
    state: call.state,
    badgeColor,
  };
}
