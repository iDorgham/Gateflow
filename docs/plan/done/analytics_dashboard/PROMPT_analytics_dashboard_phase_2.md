# PROMPT_analytics_dashboard_phase_2 — Security View Depth

**Initiative:** analytics_dashboard  
**Plan:** `docs/plan/execution/PLAN_analytics_dashboard.md`  
**Phase:** 2 of 4  

---

## Primary role

**BACKEND-API** (heatmap, aggregations) + **FRONTEND** (charts, anomaly cards, operator leaderboard)

Use BACKEND-API role for new endpoints and Prisma aggregations; FRONTEND for Recharts and UI components.

## Preferred tool

- **Cursor** (default)

---

## Context

- **Project**: GateFlow (Turborepo, pnpm)
- **Phase 1 deliverable**: Dashboard shell with mode toggle, filter bar, KPI row, placeholders
- **Schema**: `packages/db/prisma/schema.prisma` — ScanLog, Gate, User, QRCode
- **Existing**: `apps/client-dashboard/src/app/[locale]/dashboard/analytics/` with heatmap types in analytics-charts
- **Refs**: `PLAN_analytics_dashboard.md`, `CLAUDE.md`

---

## Goal

Implement full Security view: heatmap API and chart (day×hour), threat/anomaly cards, operator leaderboard, and short-polling KPI refresh. Cache heatmap data in Redis when available.

---

## Scope (in)

- `/api/analytics/heatmap` — GET endpoint: dateFrom, dateTo, projectId, gateId; returns day-of-week × hour matrix (0–6, 0–23) with counts; org-scoped, `deletedAt: null`
- Heatmap chart component (Recharts or custom matrix) — MENA weekend (Fri–Sat) visible
- Threat/anomaly cards: simple rules (e.g. denied >5% of total, spike in last hour)
- Operator leaderboard: top users by scan count in range; API + UI
- Short-polling for KPI refresh (30–60s interval)
- Redis caching for heatmap buckets (5–15 min TTL) if `UPSTASH_REDIS_*` env vars present; fallback to direct query

## Scope (out)

- WebSocket real-time (Phase 4)
- Marketing funnel or campaign charts
- UTM attribution
- Tag/persona breakdown

---

## Steps (ordered)

1. **Implement `/api/analytics/heatmap`**
   - Auth via `requireAuth`
   - Parse query: dateFrom, dateTo, projectId, gateId
   - Prisma: `ScanLog` grouped by `dayOfWeek(scannedAt)`, `hour(scannedAt)`; filter by gate, project (via Gate), orgId
   - Return `{ data: { dow: number; hour: number; count: number }[] }`
   - Add Redis cache key `analytics:heatmap:{orgId}:{dateFrom}:{dateTo}:{projectId}:{gateId}` with 5–15 min TTL when Redis available

2. **Implement `/api/analytics/summary`** (if not exists)
   - KPI metrics: totalVisits, passRate, peakHour, uniqueVisitors (stub if no contact link), deniedCount, attributedScans (stub 0)
   - Same filter params as heatmap
   - Used by KPI cards and short-polling

3. **Implement `/api/analytics/operators`**
   - Top users (operators) by scan count in date range
   - Org-scoped, join User

4. **Build heatmap chart**
   - Consume heatmap API
   - X: hours 0–23, Y: days Sun–Sat (or localized)
   - Color intensity by count
   - Click cell → optional filter drill-down (future enhancement)

5. **Build threat/anomaly cards**
   - Rule 1: Denied % > 5% → show alert card
   - Rule 2: Last hour scan count > 2× hourly average → spike alert
   - Fetch from summary or small dedicated query
   - Display as 1–2 compact cards above or beside heatmap

6. **Build operator leaderboard**
   - Table or list of top 10 operators with scan counts
   - Consume `/api/analytics/operators`

7. **Add short-polling for KPIs**
   - `useEffect` + `setInterval` 30–60s to refetch summary
   - Or use React Query `refetchInterval`
   - Invalidate on filter change

8. **Wire Security mode**
   - When mode=Security, primary chart = heatmap; secondary = operator leaderboard or anomaly cards
   - Ensure filters from Phase 1 flow to new API calls

9. **Run checks**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`

10. **Git** — conventional commit, push

---

## Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Check Prisma date grouping | "How does Prisma group by dayOfWeek and hour from DateTime? Show raw SQL or Prisma syntax." |
| **shell** | Verify Redis | "Check if UPSTASH_REDIS_REST_URL is set in client-dashboard .env; run a simple Redis ping if possible." |

---

## Acceptance criteria

- [ ] `/api/analytics/heatmap` returns correct day×hour matrix for org
- [ ] Heatmap chart renders with correct dimensions and colors
- [ ] Anomaly cards show when rules trigger
- [ ] Operator leaderboard displays top operators
- [ ] KPIs refresh every 30–60s when dashboard is open
- [ ] Redis caches heatmap when configured; no error when Redis unavailable
- [ ] `pnpm preflight` passes for client-dashboard

---

## Files likely touched

- `apps/client-dashboard/src/app/api/analytics/heatmap/route.ts` (new)
- `apps/client-dashboard/src/app/api/analytics/summary/route.ts` (new or extend)
- `apps/client-dashboard/src/app/api/analytics/operators/route.ts` (new)
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/` (heatmap chart, anomaly cards, operator leaderboard)
- `apps/client-dashboard/src/lib/` (Redis cache helper if needed)
