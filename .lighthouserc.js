/**
 * .lighthouserc.js — GateFlow Lighthouse CI Configuration
 */

/** @type {import('@lhci/cli').LhciConfig} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu',
        emulatedFormFactor: 'mobile',
        throttlingMethod: 'simulate',
      },
    },

    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.98 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'total-blocking-time': ['error', { maxNumericValue: 50 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.01 }],
      },
      failOnError: true,
    },

    upload: {
      target: 'temporary-public-storage',
    },
  },
};
