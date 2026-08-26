/**
 * Anti-brute-force rate limiter and lockout manager for guard PIN verification.
 */

export const MAX_FAILED_ATTEMPTS = 3;
export const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

let failedAttempts = 0;
let lockoutExpiresAt: number | null = null;

export interface LockoutStatus {
  isLockedOut: boolean;
  remainingSeconds: number;
  failedAttempts: number;
  attemptsRemaining: number;
}

/**
 * Evaluates current lockout status.
 */
export function getLockoutStatus(now: number = Date.now()): LockoutStatus {
  if (lockoutExpiresAt !== null) {
    const remainingMs = lockoutExpiresAt - now;
    if (remainingMs > 0) {
      return {
        isLockedOut: true,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        failedAttempts,
        attemptsRemaining: 0,
      };
    }
    // Lockout has expired — reset timer
    lockoutExpiresAt = null;
    failedAttempts = 0;
  }

  return {
    isLockedOut: false,
    remainingSeconds: 0,
    failedAttempts,
    attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - failedAttempts),
  };
}

/**
 * Records a failed PIN attempt. Triggers 60s lockout upon reaching max attempts.
 */
export function recordFailedPinAttempt(
  now: number = Date.now()
): LockoutStatus {
  // If already locked out, keep existing lockout
  if (lockoutExpiresAt !== null && lockoutExpiresAt > now) {
    return getLockoutStatus(now);
  }

  failedAttempts += 1;

  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    lockoutExpiresAt = now + LOCKOUT_DURATION_MS;
  }

  return getLockoutStatus(now);
}

/**
 * Records a successful PIN entry, resetting failure counters.
 */
export function recordSuccessfulPinAttempt(): void {
  failedAttempts = 0;
  lockoutExpiresAt = null;
}

/**
 * Resets the lockout manager state (e.g., test cleanup or admin reset).
 */
export function resetLockoutState(): void {
  failedAttempts = 0;
  lockoutExpiresAt = null;
}
