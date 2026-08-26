# IDEA: Lighthouse & Performance (Mobile + Desktop) (`lighthouse_perf_mobile_desktop`)

## Initiative Metadata

- **Slug:** `lighthouse_perf_mobile_desktop`
- **Domain:** Code · Frontend / Performance
- **Primary Surfaces:** `apps/marketing`, `apps/client-dashboard` (+ `packages/ui` if shared)
- **Status:** Draft / Planned
- **Priority:** P0 (Scheduled Regression Gate & User Experience)

---

## 1. Problem Statement

Scheduled Lighthouse CI runs on `master` fail assertion thresholds on production targets (`https://www.gateflow.site` and `https://app.gateflow.site`). Pull requests currently soft-pass on assertion misses while PR probe reachability remains green. Core performance killers—such as Framer Motion hero text delaying Largest Contentful Paint (LCP), display font waterfalls without swap hints, wildcard image domains preventing Next.js optimization, synchronous chart imports inflating Total Blocking Time (TBT), and unoptimized dashboard redirects—penalize mobile and desktop performance scores.

Relying on soft-passed schedule jobs or lowering thresholds obscures actual user regressions. Scheduled CI must become a trustworthy, hard-failing regression barrier with measured compliance on deliberate production URLs.

---

## 2. Vision & Goals

- **Trustworthy CI Gate:** Scheduled Lighthouse CI runs hard-pass against standard `.lighthouserc.js` assertion floors without silent waivers.
- **Mobile First-Class Performance:** Resolve mobile CWV bottlenecks in `apps/marketing` (visible hero LCP, font loading, layout stability).
- **Desktop Optimization:** Ensure marketing and dashboard desktop audits pass with lean bundle footprints, high SEO scores, and clean Best Practices audits.
- **Intentional Audit Targets:** Establish clear, documented audit targets for both public marketing routes and client dashboard entry points (addressing accidental redirect penalties).
- **Evidence Trail:** Document before/after performance matrices, residual risks, and operational guidelines under `docs/guides/performance/`.

---

## 3. Constraints & Non-Negotiables

1. **Package Manager:** `pnpm only`.
2. **Design Tokens & ADS:** All UI modifications must strictly adhere to ADS design tokens; no hardcoded hex or ad-hoc overrides.
3. **i18n & RTL:** Full support for Arabic (`ar-EG`, `ar`) RTL and English (`en`) LTR using CSS logical properties (`margin-inline`, `padding-inline`).
4. **Security & Multi-Tenancy:** Zero alterations or relaxations to tenant isolation (`organizationId`), CSRF, or HMAC QR signing models.
5. **No Soft-Pass Cheats:** Do not bypass or weaken assertion thresholds in `.lighthouserc.js` to achieve artificial passes.

---

## 4. Success Metrics & Targets

| Metric                         | Assert Floor (`.lighthouserc.js`) | Target Goal |
| ------------------------------ | --------------------------------- | ----------- |
| Performance                    | ≥ 0.65 (65/100)                   | ≥ 0.85+     |
| Accessibility                  | ≥ 0.85 (85/100)                   | ≥ 0.95+     |
| Best Practices                 | ≥ 0.88 (88/100)                   | ≥ 0.95+     |
| SEO                            | ≥ 0.90 (90/100)                   | ≥ 0.95+     |
| Largest Contentful Paint (LCP) | ≤ 2500 ms                         | ≤ 1800 ms   |
| Total Blocking Time (TBT)      | ≤ 200 ms                          | ≤ 100 ms    |
| Cumulative Layout Shift (CLS)  | ≤ 0.15                            | ≤ 0.05      |

---

## 5. Scope & Phase Overview

1. **Phase 1: Diagnose & Baseline Matrix** — Actionable baseline matrix (URL × Form Factor × Metrics) and redirect analysis.
2. **Phase 2: Marketing Mobile CWV** — Unblock hero LCP, font weight trim & `display: swap`, image optimization, CLS stabilization.
3. **Phase 3: Marketing Desktop CWV & Best Practices** — Bundle trimming, dynamic imports, Best Practices/SEO cleanup.
4. **Phase 4: Dashboard Desktop Target & Scores** — Public auth/login target optimization, dynamic Recharts, Suspense streaming.
5. **Phase 5: Verification, Docs & Hard Schedule Gate** — Full verification, performance documentation updates, ensuring hard failure on regression.
