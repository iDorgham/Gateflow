# Draft — design-system-redesign

**Slug:** design-system-redesign  
**Last updated:** 2026-04-06

---

## 🏛️ Overall Vision: The Serious Enterprise

GateFlow is the **OS for Secure Communities.**
Transform the current UI into a **serious, premium, high-trust enterprise-grade PropTech platform** heavily inspired by the **Atlassian Design System (ADS).** The new system must feel professional, sophisticated, and consistent across every touchpoint: marketing site, client-dashboard, admin-dashboard, resident-portal, scanner-app, and resident-mobile.

- **Core Aesthetic Pilar**: Refined **Satin-Charcoal dark mode** with deep, luxurious surface hierarchy (lightness levels 8-18-24) and subtle "satin" finish.
- **Accents**: **Kimchi** as energetic primary (default), with **Cobalt** and **Emerald** as professional profile variants.
- **DNA**: Glassmorphism, premium glows, and cinematic yet restrained micro-animations.
- **Discipline**: Strict **Token-First** discipline; zero hardcoded values.
- **Technical Excellence**: OKLCH perceptual uniformity, 8pt grid, WCAG 2.1 AA, and absolute RTL/Arabic support (Cairo + Inter).

---

## 🪜 Foundation Tokens (The System Engine)

### 🎨 1. Colors & Accents (OKLCH)

| Category    | Token Name                | OKLCH Value (Dark Base) | Semantic Usage              |
| :---------- | :------------------------ | :---------------------- | :-------------------------- |
| **Canvas**  | `--ds-background-default` | `oklch(8% 0.015 250)`   | Deep Satin page background. |
| **Surface** | `--ds-surface-subtle`     | `oklch(11% 0.015 250)`  | Nav/Sidebar containers.     |
| **Surface** | `--ds-surface-raised`     | `oklch(14% 0.02 250)`   | Standard component cards.   |
| **Surface** | `--ds-surface-overlay`    | `oklch(22% 0.02 250)`   | Highest elevation: Modals.  |
| **Accent**  | `--ds-accent-bold`        | `oklch(62% 0.22 35)`    | Primary CTAs (Kimchi).      |
| **Status**  | `--ds-text-danger`        | `oklch(60% 0.25 25)`    | Critical error messaging.   |

**Accent Profile Engine**:

- `[data-accent-profile="cobalt"] { --ds-primary-accent: oklch(50% 0.18 250); }`
- `[data-accent-profile="emerald"] { --ds-primary-accent: oklch(65% 0.15 155); }`

**Specialized Palettes**:

- **Glassmorphism**: `--ds-surface-glass`: `oklch(100% 0 0 / 0.03)` + `backdrop-filter: blur(16px)`.
- **Premium Glow**: `--ds-glow-accent`: `box-shadow: 0 0 20px -5px var(--ds-accent-subtle)`.
- **Data Viz**: 8-color sequential palette (Series 1-8) for Recharts.

### 🔡 2. Typography (Inter / Cairo)

- **Fluid Scale**: `clamp()`-driven hierarchy (Mobile to Desktop).
- **Semantics**: `--ds-text-primary`, `--ds-text-subtle`, `--ds-text-inverse`.
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700).

### 🧭 3. Iconography (Lucide 1.5px)

- **Stroke**: `--ds-icon-stroke: 1.5px` (Institutionally thin and refined).
- **Branding**: Trademark "Sentinel Glow" for brand-critical icons.

### 📏 4. Spacing & Grid (8pt)

- **Primitives**: 4, 8, 12, 16, 24, 32, 48, 64px.
- **Logical Property Mandates**: Use `inline-start/end` to ensure zero-css RTL support.

### 🏛️ 5. Layering & Z-Index Stack

- **Levels**: Toast (1000) > Modal (900) > Overlay (800) > Popover (700) > Base (1).
- **Depth FX**: Higher elevation = Stronger shadows + Soft glow spread.

### 🎬 6. Motion & Animation (Cine-Serious)

- **Easings**: `cubic-bezier(0.22, 1, 0.36, 1)` (Cine-Entrance).
- **Durations**: Fast (150ms), Base (300ms), Slow (500ms).
- **Physics**: Stiff-spring entrances with 50ms stagger delays for high-density tables.

### ⚡ 7. CSS Performance Optimizations

- **GPU-First**: Transform/Opacity only for high-frequency interactions.
- **Scroll-Driven**: CSS `@scroll-timeline` for subtle nav-bar blurs.
- **Reduced-Motion**: Respect `@media (prefers-reduced-motion: reduce)`.

---

## 🎨 Design Direction & Brand Personality

- **Tone**: Serious, trustworthy, professional premium PropTech.
- **Visual Metaphor**: Depth through layering, trust through consistency, and elite "Satin" finishes.
- **Contextual Identity**:
  - **Marketing**: Confident, expressive, conversion-driven.
  - **Dashboards**: High-density, calm, authoritative operational focus.
  - **Resident Portal**: Clean, approachable, self-service friendly.
  - **Mobile**: Compact, performant, tactile feedback.

---

## 📄 Documentation Roadmap (`apps/design-system`)

**12+ Specialized Pages:**

1. **Colors**: Primitive ramps, semantic aliases, and profile switching labs.
2. **Typography**: Fluid scaling, Cairo/Inter weights, and RTL specimen.
3. **Iconography**: Stroke standards and sentinel-glow lab.
4. **Spacing/Grid**: 8pt alignment, logical properties, and layout templates.
5. **Layering/Depth**: Z-Index map visualizer and elevation FX standards.
6. **Motion**: Easing visualizer and staggering animation playground.
7. **AI Elements**: GateAI Sidebars, messengers, and mesh visuals.
8. **Analytics**: Recharts tokens, data density, and chart entrances.
9. **Forms**: Multi-step inputs, validation states, and subtle glows.
10. **Complex UI**: DynamicTables, Drawer patterns, and sticky headers.
11. **Auth/Login**: High-trust gateway layouts and tenant branding patterns.
12. **Errors/Feedback**: Professional Toast notifications and Error masks.

---

## 🛡️ Enforcement & Implementation Strategy

- **Token Discipline**: No hardcoded values outside of `tokens.css` within component packages (`packages/ui`, `packages/components`).
- **The Ralph Loop**: Use `enforce-ads-design.js` (`pnpm check:ads`) to block primitive hex/rgb/px values across UI component libraries.
- **Preflight Checks**: `pnpm preflight` verifies token usage via `check:ads` and theme parity.
- **GPU Mandate**: Critical animations must be GPU-accelerated.

---

## ✅ Success Criteria

- 100% token usage across targeted component packages.
- Premium, serious, cohesive visual identity that feels institutional.
- Perfect light/dark parity, RTL support, and WCAG AA accessibility.
- Zero design system drift during organization context switching.

---

## 🚀 Suggested Phased Breakdown

### Phase 1: Foundation Token Overhaul

- Implement primitive OKLCH scales (Neutrals, Kimchi, Cobalt, Emerald).
- Establish the full `--ds-*` semantic level in `packages/tokens`.
- Map Tailwind/CSS logical properties to the new system.

### Phase 2: Core Documentation & Foundations

- Build the first 6 "Foundation" pages in `apps/design-system` (Colors to Motion).
- Implement the Accent Profile switching mechanism.

### Phase 3: Complex UI & Patterns Documentation

- Build the remaining 6 "Component/Pattern" pages (AI to Date Pickers).
- Establish the "Satin-Charcoal" surface hierarchy logic.

### Phase 4: Monorepo-Wide Enforcement

- Update `enforce-ads-design.js` to catch primitive drift.
- Standardize `packages/ui` and `packages/components` on the new tokens.

### Phase 5: The "Gateway" Redesign (Marketing & Auth)

- Apply the high-flair premium redesign to `apps/www` and Auth flows.
- Implement cinematic staggered entrances.

### Phase 6: Operational Redesign (Dashboards & Portal)

- Apply high-density premium redesign to Admin and Client dashboards.
- Refine Table, Analytics, and Form interactions.

### Phase 7: Mobile Optimization

- Redesign Scanner & Resident apps with compact, performant touch primitives.
- Finalize RTL/Arabic parity on mobile.

### Phase 8: Final Polish & PRD Sync

- Final accessibility audit and performance profiling.
- sync with `docs/PRD.md` and lock the version.

---

## 📝 Unified Changelog

- **2026-04-06**: Consolidated high-end enterprise vision.
- **2026-04-06**: [UNIFIED-ULTIMATE] 150+ line master specification covering EVERY prompt in this conversation.
