# PROMPT_analytics_rebuild_phase_6 — Polish & Export

**Initiative:** analytics_rebuild  
**Plan:** `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`  
**Phase:** 6 of 6  

---

## Primary role

**FRONTEND** (primary) + **i18n** — Use for RTL/i18n, loading/error/empty states, CSV export, dark mode verification, and tests.

## Skills to load

- [x] gf-i18n — Arabic labels, RTL layout
- [x] gf-design-guide — empty/error states, accessibility
- [x] gf-testing — Jest for analytics page or key components

## MCP to use

| MCP | When |
|-----|------|
| cursor-ide-browser | Optional: verify RTL and export on analytics page |

## Preferred tool

- [x] Cursor (default)

---

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard; analytics at `[locale]/dashboard/analytics/`
- **Prerequisites**: Phases 1–5 (all charts and APIs in place)
- **Refs**: `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`, `@gate-access/i18n`, existing export API

---

## Goal

Polish the analytics rebuild: (1) RTL and Arabic labels for all new chart titles and axes, (2) consistent loading/error/empty states for every chart, (3) CSV export button at bottom wired to existing or extended export API, (4) dark mode verification, (5) responsive/mobile pass, (6) add or update tests so preflight passes.

---

## Scope (in)

- **i18n** — Add translation keys for any new chart titles, axis labels, tooltips, and empty/error messages; add Arabic strings for AR locale. Use `@gate-access/i18n` or client-dashboard locale files.
- **Loading/error/empty** — Every chart component shows Skeleton when loading; shows error message (and optional retry) on fetch failure; shows “No data” (or localized message) when data array is empty.
- **Export** — Export button (CSV) at bottom of analytics page; reuse `/api/analytics/export` or extend to include current filter context; ensure response is CSV with safe escaping.
- **Dark mode** — Verify all charts and Cards look correct in dark theme (shadcn/CSS variables); fix any contrast or fill issues.
- **Responsive** — Mobile: stacked layout, touch-friendly tooltips, horizontal scroll for KPI row if needed.
- **Tests** — Add or update tests for analytics page (e.g. renders without crash, filter updates URL) and optionally for one or two chart components (e.g. TotalVisitsChart with mocked data).

## Scope (out)

- New chart types or new APIs (already done in Phases 2–5).

---

## Steps (ordered)

1. **i18n**
   - Audit all new chart titles and labels; add keys to dashboard or analytics namespace (e.g. `analytics.charts.totalVisits`, `analytics.charts.topGates`, `analytics.empty`, `analytics.error`). Add Arabic translations. Ensure RTL: `dir={locale === 'ar' ? 'rtl' : 'ltr'}` on chart containers where needed.

2. **Loading/error/empty**
   - For each chart component: ensure SWR/React Query loading state shows Skeleton inside Card; error state shows message (and retry if applicable); empty data shows localized “No data” or “No data for selected filters”. Reuse shared empty/error UI if available.

3. **CSV export**
   - Add or confirm “Export CSV” button at bottom of analytics page. Wire to existing `GET /api/analytics/export` with current filters (dateFrom, dateTo, projectId, gateId). Ensure CSV is injection-safe and includes expected columns (e.g. scan date, gate, status). If export API does not support filters, extend it or document limitation.

4. **Dark mode**
   - Toggle dark theme; open analytics page; verify chart fills, axes, and Card backgrounds use theme variables and remain readable. Fix any hard-coded light colors.

5. **Responsive**
   - Test at 320px, 768px, 1024px; ensure grid stacks, KPI row scrolls or wraps, and tooltips are usable on touch. Adjust col-span or min-heights if needed.

6. **Tests**
   - Add smoke test for analytics page (e.g. render AnalyticsClient with mock filters; expect no throw). Optionally test one chart with mocked API response. Run `pnpm turbo test --filter=client-dashboard` and fix any failures.

7. **Run full preflight**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`

8. **Git** — Conventional commit (e.g. `feat(analytics): i18n, loading/error/empty states, CSV export, dark mode, tests`).

---

## Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **browser-use** | Verify RTL and export | "Login at localhost:3001, go to analytics, switch to AR, verify RTL and chart labels; click Export CSV and verify download." |

---

## Acceptance criteria

- [ ] All new chart-related strings have i18n keys and Arabic translations; RTL layout correct.
- [ ] Every chart has loading (Skeleton), error (message ± retry), and empty (no data) states.
- [ ] CSV export button works and returns valid, filter-scoped CSV.
- [ ] Dark mode: no contrast or visibility issues on charts/Cards.
- [ ] Responsive: layout works on mobile and tablet.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (no regression).

---

## Files likely touched

- `packages/i18n/src/locales/en.json` and `ar-EG.json` (or client-dashboard locale files)
- Each chart component (loading/error/empty props or internal state)
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx` (export button, layout tweaks)
- `apps/client-dashboard/src/app/api/analytics/export/route.ts` (if extended)
- New or updated test files under `apps/client-dashboard/src/app/[locale]/dashboard/analytics/*.test.tsx` or `components/dashboard/analytics/*.test.tsx`
