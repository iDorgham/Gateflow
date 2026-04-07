# Phase 3: Pattern Documentation (7-12)

**Primary role**: `@frontend.md`
**Preferred tool**: `Cursor`

## Context

We have established the **Foundation Tokens (v3)** and documented the **Core Foundations (1-6)**. Now we must move up the atomic chain to **Pattern Documentation**. This phase focuses on how tokens combine to form the institutional GateFlow interface across complex domains: AI, Analytics, Forms, Tables, Auth, and Calendars.

## Steps

1. **AI Elements (`/ai-ui`)**: Document the "GateAI" chat patterns. Showcase the orchid/violet glowing surfaces, staggered message entrances, and the premium "Thinking" state.
2. **Analytics (`/analytics`)**: Showcase Recharts integration with the 5-color institutional palette. Document how chart colors adapt to Kimchi/Cobalt/Emerald profiles.
3. **Forms (`/forms`)**: Document multi-step form patterns, institutional validation states (Institutional Gold for warnings), and the subtle glow-focus protocol.
4. **Complex UI (`/complex-ui`)**: Document high-density Tables (16px gutters), Sticky headers with glassmorphism, and Overlay/Drawer stacking rules.
5. **Auth & Global Branding (`/auth-branding`)**: Document tenant-specific login pages, showing how the accent profile changes the entire auth experience (logos, primary buttons, links).
6. **Interaction Labs**: Each page must include at least one "Interaction Lab" (similar to the Accent Profile Lab) to demonstrate the patterns in a live environment.

## Acceptance Criteria

- 6 new documentation pages created in `apps/design-system/src/app/(docs)/patterns/`.
- All pages use `--ds-*` semantic tokens exclusively.
- Sidebar updated with new links.
- No lint errors in `apps/design-system`.
- All pages support full RTL (Arabic) parity.
