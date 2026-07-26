import {
  clearLegacyAiTranscript,
  redactSensitiveAiText,
} from './transcript-privacy';

describe('AI transcript privacy', () => {
  it('removes the legacy persisted transcript from shared browser storage', () => {
    const removeItem = jest.fn();

    clearLegacyAiTranscript({ removeItem });

    expect(removeItem).toHaveBeenCalledWith('gateflow-ai-chat-v1');
  });

  it.each([
    ['email', 'Contact jane@example.com', 'Contact j***@example.com'],
    ['phone', 'Call +961 70 123 456', 'Call +961 70 *** 456'],
    ['bearer token', 'Bearer abc.def-123_SECRET', 'Bearer [REDACTED]'],
    ['API key assignment', 'api_key=super-secret-value', 'api_key=[REDACTED]'],
    ['GateFlow credential', 'Use gflv_0123456789abcdef', 'Use [REDACTED]'],
    [
      'JWT',
      'Token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature',
      'Token [REDACTED]',
    ],
  ])('redacts %s before durable logging', (_label, input, expected) => {
    expect(redactSensitiveAiText(input)).toBe(expected);
  });

  it('handles empty nullable values without leaking or throwing', () => {
    expect(redactSensitiveAiText(null)).toBe('');
    expect(redactSensitiveAiText(undefined)).toBe('');
  });
});
