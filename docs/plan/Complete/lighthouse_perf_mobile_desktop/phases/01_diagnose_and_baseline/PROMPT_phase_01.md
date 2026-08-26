# Phase 1: Diagnose & Baseline Matrix

## Initiative

- **Slug:** `lighthouse_perf_mobile_desktop`
- **Plan:** `docs/plan/Complete/lighthouse_perf_mobile_desktop/PLAN_lighthouse_perf_mobile_desktop.md`
- **Phase:** 1 of 5

---

### Primary Role

`EXPLORE` / `FRONTEND`

### Tool Selection

|                            | Tool                      | Why                                                                  |
| -------------------------- | ------------------------- | -------------------------------------------------------------------- |
| **Tool 1** (best quality)  | Cursor / Claude Code CLI  | Fast log inspection, JSON analysis, and structured matrix extraction |
| **Tool 2** (free fallback) | OpenCode CLI / Gemini CLI | Script execution and summary generation                              |

### Skills to Load

- [x] `using-superpowers`
- [x] `verification-before-completion`
- [x] `gf-guide`

### Goal

Extract and document the comprehensive baseline performance matrix across target URLs, form factors, categories, and Core Web Vitals from the latest scheduled CI run and local diagnostic collection.

### Scope (in)

- Inspect the failing scheduled CI run (GitHub Actions run `32938556944` or fresh LHCI run).
- Record exact scores for Performance, Accessibility, Best Practices, SEO, LCP, TBT, CLS for:
  - `https://www.gateflow.site` (Mobile + Desktop)
  - `https://www.gateflow.site/en/features` (Mobile)
  - `https://www.gateflow.site/en/pricing` (Mobile)
  - `https://app.gateflow.site/en` (Desktop)
- Diagnose the impact of `/en` redirecting to `/en/login` on `app.gateflow.site`.
- Document baseline matrix in `docs/guides/performance/BASELINE_lighthouse_matrix.md`.

### Scope (out)

- Modifying production component code or config (handled in Phases 2-4).
- Lowering assertion thresholds in `.lighthouserc.js`.

### Steps (ordered)

1. Load context and investigate `ANALYSIS_performance_killers.md` alongside `.lighthouserc.js` and `.github/workflows/lighthouse.yml`.
2. Analyze LHCI output or execute a baseline diagnostic run via `npx --yes @lhci/cli@0.14.0 collect`.
3. Construct the comprehensive baseline matrix table covering all audited URLs and form factors.
4. Record key failure causes, redirect penalties, and LCP element identities in `docs/guides/performance/BASELINE_lighthouse_matrix.md`.
5. Verify that `docs/guides/performance/BASELINE_lighthouse_matrix.md` is complete and clear.

### Acceptance Criteria

- [ ] `docs/guides/performance/BASELINE_lighthouse_matrix.md` created with exact numbers for each URL × form factor combination.
- [ ] Primary LCP elements and CLS contributors identified for marketing mobile and dashboard desktop.
- [ ] Redirect behavior of `app.gateflow.site` documented with measured timing penalty.
