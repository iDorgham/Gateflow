import { shouldLock } from './inactivity';

describe('shouldLock', () => {
  it('does not lock before the timeout elapses', () => {
    expect(shouldLock(1000, 1000 + 4_999, 5_000)).toBe(false);
  });

  it('locks exactly at the timeout boundary', () => {
    expect(shouldLock(1000, 1000 + 5_000, 5_000)).toBe(true);
  });

  it('locks once the timeout is exceeded', () => {
    expect(shouldLock(1000, 1000 + 60_000, 5_000)).toBe(true);
  });

  it('treats a lastActivity in the future as not-yet-due (never negative-locks)', () => {
    expect(shouldLock(10_000, 1_000, 5_000)).toBe(false);
  });

  it('locks immediately when timeoutMs is zero and any time has passed', () => {
    expect(shouldLock(1000, 1001, 0)).toBe(true);
  });
});
