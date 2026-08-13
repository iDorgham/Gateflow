/**
 * .lighthouserc.js — GateFlow Lighthouse CI Configuration
 *
 * CI installs @lhci/cli globally (see .github/workflows/lighthouse.yml).
 * Local runs: `npx --yes @lhci/cli autorun --config=.lighthouserc.js`
 */

/** @type {{ ci: { collect: object, assert: object, upload: object } }} */
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
        'categories:performance': ['error', { minScore: 0.65 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['error', { minScore: 0.88 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.15 }],
      },
      failOnError: true,
    },

    upload: {
      target: 'temporary-public-storage',
    },
  },
};
