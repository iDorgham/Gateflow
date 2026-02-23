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

function generateScanUuid(): string {
  // Generate a UUID v4 using expo-crypto random bytes
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
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
      throw new Error('Encryption key management failed');
    }
  },

  async getOrDeriveKey(): Promise<string> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      return deriveEncryptionKey(token);
    }
    return this.getOrCreateKey();
  },

  async encrypt(data: string): Promise<string> {
    const key = await this.getOrDeriveKey();
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  },

  async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getOrDeriveKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
    return decrypted;
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

export const scanQueue = {
  async addScan(qrCode: string, gateId: string): Promise<QueuedScan> {
    const isAuth = await encryption.isAuthenticated();
    if (!isAuth) {
      throw new Error('Authentication required. Please log in first.');
    }

    const scanUuid = generateScanUuid();
    const queue = await this.getQueue();

    const scanData = JSON.stringify({
      qrCode,
      gateId,
      scannedAt: new Date().toISOString(),
    });

    const encryptedData = await encryption.encrypt(scanData);

    const newScan: EncryptedQueueItem = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      scanUuid,
      encryptedData,
      scannedAt: new Date().toISOString(),
      synced: false,
      retryCount: 0,
    };

    queue.push(newScan);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));

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
        });
      } catch (error) {
        console.error(`Failed to decrypt scan ${item.id}:`, error);
      }
    }

    return decrypted;
  },

  async removeScan(scanId: string): Promise<void> {
    const queue = await this.getQueue();
    const filtered = queue.filter((scan) => scan.id !== scanId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  async markAsSynced(scanId: string): Promise<void> {
    const queue = await this.getQueue();
    const index = queue.findIndex((scan) => scan.id === scanId);

    if (index !== -1) {
      queue[index].synced = true;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  },

  async markAsFailed(scanId: string, error: string): Promise<void> {
    const queue = await this.getQueue();
    const index = queue.findIndex((scan) => scan.id === scanId);

    if (index !== -1) {
      queue[index].retryCount += 1;
      queue[index].error = error;
      if (queue[index].retryCount >= MAX_RETRIES) {
        queue[index].synced = true;
        queue[index].error = 'Max retries exceeded';
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  },

  async getPendingScans(): Promise<QueuedScan[]> {
    const decrypted = await this.getDecryptedQueue();
    return decrypted.filter((scan) => !scan.synced && scan.retryCount < MAX_RETRIES);
  },

  async getFailedScans(): Promise<QueuedScan[]> {
    const decrypted = await this.getDecryptedQueue();
    return decrypted.filter((scan) => scan.synced && scan.error === 'Max retries exceeded');
  },

  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async clearSynced(): Promise<void> {
    const queue = await this.getQueue();
    const pending = queue.filter((scan) => !scan.synced);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  },
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

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
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }

  return response.json();
}

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
      const pendingScans = await scanQueue.getPendingScans();

      if (pendingScans.length === 0) {
        return;
      }

      const result = await bulkSyncScans(pendingScans);

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
