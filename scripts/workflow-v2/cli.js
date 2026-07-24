#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const {
  certifyApp,
  focusApp,
  loadState,
  nextApp,
  saveState,
  transition,
  validateState,
  acquireLock,
  releaseLock,
} = require('./lib');

const root = path.resolve(__dirname, '..', '..');
const defaultStateFile = path.join(root, '.ai', 'workflow-v2', 'state.json');

function usage() {
  return `GateFlow Workflow v2

Usage:
  workflow-v2 status [--json] [--state <file>]
  workflow-v2 focus [status|<app>] [--json] [--state <file>]
  workflow-v2 transition <audited|planned|developing|checking|pilot-ready>
  workflow-v2 certify --evidence <file> [--receipt-dir <dir>]
  workflow-v2 next [--confirm]
  workflow-v2 lock acquire --phase <id> --owner <id>
  workflow-v2 lock release --owner <id>
  workflow-v2 validate

All commands are local-only. Mutating commands use validated atomic state writes.`;
}

function parse(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) positional.push(argv[i]);
    else {
      const key = argv[i].slice(2);
      if (['json', 'confirm', 'help'].includes(key)) flags[key] = true;
      else flags[key] = argv[++i];
    }
  }
  return { positional, flags };
}

function summary(state) {
  return {
    version: state.version,
    focusedApp: state.focusedApp,
    stage: state.focusedApp ? state.apps[state.focusedApp].stage : null,
    apps: Object.fromEntries(Object.entries(state.apps).map(([app, value]) => [app, value.stage])),
    workdirLock: state.workdirLock,
    updatedAt: state.updatedAt,
  };
}

function output(value, json) {
  if (json) console.log(JSON.stringify(value, null, 2));
  else if (typeof value === 'string') console.log(value);
  else {
    for (const [key, item] of Object.entries(value)) {
      console.log(`${key}: ${typeof item === 'object' ? JSON.stringify(item) : item ?? 'none'}`);
    }
  }
}

function main() {
  const { positional, flags } = parse(process.argv.slice(2));
  if (flags.help || positional.length === 0) {
    console.log(usage());
    return;
  }
  const command = positional[0];
  const stateFile = path.resolve(flags.state || defaultStateFile);
  let state = loadState(stateFile);

  if (command === 'status' || (command === 'focus' && (!positional[1] || positional[1] === 'status'))) {
    output(summary(state), flags.json);
    return;
  }
  if (command === 'validate') {
    const errors = validateState(state);
    if (errors.length) throw new Error(errors.join('\n'));
    output({ valid: true, stateFile }, flags.json);
    return;
  }
  if (command === 'focus') {
    state = focusApp(state, positional[1]);
    saveState(stateFile, state);
    output(summary(state), flags.json);
    return;
  }
  if (command === 'transition') {
    state = transition(state, positional[1]);
    saveState(stateFile, state);
    output(summary(state), flags.json);
    return;
  }
  if (command === 'certify') {
    if (!flags.evidence) throw new Error('--evidence is required');
    const evidence = JSON.parse(fs.readFileSync(path.resolve(flags.evidence), 'utf8'));
    const result = certifyApp(state, evidence);
    saveState(stateFile, result.state);
    const receiptDir = path.resolve(flags['receipt-dir'] || path.join(root, '.ai', 'workflow-v2', 'receipts'));
    fs.mkdirSync(receiptDir, { recursive: true });
    const receiptFile = path.join(receiptDir, `${result.receipt.app}-${result.receipt.certifiedAt.replaceAll(':', '-')}.json`);
    fs.writeFileSync(receiptFile, `${JSON.stringify(result.receipt, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
    output({ ...summary(result.state), receiptFile }, flags.json);
    return;
  }
  if (command === 'next') {
    const result = nextApp(state, Boolean(flags.confirm));
    if (result.requiresConfirmation) {
      output(result, flags.json);
      return;
    }
    saveState(stateFile, result);
    output(summary(result), flags.json);
    return;
  }
  if (command === 'lock') {
    const action = positional[1];
    if (action === 'acquire') state = acquireLock(state, flags.phase, flags.owner);
    else if (action === 'release') state = releaseLock(state, flags.owner);
    else throw new Error('lock action must be acquire or release');
    saveState(stateFile, state);
    output(summary(state), flags.json);
    return;
  }
  throw new Error(`Unknown command: ${command}\n\n${usage()}`);
}

try {
  main();
} catch (error) {
  console.error(`workflow-v2: ${error.message}`);
  process.exitCode = 1;
}
