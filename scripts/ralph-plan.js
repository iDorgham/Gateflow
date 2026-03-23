#!/usr/bin/env node
/**
 * ralph-plan.js — Plan lifecycle manager
 *
 * Commands:
 *   node scripts/ralph-plan.js new <slug> [--phases 5] [--title "My Feature"]
 *   node scripts/ralph-plan.js ready   <slug>   # planning  → planned
 *   node scripts/ralph-plan.js start   <slug>   # planned   → in-progress
 *   node scripts/ralph-plan.js done    <slug>   # in-progress → done
 *   node scripts/ralph-plan.js status           # show all plans + state
 *   node scripts/ralph-plan.js move <slug> <from> <to>  # manual move
 *
 * Aliases: pnpm plan:new / plan:ready / plan:start / plan:done / plan:status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Escape special regex characters to prevent regex injection from CLI args
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function callDocs(args) {
  try {
    execSync(`node scripts/ralph-docs.js ${args}`, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });
  } catch {
    /* docs update is non-fatal */
  }
}

function createPR(slug, planDir) {
  // Read plan file for title + description
  const pf = planFile(planDir, slug);
  let prTitle = `feat: ${title(slug)}`;
  let prBody = `## Summary\n\n- Completed plan: \`${slug}\`\n\n## Plan phases\n\n`;

  if (fs.existsSync(pf)) {
    const content = fs.readFileSync(pf, 'utf8');
    const titleMatch = content.match(/^#\s+(.+)/m);
    if (titleMatch) prTitle = `feat: ${titleMatch[1].trim()}`;
    // Extract phase rows from the phases table
    const phaseRows = [
      ...content.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+)\|[^|]+\|\s*\[x\]/gm),
    ];
    if (phaseRows.length) {
      prBody += phaseRows
        .map((m) => `- [x] Phase ${m[1].trim()}: ${m[2].trim()}`)
        .join('\n');
    } else {
      prBody += `*(see PLAN_${slug}.md for details)*`;
    }
  }

  prBody += `\n\n## Test plan\n- [ ] All preflight checks pass (\`pnpm preflight\`)\n- [ ] Reviewed by team\n\n🤖 Generated with [GateFlow Ralph](../scripts/ralph-plan.js)`;

  try {
    const result = execSync(
      `gh pr create --title ${JSON.stringify(prTitle)} --body ${JSON.stringify(prBody)}`,
      { cwd: path.resolve(__dirname, '..'), encoding: 'utf8', stdio: 'pipe' }
    );
    console.log(`✓ PR created: ${result.trim()}`);
  } catch (err) {
    const msg = err.stderr || err.message || '';
    if (msg.includes('already exists')) {
      console.log('ℹ  PR already exists for this branch.');
    } else if (msg.includes('not found') || msg.includes('not a git')) {
      console.log(
        'ℹ  gh CLI not available or not a GitHub repo — skipping PR creation.'
      );
    } else {
      console.log(
        `ℹ  Could not create PR automatically: ${msg.split('\n')[0]}`
      );
    }
  }
}

const ROOT = path.resolve(__dirname, '..');
const PLAN_ROOT = path.join(ROOT, 'docs', 'plan');
const TEMPLATES = path.join(PLAN_ROOT, 'templates');
const STATES = ['planning', 'planned', 'in-progress', 'done', 'execution'];

// ── CLI TOOLS available in this workspace ────────────────────────────────────
const TOOLS = [
  'claude',
  'gemini',
  'opencode',
  'kilo',
  'qwen',
  'cursor',
  'kiro',
];

// ── helpers ───────────────────────────────────────────────────────────────────
function stateDir(state) {
  return path.join(PLAN_ROOT, state);
}

function findPlan(slug) {
  for (const state of STATES) {
    const dir = path.join(stateDir(state), slug);
    if (fs.existsSync(dir)) return { state, dir };
  }
  return null;
}

function planFile(dir, slug) {
  return path.join(dir, `PLAN_${slug}.md`);
}

function promptFile(dir, slug, phase) {
  return path.join(dir, `PROMPT_${slug}_phase_${phase}.md`);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function title(slug) {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function movePlan(slug, fromState, toState) {
  const src = path.join(stateDir(fromState), slug);
  const dest = path.join(stateDir(toState), slug);
  if (!fs.existsSync(src)) {
    console.error(`✗ Plan "${slug}" not found in ${fromState}/`);
    process.exit(1);
  }
  if (fs.existsSync(dest)) {
    console.error(`✗ "${slug}" already exists in ${toState}/`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
  console.log(`✓ Moved: ${fromState}/${slug}  →  ${toState}/${slug}`);
  return dest;
}

// ── PLAN template ─────────────────────────────────────────────────────────────
function buildPlanTemplate(slug, featureTitle, phases) {
  const rows = Array.from({ length: phases }, (_, i) => {
    const n = i + 1;
    const tool = n === 1 ? 'claude' : n % 3 === 0 ? 'gemini' : 'claude';
    return `| ${n} | Phase ${n}: Title | ${tool} | [ ] |`;
  }).join('\n');

  return `# PLAN: ${featureTitle}

**Slug:** \`${slug}\`
**Status:** planning
**Created:** ${today()}
**Target:** Q4 2026

## Overview

> Describe the feature goal here.

## Phases

| # | Phase | Tool | Status |
|---|-------|------|--------|
${rows}

## Technical Constraints

- Stack: Next.js 14, Prisma 5, pnpm workspaces (Turborepo)
- Tenant isolation: every query scoped to \`organizationId\`
- Tests: \`pnpm turbo test --filter=<workspace>\` must pass per phase
- Commit: run \`pnpm preflight\` before each commit

## Tools Reference

| Tool | Best for | Auto-accept flag |
|------|----------|-----------------|
| claude | Security, architecture, complex reasoning | \`--dangerously-skip-permissions\` |
| gemini | DB/schema, fast structural analysis | \`--yolo\` |
| opencode | Code generation, scaffolds, refactors | \`run\` mode |
| kilo | Free agentic, large context | \`run\` mode |
| qwen | Free agentic, 480B reasoning | \`-p\` |
| cursor | UI/visual iteration | IDE (manual) |
| kiro | IDE review, specs | IDE (manual) |
`;
}

// ── PROMPT template ───────────────────────────────────────────────────────────
function buildPromptTemplate(slug, phase, phaseTitle, tool) {
  const toolBoxes = TOOLS.map(
    (t) =>
      `- [${t === tool ? 'x' : ' '}] ${t.charAt(0).toUpperCase() + t.slice(1)} CLI`
  ).join('\n');

  return `# Phase ${phase}: ${phaseTitle}

---

## Phase ${phase}: ${phaseTitle}

### Primary role

BACKEND | FRONTEND | SECURITY

### Preferred tool

${toolBoxes}

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard, admin-dashboard, scanner-app, marketing
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (\`organizationId\`); RTL-safe (logical CSS)
- **Refs**: \`CLAUDE.md\`, \`packages/db/src/tenant.ts\`

### Goal

> Describe the goal for this phase.

### Scope (in)

- Item 1
- Item 2

### Scope (out)

- Item A (deferred to phase ${phase + 1})

### Steps (ordered)

1. Step 1
2. Step 2
3. Run \`pnpm turbo lint --filter=<workspace>\`
4. Run \`pnpm turbo typecheck --filter=<workspace>\`
5. Run \`pnpm turbo test --filter=<workspace>\`

### Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests pass, build is green
`;
}

// ── COMMANDS ──────────────────────────────────────────────────────────────────
const [, , cmd, ...rawArgs] = process.argv;

switch (cmd) {
  // ── new ──────────────────────────────────────────────────────────────────
  case 'new': {
    const slug = rawArgs.find((a) => !a.startsWith('--'));
    if (!slug) {
      console.error(
        'Usage: ralph-plan new <slug> [--phases 5] [--title "Title"]'
      );
      process.exit(1);
    }

    const pIdx = rawArgs.indexOf('--phases');
    const phases = pIdx !== -1 ? parseInt(rawArgs[pIdx + 1], 10) : 5;

    const tIdx = rawArgs.indexOf('--title');
    const featureTitle = tIdx !== -1 ? rawArgs[tIdx + 1] : title(slug);

    const dest = path.join(stateDir('planning'), slug);
    if (fs.existsSync(dest)) {
      console.error(`✗ Plan "${slug}" already exists in planning/`);
      process.exit(1);
    }

    fs.mkdirSync(dest, { recursive: true });

    // PLAN file
    fs.writeFileSync(
      planFile(dest, slug),
      buildPlanTemplate(slug, featureTitle, phases)
    );
    console.log(`✓ Created: docs/plan/planning/${slug}/PLAN_${slug}.md`);

    // PROMPT files
    for (let i = 1; i <= phases; i++) {
      const tool = i === 1 ? 'claude' : i % 3 === 0 ? 'gemini' : 'claude';
      fs.writeFileSync(
        promptFile(dest, slug, i),
        buildPromptTemplate(slug, i, `Phase ${i}: Title`, tool)
      );
      console.log(`✓ Created: PROMPT_${slug}_phase_${i}.md  [tool: ${tool}]`);
    }

    // Update ALL_TASKS_BACKLOG.md
    const backlog = path.join(PLAN_ROOT, 'backlog', 'ALL_TASKS_BACKLOG.md');
    if (fs.existsSync(backlog)) {
      let content = fs.readFileSync(backlog, 'utf8');
      const phasesEntry = Array.from(
        { length: phases },
        (_, i) => `- [ ] Phase ${i + 1} — Title`
      ).join('\n');
      const entry = `\n### ${slug} — ${featureTitle}\n\n**Status:** 🆕 Open\n\n**Target:** Q4 2026\n\n${phasesEntry}\n`;
      content = content.replace(
        '## Open Initiatives\n',
        `## Open Initiatives\n${entry}`
      );
      fs.writeFileSync(backlog, content);
      console.log(`✓ Added to ALL_TASKS_BACKLOG.md`);
    }

    console.log(`\n📋 Plan created. Next steps:`);
    console.log(`   1. Edit PLAN_${slug}.md — fill in phase titles and tools`);
    console.log(`   2. Edit each PROMPT file — fill in steps and criteria`);
    console.log(`   3. pnpm plan:ready ${slug}  — move to planned/`);
    break;
  }

  // ── ready (planning → planned) ───────────────────────────────────────────
  case 'ready': {
    const slug = rawArgs[0];
    if (!slug) {
      console.error('Usage: ralph-plan ready <slug>');
      process.exit(1);
    }
    movePlan(slug, 'planning', 'planned');
    console.log(`\n▶  Run when ready to start: pnpm plan:start ${slug}`);
    break;
  }

  // ── start (planned → in-progress) ────────────────────────────────────────
  case 'start': {
    const slug = rawArgs[0];
    if (!slug) {
      console.error('Usage: ralph-plan start <slug>');
      process.exit(1);
    }

    // try planned first, then planning
    const found = findPlan(slug);
    if (!found) {
      console.error(`✗ Plan "${slug}" not found`);
      process.exit(1);
    }
    if (found.state === 'in-progress') {
      console.log(`ℹ  "${slug}" is already in-progress`);
      break;
    }

    movePlan(slug, found.state, 'in-progress');
    callDocs(`on-plan-start ${slug}`);
    console.log(`\n▶  Run the first phase: pnpm plan:run ${slug} 1`);
    break;
  }

  // ── done (in-progress → done) ─────────────────────────────────────────────
  case 'done': {
    const slug = rawArgs[0];
    if (!slug) {
      console.error('Usage: ralph-plan done <slug>');
      process.exit(1);
    }
    const found = findPlan(slug);
    if (!found) {
      console.error(`✗ Plan "${slug}" not found`);
      process.exit(1);
    }
    movePlan(slug, found.state, 'done');

    // Trigger docs automation
    callDocs(`on-plan-done ${slug}`);

    // Auto-create PR (non-fatal if gh CLI not available)
    const doneDir = path.join(stateDir('done'), slug);
    createPR(slug, doneDir);

    // Mark complete in backlog
    const backlog = path.join(PLAN_ROOT, 'backlog', 'ALL_TASKS_BACKLOG.md');
    if (fs.existsSync(backlog)) {
      let content = fs.readFileSync(backlog, 'utf8');
      content = content.replace(
        new RegExp(
          `(### ${escapeRegExp(slug)}[^\\n]*\\n\\n\\*\\*Status:\\*\\* )🆕 Open`
        ),
        '$1✅ Complete'
      );
      fs.writeFileSync(backlog, content);
      console.log(`✓ Marked complete in ALL_TASKS_BACKLOG.md`);
    }
    break;
  }

  // ── pr (manual PR creation) ───────────────────────────────────────────────
  case 'pr': {
    const slug = rawArgs[0];
    if (!slug) {
      console.error('Usage: ralph-plan pr <slug>');
      process.exit(1);
    }
    const found = findPlan(slug);
    if (!found) {
      console.error(`✗ Plan "${slug}" not found`);
      process.exit(1);
    }
    createPR(slug, found.dir);
    break;
  }

  // ── move (manual) ─────────────────────────────────────────────────────────
  case 'move': {
    const [slug, from, to] = rawArgs;
    if (!slug || !from || !to) {
      console.error('Usage: ralph-plan move <slug> <from> <to>');
      process.exit(1);
    }
    movePlan(slug, from, to);
    break;
  }

  // ── status ────────────────────────────────────────────────────────────────
  case 'status': {
    console.log('\n📋 Plan Status\n');
    const activeStates = ['planning', 'planned', 'in-progress'];
    let found = false;

    for (const state of [...activeStates, 'done']) {
      const dir = stateDir(state);
      if (!fs.existsSync(dir)) continue;
      const entries = fs
        .readdirSync(dir)
        .filter(
          (f) =>
            f !== '.gitkeep' && fs.statSync(path.join(dir, f)).isDirectory()
        );
      if (entries.length === 0) continue;
      found = true;

      const icon =
        { planning: '📝', planned: '📌', 'in-progress': '🔄', done: '✅' }[
          state
        ] || '•';
      console.log(`${icon}  ${state.toUpperCase()}`);

      for (const slug of entries) {
        const pf = planFile(path.join(dir, slug), slug);
        if (!fs.existsSync(pf)) {
          console.log(`   • ${slug}`);
          continue;
        }

        const content = fs.readFileSync(pf, 'utf8');
        const total = (content.match(/^\| \d+/gm) || []).length;
        const done = (content.match(/\[x\]/g) || []).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const bar =
          '█'.repeat(Math.round(pct / 10)) +
          '░'.repeat(10 - Math.round(pct / 10));
        console.log(
          `   • ${slug.padEnd(35)} ${bar} ${done}/${total} phases (${pct}%)`
        );
      }
      console.log();
    }

    if (!found) console.log('  No plans found.\n');
    break;
  }

  default:
    console.log(`
ralph-plan — Plan lifecycle manager

Commands:
  new <slug> [--phases N] [--title "Title"]   Create new plan in planning/
  ready <slug>                                 planning/ → planned/
  start <slug>                                 planned/  → in-progress/
  done  <slug>                                 in-progress/ → done/
  move  <slug> <from> <to>                     Manual move between states
  status                                       Show all plans + progress

Examples:
  pnpm plan:new  my_feature --phases 5
  pnpm plan:start my_feature
  pnpm plan:run   my_feature 1
  pnpm plan:done  my_feature
    `);
}
