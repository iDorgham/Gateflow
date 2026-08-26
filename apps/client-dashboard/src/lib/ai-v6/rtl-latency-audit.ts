import {
  applyStreamChunkToMessage,
  UIMessageV6,
  StreamChunk,
} from './ui-message-adapter';

export interface RtlAuditResult {
  isCompliant: boolean;
  testedKeysCount: number;
  invalidKeys: string[];
  direction: 'rtl' | 'ltr';
}

export interface LatencyBenchmarkResult {
  chunksProcessed: number;
  totalProcessingTimeMs: number;
  averageChunkLatencyMs: number;
  isUnderTarget: boolean;
}

/**
 * Audits AI Assistant Arabic strings for Unicode compliance and RTL layout alignment.
 */
export function auditArabicRtlAssistantStrings(
  dictionary: Record<string, string>
): RtlAuditResult {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const invalidKeys: string[] = [];

  const entries = Object.entries(dictionary);
  for (const [key, value] of entries) {
    if (!value || !arabicRegex.test(value)) {
      invalidKeys.push(key);
    }
  }

  return {
    isCompliant: invalidKeys.length === 0,
    testedKeysCount: entries.length,
    invalidKeys,
    direction: 'rtl',
  };
}

/**
 * Benchmarks the multi-part stream parser and chunk accumulator for high-speed streaming throughput.
 */
export function benchmarkStreamAccumulatorLatency(
  chunkCount: number = 100
): LatencyBenchmarkResult {
  let msg: UIMessageV6 = {
    id: 'bench-msg-1',
    role: 'assistant',
    parts: [],
  };

  const startTime = performance.now();

  for (let i = 0; i < chunkCount; i++) {
    const chunk: StreamChunk =
      i % 5 === 0
        ? {
            type: 'reasoning-delta',
            reasoningDelta: `Step ${i}: analyzing security posture. `,
          }
        : i % 10 === 0
          ? {
              type: 'tool-call',
              toolCallId: `call-${i}`,
              toolName: 'searchResidents',
              args: { query: 'Alex' },
            }
          : { type: 'text-delta', textDelta: `Token ${i} ` };

    msg = applyStreamChunkToMessage(msg, chunk);
  }

  const endTime = performance.now();
  const totalProcessingTimeMs = endTime - startTime;
  const averageChunkLatencyMs = totalProcessingTimeMs / chunkCount;

  // Target: < 150ms total, < 5ms per chunk
  const isUnderTarget =
    totalProcessingTimeMs < 150 && averageChunkLatencyMs < 5;

  return {
    chunksProcessed: chunkCount,
    totalProcessingTimeMs,
    averageChunkLatencyMs,
    isUnderTarget,
  };
}
