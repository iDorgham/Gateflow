# GateFlow Design System & Tokens: The Unified Manifesto

## Vision & Philosophy

The GateFlow Design System is engineered to provide a **premium,
enterprise-grade, and perceptually uniform** experience across all touchpoints
(Admin Dashboard, Resident Portal, and Scanner Apps).

Our core philosophy is **"Token First"**. No hardcoded colors, spacing, or
arbitrary radii are allowed. Every visual decision is an expression of a
semantic token.

### 1. The Power of OKLCH

Unlike legacy HSL or RGB systems, GateFlow uses the **OKLCH** color space.

- **Perceptually Uniform:** A 10% change in Lightness (L) looks the same across
  all Hues (H).
- **Predictable Themes:** This allows us to mathematically derive dark mode
  surfaces from light mode foundations while maintaining perfect contrast and
  readability.
- **Satin-Charcoal aesthetic:** We avoid stark blacks (#000) and flat greys,
  favoring deep, satin-finished charcoal tones (12-22% lightness) in dark mode.

---

## Architecture: The Three Layers of Tokens

### A. Core Foundations (`--gf-color-neutral-*`)

The raw brand palette and primitive neutrals. These are the building blocks:

- **Kimchi (#ED4B00):** Our primary brand hue, expressed in scales from 50 to 950.
- **Neutrals:** Carefully calibrated greys with slight blue/warm tints to avoid
  "dead" colors in professional UIs.

### B. Semantic Tokens (`--ds-*`)

This is the **primary layer** developers and AI agents should use. They
describe _what_ a color does, not what it _is_.

- `--ds-background-default`: Primary card/surface color.
- `--ds-text-subtle`: Secondary descriptive text.
- `--ds-border-bold`: Emphasis borders for focus or depth.

### C. Specialized Domain Palettes

- **Virtual Laboratory (AI):** Orchid and Violet tones (`--gf-color-ai-surface`,
  `--gf-color-ai-accent`) used exclusively for Artificial General Intelligence
  features.
- **Data Viz (Analytics):** A 5-color track optimized for data clarity on both
  light/dark canvases.

---

## Theme Parity (Light vs. Dark)

GateFlow achieves **100% theme parity** by mapping semantic tokens to different
foundation primitives based on the theme:

| Semantic Token   | Light Mode Value      | Dark Mode Value             |
| :--------------- | :-------------------- | :-------------------------- |
| `surface-page`   | Off-white (98% Light) | Satin-Charcoal (12% Light)  |
| `surface-raised` | White + Soft Shadow   | Charcoal + Subtle Edge Glow |
| `text-primary`   | Slate-950             | Neutral-10 (near white)     |
| `border-subtle`  | Light Grey (92% L)    | Satin Line (24% L)          |

---

## Layout & Structural Standards

Standardized structural components ensure a familiar feel across the monorepo:

- **Left Side Menu:** Uses `--ds-sidebar-bg` and high-density active item tokens.
- **Header/Footer:** Integrated with `--ds-header-bg` and `--ds-footer-bg`.
- **Corner Radii:**
  - `rounded-xl` (12px): Standard buttons/inputs.
  - `rounded-2xl` (16px): Standard cards.
  - `rounded-[2.5rem]` (40px): Large page containers and premium section
    backgrounds.

---

## Interaction & Motion

Interaction in GateFlow is "Expressive yet Professional":

- **Glow Premium:** Hovering on primary cards triggers `var(--ds-glow-premium)`,
  a subtle bloom effect.
- **Expressive Easing:** We use a custom cubic-bezier (0.4, 0, 0.2, 1) to ensure
  transitions feel cinematic rather than mechanical.
- **Duration:** Base interaction is 300ms; entry animations is 500ms.

---

## RTL & Localization (Arabic Support)

GateFlow is built from the ground up for the MENA market:

- **Logical Properties:** We use `margin-inline`, `padding-inline`, and
  `border-inset` instead of `left/right` to support automatic RTL mirroring
  without code changes.
- **Inter & Cairo Fonts:** Inter provides crisp English legibility, while Cairo
  (specifically selected for RTL) offers unmatched professional clarity in
  Arabic dashboard environments.

---

## AI Prompting Instructions (Master Rules)

To maintain this system using AI tools (Cursor, Claude, Antigravity), follow
these "Golden Rules" in your prompts:

> [!IMPORTANT]
> **"Golden Rule for AI Agents"**
>
> 1. NEVER use `bg-slate-50` or `text-zinc-600`.
> 2. ALWAYS use `bg-[var(--ds-background-default)]` and
>    `text-[var(--ds-text-subtle)]`.
> 3. Use `rounded-[var(--ds-border-radius-200)]` for enterprise cards.
> 4. For AI-related features, use the **Virtual Lab** colors: `bg-ai-surface`
>    and `text-ai-accent`.

**Example Prompt:**
_"Create a premium analysis card using the .ds-card-premium utility. Use the
standard semantic tokens for background and text. Ensure the border uses the
subtle variant and apply the expressive hover animation."_

---

## Monorepo Implementation Sync

All apps (`admin-dashboard`, `resident-portal`, `design-system`) share the same
source of truth:

1. **Tokens Source:** `packages/tokens/css/tokens.css`
2. **Tailwind Integration:** `apps/design-system/src/app/globals.css` (The main
   `@theme` block).
3. **App Consumption:** Apps import `@gateflow/ui/globals.css` directly to stay
   in sync with the core architecture.

---

**Last Updated:** April 2026

**Status:** Enterprise Ready (v1.0)
