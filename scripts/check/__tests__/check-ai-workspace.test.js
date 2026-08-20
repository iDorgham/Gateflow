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
  if (result.mode === 'tracked-registry') {
    assert.match(
      result.warnings.join('\n'),
      /full local AI source unavailable/
    );
    assert.ok(result.counts.agents > 0);
    assert.ok(result.counts.skills > 0);
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

test('missing local AI source validates a tracked registry instead of soft-passing', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-ai-registry-'));
  const registryDirectory = path.join(root, 'scripts', 'workflow-v2');
  fs.mkdirSync(registryDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(registryDirectory, 'ai-routing-registry.json'),
    JSON.stringify({ agents: ['gateflow-guide'], skills: ['gf-guide'] })
  );

  const result = validateWorkspace(root);
  assert.equal(result.valid, true);
  assert.equal(result.skipped, false);
  assert.equal(result.mode, 'tracked-registry');
  assert.match(result.warnings.join('\n'), /full local AI source unavailable/);
});

test('missing local AI source and tracked registry fails closed', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gateflow-ai-missing-'));
  const result = validateWorkspace(root);
  assert.equal(result.valid, false);
  assert.equal(result.skipped, false);
  assert.match(result.errors.join('\n'), /tracked AI routing registry/);
});
