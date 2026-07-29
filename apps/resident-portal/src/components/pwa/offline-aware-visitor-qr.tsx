'use client';

import { useEffect, useState } from 'react';
import {
  cacheQrPayload,
  getCachedQrPayload,
  type OfflineQRPayload,
} from '@/lib/offline-cache';
import { resolveDisplayedQrCode } from '@/lib/qr-display';
import { VisitorQRCard } from '@/components/visitor-qr-card';

type Props = {
  payload: OfflineQRPayload;
  visitorName: string;
  date: string;
  timeWindow: string;
  status: 'active' | 'expired' | 'used';
  className?: string;
};

export function OfflineAwareVisitorQr({
  payload,
  visitorName,
  date,
  timeWindow,
  status,
  className,
}: Props) {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedCode, setCachedCode] = useState<string | null>(null);

  useEffect(() => {
    cacheQrPayload(payload).catch(() => {
      /* ignore cache write failures */
    });
  }, [payload]);

  useEffect(() => {
    const syncOnline = () => setIsOnline(navigator.onLine);
    syncOnline();
    window.addEventListener('online', syncOnline);
    window.addEventListener('offline', syncOnline);
    return () => {
      window.removeEventListener('online', syncOnline);
      window.removeEventListener('offline', syncOnline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCachedQrPayload(payload.id)
      .then((cached) => {
        if (!cancelled) setCachedCode(cached?.code ?? null);
      })
      .catch(() => {
        if (!cancelled) setCachedCode(null);
      });
    return () => {
      cancelled = true;
    };
  }, [payload.id, isOnline]);

  const displayed = resolveDisplayedQrCode({
    liveCode: payload.code,
    cachedCode,
    isOnline,
  });

  return (
    <VisitorQRCard
      visitorName={visitorName}
      date={date}
      timeWindow={timeWindow}
      qrValue={displayed.code ?? ''}
      status={status}
      className={className}
      offlineCached={displayed.source === 'cache'}
    />
  );
}
