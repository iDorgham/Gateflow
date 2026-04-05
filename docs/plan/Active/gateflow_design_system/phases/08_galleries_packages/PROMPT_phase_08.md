# Phase 8: Components gallery + Packages documentation

> **Plan:** `PLAN_gateflow_design_system.md` (plan folder root)  
> **Depends on:** Phase 7 (and Phases 4–5 packages exist)

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                |
| ------------- | ---------- | ------------------ |
| **Preferred** | **Cursor** | Component examples |

### Skills to load

**Also apply:** `PLAN_gateflow_design_system.md` (plan folder root) → **Production skills** → phase **8** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. `.agents/skills/shadcn-ads/SKILL.md`, `.agents/skills/shadcn-composable/SKILL.md`
2. `.agents/skills/ai-ux-patterns/SKILL.md` — AI gallery composites
3. `.agents/skills/ads-data-density/SKILL.md`, `.agents/skills/ads-dynamic-tables/SKILL.md` — gallery layouts for dense examples (tables, filter bars)
4. `.agents/skills/data-viz/SKILL.md` — if any demo includes Recharts / analytics snippets
5. `.agents/skills/design-guide/SKILL.md`, `.agents/skills/responsive-design/SKILL.md`, `.agents/skills/tailwind/SKILL.md`
6. `.agents/skills/creative-animation/SKILL.md`, `.agents/skills/uiux-animator/SKILL.md` — demo previews; **`prefers-reduced-motion`**
7. `.agents/skills/ads-accessibility-rtl/SKILL.md` — code samples and demos remain operable

### Context

- **Three galleries:**
  1. **Primitives** (`/components/primitives`) — `@gateflow/ui`: live examples + controls + code for each key export.
  2. **Patterns** (`/components/patterns`) — `@gateflow/components`: composed blocks (cards, headers, filters, step shells).
  3. **AI** (`/components/ai`) — `@gateflow/ai`: chat layout, streaming, tool panels (mock data OK).
- **Comprehensive Packages page** (`/packages`): Single **authoritative table** listing **all** design-system packages from the PLAN (tokens, theme, ui, components, ai, + **site** row for `@gateflow/design-system` deploy-only). Columns: _Package_, _Purpose_, _npm_, _Install snippet_, _Peer deps_, _Depends on (internal)_. Subpages or anchors per package optional.
- **Guidelines:** When to use `ui` vs `components` vs `ai`; RTL; no raw hex. **Link** to **`/accessibility`** (Phase 7); if that page is still missing, add it here as a **fallback** (same stub spec as Phase 7—should not happen if Phase 7 completed).

### Goal

Developers can discover **how to use** the full **@gateflow** design stack without reading monorepo source. Galleries reflect **actual** exports from `ui`, `components`, and `ai`.

### Scope (in)

- `app/components/**` — overview + primitives + patterns + ai sections; shared `Demo` layout (props table, copy code).
- Code display: syntax highlighting (shiki/rehype or `prism` per RSC constraints).
- `app/packages/**` — **full catalog** (not only three libs).
- `app/guidelines/**` with real content.
- Cross-links to Token Explorer where colors matter; cross-links to **`/accessibility`** for keyboard, contrast, and motion expectations in demos.

### Scope (out)

- Full Storybook replacement (not required).
- Visual regression testing infrastructure.

### Steps (ordered)

1. List public exports from `@gateflow/ui`, `@gateflow/components`, `@gateflow/ai`.
2. Build gallery template: title, description, live demo, code, props.
3. **Primitives:** 8–12 `ui` examples (Button, Input, Card, Dialog, Select, Tabs, Tooltip, Badge, …).
4. **Patterns:** 3+ `@gateflow/components` examples.
5. **AI:** 3+ `@gateflow/ai` examples (streaming mock).
6. **`/packages`:** full matrix + per-package install + peers; note **pre–Phase 10** `workspace:*` vs **post–Phase 10** npm.
7. Guidelines: `ui` vs `components` vs `ai`; link `docs/guides/UI_COMPONENT_LIBRARY.md` and **`/accessibility`**.
8. `pnpm turbo lint typecheck build --filter=@gateflow/design-system`.
9. Commit: `feat(design-system): primitives patterns ai galleries and packages catalog`

### Acceptance criteria

- [ ] **Coverage:** ≥ **8** `ui` examples + ≥ **3** `components` + ≥ **3** `ai`, each with code snippet.
- [ ] **Accuracy:** Snippets match published exports (typecheck if TSX-in-MDX).
- [ ] **Packages:** **`/packages`** documents **all five** npm libraries + design-system site row (install, peers, purpose).
- [ ] **Guidelines:** Checklist incl. package choice (`ui` / `components` / `ai`) and a visible link to **`/accessibility`**.
- [ ] **Motion deps:** Galleries and shared demo chrome use **CSS / Tailwind** motion (`creative-animation`). **Do not** add **`framer-motion`** or **`animejs`** to the design-system app for gallery polish **unless** a **new bullet** is added to this prompt explicitly authorizing it (library + demo scope).
- [ ] **Build:** Passes.

### Files likely touched

- `apps/design-system/app/components/**`
- `apps/design-system/app/packages/**`
- `apps/design-system/app/guidelines/**`
- `apps/design-system/components/gallery/**`
