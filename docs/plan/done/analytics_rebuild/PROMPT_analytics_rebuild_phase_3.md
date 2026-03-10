# PROMPT_analytics_rebuild_phase_3 — Core Charts (Batch 1)

**Initiative:** analytics_rebuild  
**Plan:** `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`  
**Phase:** 3 of 6  

---

## Primary role

**FRONTEND** — Use this role when implementing Recharts (or Nivo) components, Card wrappers, and theme-based colors. Ensure responsive layout and RTL-friendly structure.

## Skills to load

- [x] gf-design-guide — dashboard charts, accessibility
- [x] tokens-design — fill/stroke from CSS vars
- [x] react — hooks, data fetching (SWR or React Query)

## MCP to use

| MCP | When |
|-----|------|
| Context7 | Recharts API (AreaChart, BarChart, PieChart, tooltips, responsive container) |

## Preferred tool

- [x] Cursor (default)

---

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard; analytics at `[locale]/dashboard/analytics/`
- **Prerequisites**: Phase 1 (layout, ChartCard, Skeleton, colors); Phase 2 (APIs for visits-over-time, top-gates, scan-outcome; heatmap already exists)
- **Refs**: `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`, `apps/client-dashboard/src/components/dashboard/analytics/`, `packages/ui`

---

## Goal

Implement the first four core charts: (1) Total Visits Over Time (area or line), (2) enhanced Peak Hours Heatmap with brand colors, (3) Top Gates by Traffic (donut or horizontal bar), (4) Scan Outcome (stacked bar + optional gauge). All must use the shared Card wrapper, theme colors only, and loading Skeleton.

---

## Scope (in)

- **Total Visits Over Time** — Recharts `AreaChart` or `LineChart`; data from visits-over-time API (or summary); X = date, Y = count; fill/stroke = `hsl(var(--primary))` or chart-1.
- **Peak Hours Heatmap** — Enhance existing `AnalyticsHeatmapChart`: ensure cells use primary/chart gradient; tooltips and legend; RTL-safe.
- **Top Gates by Traffic** — Recharts `PieChart` (donut) or `BarChart` (horizontal); data from top-gates API; use chart-1…chart-5 for segments.
- **Scan Outcome** — Recharts `BarChart` (stacked) with success = green (--success), failure = red (--destructive), override = muted/warning; optional small gauge for pass rate.

## Scope (out)

- New vs Returning, Unit Types, Visitor Type, Top Units (Phase 4).
- Incidents, Quota, Peak Days, UTM (Phase 5).
- i18n string additions beyond existing (Phase 6); use existing keys where possible.

---

## Steps (ordered)

1. **Total Visits Over Time**
   - Create component (e.g. `TotalVisitsChart` or `VisitsOverTimeChart`). Fetch from `/api/analytics/visits-over-time` (or equivalent) using SWR or React Query; use filters from `useAnalyticsFilters`. Render in `AnalyticsChartCard` with title and Skeleton when loading. Use Recharts `ResponsiveContainer`, `AreaChart`/`LineChart`, `XAxis`, `YAxis`, `Tooltip`, `Area`/`Line` with `fill` and `stroke` from chart color helper (e.g. `hsl(var(--primary))`).

2. **Peak Hours Heatmap**
   - Open existing `AnalyticsHeatmapChart`; replace any hard-coded colors with CSS variables (e.g. gradient from `var(--primary)` to `var(--primary)` with opacity, or chart-1…chart-5). Ensure tooltip and axis labels are present; ensure RTL layout does not break (use `dir` from locale).

3. **Top Gates by Traffic**
   - Create `TopGatesChart`. Fetch from top-gates API; render donut (PieChart with innerRadius) or horizontal BarChart. Use chart-1…chart-5 for segments/bars. Wrap in `AnalyticsChartCard`; loading Skeleton; empty state if no data.

4. **Scan Outcome**
   - Create `ScanOutcomeChart`. Fetch from scan-outcome API; stacked BarChart with bars colored by status (success/destructive/warning). Optionally add a small gauge or KPI for “Pass rate” in the same card. Wrap in `AnalyticsChartCard`; loading and empty states.

5. **Wire into analytics-client**
   - Add the new chart components to the analytics grid (from Phase 1). Place Total Visits (col-span-2 or full), Heatmap (col-span-2), Top Gates (col-span-1), Scan Outcome (col-span-1) or per design. Keep existing Security/Marketing mode logic; add these charts to the appropriate mode or show in both if desired (see plan).

6. **Run checks**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`

7. **Git** — Conventional commit (e.g. `feat(analytics): add Total Visits, Top Gates, Scan Outcome charts; brand colors on heatmap`).

---

## Acceptance criteria

- [ ] Total Visits Over Time renders with real or mocked data; uses theme primary/chart color.
- [ ] Heatmap uses only CSS variable–based colors; no hex.
- [ ] Top Gates and Scan Outcome render; success/destructive/warning semantics correct.
- [ ] All four use Card wrapper and Skeleton when loading.
- [ ] Lint and typecheck pass.

---

## Files likely touched

- `apps/client-dashboard/src/components/dashboard/analytics/TotalVisitsChart.tsx` (or VisitsOverTimeChart.tsx)
- `apps/client-dashboard/src/components/dashboard/analytics/TopGatesChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/ScanOutcomeChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsHeatmapChart.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/index.ts`
