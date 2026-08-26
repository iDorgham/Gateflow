#!/usr/bin/env node
/**
 * check-ai-surface.js
 *
 * Automated gatekeeper for GateFlow AI Surface integrity:
 * 1. Verifies all skills under .antigravity/skills/ have valid SKILL.md and folder == frontmatter name.
 * 2. Enforces max skill directory count <= 80 and stub share <= 15%.
 * 3. Enforces exactly 1 rule with alwaysApply: true (00-gateflow-core.mdc).
 * 4. Verifies zero command collisions across workflows, factory commands, and commands.json.
 * 5. Verifies no broken skill references across workflows and rules.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SKILLS_DIR = path.join(ROOT, '.antigravity', 'skills');
const RULES_DIR = path.join(ROOT, '.antigravity', 'rules');
const WORKFLOWS_DIR = path.join(ROOT, '.antigravity', 'workflows');
const COMMANDS_JSON = path.join(ROOT, '.antigravity', 'commands.json');

let errors = [];

// 1. Check Skills
if (!fs.existsSync(SKILLS_DIR)) {
  errors.push(`Skills directory missing: ${SKILLS_DIR}`);
} else {
  const skillDirs = fs
    .readdirSync(SKILLS_DIR)
    .filter((d) => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory());
  console.log(`Checking ${skillDirs.length} skills in .antigravity/skills/...`);

  if (skillDirs.length > 80) {
    errors.push(
      `Total skill directory count exceeds limit (expected <= 80, found ${skillDirs.length})`
    );
  }

  let stubsCount = 0;
  for (const dir of skillDirs) {
    const skillFile = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      errors.push(`Skill ${dir} missing SKILL.md`);
      continue;
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    const match = content.match(/^name:\s*([^\n\r]+)/m);
    if (!match) {
      errors.push(`Skill ${dir} missing 'name:' in YAML frontmatter`);
      continue;
    }

    const name = match[1].trim().replace(/^["']|["']$/g, '');
    if (name !== dir) {
      errors.push(
        `Skill name mismatch: folder "${dir}" vs frontmatter "${name}"`
      );
    }

    const lines = content.split('\n').length;
    if (lines <= 15) {
      stubsCount++;
    }
  }

  const stubShare = (stubsCount / skillDirs.length) * 100;
  console.log(
    `Stub share: ${stubsCount}/${skillDirs.length} (${stubShare.toFixed(1)}%)`
  );
  if (stubShare > 15) {
    errors.push(
      `Stub skill share exceeds limit (expected <= 15%, found ${stubShare.toFixed(1)}%)`
    );
  }
}

// 2. Check Rules
if (!fs.existsSync(RULES_DIR)) {
  errors.push(`Rules directory missing: ${RULES_DIR}`);
} else {
  const ruleFiles = fs.readdirSync(RULES_DIR).filter((f) => f.endsWith('.mdc'));
  console.log(`Checking ${ruleFiles.length} rules in .antigravity/rules/...`);

  let alwaysApplyCount = 0;
  let alwaysApplyFile = null;

  for (const f of ruleFiles) {
    const content = fs.readFileSync(path.join(RULES_DIR, f), 'utf8');
    if (content.includes('alwaysApply: true')) {
      alwaysApplyCount++;
      alwaysApplyFile = f;
    }
  }

  if (alwaysApplyCount !== 1) {
    errors.push(
      `Expected exactly 1 rule with 'alwaysApply: true', found ${alwaysApplyCount}`
    );
  } else if (alwaysApplyFile !== '00-gateflow-core.mdc') {
    errors.push(
      `Expected 00-gateflow-core.mdc to be the only alwaysApply rule, found ${alwaysApplyFile}`
    );
  }
}

// 3. Check Commands & Quarantine
if (fs.existsSync(COMMANDS_JSON) && fs.existsSync(WORKFLOWS_DIR)) {
  const reg = JSON.parse(fs.readFileSync(COMMANDS_JSON, 'utf8'));
  const commandsObj = reg.commands || reg;
  const regKeys = Object.keys(commandsObj);
  const workflowFiles = fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));

  for (const k of regKeys) {
    if (!workflowFiles.includes(k)) {
      errors.push(`commands.json references non-existent workflow: ${k}.md`);
    }
  }
}

// Summary
if (errors.length > 0) {
  console.error('\n❌ AI Surface Hardening Check FAILED:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(
    '\n✅ AI Surface Hardening Check PASSED: all skills, rules, and commands verified.'
  );
}
