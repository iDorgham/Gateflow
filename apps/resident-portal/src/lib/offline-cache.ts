'use client';

const DB_NAME = 'gateflow-resident-offline';
const STORE_NAME = 'qr-cache';
const DB_VERSION = 1;

export interface OfflineQRPayload {
  id: string;
  code: string;
  expiresAt: string | null;
  accessType: string;
  cachedAt: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function cacheQrPayload(payload: OfflineQRPayload): Promise<void> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(payload);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function getCachedQrPayload(id: string): Promise<OfflineQRPayload | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return null;
  const db = await openDb();
  const data = await new Promise<OfflineQRPayload | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve((req.result as OfflineQRPayload | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return data;
}
