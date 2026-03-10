# IDEA_analytics_rebuild — Analytics Dashboard Rebuild (12–18 Charts)

**Status:** Ready for planning  
**Created from:** User request — comprehensive chart set, brand colors, modern UX

---

## Vision

Transform the current Client Dashboard analytics page (~70% complete per PRD_v6.0) into a **data-rich, visually consistent dashboard** with 12–18 chart types, brand-aligned colors (CSS variables / Tailwind), full RTL/i18n, loading/error states, and responsive layout.

## Key Principles

- **Brand colors only** — Primary/chart/success/destructive from `tailwind.config.ts` and CSS variables (`--primary`, `--chart-1`…, `--success`, `--destructive`). No hard-coded hex.
- **Recharts first** — Consistency with existing code; Nivo only for heatmap/funnel if Recharts is insufficient.
- **Card-wrapped charts** — Every chart in `<Card>` with `<CardHeader>` (title + tooltip) and `<CardContent>`.
- **Filters once, apply everywhere** — Date range, gate, project, unit type; SWR or React Query; org-scoped APIs.
- **RTL/Arabic** — All labels and layout support `@gate-access/i18n` and `dir`.

## Chart List (Priority)

**Top 12 (must-have):**
1. Total Visits Over Time — Multi-line / Area
2. New vs Returning Visitors — Stacked Area / Stacked Bar
3. Peak Hours Heatmap — Heatmap (existing component, enhance)
4. Unit Types Visit Ranking — Horizontal Bar
5. Top Gates by Traffic — Donut / Horizontal Bar
6. Scan Outcome (Success/Failure/Override) — Stacked Bar + Gauge
7. Visitor Type Distribution — Donut / Treemap
8. Incidents by Gate/Operator — Column / Bubble
9. Resident Quota Usage — Multi Progress Rings / Bars
10. Marketing UTM Attribution — Funnel / Bar (if data)
11. Peak Days — Radar or Grouped Bar
12. Top Active Units/Residents — Horizontal Bar (top 10)

**Stretch (13–16):** Dwell Time Histogram, QR Creation Trends, Expired QR Attempts, Gate Access by Shift, Conversion Funnel (Gate → Arrival).

## Technical Foundation

- **Data:** Existing `/api/analytics/*` (summary, heatmap, funnel, campaigns, operators) + new endpoints for visits-over-time, unit-types, top-gates, scan-outcome, visitor-type, incidents, quota, peak-days, top-units.
- **State:** SWR or React Query; filters in URL; loading/error/empty handled.
- **Security:** All APIs scoped by `organizationId`, `deletedAt: null`, RBAC.
- **Types:** Shared analytics response types (`@gate-access/types` or local in client-dashboard).

## Plan

See `docs/plan/planning/analytics_rebuild/PLAN_analytics_rebuild.md`.
