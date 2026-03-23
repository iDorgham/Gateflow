# Pro Prompt — pagespeed_100 — Phase 3: Critical Path

This phase implements server-side streaming and Suspense boundaries for maximum responsiveness.

---

## Phase 3: Critical Path — Server-Side Streaming & Suspense Boundaries

### Primary role

BACKEND-API | FRONTEND

### Preferred tool

- [x] Claude CLI — Server components, data fetching, Suspense boundaries
- [ ] Gemini CLI — Logic verification and second opinion

### Context

- **Project**: GateFlow (Next.js 14 App Router)
- **Initiative**: `pagespeed_100`
- **Goal**: Reach 100/100 performance scores through non-blocking data fetching.

### Goal

Move slow data-fetching operations into `<Suspense>` boundaries using Next.js streaming (App Router).

### Scope (in)

- All main dashboard routes in `apps/client-dashboard` with heavy API queries.
- Implementation of `loading.tsx` skeletons at the layout/page levels.

### Scope (out)

- Asset optimizations (Phase 2), Virtualization (Phase 4).

### Steps (ordered)

1. **Route Analysis**: Identify pages with high time-to-first-byte (TTFB) due to slow serial fetching.
2. **Parallel Fetching**: Refactor database requests to use `Promise.all` where possible.
3. **Suspense Boundaries**: Wrap data-heavy components in `<Suspense>` with appropriate skeleton loaders.
4. **Streaming**: Ensure `dynamic = 'force-dynamic'` is only used when necessary, preferring static or ISR/streaming for core UIs.
5. **Git Cycle**: git add, commit, push.

### Acceptance criteria

- [ ] All high-density pages show immediate UI feedback (skeletons) before data settles.
- [ ] Cumulative Layout Shift (CLS) is near 0 during streaming.
- [ ] Lighthouse reports "Reduce initial server response time" as Passed.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/page.tsx`
- `apps/client-dashboard/src/components/layout/loading.tsx` (and other `loading.tsx` files).
