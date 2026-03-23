# GateFlow — PageSpeed Results Log

> Tracks Lighthouse scores per phase and deployment.
> Update after every certification run.

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

- [ ] Phase 3 (streaming) complete
- [ ] Phase 4 (virtualization/bundle) complete
- [ ] Live server run: `npx lhci autorun --config=.lighthouserc.js`
- [ ] All 7 routes pass (4 marketing + 3 dashboard)
- [ ] Mobile AND Desktop certified
- [ ] Update this file with live scores
- [ ] Update `docs/perf/baseline_psi.json` with certified scores

---

_See `docs/perf/REGRESSION_TESTING_GUIDE.md` for full runbook._
