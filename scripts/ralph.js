#!/usr/bin/env node
/**
 * ralph.js — Master Ralph status dashboard
 *
 * One command that shows the complete state of the workspace:
 * git, plans, hooks, env, quality, and next recommended action.
 *
 * Usage:
 *   node scripts/ralph.js          full dashboard
 *   node scripts/ralph.js --short  compact summary
 *   pnpm ralph
 *   pnpm ralph:short
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PLAN_ROOT = path.join(ROOT, 'docs', 'plan');

// ── Colours ───────────────────────────────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  reset: (s) => `\x1b[0m${s}\x1b[0m`,
};

function safe(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch {
    return '';
  }
}

function sep(title = '') {
  const line = '─'.repeat(60);
  if (!title) return console.log(c.dim(line));
  const pad = Math.max(0, 58 - title.length);
  console.log(c.dim('─ ') + c.bold(title) + ' ' + c.dim('─'.repeat(pad)));
}

// ── GIT STATE ─────────────────────────────────────────────────────────────────
function gitSection() {
  sep('Git');
  const branch = safe('git rev-parse --abbrev-ref HEAD');
  const version = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
  ).version;
  const lastTag = safe('git describe --tags --abbrev=0 2>/dev/null') || 'none';
  const ahead =
    safe('git rev-list @{upstream}..HEAD 2>/dev/null | wc -l | tr -d " "') ||
    '?';
  const behind =
    safe('git rev-list HEAD..@{upstream} 2>/dev/null | wc -l | tr -d " "') ||
    '?';
  const dirty = safe('git status --porcelain').length > 0;
  const stashed = safe('git stash list | wc -l | tr -d " "') || '0';

  console.log(
    `  Branch   ${c.cyan(branch)}  ${dirty ? c.yellow('(uncommitted changes)') : c.green('(clean)')}`
  );
  console.log(`  Version  v${version}  │  Last tag: ${lastTag}`);
  console.log(
    `  Remote   ${c.green(`↑${ahead}`)} ahead  ${parseInt(behind) > 0 ? c.red(`↓${behind} behind`) : c.dim(`↓${behind} behind`)}`
  );
  if (stashed !== '0')
    console.log(`  Stash    ${c.yellow(`${stashed} stashed entries`)}`);

  // Last 5 commits
  const log = safe('git log -5 --pretty=format:"%h %s" 2>/dev/null')
    .split('\n')
    .filter(Boolean);
  if (log.length) {
    console.log(`\n  Recent commits:`);
    for (const entry of log) {
      const [hash, ...rest] = entry.split(' ');
      const msg = rest.join(' ');
      const typeMatch = msg.match(
        /^(feat|fix|chore|perf|docs|refactor|security|ci|test|hotfix)/
      );
      const colored = typeMatch
        ? msg.replace(typeMatch[0], c.cyan(typeMatch[0]))
        : c.dim(msg);
      console.log(`    ${c.dim(hash)}  ${colored}`);
    }
  }
}

// ── PLAN STATE ────────────────────────────────────────────────────────────────
function plansSection() {
  sep('Plans');
  const states = ['in-progress', 'planned', 'planning'];
  let found = false;

  for (const state of states) {
    const dir = path.join(PLAN_ROOT, state);
    if (!fs.existsSync(dir)) continue;
    const plans = fs.readdirSync(dir).filter((f) => {
      return f !== '.gitkeep' && fs.statSync(path.join(dir, f)).isDirectory();
    });
    if (!plans.length) continue;
    found = true;

    const icons = { 'in-progress': '🔄', planned: '📌', planning: '📝' };
    console.log(`\n  ${icons[state] || '•'} ${c.bold(state.toUpperCase())}`);

    for (const slug of plans) {
      const pf = path.join(dir, slug, `PLAN_${slug}.md`);
      if (!fs.existsSync(pf)) {
        console.log(`    ${slug}`);
        continue;
      }
      const content = fs.readFileSync(pf, 'utf8');
      const total = (content.match(/^\| \d+/gm) || []).length;
      const done = (content.match(/\[x\]/g) || []).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const bar =
        c.green('█').repeat(Math.round(pct / 10)) +
        c.dim('░').repeat(10 - Math.round(pct / 10));
      const nextPhase = (() => {
        const rows = [
          ...content.matchAll(/^\|\s*(\d+)\s*\|[^|]+\|[^|]+\|\s*\[ \]/gm),
        ];
        return rows[0] ? `next: phase ${rows[0][1]}` : 'all complete';
      })();
      console.log(
        `    ${slug.padEnd(34)} ${bar} ${done}/${total}  ${c.dim(nextPhase)}`
      );
    }
  }

  const doneDir = path.join(PLAN_ROOT, 'done');
  const doneCount = fs.existsSync(doneDir)
    ? fs
        .readdirSync(doneDir)
        .filter(
          (f) =>
            f !== '.gitkeep' && fs.statSync(path.join(doneDir, f)).isDirectory()
        ).length
    : 0;
  if (doneCount > 0) console.log(`\n  ✅ ${doneCount} plan(s) shipped`);
  if (!found)
    console.log(`  ${c.dim('No active plans — run: pnpm plan:new <slug>')}`);
}

// ── HOOKS STATUS ──────────────────────────────────────────────────────────────
function hooksSection() {
  sep('Git Hooks');
  const hooks = [
    { name: 'commit-msg', desc: 'commitlint — enforces conventional commits' },
    { name: 'pre-commit', desc: 'secret scan → lint-staged → prisma guard' },
    {
      name: 'post-commit',
      desc: 'sync AI tools → changelog → phase auto-close',
    },
    { name: 'pre-push', desc: 'branch enforcer → preflight' },
    { name: 'post-merge', desc: 'auto patch-bump on feat/* merge' },
  ];

  for (const h of hooks) {
    const file = path.join(ROOT, '.husky', h.name);
    const exists = fs.existsSync(file);
    const exec = exists && (fs.statSync(file).mode & 0o111) !== 0;
    const status = !exists
      ? c.red('MISSING')
      : !exec
        ? c.yellow('NOT EXECUTABLE')
        : c.green('✓');
    console.log(`  ${status}  ${h.name.padEnd(14)} ${c.dim(h.desc)}`);
  }
}

// ── AUTOMATION MAP ────────────────────────────────────────────────────────────
function automationSection() {
  sep('Automation Triggers');
  const triggers = [
    {
      when: 'git commit',
      fires:
        'commitlint + secret scan + lint-staged + phase-close + AI sync + changelog',
    },
    {
      when: 'git push',
      fires: 'branch enforcer + preflight (lint + typecheck + test)',
    },
    { when: 'feat/* → master', fires: 'auto patch-bump + annotated git tag' },
    {
      when: 'pnpm plan:start',
      fires:
        'move planning→in-progress + PRD update + UPCOMING entry + CHANGELOG',
    },
    {
      when: 'pnpm plan:done',
      fires:
        'move in-progress→done + CHANGELOG + FEATURE_LOG + UPCOMING + PRD + README + auto PR',
    },
    {
      when: 'pnpm plan:run',
      fires:
        'execute phase with right CLI tool + mark [x] + auto-done if last phase',
    },
    {
      when: 'pnpm docs:release',
      fires:
        'changelog preview + version bump + CHANGELOG close + README + git tag',
    },
    {
      when: 'git push origin v*',
      fires: 'GitHub Release auto-published from CHANGELOG section',
    },
    {
      when: 'PR opened/updated',
      fires: 'size label (XS→XL) + affected packages comment',
    },
    {
      when: '.agents/ file change',
      fires: 'watch-sync: propagate to all 7 AI tools',
    },
  ];

  for (const t of triggers) {
    console.log(`  ${c.cyan(t.when.padEnd(24))} → ${c.dim(t.fires)}`);
  }
}

// ── QUALITY SNAPSHOT ──────────────────────────────────────────────────────────
function qualitySection() {
  sep('Quality Snapshot');

  // Circular imports
  try {
    const result = execSync('node scripts/check-imports.js --summary', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    const match = result.match(/(\d+) circular/);
    if (match) {
      console.log(
        `  ${c.yellow('⚠')}  Circular imports  ${c.yellow(match[1] + ' cycles')}  ${c.dim('run: pnpm check:imports')}`
      );
    } else {
      console.log(`  ${c.green('✓')}  Circular imports  ${c.green('none')}`);
    }
  } catch {
    console.log(
      `  ${c.dim('•')}  Circular imports  ${c.dim('(run check:imports)')}`
    );
  }

  // TODOs
  try {
    const todos = execSync('node scripts/todos.js --json', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    const items = JSON.parse(todos);
    const fixmes = items.filter((i) => i.tag === 'FIXME').length;
    const hacks = items.filter((i) => i.tag === 'HACK').length;
    const tds = items.filter((i) => i.tag === 'TODO').length;
    const parts = [
      fixmes ? c.red(`${fixmes} FIXME`) : '',
      hacks ? c.yellow(`${hacks} HACK`) : '',
      tds ? c.dim(`${tds} TODO`) : '',
    ]
      .filter(Boolean)
      .join('  ');
    console.log(
      `  ${fixmes > 0 ? c.yellow('⚠') : c.green('✓')}  Tech debt        ${parts || c.green('none')}`
    );
  } catch {
    console.log(
      `  ${c.dim('•')}  Tech debt        ${c.dim('(run check:todos)')}`
    );
  }

  // Bundle baseline
  const baseline = path.join(ROOT, 'scripts', '.bundle-baseline.json');
  if (fs.existsSync(baseline)) {
    const b = JSON.parse(fs.readFileSync(baseline, 'utf8'));
    const clientKb = b['client-dashboard']?.totalKb;
    if (clientKb) {
      const status =
        clientKb > 500
          ? c.red(`${clientKb} KB ⚠ over budget`)
          : c.green(`${clientKb} KB`);
      console.log(
        `  ${clientKb > 500 ? c.yellow('⚠') : c.green('✓')}  Bundle size      client-dashboard: ${status}`
      );
    }
  } else {
    console.log(
      `  ${c.dim('•')}  Bundle size      ${c.dim('no baseline — run: pnpm check:bundle:update')}`
    );
  }

  // DB drift
  const hashFile = path.join(ROOT, 'packages', 'db', 'prisma', '.schema-hash');
  const schemaFile = path.join(
    ROOT,
    'packages',
    'db',
    'prisma',
    'schema.prisma'
  );
  if (fs.existsSync(hashFile) && fs.existsSync(schemaFile)) {
    const schema = fs.readFileSync(schemaFile, 'utf8');
    let hash = 0;
    for (let i = 0; i < schema.length; i++) {
      hash = (hash << 5) - hash + schema.charCodeAt(i);
      hash |= 0;
    }
    const current = String(Math.abs(hash));
    const saved = fs.readFileSync(hashFile, 'utf8').trim();
    if (current !== saved) {
      console.log(
        `  ${c.yellow('⚠')}  DB schema        ${c.yellow('changed since baseline — run: pnpm check:db-drift')}`
      );
    } else {
      console.log(
        `  ${c.green('✓')}  DB schema        ${c.green('no drift detected')}`
      );
    }
  }
}

// ── NEXT ACTION ───────────────────────────────────────────────────────────────
function nextActionSection() {
  sep('Recommended Next Action');

  // Find next incomplete plan phase
  const inProgressDir = path.join(PLAN_ROOT, 'in-progress');
  if (fs.existsSync(inProgressDir)) {
    const plans = fs
      .readdirSync(inProgressDir)
      .filter(
        (f) =>
          f !== '.gitkeep' &&
          fs.statSync(path.join(inProgressDir, f)).isDirectory()
      );

    for (const slug of plans) {
      const pf = path.join(inProgressDir, slug, `PLAN_${slug}.md`);
      if (!fs.existsSync(pf)) continue;
      const content = fs.readFileSync(pf, 'utf8');
      const nextRow = content.match(
        /^\|\s*(\d+)\s*\|([^|]+)\|([^|]+)\|\s*\[ \]/m
      );
      if (nextRow) {
        const phase = nextRow[1].trim();
        const name = nextRow[2].trim();
        const tool = nextRow[3].trim();
        console.log(`  ${c.green('▶')}  Active plan: ${c.bold(slug)}`);
        console.log(`     Next: Phase ${phase} — ${name} [${tool}]`);
        console.log(`     Run:  ${c.cyan(`pnpm plan:run ${slug} ${phase}`)}`);
        return;
      }
    }
  }

  // No active plan — suggest starting one
  const plannedDir = path.join(PLAN_ROOT, 'planned');
  if (fs.existsSync(plannedDir)) {
    const plans = fs
      .readdirSync(plannedDir)
      .filter(
        (f) =>
          f !== '.gitkeep' &&
          fs.statSync(path.join(plannedDir, f)).isDirectory()
      );
    if (plans.length > 0) {
      console.log(`  ${c.cyan('▶')}  Plans ready to start:`);
      plans.forEach((p) =>
        console.log(`     ${c.cyan(`pnpm plan:start ${p}`)}`)
      );
      return;
    }
  }

  const dirty = safe('git status --porcelain').length > 0;
  if (dirty) {
    console.log(
      `  ${c.yellow('▶')}  Uncommitted changes — commit or stash before starting new work`
    );
    console.log(`     ${c.dim('git status')}`);
    return;
  }

  console.log(`  ${c.dim('▶')}  No active plan — create one with:`);
  console.log(`     ${c.cyan('pnpm plan:new <slug> --phases 5')}`);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const short = process.argv.includes('--short');

console.log(
  '\n' +
    c.bold('━━━ Ralph — GateFlow Automation Dashboard ━━━━━━━━━━━━━━━━━') +
    '\n'
);
console.log(
  `  ${new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}\n`
);

gitSection();
console.log('');
plansSection();
console.log('');

if (!short) {
  hooksSection();
  console.log('');
  automationSection();
  console.log('');
  qualitySection();
  console.log('');
}

nextActionSection();
console.log('\n' + c.dim('─'.repeat(60)) + '\n');
