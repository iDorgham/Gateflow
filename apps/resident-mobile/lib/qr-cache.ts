import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY_LIST = 'resident_visitors_list';
const CACHE_KEY_ITEM_PREFIX = 'resident_visitor_';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CachedVisitor {
  id: string;
  visitorName: string | null;
  visitorPhone: string | null;
  visitorEmail: string | null;
  isOpenQR: boolean;
  createdAt: string;
  qrCode: { id: string; code: string; type: string };
  accessRule?: { type: string };
  unit?: { name: string; building: string | null };
}

export interface CachedListPayload {
  visitors: CachedVisitor[];
  cachedAt: number;
}

export async function getCachedVisitorsList(): Promise<CachedVisitor[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY_LIST);
    if (!raw) return null;
    const payload = JSON.parse(raw) as CachedListPayload;
    if (Date.now() - payload.cachedAt > CACHE_MAX_AGE_MS) return null;
    return payload.visitors;
  } catch {
    return null;
  }
}

export async function setCachedVisitorsList(visitors: CachedVisitor[]): Promise<void> {
  try {
    const payload: CachedListPayload = { visitors, cachedAt: Date.now() };
    await AsyncStorage.setItem(CACHE_KEY_LIST, JSON.stringify(payload));
    for (const v of visitors) {
      await AsyncStorage.setItem(
        `${CACHE_KEY_ITEM_PREFIX}${v.id}`,
        JSON.stringify({ ...v, cachedAt: Date.now() })
      );
    }
  } catch {
    // ignore
  }
}

export async function getCachedVisitor(id: string): Promise<CachedVisitor | null> {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_KEY_ITEM_PREFIX}${id}`);
    if (!raw) return null;
    const data = JSON.parse(raw) as CachedVisitor & { cachedAt?: number };
    if (data.cachedAt != null && Date.now() - data.cachedAt > CACHE_MAX_AGE_MS) return null;
    const { cachedAt: _, ...visitor } = data;
    return visitor;
  } catch {
    return null;
  }
}

export async function setCachedVisitor(visitor: CachedVisitor): Promise<void> {
  try {
    const payload = { ...visitor, cachedAt: Date.now() };
    await AsyncStorage.setItem(
      `${CACHE_KEY_ITEM_PREFIX}${visitor.id}`,
      JSON.stringify(payload)
    );
  } catch {
    // ignore
  }
}
