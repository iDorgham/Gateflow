---
name: design-guide
description: Web & Mobile app design — Impeccable UI/UX, dual-mode tokens, typography, spatial layout, animations, dashboard patterns, and Arabic RTL. Use when designing, auditing, or polishing any interface.
---

# Impeccable Design Guide (gf-design-guide)

The authoritative design reference for GateFlow web, mobile, and dashboard applications, combining the Atlassian Design System (ADS) foundation with the `/impeccable` design methodology and Anti-AI-Slop standards.

---

## 🎨 1. Impeccable Commands Integration

When building, refining, or auditing any UI, use the corresponding `/impeccable` subcommands:

<<<<<<< Updated upstream
| Action | Impeccable Command | Purpose & Focus |
| :--- | :--- | :--- |
| **Foundations & Palette** | `/impeccable colorize [target]` | Porcelain/satin-slate neutrals, WCAG 2.2 AA contrast, status tints. |
| **Typography & Scale** | `/impeccable typeset [target]` | Inter / Outfit / Cairo (Arabic) hierarchy, fluid `clamp()` sizing. |
| **Spatial & Spacing** | `/impeccable layout [target]` | 8pt / 4pt spatial grid, consistent optical padding, bento grids. |
| **Feature Crafting** | `/impeccable craft [feature]` | End-to-end component creation from architectural shape to markup. |
| **Motion & Micro-interactions** | `/impeccable animate [target]` | Purposeful cubic-bezier ease-out transitions (`transform`/`opacity` only). |
| **Personality & Micro-glows** | `/impeccable delight [target]` | Tasteful glows, status pulses, distinct non-generic character. |
| **Resilience & Edge Cases** | `/impeccable harden [target]` | Error states, empty states, skeletons, Arabic RTL bidi mirroring. |
| **Mobile & Touch** | `/impeccable adapt [target]` | 44px+ touch targets, bottom sheets, `nativeTokens` hex bridge. |
| **UX Review & Heuristics** | `/impeccable critique [target]` | 30 UX laws evaluation, cognitive load, Nielsen Norman heuristics. |
| **Quality Audit** | `/impeccable audit [target]` | Contrast calculations, anti-AI-slop test, Lighthouse CWV compatibility. |
| **Final Delivery** | `/impeccable polish [target]` | Pixel-perfection, sub-pixel rendering, focus-ring elevation alignment. |
=======
| Action                          | Impeccable Command              | Purpose & Focus                                                            |
| :------------------------------ | :------------------------------ | :------------------------------------------------------------------------- |
| **Foundations & Palette**       | `/impeccable colorize [target]` | Porcelain/satin-slate neutrals, WCAG 2.2 AA contrast, status tints.        |
| **Typography & Scale**          | `/impeccable typeset [target]`  | Inter / Outfit / Cairo (Arabic) hierarchy, fluid `clamp()` sizing.         |
| **Spatial & Spacing**           | `/impeccable layout [target]`   | 8pt / 4pt spatial grid, consistent optical padding, bento grids.           |
| **Feature Crafting**            | `/impeccable craft [feature]`   | End-to-end component creation from architectural shape to markup.          |
| **Motion & Micro-interactions** | `/impeccable animate [target]`  | Purposeful cubic-bezier ease-out transitions (`transform`/`opacity` only). |
| **Personality & Micro-glows**   | `/impeccable delight [target]`  | Tasteful glows, status pulses, distinct non-generic character.             |
| **Resilience & Edge Cases**     | `/impeccable harden [target]`   | Error states, empty states, skeletons, Arabic RTL bidi mirroring.          |
| **Mobile & Touch**              | `/impeccable adapt [target]`    | 44px+ touch targets, bottom sheets, `nativeTokens` hex bridge.             |
| **UX Review & Heuristics**      | `/impeccable critique [target]` | 30 UX laws evaluation, cognitive load, Nielsen Norman heuristics.          |
| **Quality Audit**               | `/impeccable audit [target]`    | Contrast calculations, anti-AI-slop test, Lighthouse CWV compatibility.    |
| **Final Delivery**              | `/impeccable polish [target]`   | Pixel-perfection, sub-pixel rendering, focus-ring elevation alignment.     |
>>>>>>> Stashed changes

---

## 🌓 2. Dual-Mode Surface Hierarchy

Never use raw `#000` or `#fff`. Use layered satin surfaces with distinct depth:

- **Light Mode (Porcelain/Alabaster)**:
  - Canvas / Gutter: `#f8f9fa`
  - Default Card: `#ffffff`
  - Raised Surface: `#ffffff` + subtle shadow (`0 1px 3px rgba(15, 23, 42, 0.08)`)
  - Overlay / Modal: `#ffffff` + deep shadow (`0 20px 25px -5px rgba(15, 23, 42, 0.08)`)
  - Border: `#e2e6eb` (subtle `#edf1f5`, bold `#cbd2db`)

- **Dark Mode (Satin Charcoal/Slate)**:
  - Canvas / Gutter: `#0b0d11` (`oklch(8% 0.012 250)`)
  - Default Card: `#12151c` (`oklch(12% 0.015 250)`)
  - Raised Surface: `#191d26` (`oklch(16% 0.018 250)`)
  - Overlay / Modal: `#212633` (`oklch(20% 0.02 250)`)
  - Border: `#232834` (subtle `#171b24`, bold `#363d4e`)

---

## 🚫 3. Anti-AI-Slop Rules (Instant Failures)

1. **NO `border-left` > 1px colored accent** on cards (use full borders, subtle background tints, or status badges).
2. **NO decorative gradient text** (`background-clip: text`) in application console tools.
3. **NO default glassmorphism** on basic cards (reserve backdrop-blur strictly for floating topbars or HUD overlays).
4. **NO identical card grids** (vary density, utilize asymmetrical bento layouts or data tables).
5. **NO layout property animations** (never animate `width`, `height`, `margin`, `padding` — animate `transform` and `opacity` only).
6. **NO bounce or elastic easing** (use `cubic-bezier(0.16, 1, 0.3, 1)` ease-out).

---

## 📱 4. Mobile & Multi-Surface Architecture

- **React Native / Expo**: Consume resolved hex values via `nativeTokens` in `@gate-access/ui/tokens`.
- **Dashboards**: High-density data tables, metric tiles, command bars (`cmd+k`), and slide-over drawers.
- **Marketing**: Animated bento containers, sticky glass navbars, and interactive preview cards.
- **RTL Support**: Use logical CSS utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) and Cairo Arabic font stacks.
