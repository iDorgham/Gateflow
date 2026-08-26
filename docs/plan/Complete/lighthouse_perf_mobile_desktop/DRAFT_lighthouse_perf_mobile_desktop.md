# DRAFT: Lighthouse & Performance (Mobile + Desktop) (`lighthouse_perf_mobile_desktop`)

**Slug:** `lighthouse_perf_mobile_desktop`  
**Domain:** Code · Frontend / Performance  
**Primary surfaces:** `apps/marketing`, `apps/client-dashboard` (+ `packages/ui` if shared)  
**Lifecycle Stage:** Draft (`docs/plan/Complete/lighthouse_perf_mobile_desktop/`)

---

## 1. Context & Technical Investigation

### Current Failing Areas

1. **Marketing Site Hero LCP (Mobile & Desktop):**
   `apps/marketing/components/sections/hero-animated-content.tsx` sets initial animation state to `opacity: 0, y: 30`. The primary headline (LCP candidate) remains hidden until client hydration and Framer Motion execution complete, penalizing LCP by 400ms+.
2. **Web Fonts Render Delay:**
   Poppins font configuration in `apps/marketing/app/[locale]/layout.tsx` and `apps/client-dashboard/src/app/[locale]/layout.tsx` loads unused weights without explicit `display: 'swap'`, causing text rendering blocks during font retrieval on mobile networks.
3. **Image Optimization & Sizing:**
   Image tags missing explicit aspect ratios or using raw format assets cause layout shifts (CLS) and extra payload size.
4. **Client Dashboard Target & Hydration:**
   Auditing `https://app.gateflow.site/en` incurs a redirect to `/en/login`. The login route must be optimized with preloaded assets, dynamic imports for non-critical widgets, and explicit `remotePatterns` configuration in `next.config.js`.

---

## 2. Target Matrix & Assertions

| Job       | URLs                                                       | Form Factors     | Floor Assertions                                                                       |
| --------- | ---------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| Marketing | `https://www.gateflow.site`, `/en/features`, `/en/pricing` | Mobile & Desktop | Perf ≥ 0.65, A11y ≥ 0.85, BP ≥ 0.88, SEO ≥ 0.90, LCP ≤ 2500ms, TBT ≤ 200ms, CLS ≤ 0.15 |
| Dashboard | `https://app.gateflow.site/en` (→ `/en/login`)             | Desktop Only     | Perf ≥ 0.65, A11y ≥ 0.85, BP ≥ 0.88, SEO ≥ 0.90, LCP ≤ 2500ms, TBT ≤ 200ms, CLS ≤ 0.15 |

---

## 3. Plan Phases Breakdown

- **Phase 1: Diagnose & Baseline Matrix** — Collect exact failing assertions and metric breakdowns across mobile & desktop routes.
- **Phase 2: Marketing Mobile CWV** — Eliminate LCP render block in hero components, add `display: swap` to fonts, eliminate CLS.
- **Phase 3: Marketing Desktop CWV & Best Practices** — Code split heavy client components, optimize static assets, audit SEO meta and security headers.
- **Phase 4: Dashboard Desktop Target & Scores** — Optimize login entry point, tighten `remotePatterns`, add dynamic chart boundaries.
- **Phase 5: Verification, Docs & Hard Schedule Gate** — Execute full LHCI audit run, record before/after matrix in `docs/guides/performance/`, verify CI hard-fail behavior.
