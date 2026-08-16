import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const store: Record<string, string> = {};

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
  setItemAsync: jest.fn((key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  }),
  deleteItemAsync: jest.fn((key: string) => {
    delete store[key];
    return Promise.resolve();
  }),
}));

import {
  DEVICE_PIN_KEY,
  SUPERVISOR_PIN_KEY,
  hasOverridePin,
  hasSecurePIN,
  setSecurePIN,
  verifyOverridePin,
  verifySecurePIN,
} from './secure-pin';
import * as SecureStore from 'expo-secure-store';

describe('secure PIN', () => {
  beforeEach(() => {
    for (const key of Object.keys(store)) delete store[key];
    jest.clearAllMocks();
  });

  it('rejects non-digit and 5-digit PINs', async () => {
    await expect(setSecurePIN('12ab')).rejects.toThrow(/4 or 6 digits/);
    await expect(setSecurePIN('12345')).rejects.toThrow(/4 or 6 digits/);
  });

  it('stores and verifies a 4-digit PIN', async () => {
    await expect(setSecurePIN('2580')).resolves.toBe(true);
    await expect(hasSecurePIN()).resolves.toBe(true);
    await expect(verifySecurePIN('2580')).resolves.toBe(true);
    await expect(verifySecurePIN('2581')).resolves.toBe(false);
    await expect(SecureStore.getItemAsync(DEVICE_PIN_KEY)).resolves.toBe(
      '2580'
    );
  });

  it('uses the device PIN for override when no supervisor PIN is set', async () => {
    await setSecurePIN('147258');
    await expect(hasOverridePin()).resolves.toBe(true);
    await expect(verifyOverridePin('147258')).resolves.toBe(true);
    await expect(verifyOverridePin('000000')).resolves.toBe(false);
  });

  it('prefers the dedicated supervisor PIN when both exist', async () => {
    await setSecurePIN('1111');
    store[SUPERVISOR_PIN_KEY] = '9999';
    await expect(verifyOverridePin('9999')).resolves.toBe(true);
    await expect(verifyOverridePin('1111')).resolves.toBe(false);
  });

  it('throws when SecureStore cannot save the PIN', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(
      new Error('disk full')
    );
    await expect(setSecurePIN('1234')).rejects.toThrow(
      /Could not save PIN on this device/
    );
  });
});
