const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { getRepoRoot } = require('../repo-root');

const root = getRepoRoot(path.resolve(__dirname, '..'));
const workflow = fs.readFileSync(
  path.join(root, '.github', 'workflows', 'ci.yml'),
  'utf8'
);

test('PR branches do not trigger a duplicate full push workflow', () => {
  const trigger = workflow.slice(
    workflow.indexOf('\non:\n'),
    workflow.indexOf('\nconcurrency:')
  );
  assert.doesNotMatch(trigger, /'feat\/\*\*'|'fix\/\*\*'|'chore\/\*\*'/);
});

test('CI OK requires head-bound runtime evidence validation', () => {
  assert.match(workflow, /runtime-proof-check:/);
  assert.match(
    workflow,
    /runtime-proof-cli\.js[^\n]*--require-evidence \.ai\/runtime-proof\.json/
  );
  assert.match(workflow, /needs:\s*\[[^\]]*runtime-proof-check[^\]]*\]/);
  assert.match(workflow, /needs\.runtime-proof-check\.result/);
});

test('deterministic performance checks are not hidden soft passes', () => {
  const performance = workflow.slice(
    workflow.indexOf('\n  performance:'),
    workflow.indexOf('\n  # ── 6. CI gate')
  );
  assert.doesNotMatch(performance, /continue-on-error:\s*true/);
  assert.match(performance, /check-imports\.js --fail --summary/);
  assert.match(workflow, /needs\.performance\.result/);
});

test('CI runs the fail-honest tracked AI validator', () => {
  assert.match(workflow, /run: pnpm check:workspace-ai/);
});
