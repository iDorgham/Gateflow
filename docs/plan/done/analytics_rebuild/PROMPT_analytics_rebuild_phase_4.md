# PROMPT_analytics_rebuild_phase_4 — Core Charts (Batch 2)

**Initiative:** analytics_rebuild  
**Plan:** `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`  
**Phase:** 4 of 6  

---

## Primary role

**FRONTEND** — Use this role when implementing Recharts components for New vs Returning, Unit Types ranking, Visitor Type distribution, and Top Active Units. Maintain Card wrapper, theme colors, and RTL-friendly layout.

## Skills to load

- [x] gf-design-guide — chart layout, legends, tooltips
- [x] tokens-design — chart palette from CSS vars
- [x] gf-i18n — RTL and Arabic labels if adding new strings

## MCP to use

| MCP | When |
|-----|------|
| Context7 | Recharts stacked bar/area, PieChart, BarChart horizontal |

## Preferred tool

- [x] Cursor (default)

---

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard; analytics components under `components/dashboard/analytics/`
- **Prerequisites**: Phases 1–3 (layout, APIs, first batch of charts)
- **Refs**: `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`, `IDEA_analytics_rebuild.md`

---

## Goal

Implement the second batch of core charts: (1) New vs Returning Visitors (stacked area or stacked bar), (2) Unit Types Visit Ranking (horizontal bar), (3) Visitor Type Distribution (donut or treemap), (4) Top Active Units/Residents (horizontal bar, top 10). All use shared Card wrapper, theme colors, and loading/empty states.

---

## Scope (in)

- **New vs Returning** — Stacked area or stacked bar; data from API (or stub if first-scan vs repeat not in schema). Use primary vs muted or chart-1/chart-2.
- **Unit Types Visit Ranking** — Horizontal BarChart; data from unit-types API; sort by count descending; chart-1 for bars.
- **Visitor Type Distribution** — Donut (PieChart) or treemap (Recharts Treemap if available); data from visitor-type API or stub; chart-1…chart-5.
- **Top Active Units** — Horizontal BarChart, top 10; data from top-units API or stub; chart-1.

## Scope (out)

- Incidents, Quota, Peak Days, UTM (Phase 5).
- Full i18n pass (Phase 6); use existing analytics keys where possible.

---

## Steps (ordered)

1. **New vs Returning**
   - Create `NewVsReturningChart`. Fetch from new-vs-returning API if implemented in Phase 2, or use stub (e.g. two series: “New” / “Returning” with placeholder counts). Recharts `AreaChart` stacked or `BarChart` stacked; theme colors. Wrap in `AnalyticsChartCard`; loading and empty states.

2. **Unit Types Visit Ranking**
   - Create `UnitTypesRankingChart`. Fetch from unit-types API; horizontal `BarChart`; Y = unit type label, X = count. Wrap in Card; loading/empty.

3. **Visitor Type Distribution**
   - Create `VisitorTypeChart`. Fetch from visitor-type API or stub; `PieChart` (donut) or Recharts `Treemap`; use chart-1…chart-5. Wrap in Card; loading/empty.

4. **Top Active Units**
   - Create `TopUnitsChart`. Fetch from top-units API or stub; horizontal `BarChart` (top 10); show unit label and count. Wrap in Card; loading/empty; handle stub (“No unit data” or similar).

5. **Wire into analytics-client**
   - Add the four components to the analytics grid. Place them in logical order (e.g. New vs Returning col-span-2, Unit Types and Visitor Type each col-span-1, Top Units col-span-1 or 2). Preserve Security/Marketing mode behavior as per plan.

6. **Run checks**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`

7. **Git** — Conventional commit (e.g. `feat(analytics): add New vs Returning, Unit Types, Visitor Type, Top Units charts`).

---

## Acceptance criteria

- [ ] All four charts render with real or stubbed data; use only theme/CSS variable colors.
- [ ] Each chart is inside the shared Card wrapper with loading and empty states.
- [ ] Layout is responsive; RTL does not break (use existing dir/locale).
- [ ] Lint and typecheck pass.

---

## Files likely touched

- `apps/client-dashboard/src/components/dashboard/analytics/NewVsReturningChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/UnitTypesRankingChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/VisitorTypeChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/TopUnitsChart.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/index.ts`
