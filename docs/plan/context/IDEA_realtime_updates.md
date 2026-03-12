# IDEA: Real-Time Live Updates

**Slug:** `realtime_updates`
**Status:** Ready to plan
**Created:** 2026-03-12
**PRD Reference:** PRD v6.0 §3.2 (client dashboard), §3.3 (scanner app)

---

## Problem

All GateFlow dashboards are static — data only refreshes on page load or manual reload. When a resident creates a QR from mobile, a gate operator scans a visitor, or a team member creates a new QR from another browser tab, none of the other open sessions see the change until they manually refresh.

Specific pain points:
- Resident creates a QR from mobile app → property manager sees it on QR page only after reload
- Gate scan happens → analytics KPIs stay stale until next page visit
- Security head watches the scan history page during a live event — misses scans in real time
- Admin deletes a QR → other logged-in users still see it until they reload

---

## Vision

Every open GateFlow dashboard reflects the current state of the world within seconds — without the user doing anything. The experience is:

- Resident creates QR on mobile → the QR row appears in the client dashboard QR table within 3 seconds
- Gate scan happens → the scan history table prepends the new row; analytics KPI counters increment
- QR is deactivated by an admin → row updates in-place (status badge changes) for all viewers

The implementation uses **Server-Sent Events (SSE) + TanStack Query invalidation** — no external service, no WebSocket complexity, no new infrastructure.

---

## Existing Assets

| Asset | Location | Notes |
|---|---|---|
| TanStack Query | `apps/client-dashboard` | Already used in `use-qrcodes.ts`, `use-analytics-summary.ts`, `use-contacts.ts`, `use-units.ts`, etc. |
| Analytics polling | `use-analytics-summary.ts:44` | Already has `refetchInterval: 45_000` — shows the pattern works |
| Upstash Redis | `apps/client-dashboard/src/lib/rate-limit.ts` | Available for cross-instance signaling if needed |
| QR hooks | `src/lib/qrcodes/use-qrcodes.ts` | `staleTime: 30s`, no `refetchInterval` — ready to hook up |
| Scan API | `src/app/api/qrcodes/validate/route.ts` | Creates ScanLog — good event emission point |
| QR create/delete | `src/app/api/qrcodes/route.ts` | Good event emission points |

---

## Architecture

### Transport: SSE (Server-Sent Events)

**Why SSE over WebSockets:**
- Next.js App Router supports SSE natively via `Response` with a `ReadableStream`
- One-way (server → client) is all we need — dashboards only receive, mutations go through normal REST APIs
- No external service (Pusher, Ably, etc.) needed
- Works with Vercel serverless if using DB-polling approach (stateless SSE)

**Why not just `refetchInterval`:**
- Polling every 10s means 6 requests/min/tab — wasteful at scale
- SSE keeps one long-lived connection; only triggers a re-fetch when data actually changed
- Better UX: update appears instantly (< 1s) vs up to 10s delay

### SSE endpoint: `GET /api/events/stream`

Stateless, DB-polling based (works in serverless/multi-instance environments):

```
Client connects → sends ?orgId=X&lastEventAt=<ISO timestamp>
Server loops every 3s:
  - Query: SELECT type, payload, createdAt FROM EventLog WHERE orgId = ? AND createdAt > lastEventAt ORDER BY createdAt ASC
  - If rows found: write SSE event lines, update lastEventAt
  - If no rows: write SSE comment (: keepalive\n\n) to keep connection alive
Client receives event → calls queryClient.invalidateQueries(eventTypeToQueryKey(type))
```

### New `EventLog` table (lightweight, append-only)

```prisma
model EventLog {
  id             String   @id @default(cuid())
  organizationId String
  type           EventType
  payload        Json     @default("{}")
  createdAt      DateTime @default(now())

  @@index([organizationId, createdAt])
}

enum EventType {
  QR_CREATED
  QR_UPDATED
  QR_DELETED
  SCAN_RECORDED
  CONTACT_CREATED
  CONTACT_UPDATED
}
```

EventLog rows are **written at mutation points** (after successful DB writes in API routes). They are retained for 24 hours then pruned (cron or on-read TTL check).

### Client hook: `useRealtimeEvents()`

```ts
// apps/client-dashboard/src/lib/realtime/use-realtime-events.ts
export function useRealtimeEvents() {
  // Opens EventSource to /api/events/stream
  // On each event: queryClient.invalidateQueries(eventTypeToQueryKey(type))
  // On error/close: reconnect with exponential backoff (max 30s)
  // Cleanup on unmount
}
```

Event-to-queryKey mapping:
```ts
QR_CREATED   → ['qrcodes']
QR_UPDATED   → ['qrcodes']
QR_DELETED   → ['qrcodes']
SCAN_RECORDED → ['scans'], ['analytics', 'summary']
CONTACT_CREATED → ['contacts']
CONTACT_UPDATED → ['contacts']
```

`useRealtimeEvents()` is mounted once in `shell.tsx` (the dashboard layout) — all child pages inherit the live invalidation without subscribing individually.

### Mobile triggers (no change needed)

The resident mobile app creates QRs via `POST /api/resident/visitors`. That route already writes to DB. **Phase 1 just adds an `EventLog` write after the QR is created.** The SSE stream picks it up within 3 seconds. No mobile-side SSE subscription needed.

---

## Scope

### In scope

**Phase 1 — EventLog model + emission points**
- Add `EventLog` model to schema + migration
- Write `emitEvent(orgId, type, payload)` utility in client-dashboard
- Add `emitEvent` calls to: QR create/delete, scan record (validate route), contact create/update
- Add `emitEvent` to resident API routes (`/api/resident/visitors` POST/DELETE)
- EventLog pruning: delete rows older than 24h (on-demand, called from the SSE route)

**Phase 2 — SSE endpoint**
- `GET /api/events/stream` — SSE handler with DB polling loop (3s interval)
- Auth: require valid access token (same `requireAuth` pattern)
- Org-scoped: only emit events for `auth.orgId`
- Keepalive comment every 15s
- Max connection lifetime: 5 minutes (client reconnects automatically)

**Phase 3 — Client hook + shell integration**
- `lib/realtime/use-realtime-events.ts` — `EventSource` + `queryClient.invalidateQueries`
- Reconnect logic with exponential backoff
- Mount in `components/dashboard/shell.tsx`
- Add `refetchInterval: 30_000` as fallback to `useQRCodes` and `use-scans` (if they exist) — ensures eventual consistency if SSE drops
- Reduce analytics `refetchInterval` from 45s to 20s

**Phase 4 — Optimistic updates on local mutations**
- QR create from dashboard: add entry to `['qrcodes']` cache immediately (before server confirms)
- QR delete: remove from cache immediately
- Scan deny: update row status immediately
- On error: roll back optimistic update + show toast

### Out of scope
- Admin dashboard real-time (separate initiative — admin data is platform-scoped, not org-scoped)
- WebSocket bidirectional communication
- External pub/sub service (Pusher, Ably, Supabase Realtime)
- Resident mobile receiving SSE events (mobile polls via normal refetch on app focus)
- Cross-org events or platform-wide broadcasts

---

## Tech Constraints

| Constraint | Detail |
|---|---|
| Serverless compatible | SSE uses DB polling, not in-memory state — works across Vercel function instances |
| Multi-tenant safe | SSE endpoint always scopes to `auth.orgId` — no cross-tenant leakage |
| Token auth | `EventSource` doesn't support custom headers; use short-lived query param token or cookie auth |
| EventLog size | Prune rows older than 24h; at 100 scans/min peak, this is ~144k rows/day — manageable |
| Soft deletes | EventLog is append-only; no `deletedAt` needed |

### Auth note for SSE
`EventSource` API in browsers cannot set custom headers. Solutions:
- **Cookie auth (preferred):** the existing `accessToken` cookie is sent automatically with the SSE request — `requireAuth` already reads cookies. No change needed.
- Fallback: short-lived query param token (if cookie-based auth fails in some environments)

---

## Success Criteria

| Metric | Target |
|---|---|
| QR appears after mobile create | Within 3 seconds in open dashboard |
| Scan appears in history | Within 3 seconds of gate scan |
| Analytics KPI increments | Within 3 seconds of scan |
| SSE connection drop recovery | Auto-reconnect within 5 seconds |
| No cross-tenant event leakage | 0 events from other orgs ever received |
| No page reload needed | User never needs to reload to see fresh data |
| Fallback on SSE failure | `refetchInterval` ensures data never > 30s stale |

---

## Risks

| Risk | Mitigation |
|---|---|
| EventLog table grows large | 24h TTL pruning on every SSE request; add DB index on `createdAt` |
| SSE connection limit per browser (6 per domain in HTTP/1.1) | Only one `useRealtimeEvents` instance mounted in shell — single connection per tab |
| Cookie auth not sent with EventSource cross-origin | Same-origin API — cookies sent automatically |
| Optimistic update creates UI flicker on error | Use TanStack Query's `onMutate/onError/onSettled` pattern; toast on rollback |

---

## Proposed Phase Breakdown (for /plan)

| Phase | Deliverable |
|---|---|
| 1 | `EventLog` schema + `emitEvent()` utility + emission in all mutation routes |
| 2 | `GET /api/events/stream` SSE endpoint (DB-polling, org-scoped, cookie auth) |
| 3 | `useRealtimeEvents()` hook + shell integration + fallback `refetchInterval` |
| 4 | Optimistic updates for QR create/delete/deny mutations |
