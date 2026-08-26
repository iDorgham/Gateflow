# Phase 2: Marketing Mobile Core Web Vitals

## Initiative

- **Slug:** `lighthouse_perf_mobile_desktop`
- **Plan:** `docs/plan/Complete/lighthouse_perf_mobile_desktop/PLAN_lighthouse_perf_mobile_desktop.md`
- **Phase:** 2 of 5

---

### Primary Role

`FRONTEND`

### Tool Selection

|                            | Tool                      | Why                                                                                     |
| -------------------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| **Tool 1** (best quality)  | Cursor / Claude Code CLI  | Accurate component editing, CSS logical properties, React 19 / Next.js 16 optimizations |
| **Tool 2** (free fallback) | OpenCode CLI / Gemini CLI | Component refactoring and lint/test verification                                        |

### Skills to Load

- [x] `using-superpowers`
- [x] `gf-design-guide`
- [x] `gf-ads-foundations`
- [x] `gf-responsive-design-system`
- [x] `verification-before-completion`

### Goal

Eliminate mobile LCP and CLS bottlenecks in `apps/marketing` by making hero LCP candidates immediately visible, configuring web font swaps, optimizing critical images, and stabilizing layout shifts.

### Scope (in)

- `apps/marketing/components/sections/hero-animated-content.tsx`: Remove `initial="hidden"` and delay from LCP heading; ensure text is rendered in server HTML and visible on mount.
- `apps/marketing/app/[locale]/layout.tsx`: Add `display: 'swap'` to `Poppins` font configuration, trim unused weights (keep only 400, 600, 700), and add preconnect hints for font/external origins.
- Convert critical above-the-fold PNG hero graphics to WebP/AVIF format with explicit `width` and `height`.
- Stabilize mobile viewports using `min-h-dvh` and reserved dimensions to eliminate layout shifts (`CLS ≤ 0.05`).

### Scope (out)

- Modifying client dashboard components (handled in Phase 4).
- Altering visual branding, copy, or marketing structure.

### Steps (ordered)

1. Update `hero-animated-content.tsx` so the main headline renders with immediate visibility while preserving subtle entry animations on secondary non-LCP elements.
2. Update font configuration in `apps/marketing/app/[locale]/layout.tsx` with `display: 'swap'` and pruned font weights.
3. Optimize hero image assets in `apps/marketing/public/` or image wrappers to ensure WebP formats, explicit sizes, and `priority` on above-the-fold assets.
4. Replace `h-screen` classes with `min-h-dvh` across marketing hero containers and check Arabic RTL alignment.
5. Run verification: `pnpm turbo lint typecheck test --filter=@gateflow/marketing`.

### Acceptance Criteria

- [ ] Hero headline in `apps/marketing` renders without opacity delays.
- [ ] `Poppins` font is loaded with `display: 'swap'` and trimmed weights.
- [ ] Above-the-fold images have explicit dimensions and priority loading.
- [ ] `pnpm turbo lint typecheck test --filter=@gateflow/marketing` passes with 0 errors.
- [ ] No visual token or RTL regressions in English or Arabic.
