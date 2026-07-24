const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..', '..', '..');
const loopCli = path.join(root, 'scripts', 'workflow-v2', 'loop-cli.js');
const deliveryCli = path.join(root, 'scripts', 'workflow-v2', 'delivery-cli.js');
const fixture = path.join(__dirname, 'fixtures', 'task-contract-input.json');

test('task draft dry-run validates without writing an artifact', () => {
  const taskFile = path.join(root, '.ai', 'workflow-v2', 'tasks', 'cli-dry-run.json');
  assert.equal(fs.existsSync(taskFile), false);
  const output = execFileSync(process.execPath, [
    loopCli,
    'task',
    'draft',
    'cli-dry-run',
    '--from',
    fixture,
    '--dry-run',
    '--json',
  ], { cwd: root, encoding: 'utf8' });
  assert.equal(JSON.parse(output).status, 'draft');
  assert.equal(fs.existsSync(taskFile), false);
});

test('loop and delivery CLIs expose local help without side effects', () => {
  const loopHelp = execFileSync(process.execPath, [loopCli, '--help'], {
    cwd: root,
    encoding: 'utf8',
  });
  const deliveryHelp = execFileSync(process.execPath, [deliveryCli, '--help'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.match(loopHelp, /bounded development loop/);
  assert.match(deliveryHelp, /delivery planner/);
});
