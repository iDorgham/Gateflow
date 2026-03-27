# Perf

Performance audit, profiling, optimization.

## Instructions

1. Identify slow paths: build time, bundle size, DB queries.
2. Use browser subagent for CPU profiling if UI.
3. Check: `pnpm turbo build` timing, Lighthouse, React Profiler.

## Focus areas

- Prisma query N+1, missing indexes
- Bundle size, code splitting
- Re-renders, memoization
