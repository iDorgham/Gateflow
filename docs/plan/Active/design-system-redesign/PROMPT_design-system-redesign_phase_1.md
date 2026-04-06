# Phase Prompt — design-system-redesign (Phase 1)

**Slug:** design-system-redesign  
**Phase:** 1  
**Target:** `@gateflow/tokens` (packages/tokens)  
**Role:** Architecture Specialist (Opencode)  
**Vision:** Establish the foundation token engine for the premium GateFlow Design System.

## 🏹 Primary Tasks

1.  **Primitive Neutral Ramps (OKLCH)**:
    - Update `packages/tokens/css/tokens.css` with the "Satin-Charcoal" hierarchy:
      - `gf-color-neutral-10`: `oklch(8% 0.015 250)` (Canvas)
      - `gf-color-neutral-20`: `oklch(11% 0.015 250)` (Sidebar)
      - `gf-color-neutral-30`: `oklch(14% 0.02 250)` (Surface)
      - `gf-color-neutral-40`: `oklch(18% 0.02 250)` (Raised)
      - `gf-color-neutral-50`: `oklch(22% 0.02 250)` (Overlay)

2.  **Primitive Accent Ramps**:
    - Implement Kimchi (Default), Cobalt, and Emerald primitive ramps using defined OKLCH ranges in the draft specification.

3.  **Semantic Token Layer (`--ds-*`)**:
    - Bridge primitives to the semantic layer:
      - `--ds-background-default` → `var(--gf-color-neutral-10)`
      - `--ds-surface-raised` → `var(--gf-color-neutral-30)`
      - `--ds-accent-bold` → `var(--ds-primary-accent)`
      - `--ds-border-subtle` → `oklch(24% 0.02 250)`

4.  **Accent Switching Mechanism**:
    - Implement the `:root` redirection logic for `--ds-primary-accent` including organizational context data-attributes (`[data-accent-profile]`).

5.  **Tailwind v4 Integration**:
    - Ensure logical property mappings for RTL (Cairo font) are present and follow the 8pt grid system.

## ✅ Acceptance Criteria

- `pnpm preflight` runs without structural errors.
- Visual token audit in `packages/tokens` shows correct OKLCH mappings.
- No design system drift; primitives are properly aliased.

## 📂 Context Reference

- [DRAFT_design-system-redesign.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/design-system-redesign/DRAFT_design-system-redesign.md)
- [PLAN_design-system-redesign.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Ready/design-system-redesign/PLAN_design-system-redesign.md)
