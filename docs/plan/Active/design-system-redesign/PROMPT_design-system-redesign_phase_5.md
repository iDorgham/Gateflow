# Pro Prompt — Phase 5: Marketing & Auth Redesign (design-system-redesign)

## Phase 5: Marketing & Auth Redesign

### Primary role

FRONTEND | CREATIVE

### Tool Selection (Quality vs Cost)

|                            | Tool           | Why                                     |
| -------------------------- | -------------- | --------------------------------------- |
| **Tool 1** (best quality)  | Cursor         | Complex UI animations and layout        |
| **Tool 2** (free fallback) | OpenCode CLI   | Standard component refactors (semantic) |

### Skills to load

**Process skills:**
- [x] `using-superpowers` — always: check skills before any response
- [x] `verification-before-completion` — before claiming done, committing, or PR
- [x] `executing-plans` — disciplined batch execution with checkpoints
- [x] `gf-uiux-animator` — for premium Framer Motion work

**Domain skills:**
- [x] `ui-ux-pro-max` — new pages, redesigns, components
- [x] `gf-ads-core-tokens` — foundations of the Atlassian Design System tokens
- [x] `gf-creative-ui-animation` — CSS/Tailwind animations and performance

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **App**: `apps/marketing` (The "www" site)
- **Redesign Vision**: ADS-inspired (Atlassian Design System), premium, serious, enterprise-grade.
- **Key aesthetic**: Satin-Charcoal depth, high-flair premium animations, semantic `--ds-*` tokens only.

### Goal

Apply a high-flair premium redesign to the marketing site (`apps/marketing`) and its login flows, implementing cinematic staggered entrances and 100% semantic token compliance.

### Scope (in)

- **Marketing Redesign**: Update `apps/marketing/app/[locale]/page.tsx` and all components in `apps/marketing/components/sections/` (Hero, Features, Testimonials, etc.).
- **Login Redesign**: Overhaul `apps/marketing/app/[locale]/login/page.tsx` to be a premium, immersive entry point.
- **Cinematic Entrances**: Implement "Cine-Entrance" staggered animations (Framer Motion) globally across the marketing app.
- **Semantic Alignment**: Ensure 100% usage of `--ds-*` semantic tokens; eliminate hardcoded hex/Tailwind primitives.

### Scope (out)

- Do not touch dashboard logic or API routes.
- Do not modify mobile apps or portals (Phases 6-7).

### Steps (ordered)

1. **Audit & Sanitize**: Scan `apps/marketing` for non-semantic tokens and replace them using `packages/tokens`. Use the automated enforcement logic from Phase 4.
2. **Hero Transformation**: Redesign `HeroAnimatedContent.tsx` to use more subtle, professional "GateFlow-Glow" accents and cinematic depth.
3. **Login Overhaul**: Redesign the Login page with a split-screen or centered immersive layout, using the "Satin-Charcoal" depth palette.
4. **Cinematic Motion**: Build a `CineEntrance` wrapper component in `apps/marketing/components/` that provides staggered fades and slight shifts (y: 20 -> 0) for section content.
5. **Section Polish**: Apply the new design system (spacing, typography, depth) to all marketing sections.
6. **Verify**: Run `pnpm turbo lint --filter=marketing` and check against the `ui-ux-pro-max` premium criteria.

### Acceptance criteria

- [ ] All `apps/marketing` components use strictly `--ds-*` semantic tokens.
- [ ] The Hero section has a high-flair, cinematic feel with premium staggered entrances.
- [ ] The Login page is visually stunning and consistent with the new ADS-inspired vision.
- [ ] No layout regressions in RTL (Arabic) mode.
- [ ] `pnpm preflight` passes for `apps/marketing`.

### Files likely touched

- `apps/marketing/app/[locale]/page.tsx`
- `apps/marketing/app/[locale]/login/page.tsx`
- `apps/marketing/components/sections/*`
- `apps/marketing/components/nav.tsx`
- `apps/marketing/components/footer.tsx`
- `apps/marketing/app/globals.css`
