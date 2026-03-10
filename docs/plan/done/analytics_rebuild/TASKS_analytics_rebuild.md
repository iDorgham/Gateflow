# Plan tasks — analytics_rebuild

Checklist for **PLAN_analytics_rebuild**. Use with `/dev` and phase prompts.

**Plan:** `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`  
**Prompts:** `docs/plan/planning/analytics_rebuild/PROMPT_analytics_rebuild_phase_N.md`

---

## Phase 1 — Design Tokens & Layout

- [x] **1.1** Chart color palette doc or helper (CSS vars only: --primary, --success, --destructive, --chart-1..5)
- [x] **1.2** Responsive grid layout (grid-cols-1 md:2 lg:3 xl:4; col-span-2/full for wide charts)
- [x] **1.3** Shared chart Card wrapper (CardHeader + title + tooltip, CardContent)
- [x] **1.4** Skeleton loading from @gate-access/ui for chart placeholders
- [x] **1.5** Refactor analytics-client.tsx / page to new grid; KPI row + filters row
- [x] **1.6** Lint pass (typecheck: pre-existing failures in settings/team/form; analytics code untouched)

**Status:** Complete

---

## Phase 2 — API & Data Layer

- [x] **2.1** Visits-over-time API (time series by day)
- [x] **2.2** Unit types ranking, top gates, scan outcome, peak days, top units APIs
- [x] **2.3** Incidents by gate/operator; resident quota stub
- [x] **2.4** Shared analytics response types; requireAuth, org scope, filters
- [x] **2.5** Lint pass

**Status:** Complete

---

## Phase 3 — Core Charts (Batch 1)

- [x] **3.1** Total Visits Over Time (area/line)
- [x] **3.2** Peak Hours Heatmap enhancement (brand colors, Skeleton loading)
- [x] **3.3** Top Gates (horizontal bar)
- [x] **3.4** Scan Outcome (horizontal bar by status + pass rate)
- [x] **3.5** Lint, typecheck pass (analytics code; API validation types fixed)

**Status:** Complete

---

## Phase 4 — Core Charts (Batch 2)

- [x] **4.1** New vs Returning (stacked area; stub API 60/40 split)
- [x] **4.2** Unit Types ranking (horizontal bar)
- [x] **4.3** Visitor Type distribution (donut)
- [x] **4.4** Top Active Units (horizontal bar, top 10)
- [x] **4.5** Lint, typecheck pass

**Status:** Complete

---

## Phase 5 — Extended Charts

- [x] **5.1** Incidents by Gate/Operator (column bar, groupBy=gate)
- [x] **5.2** Resident Quota Usage (stub: progress bars when data; “Coming soon” when empty)
- [x] **5.3** Peak Days (grouped bar by day of week)
- [x] **5.4** UTM Attribution (horizontal bar from campaigns API)
- [x] **5.5** Stretch: skipped (optional)
- [x] **5.6** Lint, typecheck pass

**Status:** Complete

---

## Phase 6 — Polish & Export

- [x] **6.1** RTL/i18n for all new chart labels and titles (en + ar)
- [x] **6.2** Loading/error/empty states per chart (already in place)
- [x] **6.3** CSV export at bottom; dark mode (theme vars)
- [x] **6.4** Responsive grid; analytics-filters unit tests
- [x] **6.5** Lint and test pass (typecheck: pre-existing elsewhere)

**Status:** Complete
