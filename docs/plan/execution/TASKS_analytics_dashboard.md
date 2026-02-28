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
- [ ] **1.9** Lint, typecheck, tests pass; committed

**Status:** In progress (1.9 pending git commit)

---

## Phase 2 — Security View Depth

- [ ] **2.1** `/api/analytics/heatmap` endpoint
- [ ] **2.2** `/api/analytics/summary` endpoint
- [ ] **2.3** `/api/analytics/operators` endpoint
- [ ] **2.4** Heatmap chart component
- [ ] **2.5** Threat/anomaly cards
- [ ] **2.6** Operator leaderboard
- [ ] **2.7** Short-polling for KPIs
- [ ] **2.8** Redis caching for heatmap (optional)
- [ ] **2.9** Lint, typecheck, tests pass; committed

**Status:** Not started

---

## Phase 3 — Marketing View Depth

- [ ] **3.1** UTM schema on QRCode (if needed)
- [ ] **3.2** `/api/analytics/funnel` endpoint
- [ ] **3.3** `/api/analytics/campaigns` endpoint
- [ ] **3.4** Funnel chart
- [ ] **3.5** Campaign bar chart
- [ ] **3.6** Persona/tag pie (stub)
- [ ] **3.7** ROI calculator widget
- [ ] **3.8** Audience export (CSV, injection-safe)
- [ ] **3.9** Lint, typecheck, tests pass; committed

**Status:** Not started

---

## Phase 4 — Polish & Real-time

- [ ] **4.1** WebSocket for live KPIs (or short-polling fallback)
- [ ] **4.2** Export chart as PNG
- [ ] **4.3** Shareable URL (copy link)
- [ ] **4.4** Mobile optimizations
- [ ] **4.5** Performance tuning (load, filter→chart targets)
- [ ] **4.6** CACHE_STRATEGY docs
- [ ] **4.7** Lint, typecheck, tests pass; committed

**Status:** Not started
