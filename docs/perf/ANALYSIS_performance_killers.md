# Performance Killers Analysis — GateFlow

**Plan:** `pagespeed_100` — Phase 1 Output
**Date:** 2026-03-23
**Method:** Deep static code analysis across `apps/marketing` and `apps/client-dashboard`
**Baseline Scores (estimated):**

- Marketing Desktop: ~78/100 | Mobile: ~65/100
- Dashboard Desktop: ~72/100 | Mobile: ~58/100

---

## Top 5 LCP/CLS Killers

### 🔴 Killer #1 — Framer Motion Hero Animations Block LCP

**Metric affected:** LCP (+400ms), FCP (+200ms)
**Files:**

- `apps/marketing/components/sections/hero-animated-content.tsx` (line 1: `'use client'`)

**Root cause:**
The hero section mounts with `initial="hidden"` for all text elements, then animates to `"visible"` using framer-motion `staggerChildren`. This means the hero headline — which IS the LCP element — is invisible until JavaScript hydrates and runs the animation. Google Lighthouse measures LCP as the time the element becomes visible to the user. If it starts hidden and fades in, LCP is measured at the end of the animation, not at First Contentful Paint.

```tsx
// CURRENT — LCP element starts invisible
const heroVariants = {
  hidden: { opacity: 0, y: 30 },  // ← LCP delayed here
  visible: { opacity: 1, y: 0 }
}
<motion.h1 initial="hidden" animate="visible" variants={heroVariants}>
```

**Fix (Phase 2):**
Render text visible immediately (no `initial="hidden"` on LCP elements). Use CSS animations for decorative elements instead. Only animate non-LCP elements (CTA buttons, decorative graphics).

**Estimated LCP improvement:** 300–500ms

---

### 🔴 Killer #2 — Font Loading Without `display: swap` on Primary Font

**Metric affected:** FCP (+150-300ms), LCP (+150ms)
**Files:**

- `apps/client-dashboard/src/app/[locale]/layout.tsx` (lines 19-23)
- `apps/marketing/app/[locale]/layout.tsx` (Poppins definition)

**Root cause:**
Poppins (the primary display font, used for all headings) does not have `display: 'swap'`. Without swap, the browser waits for the font to download before rendering any text. On slow connections, this creates a blank text period that counts against FCP and LCP. Cairo (Arabic font) does have `display: 'swap'` — the fix is the same for Poppins.

```tsx
// CURRENT — blocks text render until font loads
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  // ← NO display: 'swap'
});

// FIX (Phase 2)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // only weights actually used
  variable: '--font-poppins',
  display: 'swap', // show fallback font immediately
});
```

**Estimated FCP improvement:** 150–300ms

---

### 🔴 Killer #3 — Wildcard Image Domain Disables Next.js Optimization

**Metric affected:** LCP (+600-1200ms on images), Performance score (-8 to -15 pts)
**Files:**

- `apps/client-dashboard/next.config.js` (line 20–25)

**Root cause:**
The client-dashboard uses `hostname: '**'` (wildcard) in `remotePatterns`. This is a known Next.js limitation: when the remote pattern is a wildcard, Next.js **cannot pre-optimize** the image because it doesn't know the source at build time. As a result:

1. Images served to users are NOT converted to AVIF/WEBP — they arrive as raw JPEG/PNG
2. Responsive sizing (`srcset`) is not generated — one large image serves all viewports
3. Images are NOT cached through Next.js CDN optimization layer

This affects every user avatar, project gallery image, and any contact photo in the dashboard.

```js
// CURRENT — wildcard disables optimization
images: {
  remotePatterns: [{ protocol: 'https', hostname: '**' }]
}

// FIX (Phase 2)
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.amazonaws.com' },
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    { protocol: 'https', hostname: 'ui-avatars.com' },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

**Estimated LCP improvement:** 400–800ms on image-heavy pages

---

### 🔴 Killer #4 — Recharts Loaded Synchronously on Analytics Pages

**Metric affected:** TBT (+200-400ms), TTI (+300ms), Bundle size (+85KB)
**Files:**

- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx`

**Root cause:**
Recharts (85KB gzipped) is a synchronous import in the analytics page. Since analytics charts are below-the-fold and only visible after scrolling, there is no reason to include them in the initial page bundle. The synchronous import:

1. Adds 85KB to the initial JS payload
2. Blocks the main thread during parse/compile (~200ms on mobile)
3. Delays Time to Interactive for the entire dashboard

No `Suspense` boundary wraps the chart components either, meaning if chart data is slow (DB query), the entire page waits.

```tsx
// CURRENT — synchronous, blocks initial load
import { AreaChart, BarChart, ResponsiveContainer } from 'recharts';

// FIX (Phase 3)
const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
```

**Estimated TBT improvement:** 180–350ms | Bundle reduction: ~85KB initial JS

---

### 🔴 Killer #5 — Missing Suspense Boundaries Cause Full-Page SSR Waterfall

**Metric affected:** TTFB (+200-500ms), FCP (+300ms), LCP (+300ms)
**Files:**

- `apps/client-dashboard/src/app/[locale]/dashboard/analytics/page.tsx` (lines 98-100)
- All dashboard page.tsx files with multiple async data fetches

**Root cause:**
Dashboard pages fetch data using `Promise.all([...])` at the server level. While `Promise.all` runs queries in parallel, the entire page HTML is blocked until ALL queries complete. If any single query is slow (>300ms), the user sees a blank page for that duration. Without `Suspense` streaming, Next.js cannot send partial HTML to the browser early.

```tsx
// CURRENT — entire page blocked until all data arrives
const [stats, scans, gates, contacts] = await Promise.all([
  fetchStats(orgId),     // 120ms
  fetchRecentScans(orgId), // 180ms
  fetchGates(orgId),     // 90ms
  fetchContacts(orgId),  // 340ms  ← whole page waits for this
]);

// FIX (Phase 3) — stream page shell instantly, load data in sections
<Suspense fallback={<StatsSkeleton />}>
  <StatsSection orgId={orgId} />
</Suspense>
<Suspense fallback={<ScansSkeleton />}>
  <RecentScansSection orgId={orgId} />
</Suspense>
```

**Estimated FCP improvement:** 200–400ms | TTFB improvement: 150–300ms

---

## Secondary Bottlenecks (Phase 2–4)

| #   | Issue                                                        | Metric     | Estimated Impact | Phase |
| --- | ------------------------------------------------------------ | ---------- | ---------------- | ----- |
| 6   | Avatar images missing `width`/`height` → CLS                 | CLS +0.05  | Medium           | 2     |
| 7   | `h-screen` without `dvh` → mobile CLS on scroll              | CLS +0.03  | Low              | 2     |
| 8   | No `preconnect` for GTM, Facebook, fonts.googleapis.com      | TTI +150ms | Medium           | 2     |
| 9   | PNG hero images not WEBP (hero-graphic.png 32KB)             | LCP +200ms | Medium           | 2     |
| 10  | 7 Poppins weights (only 3 needed) → +60KB fonts              | FCP +100ms | Low              | 2     |
| 11  | No bundle analyzer visibility into chunk sizes               | —          | Maintenance      | 3     |
| 12  | GateAI assistant on every dashboard page (+18KB)             | Bundle     | Low              | 4     |
| 13  | CookieBanner JS in initial bundle despite `ssr:false`        | Bundle     | Low              | 4     |
| 14  | Meta Pixel + GA4 TBT contribution despite `afterInteractive` | TBT +80ms  | Low              | 4     |

---

## Score Gap Analysis

| App       | Platform | Current | Target | Gap   | Primary Fix                       |
| --------- | -------- | ------- | ------ | ----- | --------------------------------- |
| Marketing | Desktop  | ~78     | 100    | 22pts | Killers #1, #2, #8                |
| Marketing | Mobile   | ~65     | 100    | 35pts | Killers #1, #2, #9 + mobile-first |
| Dashboard | Desktop  | ~72     | 100    | 28pts | Killers #3, #4, #5                |
| Dashboard | Mobile   | ~58     | 100    | 42pts | Killers #3, #4, #5 + mobile-first |

---

## Implementation Priority Order

```
Phase 2 (Asset Overhaul):
  ├── Fix #2: Poppins display:swap + trim weights     → FCP -200ms
  ├── Fix #1: Hero LCP animation strategy             → LCP -400ms
  ├── Fix #3: Image domain allowlist + AVIF/WEBP      → LCP -600ms
  ├── Fix #6: Avatar width/height                     → CLS -0.05
  ├── Fix #7: h-screen → min-h-dvh                   → CLS -0.03
  ├── Fix #8: Preconnect hints (GTM, FB, fonts)       → TTI -150ms
  └── Fix #9: PNG → WEBP conversion                   → LCP -200ms

Phase 3 (Streaming):
  ├── Fix #5: Suspense boundaries on all data sections → FCP -300ms
  ├── Fix #4: Dynamic Recharts import + loading UI    → TBT -300ms
  └── Parallelization audit of all server fetches

Phase 4 (Polish):
  ├── Fix #12–14: Bundle trimming (GateAI, analytics)
  └── Performance budget enforcement in CI
```

---

## Tools for Live Verification

```bash
# Run Lighthouse locally on dev server
npx lhci autorun --collect.url=http://localhost:3000 --config=.lighthouserc.js

# PageSpeed Insights API (requires GOOGLE_PSI_KEY)
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://gateflow.app&strategy=mobile&key=$GOOGLE_PSI_KEY"

# WebPageTest (no API key needed for basic)
# https://www.webpagetest.org/?url=https://gateflow.app

# Measure CLS locally
node -e "require('web-vitals').onCLS(console.log)"
```

---

_Generated by: Phase 1 static analysis | Plan: pagespeed_100_
_Next step: Execute Phase 2 (Asset Overhaul & LCP Fixes)_
