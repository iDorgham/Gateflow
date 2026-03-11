import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'resident_history_list';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export type ResidentHistoryItem = {
  id: string;
  status: string;
  scannedAt: string;
  gateName: string;
  visitorName: string;
};

type CachePayload = {
  cachedAt: number;
  items: ResidentHistoryItem[];
};

export async function getCachedHistory(): Promise<ResidentHistoryItem[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as CachePayload;
    if (Date.now() - payload.cachedAt > CACHE_MAX_AGE_MS) return null;
    return payload.items;
  } catch {
    return null;
  }
}

export async function setCachedHistory(items: ResidentHistoryItem[]): Promise<void> {
  try {
    const payload: CachePayload = { cachedAt: Date.now(), items };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

