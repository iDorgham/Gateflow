import { useCallback, useEffect, useRef, useState } from 'react';
import { getAuthSubject } from '../lib/auth-client';
import {
  endShiftOnServer,
  fetchActiveShiftOnServer,
  startShiftOnServer,
} from '../lib/shift-api';
import {
  canScanWithShift,
  clearShiftSession,
  clearShiftTombstone,
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

        const tombstone = await loadShiftTombstone();
        if (tombstone?.reason === 'pending_end') {
          const retry = await endShiftOnServer(tombstone.shiftLogId);
          if (retry.ok || retry.status === 404) {
            await finalizeLocalShiftEnd(tombstone.shiftLogId);
            await clearShiftTombstone();
          }
        }

        const stored = await loadShiftSessionForUser(guardId);
        if (!mounted) return;

        if (!stored) {
          setSession(null);
          return;
        }

        // Re-validate against server so a stale SecureStore session cannot enable the camera.
        const verified = await fetchActiveShiftOnServer(stored.gateId);
        if (!mounted) return;

        if (verified.ok && verified.active === false) {
          await finalizeLocalShiftEnd(stored.shiftLogId);
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
          setSession(null);
          setError(
            err instanceof Error
              ? err.message
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
  }, [enabled]);

  const clearLocalShift = useCallback(async () => {
    const shiftLogId = session?.shiftLogId;
    if (shiftLogId) {
      await finalizeLocalShiftEnd(shiftLogId);
    } else {
      await clearShiftSession();
    }
    setSession(null);
    setError(null);
  }, [session?.shiftLogId]);

  const startShift = useCallback(async (gateId: string, gateName?: string) => {
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

      if (genRef.current !== startGen) {
        // Logout/dispose raced ahead — do not persist locally; best-effort close server shift.
        void endShiftOnServer(result.session.shiftLogId);
        return false;
      }

      const sessionWithGuard: ShiftSession = { ...result.session, guardId };
      const saved = await saveShiftSession(sessionWithGuard);
      if (genRef.current !== startGen) {
        void endShiftOnServer(result.session.shiftLogId);
        return false;
      }
      if (!saved) {
        setError('Shift started on server but could not save locally — retry');
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
  }, []);

  const endShift = useCallback(async () => {
    setBusy(true);
    setError(null);
    const shiftLogId = session?.shiftLogId;
    try {
      const result = await endShiftOnServer(shiftLogId);

      if (result.ok) {
        if (shiftLogId) {
          const { cleared } = await finalizeLocalShiftEnd(shiftLogId);
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
        await finalizeLocalShiftEnd(shiftLogId);
        setSession(null);
        setError(null);
        return true;
      }

      // Transport / 5xx: stop scanning but keep pending-end for retry.
      if (result.retryable && shiftLogId) {
        await markPendingShiftEnd(shiftLogId);
        setSession(null);
        setError(`${result.message} — will retry clock-out when online`);
        return false;
      }

      setError(result.message);
      return false;
    } catch (err) {
      if (shiftLogId) {
        await markPendingShiftEnd(shiftLogId);
        setSession(null);
      }
      setError(
        err instanceof Error
          ? `${err.message} — will retry clock-out when online`
          : 'Could not end shift — will retry when online'
      );
      return false;
    } finally {
      setBusy(false);
    }
  }, [session?.shiftLogId]);

  /**
   * Sign-out path: invalidate in-flight start, end server shift when possible,
   * and leave a pending_end tombstone on retryable failure so duty is not orphaned.
   */
  const disposeForLogout = useCallback(async (): Promise<boolean> => {
    genRef.current += 1;

    let cleanupSucceeded = true;

    try {
      const guardId = await getAuthSubject();
      const stored = session ?? (await loadShiftSessionForUser(guardId));
      const shiftLogId = stored?.shiftLogId;

      if (shiftLogId) {
        const result = await endShiftOnServer(shiftLogId);
        if (result.ok || result.status === 404) {
          await finalizeLocalShiftEnd(shiftLogId);
        } else {
          await markPendingShiftEnd(shiftLogId);
          cleanupSucceeded = false;
        }
      }
    } catch (err) {
      cleanupSucceeded = false;
    } finally {
      setSession(null);
      setError(null);
    }

    return cleanupSucceeded;
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
