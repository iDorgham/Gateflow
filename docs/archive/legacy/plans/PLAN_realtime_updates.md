# PLAN: Real-Time Live Updates

**Slug:** `realtime_updates`
**App:** `apps/client-dashboard` + `packages/db`
**Status:** Ready
**Source:** `docs/plan/context/IDEA_realtime_updates.md`
**Port:** 3001

---

## Context snapshot

### Existing state

| Asset | Location | Status |
|---|---|---|
| TanStack Query | `apps/client-dashboard` | In use across all data hooks |
| `useQRCodes` | `src/lib/qrcodes/use-qrcodes.ts` | `staleTime: 30s`, no `refetchInterval` |
| `useAnalyticsSummary` | `src/lib/analytics/use-analytics-summary.ts` | Already polls at 45s |
| `use-contacts`, `use-units` | `src/lib/residents/` | `useQuery`, no polling |
| QR create/delete routes | `src/app/api/qrcodes/route.ts` | No event emission |
| Scan validate route | `src/app/api/qrcodes/validate/route.ts` | No event emission |
| Resident visitor routes | `src/app/api/resident/visitors/route.ts` | No event emission (Phase 1 of resident_mobile) |
| `EventLog` model | `packages/db/prisma/schema.prisma` | Does not exist yet |
| SSE endpoint | — | Does not exist |
| `useRealtimeEvents` | — | Does not exist |

### Key architecture constraints

- **Stateless SSE** — uses DB polling inside the SSE loop; works on Vercel serverless (no in-memory pub/sub)
- **Cookie auth** — `EventSource` sends cookies automatically; use existing `requireAuth` with cookie reading
- **Single SSE connection per tab** — `useRealtimeEvents` mounted once in `shell.tsx`, not per-page
- **TanStack Query invalidation only** — SSE carries event type, not data; existing hooks re-fetch
- **Org-scoped** — every EventLog query and SSE stream is filtered to `auth.orgId`; no cross-tenant leakage
- **EventLog TTL** — prune rows older than 24h; not a soft-delete model (hard delete is correct here)
- pnpm only; `@gate-access/db` for Prisma; strict TypeScript

---

## Phases

| # | Title | Role | Files changed (est.) | Depends on |
|---|---|---|---|---|
| 1 | EventLog schema + emitEvent + mutation hooks | BACKEND-Database + BACKEND-API | 10–14 | — |
| 2 | SSE endpoint (`/api/events/stream`) | BACKEND-API + SECURITY | 3–4 | Phase 1 |
| 3 | Client hook + shell integration + fallback polling | FRONTEND | 4–6 | Phase 2 |
| 4 | Optimistic updates for QR create/delete/deny | FRONTEND | 4–6 | Phase 3 |

---

## Phase detail

### Phase 1 — EventLog schema + emitEvent + mutation hooks
**Goal:** Add the `EventLog` table to the schema, create the `emitEvent()` utility, and instrument every mutation route that should broadcast an event.

**Key deliverables:**
- `EventLog` model + `EventType` enum in schema
- `src/lib/realtime/emit-event.ts` — fire-and-forget helper
- Event emission in: QR create/delete, scan validate, resident visitor create/delete, contact create/update
- Pruning: delete EventLog rows older than 24h (called from emit-event on each write)
- Jest tests: emitEvent writes correctly; pruning removes old rows

**Acceptance criteria:**
- `prisma db push` succeeds
- After a QR is created, an `EventLog` row with `type: QR_CREATED` exists in DB
- After a scan, an `EventLog` row with `type: SCAN_RECORDED` exists
- Rows older than 24h are deleted on each emit call
- `pnpm turbo lint --filter=client-dashboard` passes
- `pnpm turbo typecheck --filter=client-dashboard` passes
- Tests pass

---

### Phase 2 — SSE endpoint
**Goal:** Build `GET /api/events/stream` — a stateless, org-scoped SSE endpoint that polls the EventLog table every 3s and pushes events to connected clients.

**Key deliverables:**
- `src/app/api/events/stream/route.ts`
- Cookie-based auth via `requireAuth`
- DB-polling loop: query EventLog where `orgId = auth.orgId AND createdAt > lastEventAt` every 3s
- SSE format: `data: {"type":"QR_CREATED"}\n\n`
- Keepalive: `: keepalive\n\n` every 15s if no events
- Max lifetime: 5 minutes, then close (client reconnects)
- Returns 401 if not authenticated

**Acceptance criteria:**
- `curl -N /api/events/stream` with valid cookie receives SSE events after a QR is created
- Returns 401 without auth
- Connection closes cleanly after 5 minutes
- No events from other orgs received
- `pnpm turbo typecheck --filter=client-dashboard` passes

---

### Phase 3 — Client hook + shell integration + fallback polling
**Goal:** Build `useRealtimeEvents()`, mount it in the dashboard shell, and add fallback `refetchInterval` to key hooks so data stays fresh even if SSE drops.

**Key deliverables:**
- `src/lib/realtime/use-realtime-events.ts` — `EventSource` + reconnect + `queryClient.invalidateQueries`
- Event-to-queryKey mapping function
- Mounted once in `components/dashboard/shell.tsx`
- `useQRCodes`: add `refetchInterval: 30_000`
- `useAnalyticsSummary`: reduce `refetchInterval` from 45_000 to 20_000
- `use-contacts`, `use-units`: add `refetchInterval: 30_000`

**Acceptance criteria:**
- Open QR page → create a QR from another tab → new row appears without reload within 3s
- Open analytics → trigger a scan → KPI counter increments within 3s
- Disconnect network → SSE reconnects with backoff when network returns
- `pnpm turbo lint --filter=client-dashboard` passes
- `pnpm turbo typecheck --filter=client-dashboard` passes

---

### Phase 4 — Optimistic updates for QR create/delete/deny
**Goal:** Make local mutations feel instant — update the TanStack Query cache immediately before the server responds. Roll back + toast on error.

**Key deliverables:**
- QR create: `onMutate` adds provisional row to `['qrcodes']` cache
- QR delete: `onMutate` removes row from cache
- Scan deny: `onMutate` updates row status to `DENIED` in cache
- `onError` rollback for all three + error toast
- `onSettled` triggers `queryClient.invalidateQueries` to sync with server truth

**Acceptance criteria:**
- QR create: row appears in table before API response returns
- QR delete: row disappears immediately on click (before API confirms)
- Network error on create: provisional row removed + toast shown
- `pnpm turbo lint --filter=client-dashboard` passes
- `pnpm turbo typecheck --filter=client-dashboard` passes

---

## TASKS tracking file
`docs/plan/execution/TASKS_realtime_updates.md`
