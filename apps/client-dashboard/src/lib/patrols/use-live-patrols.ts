'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PatrolRunDto, PatrolRouteDto } from '@gate-access/types';
import type {
  LivePatrolSummary,
  LivePatrolsResponse,
} from '@/app/api/patrols/live/route';

export type { LivePatrolSummary, LivePatrolsResponse };

export interface UseLivePatrolsResult {
  activeRuns: PatrolRunDto[];
  routes: PatrolRouteDto[];
  summary: LivePatrolSummary | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

/**
 * Builds the live patrols API URL.
 */
export function buildLivePatrolsUrl(origin: string = ''): string {
  const base =
    origin ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost');
  return new URL('/api/patrols/live', base).toString();
}

/**
 * Validates and extracts live patrol telemetry from an API response.
 */
export function parseLivePatrolPayload(json: unknown): {
  activeRuns: PatrolRunDto[];
  routes: PatrolRouteDto[];
  summary: LivePatrolSummary | null;
} {
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid response structure');
  }

  const payload = json as {
    success?: boolean;
    activeRuns?: PatrolRunDto[];
    routes?: PatrolRouteDto[];
    summary?: LivePatrolSummary;
    message?: string;
  };

  if (payload.success === false) {
    throw new Error(
      payload.message || 'API request returned unsuccessful status'
    );
  }

  return {
    activeRuns: Array.isArray(payload.activeRuns) ? payload.activeRuns : [],
    routes: Array.isArray(payload.routes) ? payload.routes : [],
    summary: payload.summary || null,
  };
}

/**
 * React hook for polling live perimeter guard patrol telemetry.
 *
 * @param pollIntervalMs - Polling interval in ms (default: 10,000ms = 10s)
 */
export function useLivePatrols(
  pollIntervalMs: number = 10000
): UseLivePatrolsResult {
  const [activeRuns, setActiveRuns] = useState<PatrolRunDto[]>([]);
  const [routes, setRoutes] = useState<PatrolRouteDto[]>([]);
  const [summary, setSummary] = useState<LivePatrolSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const mountedRef = useRef(true);

  const fetchTelemetry = useCallback(async () => {
    try {
      const url = buildLivePatrolsUrl();
      const res = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      const parsed = parseLivePatrolPayload(json);

      if (mountedRef.current) {
        setActiveRuns(parsed.activeRuns);
        setRoutes(parsed.routes);
        setSummary(parsed.summary);
        setIsError(false);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setIsError(true);
        setError(errorObj);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchTelemetry();

    if (pollIntervalMs > 0) {
      const interval = setInterval(fetchTelemetry, pollIntervalMs);
      return () => {
        mountedRef.current = false;
        clearInterval(interval);
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [fetchTelemetry, pollIntervalMs]);

  return {
    activeRuns,
    routes,
    summary,
    isLoading,
    isError,
    error,
    lastUpdated,
    refresh: fetchTelemetry,
  };
}
