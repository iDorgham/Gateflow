# PROMPT_analytics_dashboard_phase_4 — Polish & Real-time

**Initiative:** analytics_dashboard  
**Plan:** `docs/plan/execution/PLAN_analytics_dashboard.md`  
**Phase:** 4 of 4  

---

## Primary role

**FRONTEND** (export/share, mobile) + **BACKEND-API** (WebSocket, caching doc)

## Preferred tool

- **Cursor** (default)

---

## Context

- **Project**: GateFlow (Turborepo, pnpm)
- **Phases 1–3**: Dashboard shell, Security heatmap, Marketing funnel, KPIs, export
- **Targets**: Load <2s cached / <4s cold; filter change → chart update <800ms; cache hit rate >85%
- **Refs**: `PLAN_analytics_dashboard.md`, CACHE_STRATEGY (to be created)

---

## Goal

Polish the analytics dashboard: WebSocket for live KPI updates (with short-polling fallback), export/share (PNG, shareable URL), mobile optimizations, and performance tuning with caching documentation.

---

## Scope (in)

- WebSocket channel `org:{orgId}:analytics` — events: `scan.created`, `scan.denied`, `qr.created`
- Client subscribes; updates KPI counts and trend arrows when events arrive
- Fallback: keep short-polling if WebSocket unavailable
- Export & share: export chart as PNG; copy shareable dashboard URL
- Mobile: collapsible filter accordion, horizontal scroll KPI cards, stacked layout, touch-friendly
- Performance: ensure React Query or similar caching; document strategy in `docs/plan/execution/CACHE_STRATEGY_analytics.md` or `docs/guides/`
- Load and interaction targets: <2s cached, <4s cold, <800ms filter→chart

## Scope (out)

- Geospatial heatmap
- Dashboard widget builder / drag-drop
- Anomaly detection ML

---

## Steps (ordered)

1. **WebSocket integration**
   - Backend: create WebSocket endpoint or use existing real-time infra (if any)
   - Channel: `org:{orgId}:analytics`; emit on ScanLog.create, QRCode.create (via webhook or DB trigger if applicable)
   - Client: subscribe; on `scan.created` / `scan.denied` / `qr.created`, update KPI state or invalidate React Query
   - Fallback: if WebSocket fails or not configured, keep 30–60s short-polling
   - Document in CACHE_STRATEGY or README

2. **Export chart as PNG**
   - Use Recharts `toDataURL` or html2canvas (or Recharts export utility)
   - Button "Export chart" → download PNG
   - Optional: export full dashboard as PDF (lower priority)

3. **Shareable URL**
   - "Copy link" button — copies current URL with filters (already in URL from Phase 1)
   - Optional: short URL service (stretch)
   - Tooltip: "Share this dashboard view"

4. **Mobile optimizations**
   - Filter bar: collapsible accordion on small viewport
   - KPI cards: horizontal scroll (overflow-x-auto) or 2-column grid on mobile
   - Charts: full width, responsive
   - Touch targets: min 44px for buttons
   - Test on 375px width

5. **Performance tuning**
   - React Query: cache keys include filter params; staleTime 30s–1min for summary/heatmap
   - Ensure no unnecessary re-fetches on filter change (debounce if needed)
   - Lazy-load secondary charts
   - Measure: Lighthouse or manual; aim <2s cached, <4s cold

6. **Caching documentation**
   - Create `docs/plan/execution/CACHE_STRATEGY_analytics.md` or add section to existing docs
   - Document: Redis keys (heatmap, summary), TTLs, invalidation triggers, WebSocket events
   - Fallback behavior when Redis unavailable

7. **Run checks**
   - `pnpm preflight` for client-dashboard
   - Manual: load dashboard, change filter, measure time to chart update

8. **Git** — conventional commit, push

---

## Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **browser-use** | Mobile check | "Open dashboard at localhost:3001 on narrow viewport (375px), verify filter accordion, KPI scroll, chart responsiveness." |

---

## Acceptance criteria

- [ ] WebSocket updates KPIs when scan/qr events occur (or short-polling works)
- [ ] "Export chart" downloads PNG
- [ ] "Copy link" copies shareable URL with filters
- [ ] Mobile layout: filter accordion, KPI scroll, responsive charts
- [ ] Load <2s (cached) / <4s (cold) where feasible
- [ ] Filter change → chart update <800ms
- [ ] CACHE_STRATEGY or docs updated
- [ ] `pnpm preflight` passes

---

## Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/` (WebSocket hook, export, share, mobile styles)
- `apps/client-dashboard/src/app/api/` (WebSocket route if new)
- `docs/plan/execution/CACHE_STRATEGY_analytics.md` or `docs/guides/`
- `apps/client-dashboard/package.json` (if adding html2canvas or export lib)
