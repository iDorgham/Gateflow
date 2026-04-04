#!/usr/bin/env node
/**
 * ralph-run.js — Phase runner with auto-tool selection + auto-accept security
 *
 * Usage:
 *   node scripts/plan/ralph-run.js <slug> <phase>      run specific phase
 *   node scripts/plan/ralph-run.js <slug> --next       run next incomplete phase
 *   node scripts/plan/ralph-run.js <slug> --all        run all phases sequentially
 *   node scripts/plan/ralph-run.js <slug> --dry-run 1  preview without executing
 *
 * Auto-accept flags per tool:
 *   claude   → --dangerously-skip-permissions -p
 *   gemini   → --yolo -p
 *   opencode → run (non-interactive mode, no confirmations)
 *   kilo     → run (same API as opencode)
 *   qwen     → -p (headless mode)
 *   cursor   → IDE: prints file path (cannot auto-run)
 *   kiro     → IDE: prints file path (cannot auto-run)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const PLAN_ROOT = path.join(ROOT, 'docs', 'plan');
const STATES = ['Active', 'Ready', 'Draft', 'Complete'];

// ── Tool execution map ────────────────────────────────────────────────────────
// Each entry: { build: (content) => { cmd, args } } or { ide: true }
const TOOL_MAP = {
  claude: (content) => ({
    cmd: 'claude',
    args: ['--dangerously-skip-permissions', '-p', content],
  }),
  gemini: (content) => ({
    cmd: 'gemini',
    args: ['--yolo', '-p', content],
  }),
  opencode: (content) => ({
    cmd: 'opencode',
    args: ['run', content],
  }),
  kilo: (content) => ({
    cmd: 'kilo',
    args: ['run', content],
  }),
  qwen: (content) => ({
    cmd: 'qwen',
    args: ['-p', content],
  }),
  // IDE tools — cannot be auto-run; print path instead
  cursor: null,
  kiro: null,
};

// ── helpers ───────────────────────────────────────────────────────────────────
function findPlanDir(slug) {
  for (const state of STATES) {
    const dir = path.join(PLAN_ROOT, state, slug);
    if (fs.existsSync(dir)) return { state, dir };
  }
  return null;
}

function planFilePath(dir, slug, flat) {
  return flat
    ? path.join(dir, `PLAN_${slug}.md`)
    : path.join(dir, `PLAN_${slug}.md`);
}

function promptFilePath(dir, slug, phase, flat) {
  return flat
    ? path.join(dir, `PROMPT_${slug}_phase_${phase}.md`)
    : path.join(dir, `PROMPT_${slug}_phase_${phase}.md`);
}

const VALID_PLAN_TOOLS = new Set([
  'claude',
  'gemini',
  'opencode',
  'kilo',
  'qwen',
  'cursor',
  'kiro',
]);

/** Parse the phases table from PLAN file.
 *  Supports:
 *  - Legacy: | 1 | Phase Name | claude | [ ] |
 *  - Extended: | 1 | Title | Role | Deps | Cursor | Deliverables | [ ] |
 *  Returns: [{ phase, name, tool, done }]
 */
function parsePhases(planContent) {
  const phases = [];
  for (const line of planContent.split('\n')) {
    const legacy = line.match(
      /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(\w+)\s*\|\s*(\[[ x]\])\s*\|/
    );
    if (legacy) {
      phases.push({
        phase: parseInt(legacy[1], 10),
        name: legacy[2].trim(),
        tool: legacy[3].trim().toLowerCase(),
        done: legacy[4].trim() === '[x]',
      });
      continue;
    }

    const parts = line.split('|').map((p) => p.trim());
    if (parts.length < 7 || !/^\d+$/.test(parts[1])) continue;

    const tool = parts[5].toLowerCase();
    if (!VALID_PLAN_TOOLS.has(tool)) continue;

    const phase = parseInt(parts[1], 10);
    const name = parts[2];
    let done = false;
    if (parts.length >= 8) {
      const status = parts[7];
      if (status === '[x]') done = true;
    }

    phases.push({ phase, name, tool, done });
  }
  return phases;
}

/** Mark a phase as complete in the PLAN file */
function markPhaseDone(planPath, phase) {
  let content = fs.readFileSync(planPath, 'utf8');
  // Extended row: | n | title | role | deps | tool | deliverables | [ ] |
  content = content.replace(
    new RegExp(
      `^(\\|\\s*${phase}\\s*\\|(?:[^\\n|]+\\|){5}[^\\n|]+\\|\\s*)\\[\\s\\](\\s*\\|?)`,
      'gm'
    ),
    '$1[x]$2'
  );
  // Legacy 4-column: | n | name | tool | [ ] |
  content = content.replace(
    new RegExp(
      `^(\\|\\s*${phase}\\s*\\|[^\\n|]+\\|[^\\n|]+\\|\\s*)\\[\\s\\](\\s*\\|)`,
      'gm'
    ),
    '$1[x]$2'
  );
  fs.writeFileSync(planPath, content);
}

/** Run a phase with the correct CLI tool */
function runPhase(slug, phaseInfo, promptPath, dryRun) {
  const { phase, name, tool } = phaseInfo;

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🚀 Phase ${phase}: ${name}`);
  console.log(`🔧 Tool: ${tool}`);
  console.log(`📄 Prompt: ${path.relative(ROOT, promptPath)}`);
  console.log(`${'─'.repeat(60)}\n`);

  if (!fs.existsSync(promptPath)) {
    console.error(`✗ Prompt file not found: ${promptPath}`);
    return false;
  }

  const promptContent = fs.readFileSync(promptPath, 'utf8');

  // IDE tools — cannot auto-run
  if (tool === 'cursor' || tool === 'kiro') {
    console.log(`ℹ  ${tool.toUpperCase()} is an IDE — cannot auto-run.`);
    console.log(`   Open this file in ${tool}:`);
    console.log(`   ${promptPath}`);
    console.log(
      `\n   Or copy the prompt from the file and paste into ${tool}.`
    );
    return true;
  }

  const toolFn = TOOL_MAP[tool];
  if (!toolFn) {
    console.error(
      `✗ Unknown tool: "${tool}". Valid tools: ${Object.keys(TOOL_MAP).join(', ')}`
    );
    return false;
  }

  const { cmd, args } = toolFn(promptContent);

  if (dryRun) {
    console.log(`[DRY RUN] Would execute:`);
    console.log(`  ${cmd} ${args.slice(0, -1).join(' ')} "<prompt content>"`);
    return true;
  }

  console.log(`▶  Launching ${cmd}...\n`);

  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 100 * 1024 * 1024, // 100MB
  });

  if (result.error) {
    console.error(`\n✗ Failed to launch ${cmd}: ${result.error.message}`);
    console.error(`  Make sure "${cmd}" is installed and in your PATH.`);
    return false;
  }

  if (result.status !== 0) {
    console.error(`\n✗ ${cmd} exited with code ${result.status}`);
    return false;
  }

  return true;
}

// ── Entry point ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--') && isNaN(parseInt(a)));
const phaseArg = args.find((a) => !a.startsWith('--') && !isNaN(parseInt(a)));
const runNext = args.includes('--next');
const runAll = args.includes('--all');
const dryRun = args.includes('--dry-run');

if (!slug) {
  console.log(`
ralph-run — Phase runner with auto-tool selection

Usage:
  pnpm plan:run <slug> <phase>      Run a specific phase
  pnpm plan:run <slug> --next       Run next incomplete phase
  pnpm plan:run <slug> --all        Run all phases sequentially
  pnpm plan:run <slug> --dry-run 1  Preview without executing

Examples:
  pnpm plan:run my_feature 1
  pnpm plan:run my_feature --next
  pnpm plan:run my_feature --all
  `);
  process.exit(0);
}

const found = findPlanDir(slug);
if (!found) {
  console.error(`✗ Plan "${slug}" not found in any state directory.`);
  console.error(`  Run: pnpm plan:status  to see all plans.`);
  process.exit(1);
}

const { dir, flat = false } = found;
const pf = planFilePath(dir, slug, flat);

if (!fs.existsSync(pf)) {
  console.error(`✗ PLAN file not found: ${pf}`);
  process.exit(1);
}

const planContent = fs.readFileSync(pf, 'utf8');
const phases = parsePhases(planContent);

if (phases.length === 0) {
  console.error(
    `✗ No phases found in PLAN file. Make sure the phases table uses this format:`
  );
  console.error(`  | 1 | Phase Name | claude | [ ] |`);
  process.exit(1);
}

// Determine which phases to run
let toRun = [];

if (runAll) {
  toRun = phases;
} else if (runNext) {
  const next = phases.find((p) => !p.done);
  if (!next) {
    console.log(`✅ All phases complete for "${slug}".`);
    process.exit(0);
  }
  toRun = [next];
} else if (phaseArg) {
  const n = parseInt(phaseArg, 10);
  const ph = phases.find((p) => p.phase === n);
  if (!ph) {
    console.error(
      `✗ Phase ${n} not found. Available: ${phases.map((p) => p.phase).join(', ')}`
    );
    process.exit(1);
  }
  toRun = [ph];
} else {
  // Default: next incomplete
  const next = phases.find((p) => !p.done);
  if (!next) {
    console.log(`✅ All phases complete for "${slug}".`);
    process.exit(0);
  }
  toRun = [next];
}

console.log(`\n📋 Plan: ${slug}  [${found.state}]`);
console.log(`   Phases to run: ${toRun.map((p) => p.phase).join(', ')}\n`);

for (const phaseInfo of toRun) {
  const promptPath = promptFilePath(dir, slug, phaseInfo.phase, flat);
  const success = runPhase(slug, phaseInfo, promptPath, dryRun);

  if (
    success &&
    !dryRun &&
    phaseInfo.tool !== 'cursor' &&
    phaseInfo.tool !== 'kiro'
  ) {
    markPhaseDone(pf, phaseInfo.phase);
    console.log(`\n✓ Marked phase ${phaseInfo.phase} as done in PLAN file.`);

    // Auto-move to done if last phase complete
    const updated = parsePhases(fs.readFileSync(pf, 'utf8'));
    const allDone = updated.every((p) => p.done);
    if (allDone && found.state === 'Active') {
      const destDir = path.join(PLAN_ROOT, 'Complete', slug);
      fs.mkdirSync(path.dirname(destDir), { recursive: true });
      fs.renameSync(dir, destDir);
      console.log(`\n🎉 All phases complete! Moved "${slug}" → Complete/`);

      // Trigger full docs automation (same as pnpm plan:done)
      try {
        execSync(`node scripts/docs/ralph-docs.js on-plan-done ${slug}`, {
          cwd: ROOT,
          stdio: 'inherit',
        });
      } catch {
        /* non-fatal */
      }

      // Auto-create PR
      try {
        execSync(`node scripts/plan/ralph-plan.js pr ${slug}`, {
          cwd: ROOT,
          stdio: 'inherit',
        });
      } catch {
        /* non-fatal */
      }
    }
  }

  if (!success && !dryRun) {
    console.error(
      `\n⚠  Phase ${phaseInfo.phase} did not complete successfully. Stopping.`
    );
    process.exit(1);
  }

  // Small pause between phases in --all mode
  if (runAll && toRun.indexOf(phaseInfo) < toRun.length - 1) {
    console.log(
      '\n⏸  Press Enter to continue to next phase, or Ctrl+C to stop...'
    );
    const buf = Buffer.alloc(1);
    fs.readSync(0, buf, 0, 1);
  }
}

console.log('\n✅ Done.\n');
