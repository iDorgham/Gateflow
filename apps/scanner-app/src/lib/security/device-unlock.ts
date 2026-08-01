export type DeviceUnlockRequirement = {
  requiresUnlock: boolean;
  allowBiometry: boolean;
  allowPin: boolean;
};

/**
 * Unlock is required only when a device PIN and/or biometry is enrolled.
 * First-run devices without enrollment skip the gate (wizard enrolls in Phase 02).
 */
export function evaluateDeviceUnlockRequirement(input: {
  hasPin: boolean;
  biometryEnrolled: boolean;
}): DeviceUnlockRequirement {
  const allowPin = Boolean(input.hasPin);
  const allowBiometry = Boolean(input.biometryEnrolled);
  return {
    requiresUnlock: allowPin || allowBiometry,
    allowBiometry,
    allowPin,
  };
}

export function isDeviceUnlockSatisfied(input: {
  requiresUnlock: boolean;
  unlocked: boolean;
}): boolean {
  if (!input.requiresUnlock) return true;
  return Boolean(input.unlocked);
}
