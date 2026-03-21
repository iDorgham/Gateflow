# PROMPT: client_dashboard_v10_redesign — Phase 2

## Phase 2: Dashboard Home & Real-time Analytics

### Primary role
FRONTEND | UI/UX | ANIMATOR

### Preferred tool
- [x] Cursor (default)

### Context
- **Project**: GateFlow — Turborepo monorepo
- **Apps**: client-dashboard (3001)
- **Rules**: pnpm only; 100% ADS Token adherence; Framer Motion for UI animations.
- **Refs**: `CLAUDE.md`, `packages/ui/src/tokens.ts`.

### Goal
Redesign the Dashboard home KPI cards with elevation tokens and spring counting
animations, and upgrade the Analytics charts with ADS-compliant custom tooltips.

### Scope (in)
- Dashboard home KPI grid: stagger entry + spring counting animation.
- `ds.surface.raised` elevation token applied to KPI cards.
- Custom ADS tooltip style replacing Recharts `contentStyle` objects.
- All DS semantic color tokens; zero hardcoded hex values in analytics view.

### Scope (out)
- Individual chart logic and data fetching.
- Settings, Scans, or other pages.

### Steps (ordered)
1. Create `animated-kpi-grid.tsx` client component with Framer Motion stagger +
   `AnimatedNumber` counting spring.
2. Update `dashboard-overview.tsx` to import `AnimatedKpiGrid`, remove old
   `StatCard`, apply DS `surface.raised` token to the recent-scans card.
3. Update `AnalyticsKPICard.tsx`: apply `ds.surface.raised`, add Framer Motion
   slide-in entry animation.
4. Update `analytics-charts.tsx`: define `ADS_TOOLTIP_STYLE` constant and apply
   to all Recharts `<Tooltip>` components.
5. Run `pnpm turbo lint --filter=client-dashboard` and
   `pnpm turbo typecheck --filter=client-dashboard`.
6. Commit: `feat(client-dashboard): v10 dashboard home & analytics ADS upgrade`.

### Acceptance criteria
- [ ] Dashboard KPI grid animates in with spring stagger on first render.
- [ ] Numeric KPI values count up from 0 with spring easing.
- [ ] KPI cards use `var(--ds-surface-raised)` for background.
- [ ] All Recharts tooltips use ADS token styling (no `border-radius: 8` hardcoded).
- [ ] No hardcoded hex values in analytics view.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.

### Files likely touched
- `apps/client-dashboard/src/components/dashboard/animated-kpi-grid.tsx` (NEW)
- `apps/client-dashboard/src/components/dashboard/dashboard-overview.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsKPICard.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx`
