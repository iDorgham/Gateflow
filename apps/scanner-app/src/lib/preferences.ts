/**
 * preferences.ts
 *
 * Simple AsyncStorage-backed user preferences for the scanner app.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppPreferences {
  /** Whether haptic feedback is enabled (default: true) */
  hapticsEnabled: boolean;
  /** Whether location capture is enabled (default: true) */
  locationEnabled: boolean;
}

const STORAGE_KEY = 'app_preferences_v1';

const DEFAULTS: AppPreferences = {
  hapticsEnabled: true,
  locationEnabled: true,
};

export async function getPreferences(): Promise<AppPreferences> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AppPreferences>) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function setPreference<K extends keyof AppPreferences>(
  key: K,
  value: AppPreferences[K],
): Promise<void> {
  const current = await getPreferences();
  const updated: AppPreferences = { ...current, [key]: value };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
