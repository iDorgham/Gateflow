# PLAN_client_dashboard_ui_refine — Client Dashboard UI/UX Refinement

**Initiative:** Client dashboard UI/UX refinement with real estate palette  
**Source idea:** `docs/plan/context/IDEA_client_dashboard_ui_refine.md`  
**Status:** Not started  

---

## 1. Objectives

- Apply the **real estate palette** (semantic tokens) consistently across all client-dashboard pages and settings tabs.
- Replace any hardcoded hex/rgb with `text-foreground`, `bg-muted`, `border-border`, `text-primary`, etc.
- Refine layout, typography, and hierarchy for Analytics, Units, Contacts, and Settings.
- Ensure Create QR page exists and uses the palette; fix sidebar/overview links if needed.

---

## 2. High-Level Phases

| Phase | Title | Primary role | Scope |
|-------|-------|--------------|-------|
| 1 | Analytics Page & Components | FRONTEND | KPI cards, charts, filters, export buttons |
| 2 | Units Page | FRONTEND | Units table, modals, filter bar |
| 3 | Contacts Page | FRONTEND | Contacts table, forms, actions |
| 4 | Settings Page & Tabs | FRONTEND | Settings layout + all 11 tabs |
| 5 | Create QR, Overview & Shell | FRONTEND | QR routes (add if missing), overview, sidebar polish |

Each phase = one focused `/dev` session. Preflight already done; run before each phase commit.

---

## 3. Phase 1 — Analytics Page & Components

**Goal:** Audit and replace hardcoded colors in analytics page, KPI cards, charts, and filters with semantic tokens.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/` (page, analytics-client, analytics-charts, loading)
- `apps/client-dashboard/src/components/dashboard/analytics/` (AnalyticsKPICard, AnalyticsKPICards, AnalyticsFunnelChart, AnalyticsBarChart, AnalyticsHeatmapChart, AnalyticsPersonaPie, AnalyticsFilterBar, AnalyticsApplyFiltersButton, etc.)

**Scope (out):** Units, Contacts, Settings, QR pages

**Key tasks:**
- Search for hardcoded hex in analytics files (e.g. `#`, `rgb(`)
- Replace with `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-primary-foreground`
- Charts: ensure use `--chart-1` through `--chart-5` (or `hsl(var(--chart-N))`)
- KPI labels: `text-muted-foreground`; values: `text-foreground`
- Run `pnpm preflight` after changes

**Acceptance criteria:**
- No hardcoded hex in analytics files
- `pnpm preflight` passes

---

## 4. Phase 2 — Units Page

**Goal:** Apply semantic tokens to units page, table, modals, and filter bar.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/` (ViewUnitsModal, ResidentsFilterBar, TableCustomizerModal as used by units)

**Scope (out):** Contacts, Settings, Analytics

**Key tasks:**
- Search for hardcoded hex in units-related files
- Replace with semantic tokens
- Ensure table headers, cells, badges use tokens
- Modals: card background, border, button styles

**Acceptance criteria:**
- No hardcoded hex in units files
- `pnpm preflight` passes

---

## 5. Phase 3 — Contacts Page

**Goal:** Apply semantic tokens and refine layout for the contacts page (large page ~1190 lines).

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/` (ViewContactsModal, ResidentsFilterBar, TableCustomizerModal as used by contacts)

**Scope (out):** Units, Settings, Analytics

**Key tasks:**
- Search for hardcoded hex in contacts page and related components
- Replace with semantic tokens
- Tables, forms, buttons, badges, export UI
- Consider extracting repeated patterns if it improves maintainability (optional)

**Acceptance criteria:**
- No hardcoded hex in contacts files
- `pnpm preflight` passes

---

## 6. Phase 4 — Settings Page & Tabs

**Goal:** Apply semantic tokens to settings page layout and all 11 tabs.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/` (general-tab, profile-tab, workspace-tab, projects-tab, api-keys-tab, webhooks-tab, billing-tab, team-tab, roles-tab, notifications-tab, integrations-tab)

**Scope (out):** Workspace sub-pages (workspace/settings, workspace/billing, etc.) — can be a follow-up

**Key tasks:**
- Audit settings-client.tsx tabs list and tab content
- Replace hardcoded colors in each tab with semantic tokens
- Tab triggers: use `data-state` styles from Tabs component; ensure active state uses primary
- Cards, tables, forms within tabs

**Acceptance criteria:**
- No hardcoded hex in settings page and tabs
- `pnpm preflight` passes

---

## 7. Phase 5 — Create QR, Overview & Shell

**Goal:** Add or fix Create QR page, refine overview and shell for palette consistency.

**Primary role:** FRONTEND

**Scope (in):**
- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/` — add `page.tsx` and `create/page.tsx` if missing
- `apps/client-dashboard/src/app/[locale]/dashboard/page.tsx` (overview)
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/shell.tsx`
- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`

**Scope (out):** Other apps (admin, marketing)

**Key tasks:**
- Check if `/dashboard/qrcodes` and `/dashboard/qrcodes/create` routes exist; add minimal pages if 404
- Overview: replace any hardcoded colors; CTA buttons use `bg-primary`
- Sidebar: active state, hover, icons use tokens
- Shell: search, notifications, user menu use tokens

**Acceptance criteria:**
- QR routes work (no 404 from sidebar/overview links)
- No hardcoded hex in overview, sidebar, shell
- `pnpm preflight` passes

---

## 8. Dependencies & Risks

| Phase | Depends on | Risks |
|-------|------------|-------|
| 1 | — | None |
| 2 | — | Shared residents components used by both units and contacts |
| 3 | — | Contacts page is large; avoid over-refactor |
| 4 | — | 11 tabs — scope per tab is manageable |
| 5 | — | QR routes may need API exploration if creating from scratch |

---

## 9. Execution

Run each phase via `/dev`:

```
/dev
```
Then paste the contents of `docs/plan/execution/PROMPT_client_dashboard_ui_refine_phase_N.md` for the desired phase.

Or run all phases sequentially:

```
/ship
```
(After configuring ship to use `PLAN_client_dashboard_ui_refine.md`)
