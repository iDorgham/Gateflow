# Phase 7: Foundations + Interactive Token Explorer

> **Plan:** `docs/plan/execution/PLAN_gateflow_design_system.md`  
> **Depends on:** Phase 6

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                           |
| ------------- | ---------- | ----------------------------- |
| **Preferred** | **Cursor** | Interactive client components |

### Skills to load

**Also apply:** `docs/plan/execution/PLAN_gateflow_design_system.md` → **Production skills** → phase **7** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. `.agents/skills/tokens-design/SKILL.md`, `.agents/skills/ads-color-foundations/SKILL.md`, `.agents/skills/ads-color-tokens/SKILL.md`, `.agents/skills/ads-core-tokens/SKILL.md`, `.agents/skills/ads-typography/SKILL.md`, `.agents/skills/ads-spacing/SKILL.md`, `.agents/skills/ads-elevation-shadows/SKILL.md`
2. `.agents/skills/shadcn-composable/SKILL.md` — sliders, panels, Token Explorer UI
3. `.agents/skills/design-guide/SKILL.md`
4. `.agents/skills/ads-accessibility-rtl/SKILL.md` — **`/accessibility`** page + explorer keyboard UX
5. `.agents/skills/creative-animation/SKILL.md` — explorer interactions; **`prefers-reduced-motion`**
6. `.agents/skills/ui-ux-pro-max/SKILL.md` — optional layout polish for foundations pages

### Context

- **Foundations:** Pages for color, typography, spacing, elevation, motion (motion can be stub with “coming soon” if out of scope). Mirror [Primer Primitives / Foundations](https://primer.style/) clarity: **what** each scale is for, not only variable names.
- **Accessibility (stub):** Once `@gateflow/*` packages exist (true from the start of Phase 6 onward), ship a short **`/accessibility`** page structured like [Primer’s accessibility guidance](https://primer.style/accessibility) (inspiration only): GateFlow commitments, keyboard / focus, color & contrast (tie to tokens), motion & `prefers-reduced-motion`, form labels, and a pointer to RTL/i18n (full locale shell is Phase 9). Keep it **stub-length** (one screenful + anchors)—expand later; no third-party a11y libs required.
- **Token Explorer:** Client component(s) that:
  - List semantic groups (background, surface, primary, …).
  - For selected token, show **computed OKLCH** preview where possible (CSS `color-mix` / relative color demo).
  - **Sliders** for L / C / H adjustments on a **demo swatch** (educational — may not rewrite design system file live; optional “playground” overrides via inline style or CSS vars on a sandbox subtree).
  - **Light vs dark** side-by-side or toggle for same token.
  - **Copy** buttons: CSS var name, `var(--…)`, and Tailwind class if mapped.

### Goal

Foundations section is **educational** (GateFlow-specific decisions, OKLCH rationale, contrast notes). Token Explorer is the flagship interactive demo.

### Scope (in)

- `app/foundations/**` substantive MDX or TSX content (MDX only if already used in repo; else TSX + simple markdown component).
- `app/tokens/explorer` (or `/tokens#explorer`) route implementing explorer UI.
- `app/accessibility/page.tsx` (or `app/accessibility/**`): **Primer-style** stub as above; add to main nav next to Foundations/Tokens.
- Reuse `@gateflow/ui` for inputs, buttons, tabs, sheet/drawer for mobile filters if needed.

### Scope (out)

- Generating `tokens.css` from explorer (read-only education unless you explicitly add download).

### Steps (ordered)

1. Design information architecture for foundations subpages; implement navigation sidebar highlights.
2. Replace Phase 6 **Accessibility** placeholder with the stub page; verify nav + metadata title.
3. Build Token Explorer state: selected token, mode preview, slider state with **debounced** updates.
4. Implement copy-to-clipboard with accessible labels and toast (use existing ui toast if available).
5. Add content: “Relative color syntax” examples that work in supported browsers; document fallback.
6. Performance: dynamic import heavy panels if needed; avoid layout shift.
7. `pnpm turbo lint typecheck build --filter=@gateflow/design-system`
8. Commit: `feat(design-system): foundations, token explorer, and accessibility stub`

### Acceptance criteria

- [ ] **UX:** Explorer usable on mobile (stacked layout) and desktop.
- [ ] **A11y:** Sliders and copy buttons keyboard-accessible; sufficient contrast in both modes.
- [ ] **Education:** At least one page explains neutral ramp inversion + semantic vs primitive tokens.
- [ ] **Accessibility page:** `/accessibility` live with stub sections (keyboard, contrast/tokens, motion, RTL pointer); links to external [Primer accessibility](https://primer.style/accessibility) as **reference**, not normative for GateFlow.
- [ ] **Motion deps:** Token Explorer and foundations motion stay **CSS / Tailwind** (`creative-animation`). **No** **`framer-motion`** / **`animejs`** unless a **new acceptance bullet** is added to this prompt first, naming the library and use case.
- [ ] **Build:** design-system app builds successfully.

### Files likely touched

- `apps/design-system/app/foundations/**`
- `apps/design-system/app/tokens/**`
- `apps/design-system/app/accessibility/**`
- `apps/design-system/components/token-explorer/**`
