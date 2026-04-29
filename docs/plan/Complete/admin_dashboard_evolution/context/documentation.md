# Documentation — admin_dashboard_evolution

## Product & Requirements

- **PRD:** `docs/reference/product/PRD.md` — Full product requirements
- **CLAUDE.md:** `docs/CLAUDE.md` — Core architecture mandates
- **Backlog:** `docs/plan/backlog/ALL_TASKS_BACKLOG.md` — Global task backlog

## Design & UI

- **UI Design Guide:** `docs/guides/UI_DESIGN_GUIDE.md` — Colors, spacing, typography, layout patterns
- **Motion Guide:** `docs/guides/MOTION_AND_ANIMATION.md` — Animation policies and examples
- **ADS Core Skill:** `.agents/skills/ads-core-tokens/SKILL.md` — ADS token reference

## API & Architecture

- **API Routes Map:** `docs/reference/cache/API_ROUTES_MAP.md` — All 95+ routes (regenerated)
- **Schema Snapshot:** `docs/reference/cache/SCHEMA_SNAPSHOT.md` — All 40 Prisma models
- **Workspace Index:** `docs/reference/cache/WORKSPACE_INDEX.md` — Dep versions, env vars, ports

## Related Plans

- `docs/plan/Active/gateflow_design_system/` — ADS base (parallel plan)
- `docs/plan/Ready/org_types_dashboard/` — Previous org types work (reference)

## External Surfaces

- **Admin Dashboard:** `admin.gateflow.site` (port 3002 locally)
- **CMS serves:** `www.gateflow.site` (port 3000 locally via marketing app)
- **Storybook / Design App:** planned in `gateflow_design_system` plan

## Skills to Load per Phase

| Phase | Primary Skills                                        |
| ----- | ----------------------------------------------------- |
| 1     | `gf-design-guide`, `gf-architecture`, `gateflow-api`  |
| 2     | `gf-api`, `gf-nextjs-speed-core`, `gateflow-database` |
| 3     | `gf-uiux-animator`, `gf-shadcn-composable-patterns`   |
| 4     | `gf-ai-ux-patterns`, `gf-safety-interaction`          |
| 5     | `gf-design-guide`, `gf-shadcn-composable-patterns`    |
| 6     | `gf-ai-ux-patterns`, `gf-data-viz-chat`               |
| 7     | `gf-ai-ux-patterns`, `gf-safety-interaction`          |
| 8     | `gf-ads-data-density`, `gf-data-viz-chat`             |
| 9     | `gateflow-testing`, `gateflow-security`, `gf-i18n`    |
