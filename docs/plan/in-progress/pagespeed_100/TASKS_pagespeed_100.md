# TASKS — pagespeed_100

**Goal:** 100/100 Google PageSpeed (Mobile & Desktop) across all GateFlow routes
**Baseline:** Marketing ~65 mobile / ~78 desktop | Dashboard ~58 mobile / ~72 desktop
**Target:** 100/100 all categories, all routes

---

## Phase 1 — Lighthouse CI & Automated Baselines ✅

### Deliverables

- [x] `docs/perf/baseline_psi.json` — baseline scores + bottlenecks documented
- [x] `docs/perf/ANALYSIS_performance_killers.md` — Top 5 LCP/CLS killers with root causes and fix strategy
- [x] `.lighthouserc.js` — committed Lighthouse CI config with phased thresholds
- [x] `.github/workflows/lighthouse.yml` — upgraded: mobile + desktop, 3 runs, PR comment (update not duplicate), HTML report artifact
- [x] `.github/workflows/ci.yml` — added `performance` job (bundle check + circular imports + threshold summary)

### Identified Performance Killers (priority order)

| #   | Killer                                                       | Metric       | Estimated Fix |
| --- | ------------------------------------------------------------ | ------------ | ------------- |
| 1   | Hero animations block LCP (framer-motion `initial="hidden"`) | LCP +400ms   | Phase 2       |
| 2   | Poppins missing `display: swap` + 7 weights loaded           | FCP +200ms   | Phase 2       |
| 3   | Wildcard `hostname: **` disables Next.js image optimization  | LCP +600ms   | Phase 2       |
| 4   | Recharts loaded synchronously (85KB, no dynamic import)      | TBT +300ms   | Phase 3       |
| 5   | No Suspense boundaries → full SSR waterfall                  | FCP +300ms   | Phase 3       |
| 6   | Avatar images missing width/height                           | CLS +0.05    | Phase 2       |
| 7   | `h-screen` without `dvh` fallback (mobile viewport CLS)      | CLS +0.03    | Phase 2       |
| 8   | No preconnect for GTM + Meta Pixel CDNs                      | TTI +150ms   | Phase 2       |
| 9   | PNG images not WEBP (hero-graphic.png, solutions/\*.png)     | LCP +200ms   | Phase 2       |
| 10  | 7 Poppins/Cairo weights (only 400/600/700 needed)            | Bundle +60KB | Phase 2       |

---

## Phase 2 — Asset Overhaul (LCP & CLS Fixes) ⬜

### Tasks

- [ ] `apps/client-dashboard/next.config.js` — replace wildcard `hostname: **` with explicit allowlist + add `formats: ['image/avif', 'image/webp']`
- [ ] `apps/marketing/components/sections/hero-animated-content.tsx` — render LCP text visible immediately; animate decorative elements only
- [ ] `apps/client-dashboard/src/app/[locale]/layout.tsx` — add `display: 'swap'` to Poppins; reduce weights to `['400', '600', '700']`
- [ ] `apps/marketing/app/[locale]/layout.tsx` — same Poppins/Cairo weight reduction
- [ ] Add `<link rel="preconnect" href="https://www.googletagmanager.com">` and `<link rel="preconnect" href="https://connect.facebook.net">` to marketing `<head>`
- [ ] Convert `apps/marketing/public/hero-graphic.png` → `.webp` and update `<Image>` src
- [ ] Convert `apps/marketing/public/images/solutions/*.png` → `.webp`
- [ ] Add explicit `width` and `height` to all `<AvatarImage>` usages in client-dashboard
- [ ] Replace `h-screen` and `min-h-screen` with `min-h-dvh` where mobile CLS is a concern
- [ ] Update `.lighthouserc.js` thresholds to Phase 2 values after fixes land

---

## Phase 3 — Critical Path & Streaming ⬜

### Tasks

- [ ] `analytics-charts.tsx` — convert all Recharts imports to `dynamic(() => import(...), { ssr: false })` with `<ChartSkeleton>` loading state
- [ ] Add `<Suspense>` boundaries in analytics page around each data section
- [ ] Audit all dashboard server components for serial fetch chains; convert to parallel `Promise.all` where not already done
- [ ] Add `loading.tsx` for projects, contacts, units pages if missing
- [ ] Consider `React.cache()` for repeated server-side fetch patterns
- [ ] Extract critical CSS for above-the-fold dashboard skeleton
- [ ] Update `.lighthouserc.js` to Phase 3 thresholds

---

## Phase 4 — High-Density UI Polish ⬜

### Tasks

- [ ] Implement virtual scrolling for scans table (>100 rows) using `@tanstack/react-virtual`
- [ ] Audit and tree-shake heavy package imports (GateAI +18KB, analytics deps)
- [ ] Add `@next/bundle-analyzer` as dev dependency; run and document chunk breakdown
- [ ] Remove unused Poppins/Cairo weight variants from CSS variables
- [ ] Review and reduce client component surface (any unnecessary `"use client"`)
- [ ] Update `.lighthouserc.js` to Phase 4 thresholds

---

## Phase 5 — Final Audit & 100/100 Certification ⬜

### Tasks

- [ ] Run full LHCI against production Vercel URLs (marketing + dashboard)
- [ ] Run against all 4 marketing routes: `/en`, `/en/features`, `/en/pricing`, `/en/solutions`
- [ ] Run against 3 dashboard routes: `/en/dashboard`, `/en/dashboard/analytics`, `/en/dashboard/scans`
- [ ] Mobile + Desktop certification (3 runs each, median score = 100)
- [ ] Update `.lighthouserc.js` with final Phase 5 thresholds (all ≥ 0.98)
- [ ] Update `docs/perf/baseline_psi.json` with live certified scores
- [ ] Create `docs/perf/REGRESSION_TESTING_GUIDE.md`
- [ ] Commit final certification report

---

## Score Targets by Phase

| After Phase         | Marketing Mobile | Marketing Desktop | Dashboard Mobile | Dashboard Desktop |
| ------------------- | ---------------- | ----------------- | ---------------- | ----------------- |
| Phase 1 (Baseline)  | ~65              | ~78               | ~58              | ~72               |
| Phase 2 (Assets)    | ~82              | ~88               | ~74              | ~84               |
| Phase 3 (Streaming) | ~90              | ~94               | ~86              | ~92               |
| Phase 4 (Polish)    | ~96              | ~98               | ~94              | ~97               |
| Phase 5 (100/100)   | **100**          | **100**           | **100**          | **100**           |
