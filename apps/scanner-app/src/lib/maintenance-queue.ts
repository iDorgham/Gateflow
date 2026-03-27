import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Network from 'expo-network';
import { getValidAccessToken } from './auth-client';

const STORAGE_KEY = 'maintenance_queue';
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export interface QueuedMaintenanceReport {
  id: string;
  title: string;
  description?: string;
  category: 'HARDWARE' | 'FACILITY' | 'OTHER';
  gateId: string;
  scanLogId?: string;
  reportedAt: string;
  synced: boolean;
  retryCount: number;
}

export const maintenanceQueue = {
  /**
   * Queue a maintenance report for offline synchronization.
   */
  async addReport(
    report: Omit<
      QueuedMaintenanceReport,
      'id' | 'reportedAt' | 'synced' | 'retryCount'
    >
  ): Promise<QueuedMaintenanceReport> {
    const queue = await this.getQueue();
    const idBytes = await Crypto.getRandomBytesAsync(4);
    const idSuffix = Array.from(idBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const newReport: QueuedMaintenanceReport = {
      ...report,
      id: `maint_${Date.now()}_${idSuffix}`,
      reportedAt: new Date().toISOString(),
      synced: false,
      retryCount: 0,
    };

    queue.push(newReport);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));

    // Attempt sync immediately if online
    this.triggerSync().catch(() => {});

    return newReport;
  },

  async getQueue(): Promise<QueuedMaintenanceReport[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async markAsSynced(id: string): Promise<void> {
    const queue = await this.getQueue();
    const index = queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      queue[index].synced = true;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  },

  async markAsFailed(id: string): Promise<void> {
    const queue = await this.getQueue();
    const index = queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      queue[index].retryCount += 1;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  },

  async clearSynced(): Promise<void> {
    const queue = await this.getQueue();
    const pending = queue.filter((item) => !item.synced && item.retryCount < 5);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  },

  /**
   * Sync all pending maintenance reports with the server.
   */
  async triggerSync(): Promise<void> {
    try {
      const network = await Network.getNetworkStateAsync();
      if (!network.isInternetReachable) return;

      const token = await getValidAccessToken();
      if (!token) return;

      const queue = await this.getQueue();
      const pending = queue.filter(
        (item) => !item.synced && item.retryCount < 5
      );

      if (pending.length === 0) return;

      for (const report of pending) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/maintenance/work-orders`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title: report.title,
                description: report.description,
                category: report.category,
                gateId: report.gateId,
                scanLogId: report.scanLogId,
                priority: 'MEDIUM',
                source: 'SCANNER_APP',
              }),
            }
          );

          if (response.ok) {
            await this.markAsSynced(report.id);
          } else {
            await this.markAsFailed(report.id);
          }
        } catch {
          await this.markAsFailed(report.id);
        }
      }

      await this.clearSynced();
    } catch {
      // Ignore background sync errors
    }
  },
};
