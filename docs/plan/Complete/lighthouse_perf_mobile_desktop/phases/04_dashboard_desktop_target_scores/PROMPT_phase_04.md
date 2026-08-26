# Phase 4: Dashboard Desktop Target & Performance Optimization

## Initiative

- **Slug:** `lighthouse_perf_mobile_desktop`
- **Plan:** `docs/plan/Complete/lighthouse_perf_mobile_desktop/PLAN_lighthouse_perf_mobile_desktop.md`
- **Phase:** 4 of 5

---

### Primary Role

`FRONTEND` / `DEVOPS`

### Tool Selection

|                            | Tool                      | Why                                                                               |
| -------------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| **Tool 1** (best quality)  | Cursor / Claude Code CLI  | Next.js configuration, NextAuth / login route optimization, image domain security |
| **Tool 2** (free fallback) | OpenCode CLI / Gemini CLI | Component refactoring and lint/test verification                                  |

### Skills to Load

- [x] `using-superpowers`
- [x] `gf-nextjs-performance`
- [x] `gf-ads-foundations`
- [x] `verification-before-completion`

### Goal

Ensure the Client Dashboard desktop audit target (`app.gateflow.site`) is deliberate, performant, and meets all assertion floors (Performance ≥ 0.65, Accessibility ≥ 0.85, Best Practices ≥ 0.88, LCP ≤ 2500ms).

### Scope (in)

- Define and document the deliberate audit target for `app.gateflow.site` (optimizing `/en/login` as the public entry point when unauthenticated, or establishing a public health/showcase URL).
- `apps/client-dashboard/next.config.js`: Replace wildcard `hostname: '**'` with explicit trusted remote image patterns (`*.amazonaws.com`, `lh3.googleusercontent.com`, `avatars.githubusercontent.com`, `ui-avatars.com`) to re-enable Next.js image optimization.
- `apps/client-dashboard/src/app/[locale]/layout.tsx`: Add `display: 'swap'` to font loaders and prune unused font weights.
- Dynamically import heavy charting libraries (`recharts`) with loading skeletons.
- Add `Suspense` streaming boundaries around heavy data-fetching components to prevent full-page server waterfalls.

### Scope (out)

- Modifying authentication mechanisms, session cookies, or RBAC security invariants.
- Marketing site changes (handled in Phases 2-3).

### Steps (ordered)

1. Review `apps/client-dashboard` public entry and login pages; streamline SSR payload and asset preloading.
2. Update `next.config.js` image configuration to enable Next.js image transformations and caching.
3. Optimize font loading in `apps/client-dashboard` layout.
4. Convert synchronous `recharts` imports in dashboard modules to dynamic imports with skeletons.
5. Verify that `app.gateflow.site` desktop audit meets or exceeds `.lighthouserc.js` assertion floors.
6. Run workspace checks: `pnpm turbo lint typecheck test --filter=@gateflow/client-dashboard`.

### Acceptance Criteria

- [x] Dashboard login page loads with fast LCP and no blocking SSR waterfalls.
- [x] `next.config.js` image `remotePatterns` restrict domains and allow image pre-optimization.
- [x] Recharts and non-critical dashboard dependencies are lazy-loaded.
- [x] `pnpm turbo lint typecheck test --filter=@gateflow/client-dashboard` passes cleanly.
- [x] Dashboard desktop LHCI run passes all assertion floors (verified in LIGHTHOUSE_PERF_CERTIFICATION.md).
