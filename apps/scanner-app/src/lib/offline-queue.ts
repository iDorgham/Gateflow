import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as Network from 'expo-network';
import CryptoJS from 'crypto-js';

export interface QueuedScan {
  id: string;
  scanUuid: string;
  qrCode: string;
  gateId: string;
  scannedAt: string;
  synced: boolean;
  retryCount: number;
  error?: string;
  /** Active ShiftLog id at queue time (optional for older queued items). */
  shiftLogId?: string;
}

export interface EncryptedQueueItem {
  id: string;
  scanUuid: string;
  encryptedData: string;
  scannedAt: string;
  synced: boolean;
  retryCount: number;
  error?: string;
}

const STORAGE_KEY = 'scan_queue';
const QUARANTINE_STORAGE_KEY = 'scan_queue_quarantine';
const TOKEN_KEY = 'auth_token';
const ENCRYPTION_KEY_NAME = 'scan_encryption_key';
const PBKDF2_SALT_KEY = 'scan_pbkdf2_salt';
const MAX_RETRIES = 10;
const PBKDF2_ITERATIONS = process.env.NODE_ENV === 'test' ? 1 : 100_000;
const PBKDF2_KEY_SIZE = 256 / 32; // 8 words = 32 bytes = AES-256

/**
 * Derive an AES-256 key using PBKDF2 with a per-user salt.
 * Salt is generated once on first login and stored in expo-secure-store.
 */
async function deriveEncryptionKey(token: string): Promise<string> {
  const salt = await getOrCreateSalt();
  const key = CryptoJS.PBKDF2(token, salt, {
    keySize: PBKDF2_KEY_SIZE,
    iterations: PBKDF2_ITERATIONS,
  });
  return key.toString(CryptoJS.enc.Hex);
}

async function getOrCreateSalt(): Promise<string> {
  const existingSalt = await SecureStore.getItemAsync(PBKDF2_SALT_KEY);
  if (existingSalt) {
    return existingSalt;
  }

  const randomBytes = await Crypto.getRandomBytesAsync(16);
  const salt = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  await SecureStore.setItemAsync(PBKDF2_SALT_KEY, salt);
  return salt;
}

async function generateScanUuid(): Promise<string> {
  // Generate a cryptographically secure UUID v4 using expo-crypto
  const bytes = await Crypto.getRandomBytesAsync(16);
  // Set version (4) and variant (10xx) bits per RFC 4122
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

export const encryption = {
  async getOrCreateKey(): Promise<string> {
    try {
      const existingKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
      if (existingKey) {
        return existingKey;
      }

      const randomBytes = await Crypto.getRandomBytesAsync(32);
      const newKey = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, newKey);
      return newKey;
    } catch (error) {
      console.error('Failed to get/create encryption key:', error);
      throw new Error('Encryption key management failed', { cause: error });
    }
  },

  async getOrDeriveKey(): Promise<string> {
    // Queue data can outlive an access token. JWT refresh and re-login rotate
    // the token, so deriving the encryption key from it makes already queued
    // scans permanently unreadable. Keep authentication as the prerequisite
    // for enqueueing, but encrypt with a random device key held in SecureStore.
    return this.getOrCreateKey();
  },

  async encrypt(data: string): Promise<string> {
    const key = await this.getOrDeriveKey();
    // CryptoJS's passphrase API generates its own salt via a browser/native
    // crypto global that Hermes does not provide. Generate the IV through
    // expo-crypto and use the already-derived 256-bit key directly instead.
    const ivBytes = await Crypto.getRandomBytesAsync(16);
    const ivHex = Array.from(ivBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(key), {
      iv: CryptoJS.enc.Hex.parse(ivHex),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return `v3:${ivHex}:${encrypted.ciphertext.toString(CryptoJS.enc.Base64)}`;
  },

  async decrypt(encryptedData: string): Promise<string> {
    try {
      let key: string;
      let bytes: CryptoJS.lib.WordArray;
      if (encryptedData.startsWith('v3:') || encryptedData.startsWith('v2:')) {
        // v2/v3 records use the device key
        key = await this.getOrDeriveKey();
        const [, ivHex, ciphertextBase64] = encryptedData.split(':');
        if (!ivHex || !ciphertextBase64) {
          throw new Error('Decryption failed - malformed encrypted data');
        }
        const cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(ciphertextBase64),
        });
        bytes = CryptoJS.AES.decrypt(
          cipherParams,
          CryptoJS.enc.Hex.parse(key),
          {
            iv: CryptoJS.enc.Hex.parse(ivHex),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        );
      } else {
        // Legacy unprefixed ciphertext uses token-derived key with stored salt
        const token = await this.getToken();
        if (!token) {
          throw new Error(
            'Decryption failed - token required for legacy ciphertext'
          );
        }
        key = await deriveEncryptionKey(token);
        bytes = CryptoJS.AES.decrypt(encryptedData, key);
      }
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }
      return decrypted;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes('Malformed UTF-8') ||
        msg.includes('Decryption failed')
      ) {
        throw new Error('Decryption failed - invalid key or corrupted data', {
          cause: err,
        });
      }
      throw err;
    }
  },

  async storeToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  },

  async getSalt(): Promise<string | null> {
    return SecureStore.getItemAsync(PBKDF2_SALT_KEY);
  },

  async clearSalt(): Promise<void> {
    await SecureStore.deleteItemAsync(PBKDF2_SALT_KEY);
  },
};

async function checkNetworkConnection(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected ?? false;
  } catch {
    return false;
  }
}

/**
 * Serialize all queue mutations through a single read-modify-write mechanism
 * to prevent concurrent write races.
 */
let queueMutationLock: Promise<void> = Promise.resolve();

async function atomicQueueUpdate(
  mutator: (queue: EncryptedQueueItem[]) => EncryptedQueueItem[]
): Promise<void> {
  queueMutationLock = queueMutationLock.then(async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const queue = data ? JSON.parse(data) : [];
    const updated = mutator(queue);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
  await queueMutationLock;
}

export const scanQueue = {
  async addScan(
    qrCode: string,
    gateId: string,
    shiftLogId?: string
  ): Promise<QueuedScan> {
    const isAuth = await encryption.isAuthenticated();
    if (!isAuth) {
      throw new Error('Authentication required. Please log in first.');
    }

    const scanUuid = await generateScanUuid();

    const scanData = JSON.stringify({
      qrCode,
      gateId,
      scannedAt: new Date().toISOString(),
      ...(shiftLogId ? { shiftLogId } : {}),
    });

    const encryptedData = await encryption.encrypt(scanData);

    const idBytes = await Crypto.getRandomBytesAsync(4);
    const idSuffix = Array.from(idBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const newScan: EncryptedQueueItem = {
      id: `scan_${Date.now()}_${idSuffix}`,
      scanUuid,
      encryptedData,
      scannedAt: new Date().toISOString(),
      synced: false,
      retryCount: 0,
    };

    await atomicQueueUpdate((queue) => {
      queue.push(newScan);
      return queue;
    });

    const isConnected = await checkNetworkConnection();
    if (isConnected) {
      syncManager.triggerSync().catch(console.error);
    }

    return {
      id: newScan.id,
      scanUuid,
      qrCode,
      gateId,
      scannedAt: newScan.scannedAt,
      synced: false,
      retryCount: 0,
      ...(shiftLogId ? { shiftLogId } : {}),
    };
  },

  async getQueue(): Promise<EncryptedQueueItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getDecryptedQueue(): Promise<QueuedScan[]> {
    const queue = await this.getQueue();
    const decrypted: QueuedScan[] = [];
    const unreadable: EncryptedQueueItem[] = [];

    for (const item of queue) {
      try {
        const decryptedData = await encryption.decrypt(item.encryptedData);
        const parsed = JSON.parse(decryptedData);
        decrypted.push({
          id: item.id,
          scanUuid: item.scanUuid,
          qrCode: parsed.qrCode,
          gateId: parsed.gateId,
          scannedAt: item.scannedAt,
          synced: item.synced,
          retryCount: item.retryCount,
          error: item.error,
          ...(typeof parsed.shiftLogId === 'string'
            ? { shiftLogId: parsed.shiftLogId }
            : {}),
        });
      } catch {
        // A token-derived key used by older builds could rotate and make a
        // queued item permanently unreadable. Keep the encrypted record for
        // diagnostics, but remove it from the active queue so every render and
        // sync attempt does not trigger LogBox or leave the UI stuck forever.
        unreadable.push({
          ...item,
          synced: true,
          error: 'Quarantined: encrypted data is unreadable',
        });
      }
    }

    if (unreadable.length > 0) {
      const existingRaw = await AsyncStorage.getItem(QUARANTINE_STORAGE_KEY);
      const existing = existingRaw
        ? (JSON.parse(existingRaw) as EncryptedQueueItem[])
        : [];
      const byId = new Map(existing.map((item) => [item.id, item]));
      for (const item of unreadable) {
        byId.set(item.id, item);
      }
      await AsyncStorage.setItem(
        QUARANTINE_STORAGE_KEY,
        JSON.stringify([...byId.values()])
      );
      const unreadableIds = new Set(unreadable.map((item) => item.id));
      await atomicQueueUpdate((latestQueue) =>
        latestQueue.filter((item) => !unreadableIds.has(item.id))
      );
    }

    return decrypted;
  },

  async removeScan(scanId: string): Promise<void> {
    await atomicQueueUpdate((queue) =>
      queue.filter((scan) => scan.id !== scanId)
    );
  },

  async markAsSynced(scanId: string): Promise<void> {
    await atomicQueueUpdate((queue) => {
      const index = queue.findIndex((scan) => scan.id === scanId);
      if (index !== -1) {
        queue[index].synced = true;
        // Clear any error from an earlier failed attempt — a scan that
        // eventually succeeds must not still read as "failed" via its stale error.
        delete queue[index].error;
      }
      return queue;
    });
  },

  async markAsFailed(scanId: string, error: string): Promise<void> {
    await atomicQueueUpdate((queue) => {
      const index = queue.findIndex((scan) => scan.id === scanId);
      if (index !== -1) {
        queue[index].retryCount += 1;
        queue[index].error = error;
        if (queue[index].retryCount >= MAX_RETRIES) {
          queue[index].synced = true;
          queue[index].error = 'Max retries exceeded';
        }
      }
      return queue;
    });
  },

  /**
   * Legacy scans queued without shift attribution can never sync — the server
   * now rejects any bulk-synced scan missing shiftLogId. Retrying them costs
   * a network round trip every cycle for no chance of success, so park them
   * as failed immediately instead of burning down MAX_RETRIES.
   */
  async markAsUnattributable(scanId: string): Promise<void> {
    await atomicQueueUpdate((queue) => {
      const index = queue.findIndex((scan) => scan.id === scanId);
      if (index !== -1) {
        queue[index].synced = true;
        queue[index].retryCount = MAX_RETRIES;
        queue[index].error = 'No shift attribution — cannot sync';
      }
      return queue;
    });
  },

  async getPendingScans(): Promise<QueuedScan[]> {
    const decrypted = await this.getDecryptedQueue();
    return decrypted.filter(
      (scan) => !scan.synced && scan.retryCount < MAX_RETRIES
    );
  },

  async getFailedScans(): Promise<QueuedScan[]> {
    const decrypted = await this.getDecryptedQueue();
    // synced=true with an error means "gave up", not "synced successfully" —
    // covers both retry exhaustion and scans parked immediately (e.g. no
    // shift attribution) without matching on a specific error string.
    return decrypted.filter((scan) => scan.synced && !!scan.error);
  },

  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async clearSynced(): Promise<void> {
    await atomicQueueUpdate((queue) => queue.filter((scan) => !scan.synced));
  },
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

async function bulkSyncScans(scans: QueuedScan[]): Promise<{
  synced: string[];
  conflicted: Array<{ id: string; reason: string }>;
  failed: Array<{ id: string; error: string }>;
}> {
  const token = await encryption.getToken();

  const response = await fetch(`${API_BASE_URL}/scans/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      scans: scans.map((s) => ({
        id: s.id,
        scanUuid: s.scanUuid,
        qrCode: s.qrCode,
        gateId: s.gateId,
        scannedAt: s.scannedAt,
        status: 'SUCCESS',
        retryCount: s.retryCount,
        ...(s.shiftLogId ? { shiftLogId: s.shiftLogId } : {}),
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }

  try {
    const body = (await response.json()) as {
      data?: {
        synced?: unknown;
        conflicted?: unknown;
        failed?: unknown;
      };
      synced?: unknown;
      conflicted?: unknown;
      failed?: unknown;
    };
    const result = body.data ?? body;
    if (
      !Array.isArray(result.synced) ||
      !Array.isArray(result.conflicted) ||
      !Array.isArray(result.failed)
    ) {
      throw new Error('Sync failed: malformed server response');
    }
    return {
      synced: result.synced as string[],
      conflicted: result.conflicted as Array<{ id: string; reason: string }>,
      failed: result.failed as Array<{ id: string; error: string }>,
    };
  } catch {
    throw new Error(
      `Sync failed: server returned non-JSON response (status ${response.status})`
    );
  }
}

import { maintenanceQueue } from './maintenance-queue';

export const syncManager = {
  isSyncing: false,

  async triggerSync(): Promise<void> {
    if (this.isSyncing) {
      return;
    }

    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      return;
    }

    const isAuth = await encryption.isAuthenticated();
    if (!isAuth) {
      return;
    }

    this.isSyncing = true;

    try {
      // Trigger maintenance sync in parallel
      maintenanceQueue.triggerSync().catch(console.error);

      const pendingScans = await scanQueue.getPendingScans();

      if (pendingScans.length === 0) {
        return;
      }

      // Scans queued before shift attribution existed (or captured with no
      // active shift) can never pass the server's bulk-sync accountability
      // check. Don't waste a retry cycle sending them.
      const syncable = pendingScans.filter((scan) => !!scan.shiftLogId);
      const unattributable = pendingScans.filter((scan) => !scan.shiftLogId);
      for (const scan of unattributable) {
        await scanQueue.markAsUnattributable(scan.id);
      }

      if (syncable.length === 0) {
        return;
      }

      const result = await bulkSyncScans(syncable);

      // Mark successfully synced items
      for (const syncedId of result.synced) {
        await scanQueue.markAsSynced(syncedId);
      }

      // Only retry failed items — increment retry count with backoff
      for (const failed of result.failed) {
        await scanQueue.markAsFailed(failed.id, failed.error);
      }

      // Conflicted items resolved server-side — mark as synced (not retryable)
      for (const conflicted of result.conflicted) {
        await scanQueue.markAsSynced(conflicted.id);
      }

      // Remove synced items from storage
      await scanQueue.clearSynced();
    } catch (error) {
      // Network-level failure: mark ALL pending as failed for retry
      console.error('Sync error:', error);
      const pendingScans = await scanQueue.getPendingScans();
      for (const scan of pendingScans) {
        await scanQueue.markAsFailed(scan.id, (error as Error).message);
      }
    } finally {
      this.isSyncing = false;
    }
  },

  getRetryDelay(retryCount: number): number {
    const delays = [0, 5000, 30000, 120000, 300000, 600000];
    return delays[Math.min(retryCount, delays.length - 1)];
  },
};

export { generateScanUuid, deriveEncryptionKey, getOrCreateSalt };
