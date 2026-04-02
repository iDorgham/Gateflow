# Phase 6: `apps/design-system` — Next.js app, IA shell, Tailwind v4

> **Plan:** `docs/plan/execution/PLAN_gateflow_design_system.md`  
> **Depends on:** Phases 1–5

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                         |
| ------------- | ---------- | --------------------------- |
| **Preferred** | **Cursor** | Next.js App Router scaffold |

### Skills to load

**Also apply:** `docs/plan/execution/PLAN_gateflow_design_system.md` → **Production skills** → phase **6** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. Vercel `nextjs` / `tailwind` skills — **Tailwind v4 + Next.js** current setup
2. `.agents/skills/tailwind/SKILL.md`, `.agents/skills/responsive-design/SKILL.md`
3. `.agents/skills/design-guide/SKILL.md`, `.agents/skills/ads-design-intelligence/SKILL.md`
4. `.agents/skills/nextjs-performance/SKILL.md` — RSC boundaries for docs
5. `.agents/skills/creative-animation/SKILL.md`, `.agents/skills/uiux-animator/SKILL.md` — shell/nav transitions; **`prefers-reduced-motion`**
6. `.agents/skills/ads-accessibility-rtl/SKILL.md` — skip links, landmarks in chrome

### Context

- **Site:** Documentation app for **design.gateflow.site** (deploy in Phase 9).
- **Stack:** Next.js 14+ App Router, **Tailwind CSS v4** with Lightning CSS, `@import` for `@gateflow/tokens` and `@theme`.
- **IA:** Top-level routes: Home, Foundations, Tokens, **Accessibility** (placeholder route OK until Phase 7 copy), **Components**, Packages, Guidelines, Changelog (placeholders OK). **Components** section includes stubs for:
  - `app/components/page.tsx` — overview (Primitives vs Patterns vs AI)
  - `app/components/primitives/**` — `@gateflow/ui` (filled in Phase 8)
  - `app/components/patterns/**` — `@gateflow/components` (Phase 8)
  - `app/components/ai/**` — `@gateflow/ai` (Phase 8)
- **Doc UX:** [Atlassian Design](https://atlassian.design/) discovery + [Ant Design](https://ant.design/) deep examples + [Primer](https://primer.style/) **split** (foundations vs product UI clarity)—**GateFlow** chrome aligned with [gateflow.site](https://www.gateflow.site).

### Goal

Runnable app: `pnpm dev:design` starts docs site; root layout wraps `ThemeProvider` from `@gateflow/theme`; global styles load tokens; responsive shell with sidebar + mobile nav **pattern** (ADS-inspired, not a pixel copy of atlassian.design).

### Scope (in)

- `apps/design-system/package.json` with **`name: @gateflow/design-system`** (align root `dev:design` / `build:design` turbo `--filter=@gateflow/design-system`).
- `app/layout.tsx`, `app/page.tsx`, stub routes under `app/foundations`, `app/tokens`, `app/accessibility` (placeholder only — **Primer-style** content in Phase 7), `app/components` (**+** `primitives`, `patterns`, `ai` subroutes), `app/packages`, `app/guidelines`, `app/changelog`.
- Tailwind v4 config per official Next.js integration; `@custom-variant dark` tied to documented dark strategy (`data-color-mode` + optional class).
- Use `@gateflow/ui` for chrome primitives where it accelerates (Button, etc.).
- **SEO:** base metadata title template “GateFlow Design System”.

### Scope (out)

- Token Explorer logic (Phase 7).
- Full component gallery (Phase 8).
- Algolia/search (Phase 9).

### Steps (ordered)

1. Scaffold Next app; add workspace deps: `@gateflow/tokens`, `@gateflow/theme`, `@gateflow/ui`, `@gateflow/components`, `@gateflow/ai`.
2. Configure Tailwind v4 + postcss/lightning per Next 15/14 app pattern in repo (check existing `marketing` app for reference — may still be v3; prefer official TW4 doc).
3. Implement layout: header with theme toggle (light/dark/system), placeholder RTL toggle (wire in Phase 9 if not now).
4. Homepage: hero + links to sections; high visual quality (typography, spacing) using tokens only.
5. `pnpm turbo lint typecheck build --filter=@gateflow/design-system`.
6. Fix root `dev:design` / `build:design` to use `--filter=@gateflow/design-system`.
7. Commit: `feat(design-system): scaffold @gateflow/design-system Next app with Tailwind v4 and IA shell`

### Acceptance criteria

- [ ] **Commands:** `pnpm dev:design` runs dev server; `pnpm build:design` produces production build.
- [ ] **Theming:** Light/dark/system works via `@gateflow/theme` + tokens.
- [ ] **Routes:** All top-level IA routes return 200 (even placeholder content).
- [ ] **Motion deps:** Doc-site chrome (layout, nav, hero) uses **CSS / Tailwind** motion per **`creative-animation`** + `docs/guides/MOTION_AND_ANIMATION.md`. **Do not** add **`framer-motion`** or **`animejs`** to `apps/design-system` in this phase **unless** you add a **new bullet above this one** explicitly authorizing it (library name + why).
- [ ] **Quality:** Lint + typecheck + build pass for `@gateflow/design-system`.

### Files likely touched

- `apps/design-system/**`
- Root `package.json` scripts
- `turbo.json` (only if new tasks needed)
