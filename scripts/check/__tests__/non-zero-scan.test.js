/**
 * Unit tests for non-zero scan assertions and verifier functions.
 * Run: node --test scripts/check/__tests__/non-zero-scan.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  ZeroScanError,
  assertNonZeroScan,
  createScanVerifier,
  formatScanSummary,
} = require('../non-zero-scan');

describe('assertNonZeroScan', () => {
  it('passes when count is greater than or equal to default min (1)', () => {
    const result = assertNonZeroScan(10, { scannerName: 'test-scanner' });
    assert.equal(result.valid, true);
    assert.equal(result.count, 10);
    assert.equal(result.scannerName, 'test-scanner');
  });

  it('accepts array and checks array length', () => {
    const files = ['file1.ts', 'file2.ts', 'file3.ts'];
    const result = assertNonZeroScan(files, { scannerName: 'array-scanner' });
    assert.equal(result.valid, true);
    assert.equal(result.count, 3);
  });

  it('throws ZeroScanError when count is 0', () => {
    assert.throws(
      () => assertNonZeroScan(0, { scannerName: 'empty-scanner' }),
      (err) => {
        assert.ok(err instanceof ZeroScanError);
        assert.equal(err.name, 'ZeroScanError');
        assert.equal(err.scannerName, 'empty-scanner');
        assert.equal(err.scannedCount, 0);
        assert.match(err.message, /Non-zero scan assertion failed/);
        return true;
      }
    );
  });

  it('throws when array is empty', () => {
    assert.throws(
      () => assertNonZeroScan([], { scannerName: 'empty-array-scanner' }),
      ZeroScanError
    );
  });

  it('respects custom minFiles threshold', () => {
    assert.throws(
      () =>
        assertNonZeroScan(3, { scannerName: 'threshold-scanner', minFiles: 5 }),
      (err) => {
        assert.ok(err instanceof ZeroScanError);
        assert.equal(err.minFiles, 5);
        assert.equal(err.scannedCount, 3);
        return true;
      }
    );

    const passing = assertNonZeroScan(5, {
      scannerName: 'threshold-scanner',
      minFiles: 5,
    });
    assert.equal(passing.valid, true);
  });

  it('allows zero when allowZero is explicitly set to true', () => {
    const result = assertNonZeroScan(0, {
      scannerName: 'optional-scanner',
      allowZero: true,
    });
    assert.equal(result.valid, true);
    assert.equal(result.count, 0);
  });

  it('includes context details in error message when provided', () => {
    assert.throws(
      () =>
        assertNonZeroScan(0, {
          scannerName: 'context-scanner',
          context: { dir: 'apps/unknown', glob: '*.ts' },
        }),
      (err) => {
        assert.match(
          err.message,
          /context: \{"dir":"apps\/unknown","glob":"\*\.ts"\}/
        );
        return true;
      }
    );
  });
});

describe('createScanVerifier', () => {
  it('creates bound verifier with preconfigured scanner name and options', () => {
    const verify = createScanVerifier('bound-scanner', { minFiles: 2 });

    assert.throws(() => verify(1), ZeroScanError);

    const valid = verify(3);
    assert.equal(valid.valid, true);
    assert.equal(valid.count, 3);
    assert.equal(valid.scannerName, 'bound-scanner');
  });

  it('allows overriding options at call site', () => {
    const verify = createScanVerifier('bound-scanner', { minFiles: 5 });
    const valid = verify(2, { minFiles: 2 });
    assert.equal(valid.valid, true);
    assert.equal(valid.count, 2);
  });
});

describe('formatScanSummary', () => {
  it('formats standard scan summary string', () => {
    const summary = formatScanSummary({
      scannerName: 'secrets-scanner',
      mode: 'all',
      filesConsidered: 120,
      filesScanned: 120,
      durationMs: 45.2,
      extra: { issues: 0 },
    });

    assert.equal(
      summary,
      '[secrets-scanner] mode=all files_considered=120 files_scanned=120 duration_ms=45.20 issues=0'
    );
  });

  it('handles defaults gracefully', () => {
    const summary = formatScanSummary({
      scannerName: 'basic-scanner',
    });

    assert.equal(
      summary,
      '[basic-scanner] mode=default files_considered=0 files_scanned=0'
    );
  });
});
