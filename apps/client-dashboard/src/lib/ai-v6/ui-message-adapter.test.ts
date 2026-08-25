import {
  applyStreamChunkToMessage,
  convertLegacyMessageToUIMessage,
  extractPlainTextFromUIMessage,
  extractReasoningTextFromUIMessage,
  extractToolInvocationsFromUIMessage,
  UIMessageV6,
} from './ui-message-adapter';

describe('ui-message-adapter', () => {
  describe('applyStreamChunkToMessage', () => {
    it('accumulates text-delta chunks into a single text part', () => {
      let msg: UIMessageV6 = {
        id: 'msg-1',
        role: 'assistant',
        parts: [],
      };

      msg = applyStreamChunkToMessage(msg, {
        type: 'text-delta',
        textDelta: 'Hello, ',
      });
      msg = applyStreamChunkToMessage(msg, {
        type: 'text-delta',
        textDelta: 'resident!',
      });

      expect(msg.parts.length).toBe(1);
      expect(msg.parts[0]).toEqual({ type: 'text', text: 'Hello, resident!' });
      expect(extractPlainTextFromUIMessage(msg)).toBe('Hello, resident!');
    });

    it('accumulates reasoning-delta into a reasoning part', () => {
      let msg: UIMessageV6 = {
        id: 'msg-2',
        role: 'assistant',
        parts: [],
      };

      msg = applyStreamChunkToMessage(msg, {
        type: 'reasoning-delta',
        reasoningDelta: 'Analyzing ',
      });
      msg = applyStreamChunkToMessage(msg, {
        type: 'reasoning-delta',
        reasoningDelta: 'gate telemetry...',
      });

      expect(msg.parts.length).toBe(1);
      expect(msg.parts[0]).toEqual({
        type: 'reasoning',
        reasoning: 'Analyzing gate telemetry...',
      });
      expect(extractReasoningTextFromUIMessage(msg)).toBe(
        'Analyzing gate telemetry...'
      );
    });

    it('records tool-call and updates state on tool-result', () => {
      let msg: UIMessageV6 = {
        id: 'msg-3',
        role: 'assistant',
        parts: [],
      };

      msg = applyStreamChunkToMessage(msg, {
        type: 'tool-call',
        toolCallId: 'call-pass-123',
        toolName: 'issueGuestPass',
        args: { unitId: 'Villa 104', visitorName: 'John Doe' },
      });

      expect(msg.parts.length).toBe(1);
      expect(msg.parts[0].type).toBe('tool-invocation');

      const invocationsBefore = extractToolInvocationsFromUIMessage(msg);
      expect(invocationsBefore[0].state).toBe('call');

      msg = applyStreamChunkToMessage(msg, {
        type: 'tool-result',
        toolCallId: 'call-pass-123',
        result: { passId: 'pass-999', status: 'GRANTED' },
      });

      const invocationsAfter = extractToolInvocationsFromUIMessage(msg);
      expect(invocationsAfter[0].state).toBe('result');
      expect(invocationsAfter[0].result).toEqual({
        passId: 'pass-999',
        status: 'GRANTED',
      });
    });
  });

  describe('convertLegacyMessageToUIMessage', () => {
    it('converts flat message to UIMessageV6 structure', () => {
      const legacy = {
        id: 'leg-1',
        role: 'user',
        content: 'Open Gate 2 for delivery.',
        createdAt: '2026-08-24T12:00:00.000Z',
      };

      const uiMsg = convertLegacyMessageToUIMessage(legacy);
      expect(uiMsg.id).toBe('leg-1');
      expect(uiMsg.role).toBe('user');
      expect(uiMsg.parts.length).toBe(1);
      expect(uiMsg.parts[0]).toEqual({
        type: 'text',
        text: 'Open Gate 2 for delivery.',
      });
      expect(uiMsg.createdAt).toBe('2026-08-24T12:00:00.000Z');
    });
  });
});
