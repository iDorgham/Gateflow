# Phase 4: `@gateflow/components` — composed patterns on primitives

> **Plan:** `docs/plan/execution/PLAN_gateflow_design_system.md`  
> **Depends on:** Phases 1, 2, 3 (`tokens`, `theme`, `ui`)

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                    |
| ------------- | ---------- | ---------------------- |
| **Preferred** | **Cursor** | Package + compositions |

### Skills to load

**Also apply:** `docs/plan/execution/PLAN_gateflow_design_system.md` → **Production skills** → phase **4** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. `.agents/skills/shadcn-composable/SKILL.md`, `.agents/skills/shadcn-ads/SKILL.md`
2. `.agents/skills/ads-data-density/SKILL.md`, `.agents/skills/ads-dynamic-tables/SKILL.md` — compact dashboards, toolbars, table-adjacent patterns
3. `.agents/skills/design-guide/SKILL.md`, `.agents/skills/ads-design-intelligence/SKILL.md`
4. `.agents/skills/responsive-design/SKILL.md`, `.agents/skills/tailwind/SKILL.md`
5. `.agents/skills/ads-ui-styling/SKILL.md`, `.agents/skills/ads-elevation-shadows/SKILL.md`, `.agents/skills/ads-spacing/SKILL.md`
6. `.agents/skills/creative-animation/SKILL.md`, `.agents/skills/uiux-animator/SKILL.md` — micro-interactions on composed blocks (reduced-motion safe)
7. `.agents/skills/ads-accessibility-rtl/SKILL.md` — dense layouts must stay operable

### Context

- **Split:** `@gateflow/ui` stays **small, primitive, headless-friendly**. **`@gateflow/components`** owns **composed** UI: page headers with actions, filter toolbars, entity cards, stat strips, data-heavy list rows, multi-step shells—built only from `ui` + tokens (**no** duplicate color hex).
- **Inspiration:** [Primer Product UI](https://primer.style/) patterns (predictable density, a11y)—**no** `@primer/react` dependency.
- **npm:** Package name `@gateflow/components`; same publish discipline as Phase 10.
- **Docs:** Design-system site fills **`/components/patterns`** in Phase 8.

### Goal

New workspace package `packages/components` with `name: @gateflow/components`, depends on `@gateflow/tokens`, `@gateflow/theme`, `@gateflow/ui`, exports a first set of **3–6** compositions used in GateFlow dashboards (or clearly named placeholders with Story-level demos) + README.

### Scope (in)

- `packages/components/package.json`, `tsconfig`, lint, `exports` map.
- Implement patterns that **only** import from `@gateflow/ui` and token CSS (no `@gate-access/ui`).
- Document **when to use** `ui` vs `components` in package README.

### Scope (out)

- Duplicating every dashboard screen from apps (incremental migration later).
- `@gateflow/ai` (Phase 5).

### Steps (ordered)

1. Scaffold `packages/components`; wire workspace deps.
2. Add 3–6 compositions (e.g. `PageHeader`, `EntityCard`, `FilterBar`, `StepShell`—names as fits repo).
3. `pnpm turbo lint typecheck --filter=@gateflow/components`.
4. Optional: minimal test or type test for exports.
5. Commit: `feat(components): add @gateflow/components composed patterns package`

### Acceptance criteria

- [ ] **Graph:** typecheck passes; no circular deps with `ui`.
- [ ] **Styling:** Uses semantic tokens / `ui` only.
- [ ] **Exports:** Public API documented in README.
- [ ] **Plan alignment:** Ready for design-system **Patterns** gallery (Phase 8).
- [ ] **Motion deps:** Composed patterns use **CSS / Tailwind** motion by default. **No** **`framer-motion`** / **`animejs`** on `@gateflow/components` **unless** a **new acceptance bullet** authorizes it here first.

### Files likely touched

- `packages/components/**`
