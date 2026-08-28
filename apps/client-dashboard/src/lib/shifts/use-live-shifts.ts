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

/**
 * Builds the live shifts API URL, optionally scoped to a project.
 *
 * @param origin - The base origin used to construct the URL
 * @param projectId - The project identifier to include in the query string
 * @returns The fully qualified live shifts API URL
 */
export function buildLiveShiftsUrl(
  origin: string,
  projectId?: string | null
): string {
  const url = new URL('/api/shifts/live', origin);
  if (projectId) {
    url.searchParams.set('project', projectId);
  }
  return url.toString();
}

/**
 * Validates and extracts live shift telemetry from an API response.
 *
 * @param json - The response value to validate and parse
 * @returns The gate telemetry and shift summary, using empty or null defaults when omitted
 * @throws If the response structure is invalid or indicates an API failure
 */
export function parseLiveShiftPayload(json: unknown): {
  gates: LiveGateShiftTelemetry[];
  summary: LiveShiftSummary | null;
} {
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid response structure');
  }
  const payload = json as {
    success?: boolean;
    message?: string;
    data?: {
      gates?: LiveGateShiftTelemetry[];
      summary?: LiveShiftSummary;
    };
  };

  if (!payload.success) {
    throw new Error(payload.message || 'API returned failure');
  }

  return {
    gates: payload.data?.gates ?? [],
    summary: payload.data?.summary ?? null,
  };
}

/**
 * Fetches and periodically refreshes live shift telemetry for an optional project.
 *
 * @param projectId - Identifies the project whose shift telemetry should be fetched
 * @returns The current gate telemetry, summary, request status, last update time, and refresh function
 */
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

      const targetUrl = buildLiveShiftsUrl(
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3001',
        projectId
      );

      const res = await fetch(targetUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch shifts: ${res.status} ${res.statusText}`
        );
      }

      const json = await res.json();
      const parsed = parseLiveShiftPayload(json);

      if (mountedRef.current) {
        setGates(parsed.gates);
        setSummary(parsed.summary);
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
