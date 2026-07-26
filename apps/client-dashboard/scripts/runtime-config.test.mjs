import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');
const uiPackage = require('../../../packages/ui/package.json');

test('production builds enforce TypeScript validation', () => {
  assert.notEqual(nextConfig.typescript?.ignoreBuildErrors, true);
});

test('health rewrite is available in local and hosted Next runtimes', async () => {
  const rewrites = await nextConfig.rewrites();
  assert.deepEqual(rewrites, [
    { source: '/health', destination: '/api/health' },
  ]);
});

test('login primitives have tree-shakeable UI subpath exports', () => {
  for (const name of [
    './button',
    './card',
    './cn',
    './input',
    './label',
    './login-shell',
  ]) {
    assert.equal(typeof uiPackage.exports[name], 'string');
  }
});
