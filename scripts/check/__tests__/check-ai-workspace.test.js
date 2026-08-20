const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
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

test('AI workspace rejects command paths that escape .agents', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-ai-check-'));
  const source = path.join(root, '.agents');
  fs.mkdirSync(source);
  fs.writeFileSync(path.join(root, 'outside.md'), 'outside\n');
  fs.writeFileSync(
    path.join(source, 'commands.json'),
    JSON.stringify({
      commands: {
        escape: {
          title: 'Escape',
          description: 'Invalid traversal fixture',
          run: '../outside.md',
        },
      },
    })
  );

  const result = validateWorkspace(root);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /points outside \.agents/);
});
