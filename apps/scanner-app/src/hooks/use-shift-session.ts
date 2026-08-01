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
      await saveShiftSession(result.session);
      setSession(result.session);
      return true;
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
        setError(result.message);
        return false;
      }
      await clearShiftSession();
      setSession(null);
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
