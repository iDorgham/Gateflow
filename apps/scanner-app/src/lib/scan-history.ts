/**
 * scan-history.ts
 *
 * Lightweight local scan history stored in AsyncStorage.
 * Keeps the last MAX_ENTRIES entries (oldest dropped when full).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScanOutcome =
  | 'pass'      // operator pressed Pass after server SUCCESS
  | 'deny'      // operator pressed Deny (DENIED)
  | 'offline'   // accepted offline, queued for sync
  | 'rejected'; // server or local rejected

export interface HistoryEntry {
  /** Unique local ID */
  id: string;
  /** ISO timestamp of scan */
  scannedAt: string;
  /** Scan outcome */
  outcome: ScanOutcome;
  /** First ~20 chars of the QR code or short URL */
  qrPrefix: string;
  /** Gate name (if known) */
  gateName?: string;
  /** Human-readable result message */
  message?: string;
  /** Server-assigned scanId (undefined for offline / rejected) */
  scanId?: string;
}

const STORAGE_KEY = 'scan_history_v1';
const MAX_ENTRIES = 100;

function makeId(): string {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

async function readEntries(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

/**
 * Prepend a new entry to the local scan history.
 * Oldest entries are dropped when the list exceeds MAX_ENTRIES.
 */
export async function addHistoryEntry(
  entry: Omit<HistoryEntry, 'id' | 'scannedAt'>,
): Promise<void> {
  try {
    const existing = await readEntries();
    const newEntry: HistoryEntry = {
      id: makeId(),
      scannedAt: new Date().toISOString(),
      ...entry,
    };
    const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // non-fatal — history is best-effort
  }
}

/**
 * Return the full local scan history (most recent first).
 */
export async function getHistory(): Promise<HistoryEntry[]> {
  return readEntries();
}

/**
 * Clear all local scan history.
 */
export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
