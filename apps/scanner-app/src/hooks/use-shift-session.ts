import { useCallback, useEffect, useState } from 'react';
import { endShiftOnServer, startShiftOnServer } from '../lib/shift-api';
import {
  canScanWithShift,
  clearShiftSession,
  loadShiftSession,
  saveShiftSession,
  type ShiftSession,
} from '../lib/shift-session';

export function useShiftSession() {
  const [session, setSession] = useState<ShiftSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadShiftSession()
      .then((stored) => {
        if (mounted) setSession(stored);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const startShift = useCallback(async (gateId: string, gateName?: string) => {
    setBusy(true);
    setError(null);
    try {
      const result = await startShiftOnServer({ gateId, gateName });
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      const saved = await saveShiftSession(result.session);
      if (!saved) {
        setError('Shift started on server but could not save locally — retry');
        return false;
      }
      setSession(result.session);
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
    try {
      const result = await endShiftOnServer(session?.shiftLogId);
      if (!result.ok) {
        // Offline / network: still clear local duty so scanning stops; server may reopen later.
        const cleared = await clearShiftSession();
        setSession(null);
        setError(
          cleared
            ? `${result.message} — local shift ended; sync when online`
            : `${result.message} — also failed to clear local shift storage`
        );
        return true;
      }

      const cleared = await clearShiftSession();
      setSession(null);
      if (!cleared) {
        setError(
          'Shift ended on server but local session could not be cleared — restart app if scan stays blocked'
        );
      }
      return true;
    } catch (err) {
      const cleared = await clearShiftSession();
      setSession(null);
      setError(
        cleared
          ? err instanceof Error
            ? `${err.message} — local shift ended`
            : 'Could not end shift on server — local shift ended'
          : 'Could not end shift; local storage clear also failed'
      );
      return true;
    } finally {
      setBusy(false);
    }
  }, [session?.shiftLogId]);

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
  };
}
