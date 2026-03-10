# PROMPT_analytics_rebuild_phase_1 — Design Tokens & Layout

**Initiative:** analytics_rebuild  
**Plan:** `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`  
**Phase:** 1 of 6  

---

## Primary role

**FRONTEND** — Use this role when implementing layout, grid, Card wrappers, and chart color conventions. Ensure responsive design and alignment with GateFlow design tokens.

## Skills to load

- [x] gf-design-guide — layout, grid, dashboard patterns
- [x] tokens-design — CSS variables, Tailwind theme
- [x] tailwind — utilities, responsive breakpoints

## MCP to use

| MCP | When |
|-----|------|
| Context7 | Recharts/Nivo API or Tailwind docs if needed |

## Preferred tool

- [x] Cursor (default)

---

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: client-dashboard (port 3001)
- **Existing**: `apps/client-dashboard/src/app/[locale]/dashboard/analytics/page.tsx`, `analytics-client.tsx`, `AnalyticsFilterBar`, `AnalyticsKPICards`, existing chart components
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **Refs**: `CLAUDE.md`, `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`, `docs/plan/context/IDEA_analytics_rebuild.md`, `packages/ui/src/tokens.ts`, `apps/client-dashboard/src/app/globals.css`

---

## Goal

Establish chart color palette (CSS variables only), responsive grid layout, shared Card wrapper for all charts, Skeleton loading placeholders, and refactor the analytics page top section (KPI row + filters row) so that subsequent phases can drop in 12–18 charts consistently.

---

## Scope (in)

- Document or implement chart color mapping: primary/success/destructive/muted and `--chart-1`…`--chart-5` for Recharts (e.g. `fill: 'hsl(var(--primary))'` or Tailwind classes).
- Responsive grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`; allow `col-span-2` or `col-span-full` for wide charts (heatmap, trends).
- Shared component: chart wrapper with `<Card>`, `<CardHeader>` (title + optional tooltip icon), `<CardContent>`; use `@gate-access/ui` Card.
- Skeleton from `@gate-access/ui` for chart loading placeholders.
- Refactor `analytics-client.tsx` (and page if needed): top section = KPI row + global filters row; main area = grid ready for chart cards.
- No hard-coded hex in any new or modified chart-related code.

## Scope (out)

- New API routes or chart data fetching (Phase 2).
- New chart implementations (Phases 3–5).
- i18n string additions beyond what’s already on the page (Phase 6).

---

## Steps (ordered)

1. **Chart color palette**
   - Add a small util or doc that maps: primary → `hsl(var(--primary))`, success → `hsl(var(--success))`, destructive → `hsl(var(--destructive))`, chart series → `--chart-1`…`--chart-5`. Use in a comment or `lib/analytics/chart-colors.ts` for reuse in phases 3–5.

2. **Shared chart card wrapper**
   - Create a component (e.g. `AnalyticsChartCard`) that accepts `title`, optional `tooltip`, `children`, optional `className`, optional `loading`. Renders Card + CardHeader (title + tooltip) + CardContent; when `loading`, render Skeleton in CardContent. Use `@gate-access/ui` Card and Skeleton.

3. **Grid layout**
   - Update the main charts container in `analytics-client.tsx` to use the responsive grid. Keep existing Security/Marketing mode sections but structure the chart area as a grid; assign placeholder cards or existing charts to grid cells (e.g. heatmap col-span-2, leaderboard col-span-1).

4. **KPI + filters**
   - Ensure the top section has: KPI cards row (existing `AnalyticsKPICards`) and below it the filter bar (existing `AnalyticsFilterBar`). No layout regression.

5. **Skeleton**
   - Where chart content is async, use Skeleton inside the new chart card wrapper (or existing chart components) so loading state is consistent.

6. **Run checks**
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`

7. **Git** — After phase passes: conventional commit (e.g. `feat(analytics): layout grid, chart card wrapper, and token-based colors`).

---

## SuperDesign (optional)

If the current layout is unclear or you want a visual reference:
- Run SuperDesign with context on `analytics-client.tsx` to draft a grid with KPI row, filters, and 6–8 card placeholders. Use output to align implementation.

---

## Acceptance criteria

- [ ] Chart color helper or doc uses only CSS variables (no hex).
- [ ] Responsive grid is in place; wide charts can use col-span-2 or col-span-full.
- [ ] Every chart area uses (or can use) the shared Card wrapper with CardHeader + CardContent and optional Skeleton.
- [ ] Analytics page top section: KPI row + filters row; main area is grid.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.

---

## Files likely touched

- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsChartCard.tsx` (new)
- `apps/client-dashboard/src/lib/analytics/chart-colors.ts` or equivalent (new or doc)
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx`
- Optionally: `apps/client-dashboard/src/components/dashboard/analytics/index.ts`
