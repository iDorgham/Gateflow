# PHASE 1: GateFlow Design System Redesign — Foundation Tokens Overhaul

**Role:** Design Technologist / UI Specialist  
**Preferred Tool:** Cursor, Antigravity, Claude CLI, Opencode CLI, Gemini CLI, Kiro CLI, Kilo CLI, Qwen CLI

---

## 🎯 Objective

Redesign the foundation tokens in `packages/tokens/css/tokens.css` to support
a premium, enterprise-grade identity. We need to move from a basic theme to a
robust semantic system (ADS-inspired) that includes multi-accent profiles
(Kimchi, Cobalt, Emerald), a deep Satin-Charcoal hierarchy, and sophisticated
Spacing, Grid, Layering, and Motion primitives.

---

## 🛠 Prerequisites

- Review existing `packages/tokens/css/tokens.css`.
- Familiarize yourself with Atlassian Design System (ADS) spacing/layering
  principles.

---

## 📝 Steps

### 1. Color Profiles & Accent Logic (OKLCH)

- **Accent Profiling**: Define `--gf-color-accent-*` ranges using Kimchi
  (#ED4B00) as the default.
- **Alternative Profiles**: Add `@supports` or custom selectors for "Cobalt"
  and "Emerald" profile overrides.
- **Semantic Mapping**: Add `--ds-accent-*` and `--ds-accent-foreground-*`
  tokens.

### 2. Deepening the Dark Mode hierarchy

- **Satin-Charcoal Refinement**: Refine `[data-color-mode="dark"]` surface tokens:
  - `--gf-color-bg-page`: 8% L (deep canvas).
  - `--gf-color-bg-subtle`: 11% L (sidebar/nav).
  - `--gf-color-bg-default`: 14% L (cards).
  - `--ds-surface-raised`: 18% L (dropdowns/modals).
  - `--ds-surface-overlay`: 24% L (highest elevation).
- **Glassmorphism Layers**: Add `--ds-surface-glass` with varying opacity/blur
  levels.

### 3. Typography & Iconography

- **Typography Scale**: Fluid `clamp()` scale for headers; Cairo/Inter font
  weight mappings.
- **Icon Scale**: Standard stroke widths (1.5px, 2px) and icon box sizes
  (16, 20, 24).

### 4. Spacing, Grid & Layering

- **8pt Grid**: Define `--gf-space-*` tokens (2, 4, 8, 12, 16, 24, 32, 48, 64).
- **Layering System**: Map `--gf-z-index-*` for toast (1000), modal (900),
  overlay (800), and popover (700).

### 5. Advanced Motion & Easing

- **Motion Primitives**: Define durations (`fast: 150ms`, `base: 300ms`,
  `slow: 500ms`).
- **Expressive Easings**: Define `expressive-easing` (cubic-bezier) and
  `stiff-spring` for professional micro-animations.

---

## ✅ Acceptance Criteria (AC)

- All new tokens are defined semantically in `tokens.css`.
- Accent profiles (Kimchi/Cobalt/Emerald) are correctly defined.
- `pnpm preflight` passes when executed from the repository root.
- Foundations are set for the 12+ documentation pages.
