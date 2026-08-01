/**
 * inactivity.ts
 *
 * Pure timeout-boundary check for BiometricGuard's inactivity re-lock.
 * A `lastActivityMs` in the future (clock skew, stale snapshot) never
 * locks — only elapsed time locks.
 */

export function shouldLock(
  lastActivityMs: number,
  nowMs: number,
  timeoutMs: number
): boolean {
  const elapsed = nowMs - lastActivityMs;
  return elapsed >= timeoutMs;
}
