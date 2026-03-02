# Pro Prompt — Phase 1: Analytics Page & Components

Copy this prompt when running `/dev` for Phase 1 of the client dashboard UI refinement plan.

---

## Phase 1: Analytics Page & Components

### Primary role

**FRONTEND** — Use gf-design-guide and tokens-design context. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; semantic tokens only; no hardcoded hex
- **Refs**: `docs/plan/context/IDEA_client_dashboard_ui_refine.md`, `docs/guides/UI_DESIGN_GUIDE.md`, `apps/client-dashboard/src/app/globals.css`

### Goal

Audit and replace hardcoded colors in analytics page, KPI cards, charts, and filters with semantic tokens from the real estate palette.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/` (page.tsx, analytics-client.tsx, analytics-charts.tsx, loading.tsx, export-chart-button.tsx, etc.)
- `apps/client-dashboard/src/components/dashboard/analytics/` (AnalyticsKPICard, AnalyticsKPICards, AnalyticsFunnelChart, AnalyticsCampaignBarChart, AnalyticsHeatmapChart, AnalyticsPersonaPie, AnalyticsFilterBar, AnalyticsApplyFiltersButton, AnalyticsModeToggle, AnalyticsROIWidget, AnalyticsOperatorLeaderboard, AnalyticsAnomalyCards, AnalyticsAudienceExportButton, AnalyticsChartPlaceholder, copy-link-button.tsx, print-button.tsx)

### Scope (out)

- Units page, Contacts page, Settings, QR pages
- Admin dashboard, marketing

### Steps (ordered)

1. **Audit** — Search for hardcoded hex/rgb in analytics files (`#`, `rgb(`, `rgba(`). List files and line numbers.
2. **Replace** — Swap hardcoded values with semantic tokens:
   - Backgrounds: `bg-background`, `bg-card`, `bg-muted`
   - Text: `text-foreground`, `text-muted-foreground`, `text-primary`
   - Borders: `border-border`
   - Charts: use `hsl(var(--chart-1))` through `--chart-5` (or Tailwind chart utilities if defined)
   - KPI labels: `text-muted-foreground`; values: `text-foreground` or `text-2xl`/`text-3xl` with `text-foreground`
3. **Verify** — Spot-check analytics page in browser (light and dark mode).
4. Run `pnpm preflight`. Fix any regressions.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **browser-use** | After implementation | "Login at localhost:3001, navigate to /dashboard/analytics. Verify palette consistency in light and dark mode. Check KPI cards, charts, and filters." |

### Acceptance criteria

- [ ] No hardcoded hex for primary/accent/foreground/muted in analytics files.
- [ ] Charts use `--chart-1` through `--chart-5` where applicable.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/*.tsx`
- `apps/client-dashboard/src/components/dashboard/analytics/*.tsx`
