/**
 * In-memory grace period and background inactivity threshold manager for guard biometric security.
 */

export const DEFAULT_GRACE_PERIOD_MS = 5 * 60 * 1000; // 5 minutes
export const DEFAULT_INACTIVITY_LOCK_MS = 2 * 60 * 1000; // 2 minutes

let lastAuthTimestamp: number | null = null;
let backgroundedTimestamp: number | null = null;

/**
 * Records a successful biometric or PIN unlock timestamp.
 */
export function recordSuccessfulAuth(now: number = Date.now()): void {
  lastAuthTimestamp = now;
}

/**
 * Checks whether the guard is currently within the active grace period.
 */
export function isGracePeriodValid(
  now: number = Date.now(),
  gracePeriodMs: number = DEFAULT_GRACE_PERIOD_MS
): boolean {
  if (lastAuthTimestamp === null) return false;
  return now - lastAuthTimestamp < gracePeriodMs;
}

/**
 * Records the timestamp when the app enters the background.
 */
export function recordBackgroundTransition(now: number = Date.now()): void {
  backgroundedTimestamp = now;
}

/**
 * Evaluates whether returning to the foreground requires biometric re-authentication.
 */
export function shouldRequireInactivityUnlock(
  foregroundTime: number = Date.now(),
  inactivityThresholdMs: number = DEFAULT_INACTIVITY_LOCK_MS
): boolean {
  if (backgroundedTimestamp === null) return false;
  const elapsed = foregroundTime - backgroundedTimestamp;
  return elapsed >= inactivityThresholdMs;
}

/**
 * Resets all session timestamps (e.g. on guard shift end or logout).
 */
export function resetSessionSecurityState(): void {
  lastAuthTimestamp = null;
  backgroundedTimestamp = null;
}

/**
 * Gets remaining grace period milliseconds (or 0 if expired).
 */
export function getRemainingGraceMs(
  now: number = Date.now(),
  gracePeriodMs: number = DEFAULT_GRACE_PERIOD_MS
): number {
  if (lastAuthTimestamp === null) return 0;
  const elapsed = now - lastAuthTimestamp;
  const remaining = gracePeriodMs - elapsed;
  return remaining > 0 ? remaining : 0;
}
