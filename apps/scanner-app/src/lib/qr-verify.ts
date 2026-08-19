import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyQRSignature, type QRVerificationResult } from '@gate-access/types';

const NONCE_CACHE_KEY = 'qr_nonce_cache';
const MAX_NONCE_CACHE_SIZE = 1000;

/**
 * Scanner-side QR verification: signature + expiry + replay protection.
 *
 * This is the optimistic local check — server is always final authority.
 * Invalid QRs are rejected immediately without hitting the network.
 *
 * SECURITY NOTE: The HMAC secret used here (EXPO_PUBLIC_QR_SECRET) is embedded
 * in the app bundle and can be extracted via reverse engineering. This means
 * attackers can potentially forge QR signatures that pass client-side verification.
 * However, all scans MUST be validated by the server (/api/qrcodes/validate)
 * which performs authoritative verification with the server-side secret, checks
 * the QR against the database, enforces organization boundaries, and records
 * the scan. Client-side verification is only for fast-path rejection to reduce
 * unnecessary network calls. Do NOT rely on client-side verification alone.
 */
export async function verifyScanQR(
  qrString: string,
  secret: string
): Promise<QRVerificationResult> {
  // 1. Verify signature + expiration via shared library
  const result = verifyQRSignature(qrString, secret);

  if (!result.valid) {
    return result;
  }

  // 2. Check nonce replay (local cache)
  const isReplay = await isNonceReused(result.payload.nonce);
  if (isReplay) {
    return {
      valid: false,
      reason: 'NONCE_REUSED',
      details: `Nonce ${result.payload.nonce} already seen`,
    };
  }

  // 3. Record nonce
  await recordNonce(result.payload.nonce);

  return result;
}

// ─── Nonce cache (AsyncStorage-backed, bounded LRU-ish) ──────────────────────

async function getNonceCache(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(NONCE_CACHE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

async function isNonceReused(nonce: string): Promise<boolean> {
  const cache = await getNonceCache();
  return new Set(cache).has(nonce);
}

async function recordNonce(nonce: string): Promise<void> {
  const cache = await getNonceCache();
  cache.push(nonce);

  // Evict oldest entries if cache exceeds max size
  const trimmed =
    cache.length > MAX_NONCE_CACHE_SIZE
      ? cache.slice(cache.length - MAX_NONCE_CACHE_SIZE)
      : cache;

  await AsyncStorage.setItem(NONCE_CACHE_KEY, JSON.stringify(trimmed));
}

export async function clearNonceCache(): Promise<void> {
  await AsyncStorage.removeItem(NONCE_CACHE_KEY);
}

export { getNonceCache, MAX_NONCE_CACHE_SIZE };
