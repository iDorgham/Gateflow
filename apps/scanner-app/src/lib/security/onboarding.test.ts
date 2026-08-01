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

import * as SecureStore from 'expo-secure-store';
import {
  hasCompletedOnboarding,
  setOnboardingComplete,
  clearOnboardingComplete,
  ONBOARDING_COMPLETE_KEY,
} from './onboarding';

describe('onboarding completion flag', () => {
  beforeEach(() => {
    for (const key of Object.keys(store)) delete store[key];
    jest.clearAllMocks();
  });

  it('is incomplete by default', async () => {
    await expect(hasCompletedOnboarding()).resolves.toBe(false);
  });

  it('persists completion in SecureStore', async () => {
    await expect(setOnboardingComplete()).resolves.toBe(true);
    await expect(hasCompletedOnboarding()).resolves.toBe(true);
    await expect(
      SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY)
    ).resolves.toBe('1');
  });

  it('can clear completion for re-run', async () => {
    await setOnboardingComplete();
    await clearOnboardingComplete();
    await expect(hasCompletedOnboarding()).resolves.toBe(false);
  });
});
