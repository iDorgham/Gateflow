#!/usr/bin/env node
const path = require('node:path');
const { loadState } = require('./lib');
const { buildGuideSnapshot, renderGuide } = require('./guide');

const root = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const json = args.includes('--json');
const value = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};

try {
  if (args.includes('--help')) {
    console.log(`GateFlow workspace-aware guide

Usage:
  workflow-v2-guide [--json] [--state <file>]

Reads local workspace evidence and prints one safe next command. No mutations.`);
  } else {
    const stateFile = path.resolve(value('--state') || path.join(root, '.ai', 'workflow-v2', 'state.json'));
    const snapshot = buildGuideSnapshot({ root, state: loadState(stateFile) });
    console.log(json ? JSON.stringify(snapshot, null, 2) : renderGuide(snapshot));
  }
} catch (error) {
  console.error(`workflow-v2-guide: ${error.message}`);
  process.exitCode = 1;
}
