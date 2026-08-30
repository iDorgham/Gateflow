/**
 * .lighthouserc.js — GateFlow Lighthouse CI Configuration
 *
 * CI installs @lhci/cli globally (see .github/workflows/lighthouse.yml).
 * Local runs: `npx --yes @lhci/cli@0.14.0 autorun --config=.lighthouserc.js`
 */

/**
 * @typedef {object} LhciCollectSettings
 * @property {string} [chromeFlags]
 * @property {'mobile' | 'desktop'} [emulatedFormFactor]
 * @property {'simulate' | 'devtools' | 'provided'} [throttlingMethod]
 *
 * @typedef {object} LhciCollect
 * @property {number} [numberOfRuns]
 * @property {LhciCollectSettings} [settings]
 *
 * @typedef {object} LhciAssert
 * @property {Record<string, [string, Record<string, number>]>} [assertions]
 * @property {boolean} [failOnError]
 *
 * @typedef {object} LhciUpload
 * @property {string} [target]
 *
 * @typedef {object} LhciConfig
 * @property {{ collect?: LhciCollect, assert?: LhciAssert, upload?: LhciUpload }} ci
 */

/** @type {LhciConfig} */
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
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.98 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.01 }],
      },
      failOnError: true,
    },

    upload: {
      target: 'temporary-public-storage',
    },
  },
};
