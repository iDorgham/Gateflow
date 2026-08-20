const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { getRepoRoot } = require('../repo-root');
const { validateWorkspace } = require('../check-ai-workspace');

test('AI workspace command, agent, and skill graph is structurally valid', () => {
  const result = validateWorkspace(getRepoRoot(path.resolve(__dirname, '..')));
  assert.deepEqual(result.errors, []);
  if (result.skipped) {
    assert.match(result.warnings.join('\n'), /local\/gitignored/);
    return;
  }
  assert.ok(result.counts.commands > 30);
  assert.ok(result.counts.workflowAgents > 40);
  assert.ok(result.counts.skills > 100);
});
