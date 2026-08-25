#!/usr/bin/env node
/**
 * non-zero-scan.js — Monorepo Scan & Evaluation Verifier
 *
 * Enforces non-zero scan assertions across static analysis scripts,
 * linters, and verification test suites to eliminate false-positive
 * green CI runs caused by misconfigured path globs or empty sets.
 */

class ZeroScanError extends Error {
  /**
   * @param {string} scannerName
   * @param {number} count
   * @param {number} minFiles
   * @param {Record<string, any>|string} [context]
   */
  constructor(scannerName, count, minFiles = 1, context = null) {
    const details = context
      ? typeof context === 'string'
        ? ` (${context})`
        : ` (context: ${JSON.stringify(context)})`
      : '';
    super(
      `[${scannerName}] Non-zero scan assertion failed: evaluated ${count} files/items (minimum required: ${minFiles})${details}`
    );
    this.name = 'ZeroScanError';
    this.scannerName = scannerName;
    this.scannedCount = count;
    this.minFiles = minFiles;
    this.context = context;
  }
}

/**
 * Asserts that a scan or check evaluated a non-zero number of files/items.
 *
 * @param {number|Array<any>} input - Count of evaluated items or array of files.
 * @param {Object} [options]
 * @param {string} [options.scannerName='Scanner'] - Name of calling script/scanner.
 * @param {number} [options.minFiles=1] - Minimum acceptable count.
 * @param {boolean} [options.allowZero=false] - Whether zero results are permitted.
 * @param {Record<string, any>|string} [options.context] - Diagnostic metadata.
 * @returns {{ valid: boolean, count: number, scannerName: string }}
 */
function assertNonZeroScan(input, options = {}) {
  const scannerName = options.scannerName || 'Scanner';
  const minFiles = typeof options.minFiles === 'number' ? options.minFiles : 1;
  const allowZero = Boolean(options.allowZero);
  const context = options.context;

  const count = Array.isArray(input) ? input.length : Number(input) || 0;

  if (count < minFiles && !allowZero) {
    throw new ZeroScanError(scannerName, count, minFiles, context);
  }

  return {
    valid: true,
    count,
    scannerName,
  };
}

/**
 * Creates a reusable assertion helper bound to a specific scanner name and default options.
 *
 * @param {string} scannerName
 * @param {Object} [defaultOptions]
 * @returns {(input: number|Array<any>, overrideOptions?: Object) => { valid: boolean, count: number, scannerName: string }}
 */
function createScanVerifier(scannerName, defaultOptions = {}) {
  return function verifyScan(input, overrideOptions = {}) {
    return assertNonZeroScan(input, {
      scannerName,
      ...defaultOptions,
      ...overrideOptions,
    });
  };
}

/**
 * Formats a standardized scan summary log string.
 *
 * @param {Object} params
 * @param {string} params.scannerName
 * @param {string} [params.mode='default']
 * @param {number} params.filesConsidered
 * @param {number} params.filesScanned
 * @param {number} [params.durationMs]
 * @param {Record<string, any>} [params.extra]
 * @returns {string}
 */
function formatScanSummary({
  scannerName,
  mode = 'default',
  filesConsidered = 0,
  filesScanned = 0,
  durationMs,
  extra = {},
}) {
  const parts = [
    `[${scannerName}]`,
    `mode=${mode}`,
    `files_considered=${filesConsidered}`,
    `files_scanned=${filesScanned}`,
  ];

  if (typeof durationMs === 'number') {
    parts.push(`duration_ms=${durationMs.toFixed(2)}`);
  }

  for (const [key, value] of Object.entries(extra)) {
    parts.push(`${key}=${value}`);
  }

  return parts.join(' ');
}

module.exports = {
  ZeroScanError,
  assertNonZeroScan,
  createScanVerifier,
  formatScanSummary,
};
