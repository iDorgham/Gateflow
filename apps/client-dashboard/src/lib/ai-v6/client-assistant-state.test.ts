import {
  initClientAssistantState,
  handleUserSendMessage,
  handleAssistantStreamChunk,
  buildToolCardViewModel,
} from './client-assistant-state';
import { createAgenticToolCall } from './tool-lifecycle-engine';

describe('client-assistant-state', () => {
  describe('initClientAssistantState', () => {
    it('initializes clean state', () => {
      const state = initClientAssistantState();
      expect(state.status).toBe('ready');
      expect(state.messages).toEqual([]);
      expect(state.pendingToolCalls).toEqual([]);
    });
  });

  describe('handleUserSendMessage', () => {
    it('appends user message and placeholder assistant with submitted status', () => {
      const initial = initClientAssistantState();
      const { state, userMessage } = handleUserSendMessage(
        initial,
        'Please issue pass for Alex'
      );

      expect(state.messages.length).toBe(2);
      expect(state.status).toBe('submitted');
      expect(userMessage.role).toBe('user');
      expect(userMessage.parts[0]).toEqual({
        type: 'text',
        text: 'Please issue pass for Alex',
      });
      expect(state.messages[1].role).toBe('assistant');
    });
  });

  describe('handleAssistantStreamChunk', () => {
    it('updates assistant message parts and tracks tool call lifecycle', () => {
      const initial = initClientAssistantState();
      const { state: sentState } = handleUserSendMessage(initial, 'Issue pass');

      // Stream text chunk
      let state = handleAssistantStreamChunk(sentState, {
        type: 'text-delta',
        textDelta: 'Sure, preparing pass...',
      });
      expect(state.status).toBe('streaming');
      expect(state.messages[1].parts[0]).toEqual({
        type: 'text',
        text: 'Sure, preparing pass...',
      });

      // Stream tool call chunk
      state = handleAssistantStreamChunk(state, {
        type: 'tool-call',
        toolCallId: 'tc-99',
        toolName: 'issueGuestPass',
        args: { visitorName: 'Alex', unitId: 'Villa 104' },
      });
      expect(state.pendingToolCalls.length).toBe(1);
      expect(state.pendingToolCalls[0].toolName).toBe('issueGuestPass');
      expect(state.pendingToolCalls[0].state).toBe('requires-action');

      // Stream tool result chunk
      state = handleAssistantStreamChunk(state, {
        type: 'tool-result',
        toolCallId: 'tc-99',
        result: { passId: 'pass-100', status: 'GRANTED' },
      });
      expect(state.pendingToolCalls[0].state).toBe('completed');

      // Stream finish chunk
      state = handleAssistantStreamChunk(state, { type: 'finish' });
      expect(state.status).toBe('ready');
    });
  });

  describe('buildToolCardViewModel', () => {
    it('creates bilingual card model with warning badge for dangerous pending tools', () => {
      const call = createAgenticToolCall('tc-100', 'issueGuestPass', {
        visitorName: 'Alex',
        unitId: 'Villa 104',
      });
      const card = buildToolCardViewModel(call);

      expect(card.titleEn).toBe('Issue Guest Access Pass');
      expect(card.titleAr).toBe('إصدار تصريح دخول زائر');
      expect(card.requiresApproval).toBe(true);
      expect(card.badgeColor).toBe('#FFAB00'); // Warning
    });

    it('creates success card model for completed tools', () => {
      const call = createAgenticToolCall('tc-101', 'searchResidents', {
        query: 'Sarah',
      });
      call.state = 'completed';
      const card = buildToolCardViewModel(call);

      expect(card.titleEn).toBe('Resident Directory Search');
      expect(card.requiresApproval).toBe(false);
      expect(card.badgeColor).toBe('#36B37E'); // Success
    });
  });
});
