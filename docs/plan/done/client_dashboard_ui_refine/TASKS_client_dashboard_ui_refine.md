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

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Audit contacts page and ViewContactsModal for hardcoded hex
- [x] Replace with semantic tokens (tag badge color; ViewContactsModal border-border)
- [x] `pnpm preflight` passes

**Files changed:**
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ViewContactsModal.tsx`

---

## Phase 4 — Settings Page & Tabs

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Audit settings-client and all 11 tabs for hardcoded hex
- [x] Replace with semantic tokens (amber→warning, emerald→success, blue→chart-2, rgba shadows→shadow-none/hover variants)
- [x] `pnpm preflight` passes

**Files changed:**
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/api-keys-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/team-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/webhooks-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/workspace-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/profile-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/billing-tab.tsx`

---

## Phase 5 — Create QR, Overview & Shell

**Status:** Done  
**Completed:** 2026-03-02  

- [x] /dashboard/qrcodes and /dashboard/qrcodes/create routes exist (verified)
- [x] Overview uses semantic tokens (STATUS_COLORS, StatCard, page header, recent activity)
- [x] Sidebar and shell use semantic tokens (slate→muted, green→success, red→destructive)
- [x] `pnpm preflight` passes

**Files changed:**
- `apps/client-dashboard/src/app/[locale]/dashboard/page.tsx`
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/shell.tsx`
