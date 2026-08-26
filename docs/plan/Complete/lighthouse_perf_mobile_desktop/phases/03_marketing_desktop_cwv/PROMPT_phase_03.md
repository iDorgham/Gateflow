# Phase 3: Marketing Desktop CWV & Best Practices

## Initiative

- **Slug:** `lighthouse_perf_mobile_desktop`
- **Plan:** `docs/plan/Complete/lighthouse_perf_mobile_desktop/PLAN_lighthouse_perf_mobile_desktop.md`
- **Phase:** 3 of 5

---

### Primary Role

`FRONTEND`

### Tool Selection

|                            | Tool                      | Why                                                                   |
| -------------------------- | ------------------------- | --------------------------------------------------------------------- |
| **Tool 1** (best quality)  | Cursor / Claude Code CLI  | Next.js code-splitting, bundle trimming, metadata & SEO optimizations |
| **Tool 2** (free fallback) | OpenCode CLI / Gemini CLI | Component refactoring and lint/test verification                      |

### Skills to Load

- [x] `using-superpowers`
- [x] `gf-nextjs-performance`
- [x] `gf-seo-core`
- [x] `verification-before-completion`

### Goal

Optimize desktop performance, bundle sizes, SEO, and Best Practices compliance across marketing routes (`/en`, `/en/features`, `/en/pricing`).

### Scope (in)

- Code-split and dynamically import below-the-fold heavy components (pricing calculators, interactive tabs, complex diagrams) with `dynamic(() => import(...), { ssr: true/false })`.
- Ensure all hyperlinks have valid descriptive text, correct `href`, and `rel="noopener noreferrer"` for external targets.
- Audit and eliminate console warnings, CSP deprecations, or mixed content warnings.
- Ensure proper OpenGraph, canonical URLs, and structured JSON-LD metadata for all targeted routes.
- Verify desktop assertions (Performance ≥ 0.65, Accessibility ≥ 0.85, Best Practices ≥ 0.88, SEO ≥ 0.90, TBT ≤ 200ms).

### Scope (out)

- Modifying client dashboard codebase (handled in Phase 4).
- Creating new marketing routes or major copy redesign.

### Steps (ordered)

1. Audit route bundles for `/en`, `/en/features`, and `/en/pricing` in `apps/marketing`.
2. Convert heavy client interactive widgets to dynamic imports with lightweight placeholder skeletons.
3. Review Best Practices and SEO audits in Lighthouse report; fix missing meta tags, link descriptions, or security header conflicts.
4. Test desktop performance locally using `@lhci/cli`.
5. Run workspace checks: `pnpm turbo lint typecheck test --filter=@gateflow/marketing`.

### Acceptance Criteria

- [ ] Below-the-fold heavy modules are dynamically loaded without main-thread blocking.
- [ ] Desktop Best Practices score reaches ≥ 0.88 and SEO score reaches ≥ 0.90.
- [ ] Total Blocking Time (TBT) on desktop remains well under 200ms.
- [ ] `pnpm turbo lint typecheck test --filter=@gateflow/marketing` passes cleanly.
