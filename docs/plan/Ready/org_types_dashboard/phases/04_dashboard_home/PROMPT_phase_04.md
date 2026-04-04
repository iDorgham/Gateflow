# Phase 4: Dashboard home adaptation

> **Plan:** `PLAN_org_types_dashboard.md` (plan folder root)  
> **Slug:** `org_types_dashboard`

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                   |
| ------------- | ---------- | --------------------- |
| **Preferred** | **Cursor** | Dashboard composition |
| **Fallback**  | —          | —                     |

### Skills to load

1. `docs/guides/ANALYTICS_CHARTS_GUIDE.md`
2. `.cursor/skills/data-viz/SKILL.md` — chart layout, CLS
3. `.cursor/skills/i18n/SKILL.md`

### Context

- **Charts reference:** `TotalVisitsChart`, `ScanOutcomeChart`, `TopGatesChart`, `NewVsReturningChart`, `TopUnitsChart` — see `docs/guides/ANALYTICS_CHARTS_GUIDE.md`
- **Phase 2 config:** `dashboard.kpiIds`, `dashboard.chartIds`, `emptyStateScenario`
- **REAL_ESTATE priority:** rush-hour / peak traffic, top units, recurring pass usage (use existing metrics or closest available; if a metric is missing, **placeholder card** behind a feature flag in config only if already in codebase)

### Goal

Make the **dashboard home** adapt KPI cards, chart order, supplementary widgets, and **empty states** using `ORGANIZATION_FEATURES`, with **REAL_ESTATE** as the most polished path.

### Scope (in)

- Config-driven **order** and **visibility** for KPI tiles and charts
- Type-specific **headline + subtitle** i18n keys on the home hero/summary region
- Empty states: pass `scenario` from config (e.g. `realEstateNoUnits`, `schoolNoRoster`, `eventNoProjects`)
- Avoid duplicate data fetching — one query layer, reorder presentation only
- Responsive grid: same breakpoints as existing dashboard

### Scope (out)

- New analytics backend aggregates (unless trivial extension; prefer existing APIs)
- Resident portal changes

### Steps (ordered)

1. Inventory current dashboard page/components under `apps/client-dashboard/src/app/[locale]/dashboard/`.
2. Define KPI/card registry (id → component + required permission + data hook).
3. Compose layout from `features.dashboard` ordering.
4. Implement empty-state component variants keyed by config.
5. REAL_ESTATE: ensure copy references MENA compound context (via i18n keys — English in this phase).
6. Tests: snapshot or component tests for ordering helper; manual data spot-check.

### Acceptance criteria

**Functional correctness**

- [ ] Each type shows a distinct **meaningful** default layout (not merely reordering identical cards).
- [ ] REAL_ESTATE layout highlights residential operations (units, recurring access, maintenance link/summary if present).

**Code quality**

- [ ] Lint/typecheck pass; presentation logic separated from data hooks.

**Security & architecture**

- [ ] All data hooks continue to scope by `organizationId`; no cross-tenant leakage.

**Testing**

- [ ] Unit tests for layout ordering; manual verification REAL_ESTATE + two other types with seeded data.

**UX & polish**

- [ ] Skeleton loaders preserved; no layout jump beyond acceptable CLS.

**Documentation**

- [ ] Map chart ids to components in a short table inside config file comment.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/**` (home / overview)
- `apps/client-dashboard/src/components/dashboard/**` (KPI/chart wrappers)
- `packages/i18n/src/locales/en.json` (new keys — Arabic in Phase 7)
