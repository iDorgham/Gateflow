# CONTEXT: marketing_growth_engine_q3_2026

> Frozen snapshot for planning and phased execution.

## Initiative references

- IDEA: `docs/development/initiatives/IDEA_marketing_growth_engine_q3_2026.md`
- Strategy: `docs/development/brainstorming/STRATEGY_marketing_growth_engine_q3_2026.md`
- Backlog: `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

## Primary app surfaces

- Marketing pages: `apps/marketing/app/[locale]/`
- Marketing docs: `apps/marketing/docs/README.md`
- Existing attribution routes (client dashboard map): `docs/reference/cache/API_ROUTES_MAP.md`

## Existing funnel-relevant capabilities

- UTM tracking route is already mapped (`/api/marketing/utm-track`)
- CRM/webhook stack exists in dashboard platform
- Marketing already has vertical solution pages and resources surface

## Constraints and invariants

- Keep AR/EN route parity and RTL-safe rendering
- Preserve SEO metadata/canonical correctness
- No secrets exposed in client bundle
- Reuse existing API surface where feasible

## KPI baseline placeholders (fill in Phase 01)

- Demo CTA conversion rate
- Qualified lead rate
- Campaign->first-scan linkage rate
- EN vs AR conversion parity
