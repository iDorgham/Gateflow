# Tasks: Lighthouse & Performance (Mobile + Desktop) (`lighthouse_perf_mobile_desktop`)

**Plan:** [`PLAN_lighthouse_perf_mobile_desktop.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Complete/lighthouse_perf_mobile_desktop/PLAN_lighthouse_perf_mobile_desktop.md)  
**Status:** Planned  
**Branch:** `feat/lighthouse-perf-mobile-desktop`

---

## Phase 1: Diagnose & Baseline Matrix

- [x] Inspect GitHub Actions run `32938556944` and extract raw LHR JSON reports
- [x] Map out failing assertions for:
  - `https://www.gateflow.site` (Mobile + Desktop)
  - `https://www.gateflow.site/en/features` (Mobile)
  - `https://www.gateflow.site/en/pricing` (Mobile)
  - `https://app.gateflow.site/en` (Desktop)
- [x] Audit redirect penalty of `/en` → `/en/login` on `app.gateflow.site`
- [x] Create `docs/guides/performance/BASELINE_lighthouse_matrix.md` with baseline scores

---

## Phase 2: Marketing Mobile Core Web Vitals

- [x] Remove `initial="hidden"` blocking animation from `apps/marketing/components/sections/hero-animated-content.tsx`
- [x] Update `Poppins` configuration in `apps/marketing/app/[locale]/layout.tsx` to include `display: 'swap'` and trim unused weights
- [x] Convert critical marketing PNG hero images to WebP/AVIF with explicit dimensions
- [x] Add `min-h-dvh` and reserved container dimensions to prevent mobile CLS
- [x] Add preconnect hints for external font/analytics origins in `apps/marketing/app/[locale]/layout.tsx`
- [x] Run `pnpm turbo lint typecheck test --filter=@gateflow/marketing`

---

## Phase 3: Marketing Desktop CWV & Best Practices

- [x] Dynamically import below-the-fold components on `/en`, `/en/features`, and `/en/pricing`
- [x] Ensure all anchor tags have descriptive text, valid `href`, and `rel="noopener noreferrer"`
- [x] Audit and resolve console warnings, CSP deprecations, and meta descriptions across marketing routes
- [x] Verify desktop performance and SEO score assertions locally via `@lhci/cli`
- [x] Run `pnpm turbo lint typecheck test --filter=@gateflow/marketing`

---

## Phase 4: Dashboard Desktop Target & Performance Optimization

- [x] Document and optimize public login entry point (`/en/login`) for `app.gateflow.site`
- [x] Replace wildcard `**` in `apps/client-dashboard/next.config.js` `remotePatterns` with explicit trusted domains
- [x] Wrap synchronous `recharts` and complex widgets in `dynamic(() => import(...), { ssr: false })`
- [x] Add `Suspense` streaming boundaries around heavy data tables and cards in dashboard layouts
- [x] Run `pnpm turbo lint typecheck test --filter=@gateflow/client-dashboard`

---

## Phase 5: Verification, Documentation & Hard Schedule Gate

- [x] Execute full `@lhci/cli` run across marketing (mobile & desktop) and dashboard (desktop)
- [x] Ensure all 7 assertions in `.lighthouserc.js` pass with 0 assertion errors
- [x] Generate before/after comparison table in `docs/guides/performance/LIGHTHOUSE_PERF_CERTIFICATION.md`
- [x] Confirm `.github/workflows/lighthouse.yml` maintains hard failure on schedule regression
- [x] Run full workspace preflight checks: `pnpm preflight`
