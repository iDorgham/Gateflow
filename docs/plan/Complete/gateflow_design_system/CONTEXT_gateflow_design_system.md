# Context snapshot — `gateflow_design_system`

> Package graph and skills live in `PLAN_gateflow_design_system.md`. Extend this file when workspace layout or env vars change.

## Packages (target)

`@gateflow/tokens` → `@gateflow/theme` → `@gateflow/ui` → `@gateflow/components` / `@gateflow/ai` → `apps/design-system`

## Key repo paths

- `packages/tokens`, `theme`, `ui`, `components`, `ai` (as created per phase)
- `apps/design-system`
- `pnpm-workspace.yaml`, `turbo.json`, root `package.json` scripts

## Design references

- `docs/guides/UI_DESIGN_GUIDE.md`, `docs/guides/MOTION_AND_ANIMATION.md`
- `docs/development/initiatives/IDEA_atlassian_ui_remake.md`

## Motion policy

Default **`creative-animation`**; `framer-motion` / `animejs` only with explicit acceptance in the phase prompt (see PLAN).
