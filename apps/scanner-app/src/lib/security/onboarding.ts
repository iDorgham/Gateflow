import * as SecureStore from 'expo-secure-store';

/** SecureStore key for first-run wizard completion. */
export const ONBOARDING_COMPLETE_KEY = 'GATEFLOW_SCANNER_ONBOARDING_COMPLETE';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
    return value === '1' || value === 'true';
  } catch (error) {
    console.error('[Onboarding] Error reading completion flag:', error);
    return false;
  }
}

export async function setOnboardingComplete(): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, '1');
    return true;
  } catch (error) {
    console.error('[Onboarding] Error setting completion flag:', error);
    return false;
  }
}

export async function clearOnboardingComplete(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_COMPLETE_KEY);
    return true;
  } catch (error) {
    console.error('[Onboarding] Error clearing completion flag:', error);
    return false;
  }
}
