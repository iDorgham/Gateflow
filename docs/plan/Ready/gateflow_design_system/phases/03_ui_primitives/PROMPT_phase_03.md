# Phase 3: `@gateflow/ui` — semantic tokens & elevation

> **Plan:** `PLAN_gateflow_design_system.md` (plan folder root)  
> **Depends on:** Phases 1–2

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                     |
| ------------- | ---------- | ----------------------- |
| **Preferred** | **Cursor** | Large component surface |

### Skills to load

**Also apply:** `PLAN_gateflow_design_system.md` (plan folder root) → **Production skills** → phase **3** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. `.agents/skills/shadcn-ads/SKILL.md`, `.agents/skills/shadcn-composable/SKILL.md` — primitives + composition patterns
2. `.agents/skills/ads-ui-styling/SKILL.md`, `.agents/skills/ads-elevation-shadows/SKILL.md`, `.agents/skills/ads-typography/SKILL.md`, `.agents/skills/ads-spacing/SKILL.md`, `.agents/skills/ads-border-radius/SKILL.md`, `.agents/skills/ads-iconography/SKILL.md`, `.agents/skills/ads-tagging/SKILL.md`
3. `.agents/skills/design-guide/SKILL.md`
4. `.agents/skills/responsive-design/SKILL.md`, `.agents/skills/tailwind/SKILL.md`
5. `.agents/skills/ads-accessibility-rtl/SKILL.md` — focus rings, keyboard, component a11y
6. `.agents/skills/creative-animation/SKILL.md`, `.agents/skills/motion-philosophy/SKILL.md`, `.agents/skills/motion-primitives/SKILL.md` — loading, hover, dialog motion; **`prefers-reduced-motion`**
7. `.agents/skills/uiux-animator/SKILL.md` or `.agents/skills/ui-ux-pro-max/SKILL.md` — polish pass on key primitives (pick one for review depth)

### Context

- **Today:** `packages/ui` is published as `@gate-access/ui` (legacy scope); it uses `@atlaskit/tokens`, Tailwind v3, Radix primitives.
- **Target:** Rename / publish as **`@gateflow/ui`** and consume **semantic CSS variables** from **`@gateflow/tokens`** for colors, surfaces, borders, rings, and new **elevation** / **surface-raised** tokens. Maintain **shadcn** class patterns (`bg-background`, `text-foreground`, etc.) by ensuring Tailwind theme maps to the **same** CSS variables as in Phase 1.
- **Migration:** Update all monorepo consumers from `@gate-access/ui` → `@gateflow/ui` (workspace `workspace:*`); add a short deprecation note in changelog for external consumers if any.

### Goal

`@gateflow/ui` re-exports or documents a single import path: e.g. `@gateflow/ui/globals.css` **imports** `@gateflow/tokens/tokens.css` then adds any component-specific layers. All primitives (Button, Card, Input, Dialog, …) visually respect light/dark via tokens.

### Scope (in)

- Set `packages/ui/package.json` `name` to **`@gateflow/ui`**; add workspace deps: `@gateflow/tokens`, `@gateflow/theme` (theme optional as peer if only docs need provider — prefer devDependency for docs; ui package itself may not bundle theme).
- Update **every** workspace dependency that referenced `@gate-access/ui` to `@gateflow/ui`.
- Update `packages/ui/src/globals.css` (and tailwind config if needed) so **color-related** utilities map to CSS variables from tokens.
- Replace direct Atlassian token **color** usage where it conflicts with GateFlow semantic tokens; **strategy:** keep `@atlaskit/tokens` only where still required for spacing/typography **or** plan follow-up to migrate those — document decision in package README.
- Elevation: shadows / overlay tokens for modals, popovers, dropdowns — use new token keys.
- Ensure **no regression** for existing apps: `client-dashboard` build still passes.

### Scope (out)

- Migrating client-dashboard layouts to `ThemeProvider` from `@gateflow/theme` (optional same-phase if trivial).
- Tailwind v4 migration for `packages/ui` (defer unless required).

### Steps (ordered)

1. Inventory `packages/ui/src/components/**/*.tsx` for `token(`, `@atlaskit`, raw colors.
2. Rename package to `@gateflow/ui`; grep repo for `@gate-access/ui` and update imports / `package.json` deps.
3. Wire `globals.css` → import tokens; map Tailwind `theme.extend.colors` to `var(--…)` per shadcn convention.
4. Update high-traffic primitives first: Button, Card, Input, Dialog, Dropdown, Tabs, Tooltip.
5. Run `pnpm turbo lint typecheck --filter=@gateflow/ui`.
6. Run `pnpm turbo build --filter=client-dashboard` (or smallest consuming app) as regression gate.
7. Commit: `feat(ui): @gateflow/ui — consume @gateflow/tokens for semantic colors and elevation`

### Acceptance criteria

- [ ] **Naming:** Package name is `@gateflow/ui`; no stray `@gate-access/ui` references in the monorepo (except historical docs if explicitly archived).
- [ ] **Visual contract:** Components use semantic variables; dark mode flips neutrals correctly when `data-color-mode`/`.dark` contract is applied by consuming app.
- [ ] **Compatibility:** Existing shadcn-style class names still work.
- [ ] **Quality:** UI package lint + typecheck pass; at least one consumer app build passes.
- [ ] **Motion deps:** Primitives use **CSS / Tailwind** motion (`creative-animation`). **No** new **`framer-motion`** / **`animejs`** dependencies on `@gateflow/ui` **unless** a **new acceptance bullet** is added to this prompt first (library + component scope).
- [ ] **Docs:** `packages/ui/README.md` (short) or extend `docs/guides/UI_COMPONENT_LIBRARY.md` with token import instructions and new scope.

### Files likely touched

- `packages/ui/package.json`
- `packages/ui/src/globals.css`
- `packages/ui/tailwind.config.ts` (if present) or consuming app configs
- `packages/ui/src/components/**/*.tsx`
- `apps/**/package.json`, `packages/**/package.json` (dependency renames)
