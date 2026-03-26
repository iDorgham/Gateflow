# Pro Prompt — pagespeed_100 — Phase 2: Asset Overhaul

This phase optimizes images, fonts, and icons for 100/100 performance scores.

---

## Phase 2: Asset Overhaul — Image, Font & Icon Optimizations

### Primary role

FRONTEND | PERFORMANCE

### Preferred tool

- [x] Cursor IDE — Visual optimization and code refactoring
- [ ] Gemini CLI — Asset auditing and size analysis

### Context

- **Project**: GateFlow (Next.js 14, Turborepo)
- **Initiative**: `pagespeed_100`
- **File**: `docs/plan/planned/pagespeed_100/PLAN_pagespeed_100.md`
- **Goal**: Achieve a "Performance" score of 100 by reducing First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

### Goal

Optimize global assets (images, fonts, and icons) to minimize bundle size and network requests.

### Scope (in)

- All images in `apps/client-dashboard` and `apps/marketing`.
- Font configurations in `packages/ui/src/styles/fonts.ts` or similar.
- Icon usage across all apps.

### Scope (out)

- Server-side streaming (Phase 3), Virtualization (Phase 4).

### Steps (ordered)

1. **Next/Image Audit**: Ensure all `<img>` tags are replaced with `next/image` using correct `priority` and `sizes`.
2. **Font Optimization**: Use `next/font/google` with `display: swap` and subsetting.
3. **SVG Strategy**: Move from large icon libraries to scoped exports or a single SVG sprite.
4. **Metadata Audit**: Add `preconnect` and `dns-prefetch` for external assets (if any).
5. **Auto-Sync**: git add, commit, push.

### Acceptance criteria

- [ ] LCP is under 2.5s on mobile/desktop.
- [ ] Total bundle size for core pages is reduced by 15%+.
- [ ] No more "Large image payloads" in Lighthouse reports.

### Files likely touched

- `packages/ui/src/styles/fonts.ts`
- `apps/client-dashboard/next.config.js`
- `apps/marketing/next.config.js`
- Components with heavy images.
