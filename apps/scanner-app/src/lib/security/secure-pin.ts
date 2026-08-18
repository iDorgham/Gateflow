import * as SecureStore from 'expo-secure-store';

/** Device unlock PIN set during scanner onboarding. */
export const DEVICE_PIN_KEY = 'GATEFLOW_SCANNER_PIN';
/** Optional dedicated PIN for supervisor override (Settings). */
export const SUPERVISOR_PIN_KEY = 'supervisor_pin';

function isValidDevicePin(pin: string): boolean {
  return /^\d{4}$|^\d{6}$/.test(pin);
}

function pinsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function hasSecurePIN(): Promise<boolean> {
  try {
    const pin = await SecureStore.getItemAsync(DEVICE_PIN_KEY);
    return pin !== null && isValidDevicePin(pin);
  } catch (error) {
    console.error('[SecurePINStorage] Error checking PIN:', error);
    return false;
  }
}

export async function setSecurePIN(pin: string): Promise<boolean> {
  if (!isValidDevicePin(pin)) {
    throw new Error('PIN must be 4 or 6 digits');
  }

  try {
    await SecureStore.setItemAsync(DEVICE_PIN_KEY, pin);
    return true;
  } catch (error) {
    console.error('[SecurePINStorage] Error setting PIN:', error);
    throw new Error('Could not save PIN on this device', { cause: error });
  }
}

export async function verifySecurePIN(pin: string): Promise<boolean> {
  try {
    const storedPin = await SecureStore.getItemAsync(DEVICE_PIN_KEY);
    if (!storedPin) return false;
    return pinsMatch(pin, storedPin);
  } catch (error) {
    console.error('[SecurePINStorage] Error verifying PIN:', error);
    return false;
  }
}

export async function clearSecurePIN(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(DEVICE_PIN_KEY);
    return true;
  } catch (error) {
    console.error('[SecurePINStorage] Error clearing PIN:', error);
    return false;
  }
}

export async function hasOverridePin(): Promise<boolean> {
  try {
    const supervisor = await SecureStore.getItemAsync(SUPERVISOR_PIN_KEY);
    if (supervisor) return true;
    return hasSecurePIN();
  } catch (error) {
    console.error('[SecurePINStorage] Error checking override PIN:', error);
    return false;
  }
}

/**
 * Supervisor override: dedicated Settings PIN if set, otherwise the device unlock PIN.
 */
export async function verifyOverridePin(pin: string): Promise<boolean> {
  try {
    const supervisor = await SecureStore.getItemAsync(SUPERVISOR_PIN_KEY);
    if (supervisor) return pinsMatch(pin, supervisor);
    return verifySecurePIN(pin);
  } catch (error) {
    console.error('[SecurePINStorage] Error verifying override PIN:', error);
    return false;
  }
}
