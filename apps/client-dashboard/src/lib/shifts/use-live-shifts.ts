'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  LiveGateShiftTelemetry,
  LiveShiftSummary,
  GateShiftStatus,
} from '@/app/api/shifts/live/route';

export type { LiveGateShiftTelemetry, LiveShiftSummary, GateShiftStatus };

export interface UseLiveShiftsResult {
  gates: LiveGateShiftTelemetry[];
  summary: LiveShiftSummary | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useLiveShifts(projectId?: string | null): UseLiveShiftsResult {
  const [gates, setGates] = useState<LiveGateShiftTelemetry[]>([]);
  const [summary, setSummary] = useState<LiveShiftSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const mountedRef = useRef<boolean>(true);

  const fetchLiveShifts = useCallback(async () => {
    try {
      setIsError(false);
      setError(null);

      const url = new URL('/api/shifts/live', window.location.origin);
      if (projectId) {
        url.searchParams.set('project', projectId);
      }

      const res = await fetch(url.toString(), {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch shifts: ${res.status} ${res.statusText}`
        );
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'API returned failure');
      }

      if (mountedRef.current) {
        setGates(json.data.gates);
        setSummary(json.data.summary);
        setLastUpdated(new Date());
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    }
  }, [projectId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchLiveShifts();

    // 15-second polling interval for live shift telemetry
    const interval = setInterval(fetchLiveShifts, 15000);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchLiveShifts]);

  return {
    gates,
    summary,
    isLoading,
    isError,
    error,
    lastUpdated,
    refresh: fetchLiveShifts,
  };
}
