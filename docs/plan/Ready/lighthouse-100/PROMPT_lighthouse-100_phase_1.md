# PROMPT — lighthouse-100 — Phase 1: Foundation & Measurement Baseline

**Initiative:** `lighthouse-100`  
**Phase:** 1 of 5  
**Primary Role:** Architecture / DevOps  
**Preferred Tool:** Opencode / Gemini  

---

## 🎯 Phase Goal

Establish baseline Lighthouse performance audits for all 5 web applications (`apps/marketing`, `apps/design-system`, `apps/resident-portal`, `apps/client-dashboard`, `apps/admin-dashboard`), identify critical blocking JS/CSS bottlenecks, and scaffold shared performance utilities in `@gateflow/ui`.

---

## 🛠️ Step-by-Step Implementation Instructions

1. **Baseline Measurement**:
   - Run Lighthouse CI or Chrome DevTools audits on all 5 web apps across Desktop & Mobile profiles.
   - Record baseline LCP, CLS, INP, TTFB, and JS payload sizes into `docs/plan/Draft/lighthouse-100/BASELINE_AUDIT.md`.
2. **Font & CSS Optimization**:
   - Audit `next/font` configuration in each app layout (`Inter` and `Cairo`). Ensure `display: 'swap'`, `preload: true`, and matching fallback font metrics to prevent layout shifts.
   - Verify that all CSS consumes `--ds-*` semantic tokens without runtime CSS-in-JS parsing overhead.
3. **Shared Performance Primitives**:
   - Create shared dynamic island utilities in `packages/ui` (e.g. `createDynamicIsland` with built-in zero-CLS skeleton placeholder).
   - Scaffold image preloading helpers and resource hints for critical assets.
4. **Verification**:
   - Verify `pnpm preflight` and run typecheck across packages.

---

## 🧪 Acceptance Criteria

- [ ] `docs/plan/Draft/lighthouse-100/BASELINE_AUDIT.md` documents all 5 apps' starting scores.
- [ ] Shared performance utilities exported from `@gateflow/ui`.
- [ ] Font metric fallbacks configured to eliminate font-swap CLS.
- [ ] `pnpm preflight` passes cleanly.
