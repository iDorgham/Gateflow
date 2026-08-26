# Lighthouse & Performance Baseline Matrix

**Initiative:** `lighthouse_perf_mobile_desktop`  
**Date:** 2026-08-26  
**Reference CI Run:** GitHub Actions run `32938556944`  
**Configuration:** `.lighthouserc.js` (Throttling: simulated, 3 runs). Desktop collection uses `pnpm dlx @lhci/cli@0.14.0 collect --settings.emulatedFormFactor=desktop` with 3 runs per URL.

---

## 1. Executive Summary & Problem Scope

Scheduled Lighthouse CI on `master` hard-fails against standard assertion floors. While pull requests soft-pass on assertion misses when report artifacts are collected, the scheduled workflow strictly enforces assertion compliance. Target endpoints exhibit identifiable Core Web Vitals (CWV) and SEO/Best Practices bottlenecks.

---

## 2. Baseline Performance Matrix

| Target URL                              | Form Factor | Performance   | Accessibility | Best Practices | SEO       | LCP (ms)       | TBT (ms) | CLS         | Status / Primary Failure                                                              |
| --------------------------------------- | ----------- | ------------- | ------------- | -------------- | --------- | -------------- | -------- | ----------- | ------------------------------------------------------------------------------------- |
| `https://www.gateflow.site`             | 📱 Mobile   | **58**/100 🔴 | 94/100 🟢     | 86/100 🟡      | 92/100 🟢 | **3,850ms** 🔴 | 280ms 🔴 | **0.18** 🔴 | LCP blocked by opacity/filter in `hero-animated-content.tsx`; CLS                     |
| `https://www.gateflow.site`             | 🖥 Desktop   | 74/100 🟡     | 96/100 🟢     | 89/100 🟢      | 92/100 🟢 | 2,100ms 🟢     | 140ms 🟢 | 0.04 🟢     | Meets floor but close to 0.65 threshold; TBT optimization needed                      |
| `https://www.gateflow.site/en/features` | 📱 Mobile   | 62/100 🔴     | 92/100 🟢     | 88/100 🟢      | 92/100 🟢 | **2,900ms** 🔴 | 220ms 🔴 | 0.08 🟢     | LCP image format & heavy client module hydration                                      |
| `https://www.gateflow.site/en/pricing`  | 📱 Mobile   | 61/100 🔴     | 94/100 🟢     | 88/100 🟢      | 92/100 🟢 | **3,100ms** 🔴 | 240ms 🔴 | 0.12 🟡     | Interactive pricing tab bundle size, TBT inflation                                    |
| `https://app.gateflow.site/en`          | 🖥 Desktop   | 64/100 🔴     | 92/100 🟢     | 86/100 🟡      | 88/100 🔴 | **2,750ms** 🔴 | 180ms 🟢 | 0.03 🟢     | Server redirect `/en` → `/en/login` adds ~300ms roundtrip; `<a href="#">` link issues |

---

## 3. Root Cause Diagnostics

### 1. Marketing Hero LCP Delay (`apps/marketing`)

- **Root Cause:** In `apps/marketing/components/sections/hero-animated-content.tsx` (lines 953-956), the primary `h1` headline is wrapped inside a Framer Motion `motion.div` configured with `initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}` and a 0.7s transition duration.
- **Impact:** Google Lighthouse records the LCP timestamp only when the text becomes fully opaque after client-side hydration and animation execution, inflating mobile LCP from ~1.4s to 3.85s.

### 2. Layout Shift on Mobile (`CLS`)

- **Root Cause:** Viewport height containers without explicit `min-h-dvh` and hero artwork elements mounting asynchronously cause layout reflows during hydration on mobile devices.
- **Impact:** Mobile CLS reaches `0.18`, exceeding the `0.15` floor.

### 3. Client Dashboard Redirect & Login Page (`apps/client-dashboard`)

- **Root Cause:** Auditing `https://app.gateflow.site/en` without authentication immediately triggers `redirect('/en/login')` in `page.tsx`. The redirect penalty adds 200–400ms TTFB overhead. Furthermore, `apps/client-dashboard/src/app/[locale]/login/page.tsx` includes `<a href="#">` anchors lacking valid navigation targets, lowering the Best Practices/SEO scores to 86/88.
- **Impact:** Desktop Performance misses the 0.65 threshold (scoring ~0.64) and SEO misses the 0.90 floor.

### 4. Third-Party Script & Font Connection Overhead

- **Root Cause:** While preconnect links exist, font swap behavior and heavy below-the-fold interactive components contribute to Total Blocking Time (TBT) on mobile CPUs.

---

## 4. Phase-by-Phase Remediation Roadmap

1. **Phase 2 (Marketing Mobile CWV):**
   - Make the `h1` headline immediately visible in SSR HTML without initial opacity/filter suppression.
   - Enforce `min-h-dvh` and reserve container aspect ratios to push CLS ≤ 0.05.
2. **Phase 3 (Marketing Desktop CWV & Best Practices):**
   - Code split and dynamically import heavy components on `/en/features` and `/en/pricing`.
   - Ensure all links have valid `href` and SEO attributes.
3. **Phase 4 (Dashboard Desktop Target & Scores):**
   - Optimize `/en/login` page: clean up `<a href="#">` into semantic buttons or real routes, ensure preloaded styling.
   - Ensure lazy loading of all analytics charts and dashboard widgets.
4. **Phase 5 (Verification & CI Hard Gate):**
   - Re-run full LHCI assertion suite.
   - Record certified metrics in `LIGHTHOUSE_PERF_CERTIFICATION.md`.
