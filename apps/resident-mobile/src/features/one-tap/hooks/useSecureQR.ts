import { useState, useEffect, useCallback, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import { residentFetch } from '../../../lib/api';
import { type CachedVisitor } from '../../../lib/qr-cache';

export interface ResidentActivePass {
  id: string;
  qrId: string;
  code: string;
  visitorName?: string;
  unitName?: string;
  validFrom: string;
  validUntil: string;
  cachedAt: number;
}

export interface UseSecureQRResult {
  activePass: ResidentActivePass | null;
  isLoading: boolean;
  isOffline: boolean;
  isExpiringSoon: boolean;
  remainingSeconds: number;
  error: string | null;
  refreshPass: () => Promise<void>;
}

const SECURE_STORE_KEY = 'gateflow_resident_active_pass';
const EXPIRING_SOON_THRESHOLD_SECONDS = 120; // 2 minutes warning

export function useSecureQR(): UseSecureQRResult {
  const [activePass, setActivePass] = useState<ResidentActivePass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fast-path: Read from encrypted SecureStore on mount
  const loadEncryptedCache =
    useCallback(async (): Promise<ResidentActivePass | null> => {
      try {
        const raw = await SecureStore.getItemAsync(SECURE_STORE_KEY, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
        if (!raw) return null;
        const parsed = JSON.parse(raw) as ResidentActivePass;
        return parsed;
      } catch {
        return null;
      }
    }, []);

  const saveEncryptedCache = useCallback(
    async (pass: ResidentActivePass): Promise<void> => {
      try {
        await SecureStore.setItemAsync(SECURE_STORE_KEY, JSON.stringify(pass), {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
      } catch (err) {
        console.warn('[useSecureQR] Failed to save encrypted pass cache:', err);
      }
    },
    []
  );

  const fetchLivePass = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      // First try to load recent passes / active QR
      const res = await residentFetch('/resident/visitors');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const payload = (await res.json()) as {
        success?: boolean;
        data?: CachedVisitor[];
      };

      if (payload.success && payload.data && payload.data.length > 0) {
        const latest = payload.data[0];
        const now = new Date();
        const validUntil = new Date(
          now.getTime() + 24 * 60 * 60 * 1000
        ).toISOString();

        const pass: ResidentActivePass = {
          id: latest.id,
          qrId: latest.qrCode?.id ?? latest.id,
          code: latest.qrCode?.code ?? `gf-pass-${latest.id}`,
          visitorName: latest.visitorName ?? 'Resident Pass',
          unitName: latest.unit?.name ?? 'Assigned Unit',
          validFrom: latest.createdAt ?? now.toISOString(),
          validUntil,
          cachedAt: Date.now(),
        };

        setActivePass(pass);
        setIsOffline(false);
        await saveEncryptedCache(pass);
      } else {
        // Fallback to local cache if no passes exist yet
        const cached = await loadEncryptedCache();
        if (cached) {
          setActivePass(cached);
          setIsOffline(true);
        }
      }
    } catch (err) {
      console.warn(
        '[useSecureQR] Network fetch failed, falling back to cache:',
        err
      );
      const cached = await loadEncryptedCache();
      if (cached) {
        setActivePass(cached);
        setIsOffline(true);
      } else {
        setError('Unable to load pass. Check internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadEncryptedCache, saveEncryptedCache]);

  // Initial load: fast-path cache retrieval (<800ms) then background sync
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      const cached = await loadEncryptedCache();
      if (cached && isMounted) {
        setActivePass(cached);
        setIsOffline(true);
        setIsLoading(false);
      }

      // Sync latest in background
      await fetchLivePass();
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, [loadEncryptedCache, fetchLivePass]);

  // Expiration countdown ticker
  useEffect(() => {
    if (!activePass?.validUntil) return;

    const updateTimer = () => {
      const expiry = new Date(activePass.validUntil).getTime();
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((expiry - now) / 1000));
      setRemainingSeconds(diffSec);
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePass]);

  const isExpiringSoon =
    remainingSeconds > 0 && remainingSeconds <= EXPIRING_SOON_THRESHOLD_SECONDS;

  return {
    activePass,
    isLoading,
    isOffline,
    isExpiringSoon,
    remainingSeconds,
    error,
    refreshPass: fetchLivePass,
  };
}
