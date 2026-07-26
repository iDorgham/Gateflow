const LEGACY_AI_TRANSCRIPT_STORAGE_KEY = 'gateflow-ai-chat-v1';

type RemovableStorage = Pick<Storage, 'removeItem'>;

/**
 * AI conversations are intentionally memory-only. Remove transcripts written by
 * older releases so a shared browser cannot expose a previous operator's chat.
 */
export function clearLegacyAiTranscript(storage: RemovableStorage): void {
  storage.removeItem(LEGACY_AI_TRANSCRIPT_STORAGE_KEY);
}

/**
 * Remove common identifiers and credentials before AI prompts or results enter
 * durable operational logs. This is a defensive filter, not an authorization
 * boundary.
 */
export function redactSensitiveAiText(text: string | null | undefined): string {
  if (!text) return '';

  let redacted = text
    .replace(
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      '[REDACTED]'
    )
    .replace(/\bgflv_[A-Fa-f0-9]{16,}\b/g, '[REDACTED]')
    .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+/gi, 'Bearer [REDACTED]')
    .replace(
      /\b(api[_-]?key|access[_-]?token|secret)\s*([=:])\s*[^\s,;]+/gi,
      '$1$2[REDACTED]'
    );

  redacted = redacted.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    (match) => `${match[0]}***${match.slice(match.indexOf('@'))}`
  );

  redacted = redacted.replace(
    /(\+?\d{1,3}[-.\s]+\d{2,4})[-.\s]+\d{3,4}[-.\s]+(\d{3,4})\b/g,
    '$1 *** $2'
  );

  return redacted;
}
