#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const {
  buildDraftPrRequest,
  buildMergePlan,
  buildVersionPlan,
  inspectPrFixture,
} = require('./delivery');
const { loadLoop } = require('./loop-lib');

function usage() {
  return `Workflow v2 delivery planner

Usage:
  delivery-cli pr-create --loop <file> --input <file> [--json]
  delivery-cli pr-inspect --fixture <file> [--json]
  delivery-cli merge-plan --loop <file> --input <file> [--json]
  delivery-cli version-plan --input <file> [--json] [--dry-run]

This tool produces deterministic plans/receipts only. It does not push, create
PRs, merge, tag, release, deploy, or migrate.`;
}

function parse(argv) {
  const flags = {};
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith('--')) positional.push(argv[index]);
    else if (['--json', '--help', '--dry-run'].includes(argv[index])) flags[argv[index].slice(2)] = true;
    else flags[argv[index].slice(2)] = argv[++index];
  }
  return { positional, flags };
}

function json(file) {
  return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
}

try {
  const { positional, flags } = parse(process.argv.slice(2));
  if (!positional[0] || flags.help) {
    console.log(usage());
  } else {
    let result;
    if (positional[0] === 'pr-create') result = buildDraftPrRequest(loadLoop(path.resolve(flags.loop)), json(flags.input));
    else if (positional[0] === 'pr-inspect') result = inspectPrFixture(json(flags.fixture));
    else if (positional[0] === 'merge-plan') result = buildMergePlan(loadLoop(path.resolve(flags.loop)), json(flags.input));
    else if (positional[0] === 'version-plan') result = buildVersionPlan(json(flags.input));
    else throw new Error(`Unknown command: ${positional[0]}`);
    console.log(JSON.stringify(result, null, 2));
  }
} catch (error) {
  console.error(`workflow-v2-delivery: ${error.message}`);
  process.exitCode = 1;
}
