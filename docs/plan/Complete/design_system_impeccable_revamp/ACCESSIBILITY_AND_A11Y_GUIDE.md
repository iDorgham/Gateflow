# GateFlow Accessibility (A11y) & RTL Localization Engineering Guide

**Document:** `ACCESSIBILITY_AND_A11Y_GUIDE.md`  
**Initiative:** `design_system_impeccable_revamp`  
**Standard:** WCAG 2.2 Level AA Compliance  
**Target:** Monorepo Web & Mobile Applications  

---

## 1. Automated Accessibility Multi-Layer Architecture

GateFlow prevents accessibility debt through a 5-layer automated pipeline:

```
[Layer 1: Static Linting]
  Tool: eslint-plugin-jsx-a11y
  Scope: Monorepo static JSX analysis (aria-* validity, alt attributes, button types).
  Trigger: Pre-commit hook & GitHub Actions CI.

[Layer 2: Token Contrast Verification]
  Tool: @gateflow/tokens/check-contrast.ts
  Scope: Mathematical contrast calculation of all semantic text-on-surface pairs.
  Rule: Fails build if normal text < 4.5:1 or UI controls < 3.0:1.

[Layer 3: Component Unit Axe Gates]
  Tool: jest-axe / vitest-axe
  Scope: Unit tests on all primitives in packages/ui.
  Rule: 100% pass required before merging Phase 2 PR.

[Layer 4: Showcase Hard Gate]
  Tool: @axe-core/playwright
  Scope: Automated headless browser scan of all routes in apps/design-system.
  Rule: Zero critical or serious accessibility violations (Phase 4 Hard Gate).

[Layer 5: End-to-End App Journey Scans]
  Tool: Playwright E2E + axe-core
  Scope: Key user journeys (Dashboard visitors table, Resident QR pass creation, Guard scan HUD).
  Rule: Zero regressions during Phase 5 & 6 monorepo certification.
```

---

## 2. Token Contrast Verification Script Specification

`packages/tokens/scripts/check-contrast.ts` computes luminance ratios using the W3C WCAG 2.1 formula:

$$L = 0.2126 \cdot R_{sRGB} + 0.7152 \cdot G_{sRGB} + 0.0722 \cdot B_{sRGB}$$
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### Required Test Matrix
| Foreground Token | Background Surface | Theme | Minimum Ratio |
| :--- | :--- | :--- | :--- |
| `text-primary` | `layer-01`, `layer-02`, `layer-03`, `layer-04` | Light & Dark | $\ge 7.0:1$ (AAA target) |
| `text-subtle` | `layer-01`, `layer-02`, `layer-03` | Light & Dark | $\ge 4.5:1$ (AA compliant) |
| `text-brand` | `layer-01`, `layer-02` | Light & Dark | $\ge 4.5:1$ (AA compliant) |
| `border-focused` | `layer-02`, `layer-03` | Light & Dark | $\ge 3.0:1$ (AA compliant) |
| `color-danger` | `layer-02`, `layer-03` | Light & Dark | $\ge 4.5:1$ (AA compliant) |

---

## 3. Keyboard Navigation & Focus Ring Contract

### 3.1 Focus Ring Physics
- Focus rings must be unmistakable and meet $\ge 3:1$ contrast against adjacent pixels.
- Use `focus-visible:` only (prevent unwanted focus outlines on pointer clicks).
- Implementation:
```css
.ds-focus-ring {
  outline: none;
}
.ds-focus-ring:focus-visible {
  box-shadow: 0 0 0 2px var(--ds-layer-01), 0 0 0 4px var(--ds-color-primary);
}
```

### 3.2 Keyboard Navigation Matrix
- **`Tab` / `Shift+Tab`**: Moves focus between interactive controls in natural DOM order.
- **`Enter` / `Space`**: Triggers buttons, toggles switches, selects checkboxes.
- **`ArrowUp` / `ArrowDown`**: Navigates dropdown menus, tabs, and radio groups.
- **`Escape`**: Closes open dialogs, drawers, popovers, and command palettes, returning focus to trigger.

---

## 4. Arabic RTL & Bidirectional Localization Engineering

### 4.1 Logical CSS Properties Only
Never use physical directional CSS properties (`left`, `right`, `margin-left`, `padding-right`, `text-align: left`). Use logical CSS properties:

| Physical (Banned) | Logical Standard (Mandatory) | Tailwind Utility |
| :--- | :--- | :--- |
| `margin-left: 1rem` | `margin-inline-start: 1rem` | `ms-4` |
| `margin-right: 1rem` | `margin-inline-end: 1rem` | `me-4` |
| `padding-left: 1.5rem` | `padding-inline-start: 1.5rem` | `ps-6` |
| `padding-right: 1.5rem` | `padding-inline-end: 1.5rem` | `pe-6` |
| `left: 0` | `inset-inline-start: 0` | `start-0` |
| `right: 0` | `inset-inline-end: 0` | `end-0` |
| `text-align: left` | `text-align: start` | `text-start` |
| `text-align: right` | `text-align: end` | `text-end` |

### 4.2 Arabic Typography & Diacritic Protection
- Arabic text lines require $1.6\times$ line height (compared to $1.4\times$ in English) to prevent complex ligatures and vowel marks (Tashkeel) from clipping against container borders.
- Directional icons (arrows, chevrons, search leading icons) must flip automatically in RTL:
```tsx
<ChevronRightIcon className="w-4 h-4 rtl:rotate-180 transition-transform" />
```
