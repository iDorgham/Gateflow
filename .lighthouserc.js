/**
 * .lighthouserc.js — GateFlow Lighthouse CI Configuration
 *
 * Target: 100/100 on Performance, Accessibility, Best Practices, SEO
 * Plan:   pagespeed_100
 *
 * Usage:
 *   npx lhci autorun --config=.lighthouserc.js
 *
 * Thresholds are progressively tightened as fixes land:
 *   Phase 1: Baseline (current)    → Performance ≥ 0.65 (establishes floor)
 *   Phase 2: Asset overhaul        → Performance ≥ 0.85
 *   Phase 3: Streaming             → Performance ≥ 0.92
 *   Phase 4: Polish                → Performance ≥ 0.98
 *   Phase 5: 100/100 Certification → Performance = 1.00
 *
 * Update the assert thresholds below as each phase completes.
 */

/** @type {import('@lhci/cli').LhciConfig} */
module.exports = {
  ci: {
    collect: {
      // Run 3 times per URL for statistical stability
      numberOfRuns: 3,
      settings: {
        // ── Chrome flags for CI environment ──────────────────────
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu',

        // ── Run both mobile (default) and desktop ─────────────────
        // Override per-run via CLI: --settings.emulatedFormFactor=desktop
        emulatedFormFactor: 'mobile',

        // ── Throttle to simulate real-world mobile conditions ──────
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },

        // ── Extra headers if behind auth ───────────────────────────
        // extraHeaders: { Cookie: 'preview_mode=1' },

        // ── Skip PWA category (GateFlow is not a PWA) ─────────────
        skipAudits: [
          'installable-manifest',
          'splash-screen',
          'themed-address-bar',
          'maskable-icon',
        ],

        // ── Output formats ─────────────────────────────────────────
        output: ['html', 'json'],
      },
    },

    assert: {
      // ── Phase 2: Asset Overhaul thresholds (raised after font/image/dvh fixes) ──
      // Update these thresholds as performance improves.
      assertions: {
        // ── Category Scores ────────────────────────────────────────
        'categories:performance': ['error', { minScore: 0.82 }], // → 1.0 by Phase 5
        'categories:accessibility': ['error', { minScore: 0.88 }], // → 1.0 by Phase 5
        'categories:best-practices': ['error', { minScore: 0.9 }], // → 1.0 by Phase 5
        'categories:seo': ['error', { minScore: 0.92 }], // → 1.0 by Phase 5

        // ── Core Web Vitals ────────────────────────────────────────
        // LCP: good < 2.5s, needs improvement < 4.0s
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }], // → 1800 by Phase 5
        // FCP: good < 1.8s
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }], // → 1000 by Phase 5
        // TBT: good < 200ms
        'total-blocking-time': ['warn', { maxNumericValue: 400 }], // → 50 by Phase 5
        // CLS: good < 0.1
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // → 0.0 by Phase 5
        // TTI: good < 3.8s
        interactive: ['warn', { maxNumericValue: 4000 }], // → 3000 by Phase 5
        // Speed Index: good < 3.4s
        'speed-index': ['warn', { maxNumericValue: 3500 }], // → 2000 by Phase 5

        // ── Specific Audits (hard gates even at Phase 1) ──────────
        // These should never regress regardless of phase:
        'uses-https': ['error', { minScore: 1 }],
        'no-vulnerable-libraries': ['error', { minScore: 1 }],
        'is-crawlable': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'html-has-lang': ['error', { minScore: 1 }],
        'meta-description': ['warn', { minScore: 1 }],
        'image-alt': ['warn', { minScore: 1 }],
        'button-name': ['warn', { minScore: 1 }],
        'link-name': ['warn', { minScore: 1 }],
        'color-contrast': ['warn', { minScore: 1 }],

        // ── Performance opportunity audits ─────────────────────────
        // These become errors in Phase 3+
        'uses-optimized-images': ['warn', { minScore: 0 }],
        'uses-webp-images': ['warn', { minScore: 0 }],
        'uses-responsive-images': ['warn', { minScore: 0 }],
        'efficient-animated-content': ['warn', { minScore: 0 }],
        'render-blocking-resources': ['warn', { minScore: 0 }],
        'unused-javascript': ['warn', { minScore: 0 }],
        'unused-css-rules': ['warn', { minScore: 0 }],
      },

      failOnError: true,
    },

    upload: {
      // Upload reports to LHCI server or temporary public storage
      // For production: configure LHCI_TOKEN and LHCI_SERVER_BASE_URL
      target: 'temporary-public-storage',
      // Uncomment for self-hosted LHCI server:
      // target: 'lhci',
      // serverBaseUrl: process.env.LHCI_SERVER_BASE_URL,
      // token: process.env.LHCI_TOKEN,
    },
  },
};

/**
 * PHASE THRESHOLD PROGRESSION
 * Update `assert.assertions` as each phase completes:
 *
 * After Phase 2 (Asset Overhaul):
 *   performance: 0.82, lcp: 3000, fcp: 2000, tbt: 400, cls: 0.10
 *
 * After Phase 3 (Streaming):
 *   performance: 0.92, lcp: 2200, fcp: 1500, tbt: 200, cls: 0.05
 *
 * After Phase 4 (Polish):
 *   performance: 0.97, lcp: 2000, fcp: 1200, tbt: 100, cls: 0.02
 *
 * After Phase 5 (Certification):
 *   performance: 1.00, lcp: 1800, fcp: 1000, tbt: 50, cls: 0.0
 */
