import {
  getLockoutStatus,
  recordFailedPinAttempt,
  recordSuccessfulPinAttempt,
  resetLockoutState,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_MS,
} from './lockout-manager';

describe('lockout-manager', () => {
  beforeEach(() => {
    resetLockoutState();
  });

  it('starts in unlocked state with 3 attempts remaining', () => {
    const status = getLockoutStatus();
    expect(status).toEqual({
      isLockedOut: false,
      remainingSeconds: 0,
      failedAttempts: 0,
      attemptsRemaining: 3,
    });
  });

  it('decrements attempts remaining on failed attempt', () => {
    const status1 = recordFailedPinAttempt(1000);
    expect(status1.isLockedOut).toBe(false);
    expect(status1.failedAttempts).toBe(1);
    expect(status1.attemptsRemaining).toBe(2);

    const status2 = recordFailedPinAttempt(2000);
    expect(status2.isLockedOut).toBe(false);
    expect(status2.failedAttempts).toBe(2);
    expect(status2.attemptsRemaining).toBe(1);
  });

  it('triggers 60-second lockout on 3rd failed attempt', () => {
    const startTime = 10000;
    recordFailedPinAttempt(startTime);
    recordFailedPinAttempt(startTime + 1000);
    const lockStatus = recordFailedPinAttempt(startTime + 2000);

    expect(lockStatus.isLockedOut).toBe(true);
    expect(lockStatus.remainingSeconds).toBe(60);
    expect(lockStatus.attemptsRemaining).toBe(0);

    // 30 seconds into lockout
    const midStatus = getLockoutStatus(startTime + 2000 + 30000);
    expect(midStatus.isLockedOut).toBe(true);
    expect(midStatus.remainingSeconds).toBe(30);

    // After 60 seconds expire
    const expiredStatus = getLockoutStatus(
      startTime + 2000 + LOCKOUT_DURATION_MS + 1000
    );
    expect(expiredStatus.isLockedOut).toBe(false);
    expect(expiredStatus.remainingSeconds).toBe(0);
    expect(expiredStatus.attemptsRemaining).toBe(MAX_FAILED_ATTEMPTS);
  });

  it('resets failed attempts counter on successful PIN verification', () => {
    recordFailedPinAttempt(1000);
    recordFailedPinAttempt(2000);
    expect(getLockoutStatus().failedAttempts).toBe(2);

    recordSuccessfulPinAttempt();
    expect(getLockoutStatus().failedAttempts).toBe(0);
    expect(getLockoutStatus().attemptsRemaining).toBe(3);
  });
});
