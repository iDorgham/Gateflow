import {
  evaluateDeviceUnlockRequirement,
  isDeviceUnlockSatisfied,
} from './device-unlock';

describe('evaluateDeviceUnlockRequirement', () => {
  it('does not require unlock when neither PIN nor biometry is enrolled', () => {
    expect(
      evaluateDeviceUnlockRequirement({
        hasPin: false,
        biometryEnrolled: false,
      })
    ).toEqual({
      requiresUnlock: false,
      allowBiometry: false,
      allowPin: false,
    });
  });

  it('requires unlock when PIN is enrolled', () => {
    expect(
      evaluateDeviceUnlockRequirement({
        hasPin: true,
        biometryEnrolled: false,
      })
    ).toEqual({
      requiresUnlock: true,
      allowBiometry: false,
      allowPin: true,
    });
  });

  it('requires unlock when biometry is enrolled', () => {
    expect(
      evaluateDeviceUnlockRequirement({
        hasPin: false,
        biometryEnrolled: true,
      })
    ).toEqual({
      requiresUnlock: true,
      allowBiometry: true,
      allowPin: false,
    });
  });

  it('allows both PIN and biometry when both are enrolled', () => {
    expect(
      evaluateDeviceUnlockRequirement({
        hasPin: true,
        biometryEnrolled: true,
      })
    ).toEqual({
      requiresUnlock: true,
      allowBiometry: true,
      allowPin: true,
    });
  });
});

describe('isDeviceUnlockSatisfied', () => {
  it('is false until unlock succeeds when required', () => {
    expect(
      isDeviceUnlockSatisfied({
        requiresUnlock: true,
        unlocked: false,
      })
    ).toBe(false);
  });

  it('is true after unlock succeeds when required', () => {
    expect(
      isDeviceUnlockSatisfied({
        requiresUnlock: true,
        unlocked: true,
      })
    ).toBe(true);
  });

  it('is true when unlock is not required', () => {
    expect(
      isDeviceUnlockSatisfied({
        requiresUnlock: false,
        unlocked: false,
      })
    ).toBe(true);
  });
});
