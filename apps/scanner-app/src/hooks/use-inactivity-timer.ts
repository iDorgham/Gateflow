import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { shouldLock } from '../lib/inactivity';

const DEFAULT_CHECK_INTERVAL_MS = 1_000;

export interface UseInactivityTimerOptions {
  /** Timer is fully paused (no polling, no AppState tracking) when false. */
  enabled: boolean;
  timeoutMs: number;
  onLock: () => void;
  checkIntervalMs?: number;
}

/**
 * Drives BiometricGuard's re-lock decision from two independent signals:
 * foreground inactivity (polled against `lastActivity`) and time spent
 * backgrounded (measured across an AppState background→active transition,
 * since a suspended app doesn't get timer ticks while backgrounded).
 */
export function useInactivityTimer({
  enabled,
  timeoutMs,
  onLock,
  checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS,
}: UseInactivityTimerOptions) {
  const lastActivityRef = useRef(Date.now());
  const backgroundedAtRef = useRef<number | null>(null);

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    recordActivity();
    backgroundedAtRef.current = null;

    const interval = setInterval(() => {
      if (shouldLock(lastActivityRef.current, Date.now(), timeoutMs)) {
        onLock();
      }
    }, checkIntervalMs);
    return () => clearInterval(interval);
  }, [enabled, timeoutMs, onLock, checkIntervalMs, recordActivity]);

  useEffect(() => {
    if (!enabled) return;

    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'background' || state === 'inactive') {
          backgroundedAtRef.current ??= Date.now();
          return;
        }
        if (state === 'active' && backgroundedAtRef.current !== null) {
          const backgroundedSince = backgroundedAtRef.current;
          backgroundedAtRef.current = null;
          if (shouldLock(backgroundedSince, Date.now(), timeoutMs)) {
            onLock();
          } else {
            recordActivity();
          }
        }
      }
    );
    return () => subscription.remove();
  }, [enabled, timeoutMs, onLock, recordActivity]);

  return { recordActivity };
}
