import {
  recordSuccessfulAuth,
  isGracePeriodValid,
  recordBackgroundTransition,
  shouldRequireInactivityUnlock,
  resetSessionSecurityState,
  getRemainingGraceMs,
  DEFAULT_GRACE_PERIOD_MS,
  DEFAULT_INACTIVITY_LOCK_MS,
} from './session-grace';

describe('session-grace', () => {
  beforeEach(() => {
    resetSessionSecurityState();
  });

  describe('isGracePeriodValid', () => {
    it('returns false when no auth has been recorded', () => {
      expect(isGracePeriodValid()).toBe(false);
    });

    it('returns true when within the 5-minute grace period', () => {
      const authTime = 1000000;
      recordSuccessfulAuth(authTime);

      // 4 minutes later
      const checkTime = authTime + 4 * 60 * 1000;
      expect(isGracePeriodValid(checkTime)).toBe(true);
    });

    it('returns false when elapsed time exceeds 5-minute grace period', () => {
      const authTime = 1000000;
      recordSuccessfulAuth(authTime);

      // 5 minutes and 1 millisecond later
      const checkTime = authTime + DEFAULT_GRACE_PERIOD_MS + 1;
      expect(isGracePeriodValid(checkTime)).toBe(false);
    });
  });

  describe('shouldRequireInactivityUnlock', () => {
    it('returns false if app was never backgrounded', () => {
      expect(shouldRequireInactivityUnlock()).toBe(false);
    });

    it('returns false if app was backgrounded for less than 2 minutes', () => {
      const bgTime = 2000000;
      recordBackgroundTransition(bgTime);

      // 1 minute later
      const fgTime = bgTime + 60 * 1000;
      expect(shouldRequireInactivityUnlock(fgTime)).toBe(false);
    });

    it('returns true if app was backgrounded for 2 minutes or longer', () => {
      const bgTime = 2000000;
      recordBackgroundTransition(bgTime);

      // 2 minutes later
      const fgTime = bgTime + DEFAULT_INACTIVITY_LOCK_MS;
      expect(shouldRequireInactivityUnlock(fgTime)).toBe(true);
    });
  });

  describe('getRemainingGraceMs', () => {
    it('returns 0 when no auth is recorded', () => {
      expect(getRemainingGraceMs()).toBe(0);
    });

    it('returns remaining milliseconds accurately', () => {
      const authTime = 5000000;
      recordSuccessfulAuth(authTime);

      // 2 minutes elapsed
      const now = authTime + 2 * 60 * 1000;
      expect(getRemainingGraceMs(now)).toBe(3 * 60 * 1000);
    });
  });

  describe('resetSessionSecurityState', () => {
    it('clears all session timestamps', () => {
      recordSuccessfulAuth(10000);
      recordBackgroundTransition(15000);

      resetSessionSecurityState();
      expect(isGracePeriodValid(11000)).toBe(false);
      expect(shouldRequireInactivityUnlock(100000)).toBe(false);
    });
  });
});
