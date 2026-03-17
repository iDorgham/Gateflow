# PLAN_analytics_rebuild — Analytics Dashboard Rebuild (12–18 Charts)

**Initiative:** analytics_rebuild  
**Source:** `docs/plan/context/IDEA_analytics_rebuild.md`  
**Primary product spec:** `docs/PRD_v7.0.md` (Client Dashboard, Analytics)  
**Related:** Existing analytics at `apps/client-dashboard/src/app/[locale]/dashboard/analytics/`, execution `PLAN_analytics_dashboard` (done)  
**Owner:** Product + Engineering  
**Status:** Draft (planning) — use `/plan ready analytics_rebuild` when approved  
**Estimated total:** 6 phases, ~4–6 weeks  
**Task checklist:** `docs/plan/planning/analytics_rebuild/TASKS_analytics_rebuild.md` (optional)

---

## 1. Objectives

Transform the current analytics page into a **modern, data-rich dashboard** with 12–18 chart types, brand-aligned visuals (CSS variables / Tailwind), responsive grid, Card-wrapped charts, tooltips/legends/hover, RTL/i18n, loading states (Skeleton), and consistent GateFlow UI/UX.

**Core goals:**
- 12–18 chart types from the agreed list (Total Visits Over Time, New vs Returning, Peak Hours Heatmap, Unit Types, Top Gates, Scan Outcome, Visitor Type, Incidents, Quota, UTM, Peak Days, Top Units, + stretch).
- All chart colors from theme: `var(--primary)`, `var(--success)`, `var(--destructive)`, `var(--muted)`, `var(--chart-1)` … `var(--chart-5)` (no hard-coded hex).
- Responsive layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`; wide charts (heatmap, trends) use `col-span-2` or `col-span-full`.
- Every chart in `<Card>` with `<CardHeader>` (title + tooltip) and `<CardContent>`.
- Data from existing or new `/api/analytics/*` endpoints; Prisma aggregations; filters (date range, gate, project, unit type); SWR or React Query; org scope and RBAC.

---

## 2. Prerequisites & Dependencies

| Dependency | Status | Notes |
|------------|--------|------|
| Existing analytics page | Exists | `page.tsx`, `analytics-client.tsx`, KPI cards, heatmap, funnel, campaign bar, etc. |
| Existing APIs | Exist | `/api/analytics/summary`, `heatmap`, `funnel`, `campaigns`, `operators`, `export` |
| Recharts | In use | Prefer for all charts; Nivo only if heatmap/funnel need it |
| @gate-access/ui | Exists | Card, Skeleton, shadcn-style components |
| Design tokens | Exist | `packages/ui/src/tokens.ts`, `globals.css` (--primary, --chart-1..5, --success, --destructive) |
| ScanLog / QRCode schema | Exists | Prisma; groupBy by createdAt, status, gateId, etc. |
| UTM / Resident Quota | Partial | UTM on QRCode/ScanLog if present; Resident/Unit/Quota per PRD Phase 2 |

---

## 3. High-Level Phases

| # | Phase | Primary role | Summary |
|---|--------|--------------|---------|
| 1 | Design tokens & layout | FRONTEND | Chart color palette from CSS vars; responsive grid; Card wrappers; Skeleton; top section KPI + filters |
| 2 | API & data layer | BACKEND-API + BACKEND-Database | New/updated analytics endpoints and shared types; Prisma groupBy; org scope, RBAC |
| 3 | Core charts (batch 1) | FRONTEND | Total Visits Over Time, Peak Hours Heatmap (enhance), Top Gates, Scan Outcome (stacked bar + gauge) |
| 4 | Core charts (batch 2) | FRONTEND | New vs Returning, Unit Types ranking, Visitor Type distribution, Top Active Units |
| 5 | Extended charts | FRONTEND + BACKEND-API | Incidents by Gate/Operator, Resident Quota, Peak Days, UTM Attribution; stretch: Dwell Time, QR trends, Expired QR, Gate by Shift |
| 6 | Polish & export | FRONTEND + i18n | RTL/i18n pass, loading/error/empty states, CSV export, dark mode, tests |

---

## 4. Phase 1 — Design Tokens & Layout

**Primary role:** FRONTEND  
**Estimated:** 3–5 days

**Scope**
- Ensure chart color palette uses only CSS variables / Tailwind: `--primary`, `--success`, `--destructive`, `--muted`, `--chart-1` … `--chart-5`. Document in plan or `docs/DESIGN_TOKENS.md` if needed.
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`; wide charts `col-span-2` or `col-span-full`.
- Top section: KPI cards row + global filters row (date range, gate, project, unit type).
- Wrap every chart area in `<Card>` with `<CardHeader>` (title + tooltip icon) and `<CardContent>`.
- Add Skeleton loading from `@gate-access/ui` for chart placeholders.
- Refactor `analytics-client.tsx` / page layout to this grid; keep existing mode toggle and filter bar.

**Deliverables**
- Updated analytics page layout (grid, KPI row, filters).
- Shared chart wrapper component (Card + title + tooltip) and Skeleton usage.
- Chart color helper or docs: map semantic (primary/success/destructive) to Recharts/Nivo props.

**Depends on:** None

**Test criteria**
- Layout is responsive; wide charts span correctly.
- All new chart placeholders use Card + Skeleton.
- No hard-coded hex in chart-related code; colors from theme.
- `pnpm turbo lint --filter=client-dashboard` and typecheck pass.

---

## 5. Phase 2 — API & Data Layer

**Primary role:** BACKEND-API + BACKEND-Database

**Scope**
- New or updated API routes under `apps/client-dashboard/src/app/api/analytics/` for:
  - Visits over time (time series: day/hour, count)
  - New vs returning (if data: first scan vs repeat; else stub)
  - Unit types visit ranking (groupBy unit type or project metadata)
  - Top gates by traffic (count by gateId)
  - Scan outcome (groupBy status: SUCCESS, DENIED, OVERRIDE)
  - Visitor type distribution (e.g. QRCode type or stub)
  - Incidents by gate/operator (denied/override counts)
  - Resident quota usage (if Unit/Resident models exist; else stub)
  - Peak days (day-of-week counts)
  - Top active units (top 10 by scan count)
- All routes: `requireAuth`, scope by `organizationId`, `deletedAt: null`, validate projectId/gateId.
- Shared TypeScript types for analytics responses (`@gate-access/types` or local in client-dashboard).
- Filters: dateFrom, dateTo, projectId, gateId, unitType; consistent query schema.

**Deliverables**
- New route files and shared types.
- Example Prisma snippets (groupBy on ScanLog, QRCode, Gate) for 3–4 key charts.
- Security: no cross-org data; RBAC respected.

**Depends on:** Phase 1 (layout can proceed in parallel; data consumed in phases 3–5)

**Test criteria**
- Each new endpoint returns valid JSON; respects filters and org.
- Lint, typecheck, and existing tests pass.

---

## 6. Phase 3 — Core Charts (Batch 1)

**Primary role:** FRONTEND

**Scope**
- **Total Visits Over Time** — Multi-line or area chart (Recharts); data from visits-over-time API; primary color.
- **Peak Hours Heatmap** — Enhance existing `AnalyticsHeatmapChart`; ensure brand colors (e.g. primary gradient); tooltips, RTL.
- **Top Gates by Traffic** — Donut or horizontal bar (Recharts); data from top-gates API.
- **Scan Outcome (Success/Failure/Override)** — Stacked bar + optional gauge; success=green, failure=destructive, override=warning/muted.

**Deliverables**
- New components (e.g. `TotalVisitsChart`, `TopGatesChart`, `ScanOutcomeChart`) or equivalent; heatmap enhancement.
- All use Card wrapper, theme colors, loading Skeleton.

**Depends on:** Phase 1, Phase 2 (APIs for these charts)

**Test criteria**
- Charts render with real or mocked data; no hex colors; responsive.
- Lint and typecheck pass.

---

## 7. Phase 4 — Core Charts (Batch 2)

**Primary role:** FRONTEND

**Scope**
- **New vs Returning Visitors** — Stacked area or stacked bar; API or stub.
- **Unit Types Visit Ranking** — Horizontal bar chart.
- **Visitor Type Distribution** — Donut or treemap (Recharts).
- **Top Active Units/Residents** — Horizontal bar (top 10).

**Deliverables**
- Components: `NewVsReturningChart`, `UnitTypesRankingChart`, `VisitorTypeChart`, `TopUnitsChart` (or equivalent names).
- Card wrapper, theme colors, loading/empty states.

**Depends on:** Phases 1–2, Phase 3

**Test criteria**
- Charts render; RTL and i18n labels work; lint/typecheck pass.

---

## 8. Phase 5 — Extended Charts

**Primary role:** FRONTEND + BACKEND-API

**Scope**
- **Incidents by Gate/Operator** — Column or bubble chart; data from incidents API.
- **Resident Quota Usage** — Multi progress rings or bars; stub if no quota data.
- **Peak Days** — Radar or grouped bar (day-of-week).
- **Marketing UTM Attribution** — Funnel or bar; use existing funnel/campaigns data if available.
- **Stretch (if time):** Dwell time histogram, QR creation trends, Expired QR attempts, Gate access by shift.

**Deliverables**
- New chart components and any new API endpoints or extensions.
- Stubs for missing data (quota, UTM) with clear “No data” state.

**Depends on:** Phases 1–4

**Test criteria**
- All new charts use theme colors and Card wrapper; lint/typecheck pass.

---

## 9. Phase 6 — Polish & Export

**Primary role:** FRONTEND + i18n

**Scope**
- RTL and Arabic labels for all new chart titles and axes (use `@gate-access/i18n`).
- Loading (Skeleton), error (message + retry), and empty (no data) states for every chart.
- Export button (CSV) at bottom; reuse or extend existing export API.
- Dark mode: verify charts and Cards respect theme (shadcn handles most).
- Responsive pass: mobile stacked, touch-friendly tooltips.
- Add or update tests for analytics page and key chart components.

**Deliverables**
- i18n keys and AR translations for new strings.
- Consistent loading/error/empty UX.
- CSV export wired; dark mode verified; tests passing.

**Depends on:** Phases 1–5

**Test criteria**
- `pnpm turbo lint --filter=client-dashboard`, typecheck, test pass.
- RTL layout correct; export produces valid CSV.

---

## 10. Brand Colors Reference

Use only these (from `apps/client-dashboard/src/app/globals.css` and `packages/ui/src/tokens.ts`):

| Purpose | Token / Class |
|--------|----------------|
| Primary (data lines, bars) | `hsl(var(--primary))` or `var(--primary)` |
| Positive / success | `hsl(var(--success))` |
| Negative / failures | `hsl(var(--destructive))` |
| Neutral / backgrounds | `hsl(var(--muted))`, `hsl(var(--background))` |
| Accents / gradients | `var(--chart-1)` … `var(--chart-5)`; primary with opacity |
| Avoid | Hard-coded hex (e.g. `#0d9488`); use CSS vars or Tailwind |

If product later adopts a teal primary (e.g. MENA-friendly), change `--primary` in CSS; chart code need not change.

---

## 11. Risks & Blockers

- **New vs Returning / Visitor type:** May require `contactId` or fingerprint on ScanLog; schema might need extension or stub.
- **Resident Quota / Top Units:** Depends on Unit/Resident models (Phase 2 Resident Portal); stub with “Coming soon” or mock until data exists.
- **UTM:** Use existing funnel/campaigns APIs where available; otherwise stub.

---

## 12. Files Likely Touched

- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/*` (new and existing chart components)
- `apps/client-dashboard/src/app/api/analytics/*` (new routes)
- `packages/types/src/*` or `apps/client-dashboard/src/lib/analytics/*` (types)
- `packages/i18n/src/locales/*` or client-dashboard locale files
- `apps/client-dashboard/tailwind.config.ts` or `globals.css` (only if adding chart vars)
- `docs/DESIGN_TOKENS.md` or plan docs (optional)
