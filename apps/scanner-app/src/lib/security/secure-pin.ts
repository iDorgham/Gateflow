import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

/**
 * Securely store and retrieve PINs used for scanner access or shift initialization.
 */
const PIN_KEY = 'GATEFLOW_SCANNER_PIN';

export async function hasSecurePIN(): Promise<boolean> {
  try {
    const pin = await SecureStore.getItemAsync(PIN_KEY);
    return pin !== null && (pin.length === 4 || pin.length === 6);
  } catch (error) {
    console.error('[SecurePINStorage] Error checking PIN:', error);
    return false;
  }
}

export async function setSecurePIN(pin: string): Promise<boolean> {
  if (!pin || (pin.length !== 4 && pin.length !== 6)) {
    throw new Error('PIN must be 4 or 6 digits');
  }

  try {
    await SecureStore.setItemAsync(PIN_KEY, pin);
    return true;
  } catch (error) {
    console.error('[SecurePINStorage] Error setting PIN:', error);
    return false;
  }
}

export async function verifySecurePIN(pin: string): Promise<boolean> {
  try {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    if (!storedPin) return false;
    // Basic timing attack mitigation for 4-6 digit pins
    const buf1 = Buffer.from(pin);
    const buf2 = Buffer.from(storedPin);
    if (buf1.length !== buf2.length) return false;
    let result = 0;
    for (let i = 0; i < buf1.length; i++) {
      result |= buf1[i]! ^ buf2[i]!;
    }
    return result === 0;
  } catch (error) {
    console.error('[SecurePINStorage] Error verifying PIN:', error);
    return false;
  }
}

export async function clearSecurePIN(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(PIN_KEY);
    return true;
  } catch (error) {
    console.error('[SecurePINStorage] Error clearing PIN:', error);
    return false;
  }
}
