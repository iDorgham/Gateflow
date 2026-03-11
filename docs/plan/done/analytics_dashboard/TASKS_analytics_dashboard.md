# Plan tasks — analytics_dashboard

Checklist for **PLAN_analytics_dashboard**. Use with `/dev` and phase prompts.

**Plan:** `docs/plan/execution/PLAN_analytics_dashboard.md`  
**Prompts:** `docs/plan/execution/PROMPT_analytics_dashboard_phase_N.md`

---

## Phase 1 — Core Dashboard Shell

- [x] **1.1** Shared filter schema + `useAnalyticsFilters` hook
- [x] **1.2** `AnalyticsFilterBar` component
- [x] **1.3** `AnalyticsModeToggle` component
- [x] **1.4** KPI card components (4–6 cards)
- [x] **1.5** Refactored layout (12-col desktop, stacked mobile)
- [x] **1.6** "Open in Analytics" on Contacts/Units
- [x] **1.7** "Apply to Contacts/Units" on dashboard
- [x] **1.8** i18n for new strings
- [x] **1.9** Lint, typecheck, tests pass; committed

**Status:** Complete

---

## Phase 2 — Security View Depth

- [x] **2.1** `/api/analytics/heatmap` endpoint
- [x] **2.2** `/api/analytics/summary` endpoint
- [x] **2.3** `/api/analytics/operators` endpoint
- [x] **2.4** Heatmap chart component
- [x] **2.5** Threat/anomaly cards
- [x] **2.6** Operator leaderboard
- [x] **2.7** Short-polling for KPIs
- [x] **2.8** Redis caching for heatmap (optional)
- [x] **2.9** Lint, typecheck, tests pass; committed

**Status:** Complete

---

## Phase 3 — Marketing View Depth

- [x] **3.1** UTM schema on QRCode (if needed)
- [x] **3.2** `/api/analytics/funnel` endpoint
- [x] **3.3** `/api/analytics/campaigns` endpoint
- [x] **3.4** Funnel chart
- [x] **3.5** Campaign bar chart
- [x] **3.6** Persona/tag pie (stub)
- [x] **3.7** ROI calculator widget
- [x] **3.8** Audience export (CSV, injection-safe)
- [x] **3.9** Lint, typecheck, tests pass; committed

**Status:** Complete

---

## Phase 4 — Polish & Real-time

- [x] **4.1** WebSocket for live KPIs (or short-polling fallback)
- [x] **4.2** Export chart as PNG
- [x] **4.3** Shareable URL (copy link)
- [x] **4.4** Mobile optimizations
- [x] **4.5** Performance tuning (load, filter→chart targets)
- [x] **4.6** CACHE_STRATEGY docs
- [x] **4.7** Lint, typecheck, tests pass; committed

**Status:** Done
