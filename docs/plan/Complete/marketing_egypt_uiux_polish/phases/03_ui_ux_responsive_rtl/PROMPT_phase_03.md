# PROMPT: Phase 03 — UI/UX & Responsive RTL Polish

**Slug:** `marketing_egypt_uiux_polish`  
**Phase:** 03  
**Primary Role:** FRONTEND  
**Preferred Tool:** Cursor  
**App Scope:** `apps/marketing`

---

## Objective

Refine UI/UX micro-animations, enhance sticky navigation and mobile menu drawer, and guarantee pixel-perfect bidirectional (RTL/LTR) fluidity across all responsive breakpoints.

---

## Context & Components to Touch

- `apps/marketing/components/nav.tsx`
- `apps/marketing/components/sections/hero-animated-content.tsx`
- `apps/marketing/components/sections/trust-bar.tsx`
- `apps/marketing/components/sections/pricing-card.tsx`
- `apps/marketing/components/footer.tsx`

---

## Steps

1. Verify and enforce CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`) across all section layouts.
2. Ensure directional icons (chevrons, back/forward arrows) flip cleanly when `locale === 'ar-EG'`, while non-directional icons (search, shield, lock) stay fixed.
3. Encapsulate all telephone numbers, numeric metrics badges, and system codes in `dir="ltr"` containers so numbers format correctly in Arabic view.
4. Polish Framer Motion entrance animations and hover states on trust cards and pricing tiers.

---

## Acceptance Criteria

- [ ] RTL layout renders without horizontal overflow or misaligned icons in Arabic mode.
- [ ] Phone numbers and numeric codes display in LTR format.
- [ ] Mobile navigation drawer operates smoothly on iOS and Android viewports.
- [ ] `pnpm turbo lint typecheck --filter=marketing` passes cleanly.
