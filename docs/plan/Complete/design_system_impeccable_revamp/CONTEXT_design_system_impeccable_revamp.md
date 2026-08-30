# CONTEXT — `design_system_impeccable_revamp`

**Version:** 7.0 (Trunk Branching, Multi-Layer A11y, No Version Tags)  
<<<<<<< Updated upstream
**Repository:** https://github.com/iDorgham/Gateflow  
=======
**Repository:** https://github.com/iDorgham/Gateflow
>>>>>>> Stashed changes

This document defines the architectural context, 3-tier token structure, component API contracts, and automated accessibility layers for the Design System overhaul.

---

## 1. Package Architecture & Token Tiers

```
packages/
  tokens/
    foundations/             # Primitive (OKLCH raw palette, spacing scales)
    semantic/                # Themeable (colors, layer-01..04, density, interaction)
    component/               # Thin, optional component-level aliases
  ui/
    src/
      primitives/            # Button, Badge, Input, Card, Dialog, Drawer, Tabs, Tooltip...
      patterns/              # DynamicTable, FormField, EmptyState, Banner, Command...
      mobile/                # BottomSheet, FAB, TouchList, BiometricHUD...
      themes/                # Density and Accent profile helpers
      tokens.ts              # Web tokens and synchronized nativeTokens bridge
```

- **Alias Direction**: `Component` → `Semantic` → `Primitive`. Themes only remap the semantic layer.
- **Expo / React Native**: Consumes typed `nativeTokens` directly from `@gateflow/ui/tokens` with fully resolved hex values.

---

## 2. Layer & Elevation Invariants

- **Dark Mode (Satin Charcoal OKLCH)**:
  - `layer-01` (Canvas / Gutter): `#0b0d11`
  - `layer-02` (Default Surface / Table): `#12151c`
  - `layer-03` (Raised Surface / Card): `#191d26`
  - `layer-04` (Overlay / Modal / Drawer): `#212633`
- **Light Mode (Porcelain)**:
  - `layer-01` (Page): `#f8f9fa`
  - `layer-02` (Surface): `#ffffff`
  - `layer-03` (Raised): `#ffffff` + subtle shadow
  - `layer-04` (Overlay): `#ffffff` + deep shadow

---

## 3. Automated Accessibility Matrix

<<<<<<< Updated upstream
| Layer | Tool | When Run | Gate Condition |
| :--- | :--- | :--- | :--- |
| **Lint** | `eslint-plugin-jsx-a11y` | Every PR | Zero lint errors |
| **Tokens** | Contrast Checker Script | Token build | 100% pairs $\ge 4.5:1$ text / $\ge 3:1$ UI |
| **Component** | `jest-axe` / `vitest-axe` | Unit tests | Zero axe violations on primitives |
| **Showcase** | Playwright + axe | Phase 4 Gate | Clean scan on all showcase pages |
| **Apps** | `@axe-core/playwright` | Phase 5–6 | Zero serious/critical a11y regressions on key flows |
=======
| Layer         | Tool                      | When Run     | Gate Condition                                      |
| :------------ | :------------------------ | :----------- | :-------------------------------------------------- |
| **Lint**      | `eslint-plugin-jsx-a11y`  | Every PR     | Zero lint errors                                    |
| **Tokens**    | Contrast Checker Script   | Token build  | 100% pairs $\ge 4.5:1$ text / $\ge 3:1$ UI          |
| **Component** | `jest-axe` / `vitest-axe` | Unit tests   | Zero axe violations on primitives                   |
| **Showcase**  | Playwright + axe          | Phase 4 Gate | Clean scan on all showcase pages                    |
| **Apps**      | `@axe-core/playwright`    | Phase 5–6    | Zero serious/critical a11y regressions on key flows |
>>>>>>> Stashed changes

---

## 4. Component API & State Contract

- **Shared Core Props**:
  - `variant`: Visual style variation
  - `size`: `sm` | `md` | `lg`
  - `tone` / `intent`: `primary` | `neutral` | `success` | `warning` | `danger` | `info`
  - `isDisabled`, `isLoading`, `isSelected`, `asChild`
- **State Coverage Matrix**: `default`, `hover`, `active`/`pressed`, `focus-visible`, `disabled`, `loading`, `selected`, `error`.
- **FormField Standard**: Always structure forms using composable `FormField` (`label`, `control`, `helperText`, `errorMessage`).

---

## 5. Master Specifications & Reference Documents

- **Root AI Design Specification**: [`DESIGN.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/DESIGN.md)
- **Impeccable Command Handbook**: [`IMPECCABLE_AND_DESIGN_MD_GUIDE.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design_system_impeccable_revamp/IMPECCABLE_AND_DESIGN_MD_GUIDE.md)
- **Design System Architecture**: [`DESIGN_SYSTEM_ARCHITECTURE.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design_system_impeccable_revamp/DESIGN_SYSTEM_ARCHITECTURE.md)
- **Accessibility & Arabic RTL Guide**: [`ACCESSIBILITY_AND_A11Y_GUIDE.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design_system_impeccable_revamp/ACCESSIBILITY_AND_A11Y_GUIDE.md)
- **AI Prompt Writing Guide**: [`AI_PROMPT_WRITING_GUIDE.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design_system_impeccable_revamp/AI_PROMPT_WRITING_GUIDE.md)
- **Multi-App Migration Guide**: [`MIGRATION_AND_ROLLOUT_GUIDE.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design_system_impeccable_revamp/MIGRATION_AND_ROLLOUT_GUIDE.md)
- **Vibe Coder Quickstart**: [`VIBE_CODER_QUICKSTART.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design_system_impeccable_revamp/VIBE_CODER_QUICKSTART.md)
- **AI Context Pack (llms.txt)**: [`AI_CONTEXT_PACK.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design_system_impeccable_revamp/AI_CONTEXT_PACK.md)
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
