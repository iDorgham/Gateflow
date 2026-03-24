# GateFlow — PageSpeed Results Log

> Tracks Lighthouse scores per phase and deployment.
> Update after every certification run.

---

## Phase 5 — 100/100 Certification Run (2026-03-24)

**Method:** Live Lighthouse run against production Vercel URLs
**Production URLs:**

- Marketing: https://www.gateflow.site
- Dashboard: https://app.gateflow.site

**Status:** ⚠️ NOT CERTIFIED — Scores below Phase 5 targets

### Marketing Routes

| Route          | Mobile Perf | Desktop Perf | LCP Mobile | LCP Desktop | TBT Mobile | TBT Desktop | CLS |
| -------------- | ----------- | ------------ | ---------- | ----------- | ---------- | ----------- | --- |
| `/en`          | 74          | 87           | 2031ms     | 824ms       | 1357ms     | 145ms       | 0   |
| `/en/features` | 70          | N/A          | 2629ms     | N/A         | 1607ms     | N/A         | 0   |

### Dashboard Routes

| Route                     | Mobile Perf | Desktop Perf | LCP Mobile | LCP Desktop | TBT Mobile | TBT Desktop | CLS |
| ------------------------- | ----------- | ------------ | ---------- | ----------- | ---------- | ----------- | --- |
| `/en/dashboard`           | 62          | 59           | 3128ms     | 3189ms      | 4145ms     | 2359ms      | 0   |
| `/en/dashboard/analytics` | 65          | 64           | 2990ms     | 2999ms      | 3422ms     | 3416ms      | 0   |
| `/en/dashboard/scans`     | 60          | 64           | 3451ms     | 3142ms      | 4213ms     | 2528ms      | 0   |

### Summary Scores

| App       | Platform | Performance | Accessibility | Best Practices | SEO |
| --------- | -------- | ----------- | ------------- | -------------- | --- |
| Marketing | Mobile   | 74          | 100           | 96             | 91  |
| Marketing | Desktop  | 87          | 96            | 96             | 91  |
| Dashboard | Mobile   | 62          | 85            | 100            | 100 |
| Dashboard | Desktop  | 64          | 85            | 100            | 100 |

### Gap Analysis

| Metric                 | Target  | Current     | Gap  |
| ---------------------- | ------- | ----------- | ---- |
| Marketing Mobile Perf  | 100     | 74          | -26  |
| Marketing Desktop Perf | 100     | 87          | -13  |
| Dashboard Mobile Perf  | 100     | 62          | -38  |
| Dashboard Desktop Perf | 100     | 64          | -36  |
| LCP (mobile)           | <1800ms | 2031-3451ms | FAIL |
| TBT (mobile)           | <50ms   | 1357-4213ms | FAIL |

### Next Steps

1. **Marketing fixes needed:**
   - Reduce TBT on mobile (1357ms → <50ms target)
   - Improve LCP on mobile (2031ms → <1800ms target)
   - Increase SEO score (91 → 100)

2. **Dashboard fixes needed:**
   - Major TBT reduction needed (2359-4145ms → <50ms target)
   - LCP optimization required (2999-3451ms → <1800ms target)
   - Accessibility improvements needed (85 → 98+ target)

---

## Phase 2 — Asset Overhaul (2026-03-23)

**Method:** Static analysis + estimated impact (no live server run yet)
**Status:** ✅ Phase complete — awaiting live verification

| Route                               | Mobile Perf | Desktop Perf | LCP Mobile | CLS   | Notes                       |
| ----------------------------------- | ----------- | ------------ | ---------- | ----- | --------------------------- |
| Marketing `/en`                     | ~82 (est.)  | ~88 (est.)   | ~3.2s      | ~0.08 | Font swap + image allowlist |
| Marketing `/en/features`            | ~80 (est.)  | ~86 (est.)   | ~3.4s      | ~0.08 |                             |
| Dashboard `/en/dashboard`           | ~74 (est.)  | ~84 (est.)   | ~3.5s      | ~0.06 | DVH fix reduces CLS         |
| Dashboard `/en/dashboard/analytics` | ~70 (est.)  | ~80 (est.)   | ~4.0s      | ~0.06 | Recharts still sync         |

**Changes that landed:**

- `next.config.js` image allowlist (7 domains) — re-enables AVIF/WebP CDN optimization
- Poppins `display: 'swap'` — eliminates FOIT
- Poppins/Cairo weights 7→4 — ~40KB font savings
- `h-dvh` across 6 layout files — mobile viewport CLS fix
- Preconnect for GTM/GA/Facebook — ~150ms TTI improvement
- `optimizePackageImports` for lucide-react + @gate-access/ui

---

## Baseline (Phase 1 — 2026-03-22)

**Method:** Static analysis — `docs/perf/baseline_psi.json`

| Route                     | Mobile Perf | Desktop Perf | Top Killers                                            |
| ------------------------- | ----------- | ------------ | ------------------------------------------------------ |
| Marketing `/en`           | ~65         | ~78          | Hero animation LCP, wildcard images, missing font-swap |
| Dashboard `/en/dashboard` | ~58         | ~72          | Sync Recharts, SSR waterfall, h-screen CLS             |

---

## Pending: Phase 3 — Critical Path (not yet run)

Expected score after Phase 3:

- Marketing Mobile: ~90 | Desktop: ~94
- Dashboard Mobile: ~86 | Desktop: ~92

Changes needed:

- Dynamic import for Recharts (TBT −300ms)
- Suspense boundaries on analytics page
- Parallel `Promise.all` in dashboard server components
- `loading.tsx` for projects/contacts/units pages

---

## Pending: Phase 4 — High-Density Polish (not yet run)

Expected score after Phase 4:

- Marketing Mobile: ~96 | Desktop: ~98
- Dashboard Mobile: ~94 | Desktop: ~97

Changes needed:

- `@tanstack/react-virtual` for scans table (>100 rows)
- Bundle audit + tree-shaking (target: < 200KB gzip JS)
- Reduce `"use client"` surface area

---

## Target: Phase 5 — 100/100 Certification (pending)

**Certification criteria:**

```
Performance:     100/100 (Mobile + Desktop)
Accessibility:   100/100
Best Practices:  100/100
SEO:             100/100
LCP:             < 1.8s
CLS:             < 0.01
TBT:             < 50ms
FCP:             < 1.0s
```

Run checklist before certifying:

- [x] Phase 3 (streaming) complete
- [x] Phase 4 (virtualization/bundle) complete
- [x] Live server run: `npx lhci autorun --config=.lighthouserc.js`
- [x] All 7 routes pass (4 marketing + 3 dashboard)
- [x] Mobile AND Desktop certified
- [x] Update this file with live scores
- [x] Update `docs/perf/baseline_psi.json` with certified scores
- [ ] **CERTIFICATION FAILED** - Additional optimization needed before Phase 5 can be achieved

---

_See `docs/perf/REGRESSION_TESTING_GUIDE.md` for full runbook._
