# GateFlow — Performance Regression Testing Guide

> **Initiative:** `pagespeed_100`
> **Goal:** Keep all GateFlow routes at 100/100 Google PageSpeed (Mobile & Desktop) permanently.

---

## 1. Quick Reference

| Command                                                         | When to use                        |
| --------------------------------------------------------------- | ---------------------------------- |
| `npx lhci autorun --config=.lighthouserc.js`                    | CI gate (automated)                |
| `npx lhci collect --url=http://localhost:3001`                  | Local single run                   |
| `node scripts/check-bundle-size.js`                             | Pre-commit bundle guard            |
| `node scripts/check-imports.js --summary`                       | Circular-import / dead-weight scan |
| `pnpm turbo build --filter=marketing --filter=client-dashboard` | Verify build before audit          |

---

## 2. Automated Gates (already wired)

### 2.1 GitHub Actions — `lighthouse.yml`

Runs on every PR that touches frontend files and daily at 06:00 UTC.

- **`lighthouse-marketing`** job: mobile + desktop, 3 runs each, uploads HTML reports.
- **`lighthouse-dashboard`** job: desktop, 3 runs, uploads HTML reports.
- **`lhci-gate`** required status check: PR cannot merge if any threshold in `.lighthouserc.js` fails.

HTML reports are saved as artifacts for 7 days under the run summary.

### 2.2 CI Pipeline — `ci.yml`

The `performance` job runs on every push:

- `node scripts/check-bundle-size.js` — fails if gzip JS > 200 KB for dashboard
- `node scripts/check-imports.js --summary` — fails on circular imports
- Prints current `.lighthouserc.js` threshold summary

---

## 3. Running Lighthouse Locally

### Prerequisites

```bash
# Install lhci globally (once)
npm install -g @lhci/cli

# Ensure Chrome is installed
google-chrome --version || chromium-browser --version
```

### Marketing app

```bash
# Terminal 1: build + serve
cd apps/marketing
pnpm build && pnpm start

# Terminal 2: run audit
npx lhci collect \
  --url=http://localhost:3000/en \
  --url=http://localhost:3000/en/features \
  --url=http://localhost:3000/en/pricing \
  --url=http://localhost:3000/en/solutions \
  --numberOfRuns=3 \
  --settings.emulatedFormFactor=mobile

# Assert thresholds
npx lhci assert --config=.lighthouserc.js
```

### Client Dashboard

```bash
# Terminal 1
cd apps/client-dashboard
pnpm build && pnpm start

# Terminal 2
npx lhci collect \
  --url=http://localhost:3001/en/dashboard \
  --url=http://localhost:3001/en/dashboard/analytics \
  --url=http://localhost:3001/en/dashboard/scans \
  --numberOfRuns=3

npx lhci assert --config=.lighthouserc.js
```

### Full autorun (uses `.lighthouserc.js` urls config)

```bash
npx lhci autorun --config=.lighthouserc.js
```

---

## 4. Interpreting Results

### Score targets by phase

| Phase       | Perf      | A11y      | Best Practices | SEO       | LCP         | CLS       |
| ----------- | --------- | --------- | -------------- | --------- | ----------- | --------- |
| 1 Baseline  | ≥0.65     | ≥0.85     | ≥0.88          | ≥0.90     | ≤4000ms     | ≤0.15     |
| 2 Assets    | ≥0.82     | ≥0.88     | ≥0.90          | ≥0.92     | ≤3000ms     | ≤0.10     |
| 3 Streaming | ≥0.92     | ≥0.92     | ≥0.93          | ≥0.95     | ≤2200ms     | ≤0.05     |
| 4 Polish    | ≥0.97     | ≥0.95     | ≥0.97          | ≥0.98     | ≤2000ms     | ≤0.02     |
| **5 Final** | **≥0.98** | **≥0.98** | **≥0.98**      | **≥0.99** | **≤1800ms** | **≤0.01** |

### Common failures and fixes

| Audit                        | Symptom             | Fix                                                                 |
| ---------------------------- | ------------------- | ------------------------------------------------------------------- |
| `largest-contentful-paint`   | LCP > 2.5s          | Check `next/image` usage; ensure hero image uses `priority` prop    |
| `cumulative-layout-shift`    | CLS > 0.1           | Use `h-dvh` not `h-screen`; explicit `width`/`height` on `<Image>`  |
| `total-blocking-time`        | TBT > 200ms         | Dynamic import heavy components; move to Server Components          |
| `unused-javascript`          | Bundle bloat        | Run `check-bundle-size.js`; use `optimizePackageImports`            |
| `render-blocking-resources`  | Fonts/scripts block | Ensure `display: 'swap'`; use `<link rel="preconnect">`             |
| `uses-webp-images`           | PNG/JPEG served     | Confirm `formats: ['image/avif', 'image/webp']` in `next.config.js` |
| `efficient-animated-content` | GIF/video           | Replace with WebM or CSS animation                                  |
| `font-display`               | FOIT                | Verify `display: 'swap'` on all `next/font` declarations            |

---

## 5. Preventing Regressions

### Pre-commit check (automated via Husky)

The `pre-commit` hook runs `node scripts/check-bundle-size.js` and `node scripts/check-imports.js` on every commit. If either fails, the commit is blocked.

### PR checklist (manual)

Before merging any PR that touches `apps/marketing`, `apps/client-dashboard`, or `packages/ui`:

- [ ] `pnpm turbo build --filter=<changed-app>` succeeds
- [ ] `node scripts/check-bundle-size.js` passes (gzip JS < 200 KB dashboard)
- [ ] No new `"use client"` on components that can be Server Components
- [ ] Any new `<Image>` usage has explicit `width`, `height`, and `alt`
- [ ] Any new third-party `<script>` uses `strategy="lazyOnload"` or `strategy="afterInteractive"`
- [ ] Any new chart/heavy component is wrapped in `next/dynamic({ ssr: false })`
- [ ] No new synchronous `import` of `recharts`, `d3`, `echarts`, or similar (> 50 KB)

### Post-deploy verification

After every production deploy to Vercel:

```bash
# Run against production URL
npx lhci collect \
  --url=https://gateflow.io/en \
  --url=https://app.gateflow.io/en/dashboard \
  --numberOfRuns=3 \
  --settings.emulatedFormFactor=mobile

npx lhci assert --config=.lighthouserc.js
```

Record results in `docs/plan/learning/pagespeed_results.md`.

---

## 6. Certification Run (Phase 5)

To achieve the official **100/100 certification**, run the following from a clean production build:

```bash
# 1. Build both apps
pnpm turbo build --filter=marketing --filter=client-dashboard

# 2. Serve marketing (port 3000) and dashboard (port 3001) simultaneously
# Terminal A:
cd apps/marketing && pnpm start
# Terminal B:
cd apps/client-dashboard && pnpm start

# 3. Full autorun (mobile + desktop, 3 runs each)
npx lhci autorun --config=.lighthouserc.js

# 4. Record median scores
# Open .lighthouseci/lhr-*.json and extract median scores per URL

# 5. Update docs/plan/learning/pagespeed_results.md with certified scores
# 6. Update docs/perf/baseline_psi.json with certified scores
# 7. Commit: "perf(cert): 100/100 certification run — all routes green"
```

### Certification criteria

All of the following must be **green** across all routes, both Mobile and Desktop:

- Performance: **100**
- Accessibility: **100**
- Best Practices: **100**
- SEO: **100**
- LCP: **< 1.8s**
- CLS: **< 0.01**
- TBT: **< 50ms**
- FCP: **< 1.0s**

---

## 7. Monitoring (Ongoing)

- **Daily CI run**: `.github/workflows/lighthouse.yml` fires at 06:00 UTC — check the Actions tab weekly.
- **PR gate**: `lhci-gate` status check is required on every PR — no bypasses.
- **Bundle drift**: `check-bundle-size.js` fails CI if dashboard gzip JS exceeds 200 KB.
- **Score drift alert**: If any score drops > 2 points between runs, open a `perf:` ticket immediately.

---

_Last updated: 2026-03-23 | Initiative: `pagespeed_100` | Phase 5_
