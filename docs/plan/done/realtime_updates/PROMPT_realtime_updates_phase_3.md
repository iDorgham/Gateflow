# Phase 3: Client Hook + Shell Integration + Fallback Polling

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/client-dashboard`
- **Refs**:
  - `apps/client-dashboard/src/components/dashboard/shell.tsx` — mount hook here (once per session)
  - `apps/client-dashboard/src/lib/qrcodes/use-qrcodes.ts` — add `refetchInterval`
  - `apps/client-dashboard/src/lib/analytics/use-analytics-summary.ts` — reduce poll from 45s to 20s
  - `apps/client-dashboard/src/lib/residents/use-contacts.ts` — add `refetchInterval`
  - `apps/client-dashboard/src/lib/residents/use-units.ts` — add `refetchInterval`
  - `apps/client-dashboard/src/app/api/events/stream/route.ts` — Phase 2 output

## Goal
Build `useRealtimeEvents()` — a client hook that opens an `EventSource` to `/api/events/stream`, maps incoming events to TanStack Query invalidations, and reconnects automatically on failure. Mount it once in `shell.tsx` so all dashboard pages benefit without any per-page changes.

## Scope (in)

**`src/lib/realtime/use-realtime-events.ts`**:

```ts
'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Maps SSE event type → TanStack Query keys to invalidate
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

export function useRealtimeEvents() {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = useRef(1000); // start at 1s, max 30s

  function connect() {
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource('/api/events/stream');
    esRef.current = es;

    es.onopen = () => {
      backoffRef.current = 1000; // reset backoff on successful connect
    };

    es.onmessage = (event) => {
      try {
        const { type } = JSON.parse(event.data) as { type: string };
        const keys = EVENT_QUERY_MAP[type] ?? [];
        keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      } catch {
        // Malformed event — ignore
      }
    };

    es.onerror = () => {
      es.close();
      esRef.current = null;
      // Reconnect with exponential backoff (max 30s)
      const delay = Math.min(backoffRef.current, 30_000);
      backoffRef.current = delay * 2;
      reconnectTimer.current = setTimeout(connect, delay);
    };
  }

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
```

**Mount in `components/dashboard/shell.tsx`**:
- Import `useRealtimeEvents` and call it at the top of the shell component
- Must be in a `'use client'` component (shell already is)
- One call = one SSE connection per browser tab

**Update polling intervals in existing hooks**:

`src/lib/qrcodes/use-qrcodes.ts`:
```ts
// Add to useQuery options:
refetchInterval: 30_000,
refetchOnWindowFocus: true,
```

`src/lib/analytics/use-analytics-summary.ts`:
```ts
// Change from 45_000 to:
const POLL_INTERVAL_MS = 20_000;
```

`src/lib/residents/use-contacts.ts`:
```ts
refetchInterval: 30_000,
refetchOnWindowFocus: true,
```

`src/lib/residents/use-units.ts`:
```ts
refetchInterval: 30_000,
refetchOnWindowFocus: true,
```

These `refetchInterval` values are the **fallback** — they ensure data never stays stale if the SSE connection drops. SSE invalidation is the primary path; polling is the safety net.

## Steps (ordered)
1. Create `apps/client-dashboard/src/lib/realtime/use-realtime-events.ts`.
2. Read `apps/client-dashboard/src/components/dashboard/shell.tsx`.
3. Add `useRealtimeEvents()` call inside the shell component body.
4. Read and update `src/lib/qrcodes/use-qrcodes.ts` — add `refetchInterval` + `refetchOnWindowFocus`.
5. Read and update `src/lib/analytics/use-analytics-summary.ts` — change `POLL_INTERVAL_MS` to 20_000.
6. Read and update `src/lib/residents/use-contacts.ts` — add `refetchInterval` + `refetchOnWindowFocus`.
7. Read and update `src/lib/residents/use-units.ts` — add `refetchInterval` + `refetchOnWindowFocus`.
8. **End-to-end test** (manual):
   - Open client dashboard QR page in browser tab A
   - In browser tab B (or Postman), create a new QR via `POST /api/qrcodes`
   - Tab A: verify new QR row appears in table within 3 seconds without reload
   - Open analytics page: trigger a scan → verify KPI counter increments within 3s
9. Run `pnpm turbo lint --filter=client-dashboard`.
10. Run `pnpm turbo typecheck --filter=client-dashboard`.
11. Commit: `feat(realtime): useRealtimeEvents hook + shell integration + fallback polling (phase 3)`.

## Scope (out)
- Optimistic updates (Phase 4)
- Admin dashboard real-time
- Mobile SSE subscription

## Acceptance criteria
- [ ] `useRealtimeEvents` is mounted once in shell; a single `EventSource` per tab is opened
- [ ] QR created in another tab → appears in QR table within 3 seconds without reload
- [ ] Scan recorded → analytics KPI counter updates within 3 seconds
- [ ] SSE connection drops (test by stopping dev server briefly) → reconnects within backoff delay
- [ ] `useQRCodes` has `refetchInterval: 30_000` as fallback
- [ ] Analytics poll interval is 20s (was 45s)
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes

## Files likely touched
- `apps/client-dashboard/src/lib/realtime/use-realtime-events.ts` (new)
- `apps/client-dashboard/src/components/dashboard/shell.tsx` (updated)
- `apps/client-dashboard/src/lib/qrcodes/use-qrcodes.ts` (updated)
- `apps/client-dashboard/src/lib/analytics/use-analytics-summary.ts` (updated)
- `apps/client-dashboard/src/lib/residents/use-contacts.ts` (updated)
- `apps/client-dashboard/src/lib/residents/use-units.ts` (updated)

## Git commit
```
feat(realtime): useRealtimeEvents hook + shell integration + fallback polling (phase 3)
```
