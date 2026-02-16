import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export interface QueuedScan {
  id: string;
  qrCode: string;
  gateId: string;
  scannedAt: string;
  synced: boolean;
  retryCount: number;
}

const STORAGE_KEY = 'scan_queue';
const TOKEN_KEY = 'auth_token';
const ENCRYPTION_KEY_NAME = 'scan_encryption_key';

export const encryption = {
  async getOrCreateKey(): Promise<string> {
    try {
      const existingKey = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
      if (existingKey) {
        return existingKey;
      }
      
      const newKey = Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${Date.now()}_${Math.random()}`
      );
      
      await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, await newKey);
      return newKey;
    } catch (error) {
      console.error('Failed to get/create encryption key:', error);
      throw new Error('Encryption key management failed');
    }
  },

  async encrypt(data: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const encoded = btoa(`${key}:${data}`);
    return encoded;
  },

  async decrypt(encryptedData: string): Promise<string> {
    const decoded = atob(encryptedData);
    const [, data] = decoded.split(':');
    return data;
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
};

export const scanQueue = {
  async addScan(qrCode: string, gateId: string): Promise<QueuedScan> {
    const queue = await this.getQueue();
    
    const newScan: QueuedScan = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      qrCode,
      gateId,
      scannedAt: new Date().toISOString(),
      synced: false,
      retryCount: 0,
    };

    queue.push(newScan);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    
    return newScan;
  },

  async getQueue(): Promise<QueuedScan[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
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

  async incrementRetry(scanId: string): Promise<void> {
    const queue = await this.getQueue();
    const index = queue.findIndex((scan) => scan.id === scanId);
    
    if (index !== -1) {
      queue[index].retryCount += 1;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  },

  async getPendingScans(): Promise<QueuedScan[]> {
    const queue = await this.getQueue();
    return queue.filter((scan) => !scan.synced);
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
