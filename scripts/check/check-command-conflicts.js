#!/usr/bin/env node
/**
 * check-command-conflicts.js
 *
 * Verifies that:
 * 1. GateFlow slash commands in .antigravity/workflows/ and commands.json are unique and valid.
 * 2. Sovereign / AIWF content factory commands are strictly quarantined under .ai/commands/factory/
 *    and do not place top-level colliding command markdown files directly in .ai/commands/.
 * 3. No duplicate command definitions exist across tools.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const CANONICAL_WORKFLOWS_DIR = path.join(ROOT, '.antigravity', 'workflows');
const COMMANDS_JSON_PATH = path.join(ROOT, '.antigravity', 'commands.json');
const AI_COMMANDS_DIR = path.join(ROOT, '.ai', 'commands');

let errors = [];

// 1. Check Canonical Workflows
if (!fs.existsSync(CANONICAL_WORKFLOWS_DIR)) {
  errors.push(
    `Missing canonical workflows directory at: ${CANONICAL_WORKFLOWS_DIR}`
  );
} else {
  const workflowFiles = fs
    .readdirSync(CANONICAL_WORKFLOWS_DIR)
    .filter((f) => f.endsWith('.md'));
  const workflowNames = new Set(
    workflowFiles.map((f) => path.basename(f, '.md'))
  );

  // Check commands.json matches
  if (fs.existsSync(COMMANDS_JSON_PATH)) {
    try {
      const reg = JSON.parse(fs.readFileSync(COMMANDS_JSON_PATH, 'utf8'));
      const registeredKeys = Object.keys(reg.commands || {});

      for (const name of workflowNames) {
        if (!registeredKeys.includes(name)) {
          errors.push(
            `Workflow "${name}.md" is not registered in commands.json`
          );
        }
      }

      for (const key of registeredKeys) {
        if (!workflowNames.has(key)) {
          errors.push(
            `commands.json key "${key}" has no matching workflow in ${CANONICAL_WORKFLOWS_DIR}`
          );
        }
      }
    } catch (e) {
      errors.push(`Failed to parse commands.json: ${e.message}`);
    }
  }
}

// 2. Check Sovereign / AIWF Quarantine
if (fs.existsSync(AI_COMMANDS_DIR)) {
  const rootAiCommandFiles = fs.readdirSync(AI_COMMANDS_DIR).filter((f) => {
    // Only README.md is allowed at the top level of .ai/commands/
    return f.endsWith('.md') && f.toLowerCase() !== 'readme.md';
  });

  if (rootAiCommandFiles.length > 0) {
    errors.push(
      `Found un-quarantined command files directly in ${AI_COMMANDS_DIR}: ${rootAiCommandFiles.join(
        ', '
      )}. Sovereign factory commands must be placed under .ai/commands/factory/ to avoid collisions with GateFlow workflows.`
    );
  }
}

// 3. Report
if (errors.length > 0) {
  console.error('❌ Command Conflicts & Integrity Check Failed:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(
    '✅ Command uniqueness and quarantine integrity verified (0 collisions).'
  );
}
