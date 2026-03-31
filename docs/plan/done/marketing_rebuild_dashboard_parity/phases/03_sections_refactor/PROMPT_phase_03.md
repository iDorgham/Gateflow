# Phase 03: Section refactors & RTL

### Primary role

**FRONTEND**

### Tool selection

|            | Tool         | Why                             |
| ---------- | ------------ | ------------------------------- |
| **Tool 1** | Cursor       | Many section components         |
| **Tool 2** | OpenCode CLI | Batch className / token renames |

### Skills to load

- `design-guide`, `responsive-design`, `ads-ui-styling`, `creative-animation` or `uiux-animator` (sections with motion)
- `i18n`, `ads-accessibility-rtl`

### MCP

- **cursor-ide-browser** — verify key pages after refactors

### Context

- Phase 01–02 merged; `CONTEXT_marketing_rebuild_dashboard_parity.md`

### Goal

Refactor **marketing sections** and key landing pages to use the **aligned token system** and shared UI patterns: homepage blocks, features, pricing, solutions hub, CTAs, cards.

### Scope (in)

- `apps/marketing/components/sections/*`
- `apps/marketing/app/[locale]/page.tsx`, `features/page.tsx`, `pricing/page.tsx`, `solutions/page.tsx` (as needed)
- Shared cards: `feature-card.tsx`, `pricing-card.tsx`, `hero-section.tsx`, etc.

### Scope (out)

- New copy or blog content overhaul
- API routes

### Steps

1. Prioritize high-traffic surfaces: home → pricing → features → solutions
2. Replace hardcoded palette classes with semantic tokens / `Button` `Card` from UI package where appropriate
3. RTL audit: flex direction, icons, padding on `ar-EG`
4. `pnpm --filter marketing lint`
5. If `packages/ui` touched in same pass: `pnpm preflight`

### Acceptance criteria

- [ ] Homepage + pricing visually consistent with dashboard semantics (primary, muted, border, surface)
- [ ] No broken layouts in `ar-EG` on refactored pages
- [ ] `pnpm --filter marketing lint` passes
- [ ] `pnpm preflight` passes when shared packages change

### Files likely touched

- `apps/marketing/components/sections/*.tsx`
- `apps/marketing/components/hero-section.tsx`, `feature-card.tsx`, `pricing-card.tsx`
- `apps/marketing/app/[locale]/page.tsx`, `features/page.tsx`, `pricing/page.tsx`, `solutions/page.tsx`

### Handoff

Visual system stable for final SEO/motion/verification pass.
