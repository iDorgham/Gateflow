# Pro Prompt — pagespeed_100 — Phase 4: High-Density UI Optimization

This phase virtualizes tables and removes tree-shakeable dead code for max performance.

---

## Phase 4: High-Density UI — Virtualization & Bundle Shaking

### Primary role

FRONTEND | PERFORMANCE

### Preferred tool

- [x] Cursor IDE — UI patterns, virtualization, bundle analysis
- [ ] Gemini CLI — Code audit and refactoring

### Context

- **Project**: GateFlow (Turborepo, UI Package)
- **Initiative**: `pagespeed_100`
- **Goal**: Resolve "Reduce JavaScript execution time" and "Limit the size of the DOM" Lighthouse audits.

### Goal

Implement windowing/virtualization for large data tables and ensure the UI bundle is tree-shaken.

### Scope (in)

- `packages/ui` (specifically `DynamicTable` or TanStack Table components).
- `apps/client-dashboard` (Scans, CRM, Gates lists).

### Scope (out)

- Streaming (Phase 3), Certification (Phase 5).

### Steps (ordered)

1. **Virtualize Tables**: Integrate `@tanstack/react-virtual` or similar into the global `DynamicTable`.
2. **Bundle Audit**: Use `next-bundle-analyzer` to identify large third-party libraries (e.g., full `lucide-react` vs scoped).
3. **Lazy Loading**: Use `next/dynamic` for heavy client-side components not in the initial viewport.
4. **Memoization**: Review expensive React renders and apply `useMemo`/`useCallback` where necessary.
5. **Auto-Sync**: git add, commit, push.

### Acceptance criteria

- [ ] All lists with 100+ items remain perfectly fluid (60fps scrolling).
- [ ] Main JS bundle size for dashboard is under 200kb (gzip).
- [ ] React DevTools show zero unnecessary re-renders in the main analytics dashboard.

### Files likely touched

- `packages/ui/src/components/ui/dynamic-table.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx`
- `apps/client-dashboard/next.config.js`
