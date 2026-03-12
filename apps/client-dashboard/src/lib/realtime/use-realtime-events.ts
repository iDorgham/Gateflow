'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/** Maps SSE event type strings to TanStack Query keys to invalidate. */
const EVENT_QUERY_MAP: Record<string, string[][]> = {
  QR_CREATED:          [['qrcodes']],
  QR_UPDATED:          [['qrcodes']],
  QR_DELETED:          [['qrcodes']],
  SCAN_RECORDED:       [['scans'], ['analytics', 'summary']],
  CONTACT_CREATED:     [['contacts']],
  CONTACT_UPDATED:     [['contacts']],
  VISITOR_QR_CREATED:  [['qrcodes'], ['contacts']],
  VISITOR_QR_DELETED:  [['qrcodes']],
};

/**
 * Opens a single SSE connection to /api/events/stream and maps incoming
 * events to TanStack Query cache invalidations so every open page
 * reflects mutations within ~3 seconds — no page reload needed.
 *
 * Mount once in DashboardShell. One connection per tab.
 * Reconnects automatically with exponential backoff on failure.
 */
export function useRealtimeEvents(): void {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = useRef(1_000); // start 1 s, doubles on each failure, max 30 s
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    function connect() {
      if (!mountedRef.current) return;

      // Close any existing connection before opening a new one
      esRef.current?.close();

      const es = new EventSource('/api/events/stream');
      esRef.current = es;

      es.onopen = () => {
        // Reset backoff on successful connection
        backoffRef.current = 1_000;
      };

      es.onmessage = (event: MessageEvent) => {
        try {
          const { type } = JSON.parse(event.data as string) as { type: string };
          const keys = EVENT_QUERY_MAP[type];
          if (keys) {
            keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
          }
        } catch {
          // Malformed event — ignore silently
        }
      };

      es.onerror = () => {
        es.close();
        esRef.current = null;

        if (!mountedRef.current) return;

        // Exponential backoff: 1 s → 2 s → 4 s → … → 30 s max
        const delay = Math.min(backoffRef.current, 30_000);
        backoffRef.current = delay * 2;

        reconnectTimerRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      mountedRef.current = false;
      esRef.current?.close();
      esRef.current = null;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };
    // queryClient is stable — no need to list as dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
