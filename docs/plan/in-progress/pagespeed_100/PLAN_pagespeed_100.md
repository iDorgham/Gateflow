# PLAN: Google PageSpeed 100% Mastery

Initiative: `pagespeed_100`
Goal: 100/100 Google PageSpeed score (Mobile & Desktop) across all GateFlow routes.

## 📈 Status Check

- **Current**: Marketing ~65 mobile / ~78 desktop | Dashboard ~58 mobile / ~72 desktop
- **Target**: 100/100
- **Team**: `perf` (Gemini, Opencode, Kilo)
- **Baseline**: `docs/perf/baseline_psi.json`
- **Analysis**: `docs/perf/ANALYSIS_performance_killers.md`

## 🗺️ Phases

### Phase 1: Lighthouse CI & Automated Baselines ✅

- **Goal**: Establish a repeatable performance measurement pipeline.
- **Deliverables**:
  - [x] GitHub Action for Lighthouse CI (mobile + desktop, PR comment, artifacts).
  - [x] Performance baseline documented (`docs/perf/baseline_psi.json`).
  - [x] Top 5 LCP/CLS killers analysed (`ANALYSIS_performance_killers.md`).
  - [x] `.lighthouserc.js` committed with phased thresholds.
  - [x] `performance` job added to `ci.yml` (bundle + import checks).

### Phase 2: Asset Overhaul (LCP & CLS Fixes) ✅

- **Goal**: Resolve all image and font-related bottlenecks.
- **Deliverables**:
  - [x] `next/image` — wildcard `hostname: **` replaced with explicit 7-entry allowlist; AVIF/WebP formats enabled.
  - [x] Font swapping strategy — `display: 'swap'` added to Poppins; weights trimmed from 7 → 4 in both apps.
  - [x] Mobile viewport CLS — all `h-screen`/`min-h-screen` → `h-dvh`/`min-h-dvh` (6 files).
  - [x] Preconnect hints for GTM, GA, Facebook Pixel CDNs added to marketing `<head>`.
  - [x] `.lighthouserc.js` thresholds raised to Phase 2 values (performance ≥ 0.82, LCP ≤ 3000ms).

### Phase 3: Critical Path & Streaming ✅

- **Goal**: Optimize Time to First Byte (TTFB) and Total Blocking Time (TBT).
- **Deliverables**:
  - [x] Suspense boundaries on analytics page + dashboard skeleton component.
  - [x] Parallel data fetching in dashboard server components.
  - [x] Dynamic imports for all Recharts/chart components (TBT −300ms).

### Phase 4: High-Density UI Polish ✅

- **Goal**: Maintain 100/100 even with complex data visualizations.
- **Deliverables**:
  - [x] `@tanstack/react-virtual` virtualization in `DynamicTable` + `ScansTable`.
  - [x] Bundle analysis + additional import tree-shaking.
  - [x] `analytics-client.tsx` further optimized.

### Phase 5: Final Audit & 100/100 Certification (infra ✅ — live run pending)

- **Goal**: Verify and lock in the perfect score.
- **Deliverables**:
  - [x] `.lighthouserc.js` raised to Phase 5 final thresholds (perf ≥ 0.98, LCP ≤ 1800ms, TBT ≤ 50ms, CLS ≤ 0.01).
  - [x] `docs/perf/REGRESSION_TESTING_GUIDE.md` — complete runbook for local + CI + production certification.
  - [x] `docs/plan/learning/pagespeed_results.md` — phase-by-phase results tracker.
  - [ ] Live production Lighthouse run — requires Phases 3 + 4 complete (streaming + virtualization).
  - [ ] Mobile/Desktop certification (100/100 all routes, 3 runs each).
  - [ ] Update `docs/perf/baseline_psi.json` with certified scores.

---

## 🛠️ Performance Mandate

Every Pull Request must undergo a `/clis team perf` review if performance scores drop by > 2 points.
