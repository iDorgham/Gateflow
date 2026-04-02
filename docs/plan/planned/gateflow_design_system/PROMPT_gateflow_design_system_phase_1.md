# Phase 1: `@gateflow/tokens` — OKLCH architecture & `tokens.css`

> **Plan:** `docs/plan/execution/PLAN_gateflow_design_system.md`  
> **Context:** `docs/plan/context/IDEA_atlassian_ui_remake.md`, `docs/guides/UI_COMPONENT_LIBRARY.md`

### Primary role

**FRONTEND** (design tokens / CSS architecture)

### Tool selection

|               | Tool       | Why                          |
| ------------- | ---------- | ---------------------------- |
| **Preferred** | **Cursor** | Monorepo package scaffolding |
| **Fallback**  | —          | —                            |

### Skills to load

**Also apply:** `docs/plan/execution/PLAN_gateflow_design_system.md` → **Production skills** → phase **1** groups.

1. `.agents/skills/tokens-design/SKILL.md` or `.agents/skills/ads-color-tokens/SKILL.md` — token naming, ramps
2. `.agents/skills/ads-core-tokens/SKILL.md`, `.agents/skills/ads-color-foundations/SKILL.md`, `.agents/skills/ads-typography/SKILL.md`, `.agents/skills/ads-spacing/SKILL.md`, `.agents/skills/ads-elevation-shadows/SKILL.md`, `.agents/skills/ads-border-radius/SKILL.md`, `.agents/skills/ads-iconography/SKILL.md`, `.agents/skills/ads-tagging/SKILL.md` — systematic scales (use subsets as needed; do not skip contrast/status semantics)
3. `.agents/skills/tailwind/SKILL.md` — Tailwind v4 `@theme` patterns where applicable
4. `.agents/skills/design-guide/SKILL.md` — `docs/guides/UI_DESIGN_GUIDE.md` alignment for semantic color/chart intent
5. `.agents/skills/ads-accessibility-rtl/SKILL.md` — contrast, status readability, future RTL token consumers
6. `docs/arch/PROJECT_STRUCTURE.md` — package conventions

### Context

- **Design influences:** Blend [Atlassian Design](https://atlassian.design/) (semantic tokens, elevation, `data-color-mode`, calm B2B) with [Ant Design](https://ant.design/) (predictable component scale, doc-friendly patterns) and [Primer](https://primer.style/) **Primitives** mindset (systematic color/spacing/typography scales, foundations-first docs)—implemented as **GateFlow-owned CSS**, not Atlassian/Ant/Primer runtime libs. **Brand:** align ramps and contrast with [gateflow.site](https://www.gateflow.site) (enterprise security, trust, MENA EN/AR).
- **Objective:** New workspace package `@gateflow/tokens` exporting a **single canonical CSS surface** for GateFlow: OKLCH primitives, semantic tokens, **shadcn-compatible** variables (`--background`, `--foreground`, `--card`, …), and **Tailwind v4 `@theme`** mappings for consumers that use v4—**structured for future npm publish** (`exports`, `files`, see Phase 10).
- **Dark mode:** Implement **neutral ramp inversion** (light ↔ dark) using OKLCH and, where supported, **relative color syntax** (`oklch(from … l c h)`) for derived states (hover, muted, borders). Document browser support assumptions; provide non-relative fallbacks if needed for older targets.
- **Compatibility:** Package must be consumable as **plain CSS** by Tailwind v3 apps (import variables only) **without** forcing v4.

### Goal

Ship `@gateflow/tokens` with `tokens.css` (light + dark), optional split files if maintainability demands, TypeScript `token()` helper resolving semantic keys to `var(--…)` strings, and published `package.json` `exports` for CSS + TS.

### Scope (in)

- `packages/tokens/` with `package.json`, `tsconfig.json`, ESLint extend from `@gate-access/config` if pattern exists.
- OKLCH scales: neutrals, brand primary/secondary, semantic (success/warning/danger/info), **elevation** and **surface-raised** tokens.
- Semantic names: e.g. `color.background`, `color.surface`, `color.surface-raised`, `color.primary`, `color.primary-foreground`, `color.border`, `color.muted`, `color.accent`, etc. Map to CSS custom properties with a consistent prefix (e.g. `--gf-` + semantic path or documented flat list).
- **shadcn aliases:** mirror expected `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, etc., **defined in terms of** semantic tokens (no duplicate hex sources).
- **Tailwind v4:** provide `@theme { … }` block mapping design tokens to `--color-*` utilities (document import path, e.g. `@import "@gateflow/tokens/theme.css"`).
- **TypeScript:** `token('semantic.path')` (or agreed API) with strict union of keys; unit tests optional but welcome for key coverage.
- README in package: consumption for (a) global CSS import, (b) Next.js App Router layout, (c) Tailwind v4.

### Scope (out)

- React providers (Phase 2).
- Changing every dashboard page (later phases / separate refactors).
- Removing `@atlaskit/tokens` from `@gateflow/ui` (Phase 3).

### Steps (ordered)

1. Scaffold `packages/tokens` with `name: @gateflow/tokens`; align naming with current `packages/ui` (`@gate-access/ui` until Phase 3) `globals.css` / token usage — grep for `--` and `hsl(` / `oklch(` in `packages/ui`.
2. Author `tokens.css`: `:root`, `[data-color-mode="dark"]` or documented dark selector contract matching Phase 2 (keep **consistent** with plan: prefer `data-color-mode` per PLAN).
3. Add `@theme` file for Tailwind v4 consumers.
4. Implement `token()` in `src/token.ts` (or similar) with exported types.
5. `pnpm --filter @gateflow/tokens typecheck` (add script if needed).
6. Wire turbo: ensure `build` is no-op or `tokens:build` copies nothing — **avoid** breaking `^build` graph (empty `build` script that exits 0 is acceptable if repo pattern allows).
7. Commit: `feat(tokens): add @gateflow/tokens OKLCH package and tokens.css`

### Acceptance criteria

- [ ] **Build graph:** `pnpm turbo build --filter=@gateflow/tokens` does not fail the monorepo.
- [ ] **Artifacts:** `tokens.css` + v4 `@theme` entry documented in package README.
- [ ] **Semantics:** Documented list of semantic + shadcn alias variables; dark mode uses inverted neutral ramp.
- [ ] **API:** `token()` typed helper exports from package entry.
- [ ] **Quality:** Lint/typecheck for package passes.

### Files likely touched

- `packages/tokens/package.json`
- `packages/tokens/src/**`
- `packages/tokens/css/**` or root-level `tokens.css`
- `turbo.json` (only if a new task is required)
