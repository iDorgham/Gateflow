# TASKS_client_dashboard_ui_refine

**Plan:** `PLAN_client_dashboard_ui_refine.md`  
**Status:** Not started  

---

## Phase 1 — Analytics Page & Components

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Audit analytics files for hardcoded hex
- [x] Replace with semantic tokens (chart palette, status/QR colors, grid, tooltips, heatmap)
- [x] Charts use --chart-1 through --chart-5
- [x] `pnpm preflight` passes

**Files changed:**
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/loading.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/export-chart-button.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/copy-link-button.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/print-button.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsHeatmapChart.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsChartPlaceholder.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsOperatorLeaderboard.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsApplyFiltersButton.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsModeToggle.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsFilterBar.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsKPICard.tsx`

---

## Phase 2 — Units Page

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Audit units page and ViewUnitsModal for hardcoded colors
- [x] Replace with semantic tokens (potential vacancy badge: text-warning, border-warning/50)
- [x] ResidentsFilterBar uses tokens (shared with contacts)
- [x] `pnpm preflight` passes

**Files changed:**
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ViewUnitsModal.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ResidentsFilterBar.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/TableCustomizerModal.tsx`

---

## Phase 3 — Contacts Page

**Status:** Pending  

- [ ] Audit contacts page and ViewContactsModal for hardcoded hex
- [ ] Replace with semantic tokens
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ViewContactsModal.tsx`

---

## Phase 4 — Settings Page & Tabs

**Status:** Pending  

- [ ] Audit settings-client and all 11 tabs for hardcoded hex
- [ ] Replace with semantic tokens
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/*.tsx`

---

## Phase 5 — Create QR, Overview & Shell

**Status:** Pending  

- [ ] Add or fix /dashboard/qrcodes and /dashboard/qrcodes/create routes
- [ ] Overview uses semantic tokens
- [ ] Sidebar and shell use semantic tokens
- [ ] `pnpm preflight` passes

**Files to touch:**
- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/page.tsx` (if new)
- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/page.tsx` (if new)
- `apps/client-dashboard/src/app/[locale]/dashboard/page.tsx`
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/shell.tsx`
- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`
