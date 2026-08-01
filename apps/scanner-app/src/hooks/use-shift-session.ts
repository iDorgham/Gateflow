import { useCallback, useEffect, useRef, useState } from 'react';
import * as Network from 'expo-network';
import { getAuthSubject } from '../lib/auth-client';
import {
  endShiftOnServer,
  fetchActiveShiftOnServer,
  startShiftOnServer,
} from '../lib/shift-api';
import {
  canScanWithShift,
  clearShiftSession,
  finalizeLocalShiftEnd,
  loadShiftSessionForUser,
  loadShiftTombstone,
  markPendingShiftEnd,
  saveShiftSession,
  type ShiftSession,
} from '../lib/shift-session';

export function useShiftSession(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [session, setSession] = useState<ShiftSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const genRef = useRef(0);
  const startOperationsRef = useRef<Set<Promise<boolean>>>(new Set());
  const startCleanupBlockedRef = useRef<string | null>(null);
  const pendingRetryRef = useRef<Promise<void> | null>(null);

  const retryPendingEnd = useCallback((): Promise<void> => {
    if (pendingRetryRef.current) return pendingRetryRef.current;

    const retry = (async () => {
      const guardId = await getAuthSubject();
      if (!guardId) return;
      const tombstone = await loadShiftTombstone();
      if (
        tombstone?.reason !== 'pending_end' ||
        tombstone.guardId !== guardId
      ) {
        return;
      }

      const result = await endShiftOnServer(tombstone.shiftLogId);
      if (result.ok || result.status === 404) {
        // finalize owns both session deletion and ended-tombstone protection.
        // A failed session delete must leave its replacement tombstone intact.
        await finalizeLocalShiftEnd(tombstone.shiftLogId, guardId);
      }
    })();
    pendingRetryRef.current = retry;
    void retry.finally(() => {
      if (pendingRetryRef.current === retry) pendingRetryRef.current = null;
    });
    return retry;
  }, []);

  useEffect(() => {
    if (!enabled) {
      setSession(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    async function hydrate() {
      try {
        const guardId = await getAuthSubject();

        await retryPendingEnd();

        const stored = await loadShiftSessionForUser(guardId);
        if (!mounted) return;

        if (!stored) {
          setSession(null);
          return;
        }

        // Re-validate against server so a stale SecureStore session cannot enable the camera.
        const verified = await fetchActiveShiftOnServer(stored.gateId);
        if (!mounted) return;

        if (!verified.ok && verified.authFailure) {
          const marked = await markPendingShiftEnd(
            stored.shiftLogId,
            stored.guardId
          );
          // Authentication rejection is authoritative: never keep scanning on
          // a locally cached shift. The marker protects a future clock-out retry.
          setSession(null);
          setError(
            marked
              ? 'Session expired — sign in again to resume scanning'
              : 'Session expired — local cleanup could not be saved'
          );
          return;
        }

        if (verified.ok && verified.active === false) {
          await finalizeLocalShiftEnd(stored.shiftLogId, guardId ?? undefined);
          setSession(null);
          setError('Previous shift ended — start a new shift to scan');
          return;
        }

        if (
          verified.ok &&
          verified.active &&
          verified.session.shiftLogId !== stored.shiftLogId
        ) {
          const sessionWithGuard: ShiftSession = {
            ...verified.session,
            ...(guardId ? { guardId } : {}),
          };
          const saved = await saveShiftSession(sessionWithGuard);
          setSession(saved ? sessionWithGuard : null);
          return;
        }

        // Network/unknown: keep local session (offline-tolerant) until first scan fails.
        setSession(stored);
      } catch (err) {
        if (mounted) {
          await clearShiftSession();
          setSession(null);
          setError(
            err instanceof Error
              ? `Could not load shift session: ${err.message}`
              : 'Could not load shift session'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void hydrate();
    return () => {
      mounted = false;
    };
  }, [enabled, retryPendingEnd]);

  useEffect(() => {
    if (!enabled) return;
    const subscription = Network.addNetworkStateListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        void retryPendingEnd();
      }
    });
    return () => subscription.remove();
  }, [enabled, retryPendingEnd]);

  const clearLocalShift = useCallback(
    async (expectedShiftLogId?: string) => {
      const shiftLogId = expectedShiftLogId ?? session?.shiftLogId;
      if (shiftLogId) {
        await finalizeLocalShiftEnd(shiftLogId, session?.guardId);
      } else {
        await clearShiftSession();
      }
      setSession((current) => {
        if (shiftLogId && current?.shiftLogId !== shiftLogId) return current;
        return null;
      });
      if (!expectedShiftLogId || expectedShiftLogId === session?.shiftLogId) {
        setError(null);
      }
    },
    [session?.guardId, session?.shiftLogId]
  );

  const startShift = useCallback((gateId: string, gateName?: string) => {
    const operation = (async (): Promise<boolean> => {
      const startGen = genRef.current;
      setBusy(true);
      setError(null);
      try {
        const guardId = await getAuthSubject();
        if (!guardId) {
          setError('Not signed in');
          return false;
        }

        const result = await startShiftOnServer({ gateId, gateName });
        if (!result.ok) {
          setError(result.message);
          return false;
        }

        const sessionWithGuard: ShiftSession = { ...result.session, guardId };
        if (genRef.current !== startGen) {
          // Logout waits for this operation before clearing auth. Persist a retry marker
          // if the close cannot complete while credentials are still available.
          const cleanup = await endShiftOnServer(result.session.shiftLogId);
          if (
            !cleanup.ok &&
            cleanup.status !== 404 &&
            (cleanup.retryable || cleanup.authFailure)
          ) {
            const marked = await markPendingShiftEnd(
              result.session.shiftLogId,
              guardId
            );
            if (!marked) {
              startCleanupBlockedRef.current =
                'Could not safely record the pending clock-out';
            }
          } else if (!cleanup.ok && cleanup.status !== 404) {
            // Keep enough local state for disposeForLogout to block logout and
            // surface the permanent failure instead of orphaning the server shift.
            const savedForLogout = await saveShiftSession(sessionWithGuard);
            if (!savedForLogout) {
              startCleanupBlockedRef.current = cleanup.message;
            }
          }
          return false;
        }

        const saved = await saveShiftSession(sessionWithGuard);
        if (genRef.current !== startGen) {
          const cleanup = await endShiftOnServer(result.session.shiftLogId);
          if (cleanup.ok || cleanup.status === 404) {
            // saveShiftSession completed before logout won the race. Remove only
            // this exact persisted session; conditional finalize preserves a newer one.
            await finalizeLocalShiftEnd(result.session.shiftLogId, guardId);
          } else if (cleanup.retryable || cleanup.authFailure) {
            const marked = await markPendingShiftEnd(
              result.session.shiftLogId,
              guardId
            );
            if (!marked) {
              startCleanupBlockedRef.current =
                'Could not safely record the pending clock-out';
            }
          }
          return false;
        }
        if (!saved) {
          // The server shift exists but cannot enable scanning without durable
          // local state. Compensate immediately, or durably queue its clock-out.
          const cleanup = await endShiftOnServer(result.session.shiftLogId);
          if (cleanup.ok || cleanup.status === 404) {
            await finalizeLocalShiftEnd(result.session.shiftLogId, guardId);
            setError('Could not save the shift locally — start again');
          } else if (cleanup.retryable || cleanup.authFailure) {
            const marked = await markPendingShiftEnd(
              result.session.shiftLogId,
              guardId
            );
            if (!marked) {
              startCleanupBlockedRef.current =
                'Shift started but local recovery state could not be saved';
            }
            setError(
              marked
                ? 'Could not save the shift locally — clock-out queued'
                : 'Shift started but local recovery state could not be saved'
            );
          } else {
            startCleanupBlockedRef.current = cleanup.message;
            setError(cleanup.message);
          }
          return false;
        }
        setSession(sessionWithGuard);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not start shift');
        return false;
      } finally {
        setBusy(false);
      }
    })();
    startOperationsRef.current.add(operation);
    void operation.then(
      () => startOperationsRef.current.delete(operation),
      () => startOperationsRef.current.delete(operation)
    );
    return operation;
  }, []);

  const endShift = useCallback(async () => {
    setBusy(true);
    setError(null);
    const shiftLogId = session?.shiftLogId;
    try {
      const result = await endShiftOnServer(shiftLogId);

      if (result.ok) {
        if (shiftLogId) {
          const { cleared } = await finalizeLocalShiftEnd(
            shiftLogId,
            session?.guardId
          );
          setSession(null);
          if (!cleared) {
            setError(
              'Shift ended on server; local clear failed — scanning stays blocked'
            );
          }
        } else {
          setSession(null);
        }
        return true;
      }

      // Confirmed already ended — clear local duty.
      if (result.status === 404 && shiftLogId) {
        await finalizeLocalShiftEnd(shiftLogId, session?.guardId);
        setSession(null);
        setError(null);
        return true;
      }

      if (result.authFailure && shiftLogId) {
        const marked = await markPendingShiftEnd(shiftLogId, session?.guardId);
        setSession(null);
        setError(
          marked
            ? 'Session expired — sign in again to finish clock-out'
            : 'Session expired — local cleanup could not be saved'
        );
        return false;
      }

      // Transport / 5xx: stop scanning but keep pending-end for retry.
      if (result.retryable && shiftLogId) {
        const marked = await markPendingShiftEnd(shiftLogId, session?.guardId);
        if (marked) setSession(null);
        setError(
          marked
            ? `${result.message} — will retry clock-out when online`
            : `${result.message} — could not save retry state; shift remains active`
        );
        return false;
      }

      setError(result.message);
      return false;
    } catch (err) {
      let marked = false;
      if (shiftLogId) {
        marked = await markPendingShiftEnd(shiftLogId, session?.guardId);
        if (marked) setSession(null);
      }
      const message =
        err instanceof Error ? err.message : 'Could not end shift';
      setError(
        marked
          ? `${message} — will retry clock-out when online`
          : `${message} — could not save retry state; shift remains active`
      );
      return false;
    } finally {
      setBusy(false);
    }
  }, [session?.guardId, session?.shiftLogId]);

  /**
   * Sign-out path: invalidate in-flight start, end server shift when possible,
   * and leave a pending_end tombstone on retryable failure so duty is not orphaned.
   */
  const disposeForLogout = useCallback(async (): Promise<boolean> => {
    genRef.current += 1;
    setBusy(true);
    try {
      // Keep credentials alive until every server start has either persisted its
      // session or closed/recorded the resulting server shift.
      await Promise.allSettled([...startOperationsRef.current]);
      if (startCleanupBlockedRef.current) {
        setError(startCleanupBlockedRef.current);
        return false;
      }

      const guardId = await getAuthSubject();
      const stored = session ?? (await loadShiftSessionForUser(guardId));
      const shiftLogId = stored?.shiftLogId;

      if (shiftLogId) {
        const owner = stored?.guardId ?? guardId ?? undefined;
        const result = await endShiftOnServer(shiftLogId);
        if (result.ok || result.status === 404) {
          await finalizeLocalShiftEnd(shiftLogId, owner);
        } else if (result.retryable || result.authFailure) {
          const marked = await markPendingShiftEnd(shiftLogId, owner);
          if (!marked) {
            setError('Could not safely record the pending clock-out');
            return false;
          }
        } else {
          // Validation/permission failures require resolution while authenticated.
          setError(result.message);
          return false;
        }
      }

      setSession(null);
      setError(null);
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? `Could not prepare logout: ${error.message}`
          : 'Could not safely prepare logout'
      );
      return false;
    } finally {
      setBusy(false);
    }
  }, [session]);

  const canScan = useCallback(
    (gateId: string | null | undefined) => canScanWithShift(session, gateId),
    [session]
  );

  return {
    session,
    loading,
    busy,
    error,
    isActive: session != null,
    startShift,
    endShift,
    canScan,
    clearLocalShift,
    disposeForLogout,
  };
}
