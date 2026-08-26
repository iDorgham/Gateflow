# PROMPT: Phase 04 — Core Web Vitals & Performance Verification

**Slug:** `marketing_egypt_uiux_polish`  
**Phase:** 04  
**Primary Role:** QA / DevOps  
**Preferred Tool:** Cursor / Claude CLI  
**App Scope:** `apps/marketing`

---

## Objective

Optimize Core Web Vitals (CWV) metrics across desktop and mobile, ensuring sub-1.2s Largest Contentful Paint (LCP), zero Cumulative Layout Shift (CLS < 0.02), and complete preflight verification.

---

## Context & Files to Touch

- `apps/marketing/components/sections/hero-animated-content.tsx`
- `apps/marketing/components/sections/product-screenshots.tsx`
- `apps/marketing/app/[locale]/page.tsx`
- `apps/marketing/next.config.js`

---

## Steps

1. Optimize `HeroAnimatedContent` so critical text content renders immediately without blocking on animation bundle execution.
2. Specify explicit width, height, and priority parameters on hero graphics and partner logos to eliminate layout shifts.
3. Dynamically import heavy below-the-fold widgets using Next.js `dynamic()` with appropriate loading states.
4. Execute full preflight test suite (`pnpm turbo lint typecheck --filter=marketing`) and confirm zero regressions.

---

## Acceptance Criteria

- [ ] Hero FCP and LCP optimized with immediate paint for critical copy.
- [ ] Zero layout shift on image load (CLS < 0.02).
- [ ] `pnpm turbo lint typecheck --filter=marketing` passes with 0 warnings/errors.
