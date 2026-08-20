#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  changedFiles,
  classifyRuntimeProof,
  validateEvidence,
} = require('./runtime-proof');

const repoRoot = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const value = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const json = args.includes('--json');
function parseExplicitFiles(cliArgs) {
  const index = cliArgs.indexOf('--files');
  if (index === -1) return null;
  const files = [];
  for (const arg of cliArgs.slice(index + 1)) {
    if (arg.startsWith('--')) break;
    files.push(arg);
  }
  return files;
}
const explicitFiles = parseExplicitFiles(args);

function headSha() {
  return execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim();
}

function markdown(result) {
  const lines = [
    '## Runtime proof plan',
    '',
    `Head: \`${result.head}\``,
    `Changed files: ${result.files.length}`,
    `Runtime proof: ${result.requiresRuntimeProof ? 'REQUIRED' : 'not required by the deterministic classifier'}`,
    '',
  ];
  for (const requirement of result.requirements) {
    lines.push(
      `- [ ] **${requirement.id}** (${requirement.kind}) — ${requirement.reason}`
    );
    lines.push(`  - Evidence: ${requirement.suggestedEvidence}`);
    lines.push(
      `  - Files: ${requirement.files.map((file) => `\`${file}\``).join(', ')}`
    );
  }
  if (!result.requirements.length)
    lines.push(
      '- No runtime category matched. Normal focused checks and review still apply.'
    );
  if (result.evidence) {
    lines.push(
      '',
      `Evidence receipt: ${result.evidence.valid ? 'VALID' : 'INCOMPLETE'}`
    );
    for (const item of result.evidence.results)
      lines.push(
        `- [${item.complete ? 'x' : ' '}] ${item.requirement}: ${item.message}`
      );
  }
  return `${lines.join('\n')}\n`;
}

function run() {
  try {
    if (args.includes('--help')) {
      console.log(
        'Usage: runtime-proof-cli [--base <ref>] [--files <paths...>] [--evidence <receipt.json>] [--json] [--github-summary <file>]'
      );
      process.exit(0);
    }
    const files = explicitFiles || changedFiles(repoRoot, value('--base'));
    const result = {
      version: 1,
      head: headSha(),
      ...classifyRuntimeProof(files),
    };
    const evidenceFile = value('--evidence');
    if (evidenceFile) {
      const evidence = JSON.parse(
        fs.readFileSync(path.resolve(evidenceFile), 'utf8')
      );
      result.evidence = validateEvidence(result, evidence, result.head, {
        root: repoRoot,
      });
      if (!result.evidence.valid) process.exitCode = 1;
    }
    const output = json
      ? `${JSON.stringify(result, null, 2)}\n`
      : markdown(result);
    const summaryFile =
      value('--github-summary') || process.env.GITHUB_STEP_SUMMARY;
    if (summaryFile)
      fs.appendFileSync(path.resolve(summaryFile), markdown(result));
    process.stdout.write(output);
  } catch (error) {
    console.error(`runtime-proof: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) run();

module.exports = { parseExplicitFiles };
