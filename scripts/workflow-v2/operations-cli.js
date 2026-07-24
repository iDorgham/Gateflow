#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const {
  buildQrVectors,
  checkEnvironmentNames,
  checkReasonCodes,
  releaseChecklist,
  scanTenantScope,
  verificationCommands,
} = require('./operations');

const args = process.argv.slice(2);
const command = args[0];
const json = args.includes('--json');
const value = (flag) => args[args.indexOf(flag) + 1];
const print = (data) => console.log(
  typeof data === 'string' && !json ? data : JSON.stringify(data, null, 2)
);

function help() {
  return `Workflow v2 local operations

Usage:
  operations-cli qr-vectors --secret-env <NAME> [--json]
  operations-cli reason-codes <json-file> [--json]
  operations-cli env-check <app> [--json]
  operations-cli tenant-scan <file...> [--json]
  operations-cli verify <app> [--run] [--json]
  operations-cli vercel-readiness <app> [--json]
  operations-cli release-checklist <app> [--json]

Default behavior is read-only/dry-run. Secret values are never printed.`;
}

try {
  if (!command || args.includes('--help')) return print(help());
  if (command === 'qr-vectors') {
    const name = value('--secret-env');
    if (!name || !process.env[name]) throw new Error('--secret-env must name a populated fixture-only variable');
    return print(buildQrVectors(process.env[name]));
  }
  if (command === 'reason-codes') {
    const codes = JSON.parse(fs.readFileSync(path.resolve(args[1]), 'utf8'));
    const errors = checkReasonCodes(codes);
    if (errors.length) process.exitCode = 1;
    return print({ valid: errors.length === 0, errors });
  }
  if (command === 'env-check' || command === 'vercel-readiness') {
    const result = checkEnvironmentNames(args[1], process.env);
    if (result.missing.length) process.exitCode = 1;
    return print(result);
  }
  if (command === 'tenant-scan') {
    const files = args.slice(1).filter((arg) => !arg.startsWith('--'));
    const findings = files.flatMap((file) => scanTenantScope(fs.readFileSync(path.resolve(file), 'utf8')).map((message) => ({ file, message })));
    if (findings.length) process.exitCode = 1;
    return print({ valid: findings.length === 0, findings });
  }
  if (command === 'verify') {
    const plan = verificationCommands(args[1]);
    if (!args.includes('--run')) return print({ ...plan, dryRun: true });
    const { spawnSync } = require('node:child_process');
    const results = plan.commands.map((item) => {
      const [bin, ...commandArgs] = item.split(' ');
      const result = spawnSync(bin, commandArgs, { cwd: path.resolve(__dirname, '..', '..'), stdio: 'inherit' });
      return { command: item, exitCode: result.status };
    });
    if (results.some((item) => item.exitCode !== 0)) process.exitCode = 1;
    return print({ app: plan.app, results });
  }
  if (command === 'release-checklist') return print(releaseChecklist(args[1]));
  throw new Error(`Unknown command: ${command}`);
} catch (error) {
  console.error(`workflow-v2-operations: ${error.message}`);
  process.exitCode = 1;
}
