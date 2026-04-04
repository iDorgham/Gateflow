#!/usr/bin/env node
/**
 * phase-close.js — Auto-close plan phases from commit messages
 *
 * Parses the latest commit message for phase references and marks
 * the corresponding phase [x] in the active PLAN_<slug>.md file.
 *
 * Recognized patterns in commit message:
 *   phase 3           → closes phase 3 of the active in-progress plan
 *   phase 3 of crm    → closes phase 3 of plan "crm"
 *   [p3]              → shorthand for phase 3
 *   closes phase 3    → explicit close
 *   ✓ phase 3         → emoji style
 *
 * Called from: .husky/post-commit
 * Usage: node scripts/plan/phase-close.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Repo root (this file lives in scripts/plan/)
const ROOT = path.resolve(__dirname, '../..');
const PLAN_ROOT = path.join(ROOT, 'docs', 'plan');

function getLastCommitMsg() {
  try {
    return execSync('git log -1 --pretty=%B', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  } catch {
    return '';
  }
}

// ── Parse phase references from commit message ────────────────────────────────
function parsePhaseRefs(msg) {
  const refs = [];
  const lower = msg.toLowerCase();

  // Pattern 1: "phase 3 of slug" or "phase 3 of my-feature"
  const withSlug = [
    ...lower.matchAll(/(?:closes?\s+)?phase\s+(\d+)\s+of\s+([\w-]+)/g),
  ];
  for (const m of withSlug)
    refs.push({ phase: parseInt(m[1], 10), slug: m[2] });

  // Pattern 2: "[p3]" shorthand
  const shorthand = [...lower.matchAll(/\[p(\d+)\]/g)];
  for (const m of shorthand)
    refs.push({ phase: parseInt(m[1], 10), slug: null });

  // Pattern 3: bare "phase 3" or "closes phase 3" or "✓ phase 3"
  const bare = [
    ...lower.matchAll(
      /(?:closes?\s+|✓\s*|complete[sd]?\s+)?phase\s+(\d+)(?!\s+of)/g
    ),
  ];
  for (const m of bare) {
    if (!refs.some((r) => r.phase === parseInt(m[1], 10) && r.slug === null)) {
      refs.push({ phase: parseInt(m[1], 10), slug: null });
    }
  }

  return refs;
}

// ── Find active in-progress plans ────────────────────────────────────────────
function getInProgressPlans() {
  const dir = path.join(PLAN_ROOT, 'Active');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => {
      const full = path.join(dir, f);
      return (
        fs.statSync(full).isDirectory() &&
        fs.existsSync(path.join(full, `PLAN_${f}.md`))
      );
    })
    .map((slug) => ({
      slug,
      planFile: path.join(dir, slug, `PLAN_${slug}.md`),
    }));
}

// ── Mark phase [x] in PLAN file ──────────────────────────────────────────────
function markPhase(planFile, phaseNum) {
  let content = fs.readFileSync(planFile, 'utf8');

  // Match table rows: | N | Phase title | tool | [ ] |
  // or: | N | Phase title | tool | [x] |
  const phaseRowRe = new RegExp(
    `(\\|\\s*${phaseNum}\\s*\\|[^|]+\\|[^|]+\\|\\s*)\\[ \\](\\s*\\|)`,
    'g'
  );

  if (!phaseRowRe.test(content)) {
    return false; // phase not found or already closed
  }

  content = content.replace(phaseRowRe, '$1[x]$2');
  fs.writeFileSync(planFile, content);
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const msg = getLastCommitMsg();
if (!msg) process.exit(0);

const refs = parsePhaseRefs(msg);
if (refs.length === 0) process.exit(0);

const plans = getInProgressPlans();
if (plans.length === 0) process.exit(0);

let closedAny = false;

for (const ref of refs) {
  // If slug specified, find that plan
  const targets = ref.slug
    ? plans.filter((p) => p.slug === ref.slug || p.slug.includes(ref.slug))
    : plans; // no slug = apply to all in-progress plans

  for (const plan of targets) {
    const closed = markPhase(plan.planFile, ref.phase);
    if (closed) {
      console.log(`✓ Phase ${ref.phase} marked complete in ${plan.slug}`);
      closedAny = true;

      // Re-stage the updated PLAN file so it's included in the commit history
      try {
        execSync(`git add "${plan.planFile}"`, { cwd: ROOT, stdio: 'pipe' });
      } catch {
        /* non-fatal */
      }
    }
  }
}

if (closedAny) {
  // Amend the commit silently to include the PLAN file update.
  // Set RALPH_AMEND=1 so post-commit hook skips sync/changelog on the amend.
  try {
    execSync('git commit --amend --no-edit --no-verify', {
      cwd: ROOT,
      stdio: 'pipe',
      env: { ...process.env, RALPH_AMEND: '1' },
    });
    console.log('✓ PLAN file update included in commit');
  } catch {
    /* if amend fails, the mark is still written to disk */
  }
}
