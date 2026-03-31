'use client';

import { useEffect } from 'react';
import { cacheQrPayload, type OfflineQRPayload } from '@/lib/offline-cache';

export function OfflineQrCacheClient({ payload }: { payload: OfflineQRPayload }) {
  useEffect(() => {
    cacheQrPayload(payload).catch((error) => {
      console.warn('Failed to cache QR payload', error);
    });
  }, [payload]);

  return null;
}
