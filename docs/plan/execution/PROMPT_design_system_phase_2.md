# Phase 2: `@gateflow/theme` — Provider, hooks, Turborepo scripts

> **Plan:** `docs/plan/execution/PLAN_gateflow_design_system.md`  
> **Depends on:** Phase 1 (`@gateflow/tokens`)

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                     |
| ------------- | ---------- | ----------------------- |
| **Preferred** | **Cursor** | React + monorepo wiring |

### Skills to load

**Also apply:** `docs/plan/execution/PLAN_gateflow_design_system.md` → **Production skills** → phase **2** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. `.cursor/skills/documentation-lookup/SKILL.md` or Context7 — `next-themes` current API
2. `.agents/skills/design-guide/SKILL.md`
3. `.agents/skills/ads-accessibility-rtl/SKILL.md` — mode switches must not break contrast or focus
4. `.agents/skills/creative-animation/SKILL.md` — `docs/guides/MOTION_AND_ANIMATION.md`; theme transitions respect **`prefers-reduced-motion`**
5. `.agents/skills/i18n/SKILL.md` — RTL + theme coexistence notes (no full i18n here)

### Context

- **Objective:** Package `@gateflow/theme` that sets **`data-color-mode`** on `document.documentElement` (or agreed container) in an Atlassian-compatible way: e.g. `light`, `dark`, and system-derived values.
- **next-themes:** Integrate so `class` / `attribute` strategy does not fight `data-color-mode`; prefer a **single source of truth** documented in README (either next-themes drives both `class` and `data-color-mode`, or a thin adapter).

### Goal

Apps import `ThemeProvider` once (e.g. root layout), call `useTheme()` for mode, and optionally use token resolver utilities (e.g. resolve `var(--…)` for inline styles or SSR-safe defaults).

### Scope (in)

- `packages/theme/` with peer deps: `react`, `react-dom`, `next-themes` (version aligned with repo Next.js apps — check `apps/client-dashboard` / `admin-dashboard`).
- Export: `ThemeProvider`, `useTheme`, `useGateFlowColorMode` (name as needed), utilities: `getTokenVar`, `resolveToken` (thin wrappers around `token()` from `@gateflow/tokens` if useful).
- Document **required** root markup: `suppressHydrationWarning` on `<html>` if using next-themes pattern.
- Root `package.json` scripts: **`dev:design`** and **`build:design`** — filter `@gateflow/design-system` (confirm `name` in `apps/design-system/package.json` in Phase 6); if app missing, document “passes after Phase 6” or add minimal placeholder package name early.

### Scope (out)

- Full docs site (Phase 6+).
- Replacing all `ThemeProvider` usages in every app (optional follow-up).

### Steps (ordered)

1. Scaffold `packages/theme` with `name: @gateflow/theme`; add dependency on `@gateflow/tokens` (workspace).
2. Implement `ThemeProvider` wrapping `next-themes` + syncing `data-color-mode`.
3. Export minimal types; ensure tree-shake-friendly entry.
4. Add `pnpm --filter @gateflow/theme typecheck` + lint.
5. Update root `package.json` with `dev:design` / `build:design` (turbo filter).
6. Optional: add a **smoke** test or Storybook-less vitest if repo pattern exists; otherwise skip.
7. Commit: `feat(theme): add @gateflow/theme with data-color-mode and next-themes`

### Acceptance criteria

- [ ] **Consumer contract:** README documents props, default mode, and `data-color-mode` values.
- [ ] **Integration:** Importing provider + `tokens.css` in a minimal Next layout yields working light/dark toggle (manual verify in Phase 6 app or temporary test page).
- [ ] **Graph:** `pnpm turbo typecheck --filter=@gateflow/theme` passes.
- [ ] **Scripts:** Root scripts `dev:design` / `build:design` exist and run turbo (may no-op fail until app exists — **if** so, document; prefer creating minimal `apps/design-system` package.json in Phase 2 tail or defer script to Phase 6).
- [ ] **Motion deps:** `@gateflow/theme` does **not** introduce **`framer-motion`** / **`animejs`**; any transition guidance points to **CSS** + **`prefers-reduced-motion`** (`creative-animation`).

### Files likely touched

- `packages/theme/**`
- `package.json` (root scripts)
- `packages/theme/package.json`
