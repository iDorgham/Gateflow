# PROMPT_analytics_dashboard_phase_1 — Core Dashboard Shell

**Initiative:** analytics_dashboard  
**Plan:** `docs/plan/execution/PLAN_analytics_dashboard.md`  
**Phase:** 1 of 4  

---

## Primary role

**FRONTEND** — Use this role when implementing layout, components, filter propagation, and i18n. Ensure RTL and Arabic support for new UI.

## Preferred tool

- **Cursor** (default) — routine UI and layout work.

---

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (port 3001)
- **Existing analytics**: `apps/client-dashboard/src/app/[locale]/dashboard/analytics/page.tsx`, `analytics-charts.tsx`
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **Refs**: `CLAUDE.md`, `docs/plan/execution/PLAN_analytics_dashboard.md`, `docs/PRD_v6.0.md`

---

## Goal

Build the core analytics dashboard shell: layout (12-column grid desktop, stacked mobile), Security/Marketing mode toggle, global filter bar, KPI row with basic counters, primary chart placeholders (heatmap for Security, funnel for Marketing), and filter inheritance from Contacts/Units pages.

---

## Scope (in)

- Dashboard page layout with header, mode toggle, filter bar, KPI row, main chart area, bottom panels (collapsible)
- `AnalyticsModeToggle` component (Security ◯ Marketing)
- `AnalyticsFilterBar` component (date range, project, gate, tags stubbed, unit type, search)
- KPI card components: Total Visits, Pass Rate, Peak Hour, Unique Visitors (stub if no contact link), Denied Scans, Attributed Scans (stub if no UTM)
- Primary chart placeholders: heatmap area for Security, funnel area for Marketing
- Filter propagation via URL params (`dateFrom`, `dateTo`, `projectId`, `gateId`, `unitType`, `search`, `mode`)
- "Open in Analytics Dashboard" button on Contacts and Units pages → navigates to dashboard with current filters in URL
- "Apply to Contacts/Units" button on dashboard → navigates back with dashboard filters in URL
- RTL + i18n for new strings (use existing `@/lib/i18n`)

## Scope (out)

- Full heatmap or funnel implementation (placeholders only)
- WebSocket or real-time updates
- UTM schema changes (stub Attributed Scans as 0 or —)
- Tag model (filter bar shows tags dropdown stubbed or hidden)

---

## Steps (ordered)

1. **Create shared filter schema and URL sync**
   - Define `AnalyticsFilters` type (dateFrom, dateTo, projectId, gateId, unitType, tagIds, search, mode)
   - Create `useAnalyticsFilters()` hook that reads/writes URL search params
   - Ensure filters persist across page loads (shareable links)

2. **Build AnalyticsFilterBar**
   - Date range picker (7d, 30d, custom)
   - Project selector (from project cookie or API)
   - Gate selector (optional)
   - Unit type filter (STUDIO, ONE_BR, etc. from schema)
   - Search input (optional)
   - Tags: stub dropdown or hide if no Tag model
   - Wire to `useAnalyticsFilters`; updates URL on change

3. **Build AnalyticsModeToggle**
   - Toggle: Security | Marketing
   - Persist in URL param `mode`
   - Default: Security
   - Accessible, keyboard-friendly

4. **Build KPI card components**
   - 4–6 cards: Total Visits, Pass Rate, Peak Hour, Unique Visitors, Denied Scans, Attributed Scans
   - Fetch from existing analytics data or new lightweight `/api/analytics/summary` stub
   - Display trend arrow/sparkline if data available (or placeholder)
   - Use existing Card from `@gate-access/ui`

5. **Refactor analytics page layout**
   - 12-column grid on desktop
   - Header: logo area, project switcher, mode toggle, user menu
   - Filter bar (full width)
   - KPI row (full width, 4–6 cards)
   - Main area: left 60% primary chart, right 40% secondary (placeholders)
   - Bottom: collapsible panels (Top Units, Top Tags, Operators — can be empty placeholders)
   - Mobile: stacked, filter bar collapsible accordion, KPI horizontal scroll

6. **Add "Open in Analytics Dashboard" to Contacts and Units**
   - Read current filters from Contacts/Units page (URL or state)
   - Button/link navigates to `/[locale]/dashboard/analytics?dateFrom=...&dateTo=...&projectId=...` etc.
   - Ensure filter keys match dashboard expectations

7. **Add "Apply to Contacts/Units" on dashboard**
   - Button that navigates to `/[locale]/dashboard/residents/contacts?...` or `.../units?...` with current dashboard filters in URL

8. **Add i18n keys**
   - New strings: mode labels, filter labels, KPI titles, button labels
   - Arabic translations for AR locale

9. **Run checks**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`

10. **Git** — After phase passes: `/github` or `git add`, conventional commit, push

---

## SuperDesign

**Run before implementation** if creating a new dashboard layout:

| Scenario | Action |
|----------|--------|
| New layout | `superdesign create-design-draft` with layout intent, 12-column grid, mode toggle, KPI row. Use `--context-file` for existing analytics page and sidebar. |

If skipping SuperDesign, align with existing analytics page structure and `@gate-access/ui` Card, Button, etc.

---

## Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Trace filter flow on Contacts/Units | "Trace how Contacts and Units pages handle filters (URL, state, API params). Return key files and param names." |
| **browser-use** | Verify filter inheritance | "Login at localhost:3001, go to Contacts, set filters, click Open in Analytics, verify dashboard receives same filters." |

---

## Acceptance criteria

- [ ] Mode toggle (Security/Marketing) works and persists in URL
- [ ] Filter bar updates URL; filters available to child components
- [ ] KPI row displays 4–6 cards (values can be placeholder or from existing data)
- [ ] Primary chart area shows placeholder for heatmap (Security) or funnel (Marketing)
- [ ] "Open in Analytics Dashboard" from Contacts/Units passes filters to dashboard
- [ ] "Apply to Contacts/Units" passes dashboard filters to Contacts/Units
- [ ] Layout is responsive (mobile stacked, desktop grid)
- [ ] RTL and Arabic strings work for new UI
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes
- [ ] `pnpm turbo test --filter=client-dashboard` passes (no regression)

---

## Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx` (or new components)
- New: `apps/client-dashboard/src/components/dashboard/analytics/` (FilterBar, ModeToggle, KPICards)
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx`
- `apps/client-dashboard/src/lib/i18n/` or locale JSON files
