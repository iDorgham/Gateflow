# GateFlow Automation Guide

> Complete reference for the Ralph automation system — every script, hook, trigger, and workflow.

---

## Table of Contents

- [Overview](#overview)
- [Quick Reference — All Commands](#quick-reference--all-commands)
- [The Ralph Dashboard](#the-ralph-dashboard)
- [Git Hooks — What Fires When](#git-hooks--what-fires-when)
- [Plan Lifecycle](#plan-lifecycle)
- [Phase Runner](#phase-runner)
- [Docs Automation](#docs-automation)
- [Semantic Versioning](#semantic-versioning)
- [Quality Checks](#quality-checks)
- [Hotfix Workflow](#hotfix-workflow)
- [GitHub Actions](#github-actions)
- [AI Tool Sync](#ai-tool-sync)
- [Dev Onboarding](#dev-onboarding)
- [Pre-Deploy Checklist](#pre-deploy-checklist)
- [Best Workflow — Step by Step](#best-workflow--step-by-step)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Ralph automation system is a set of Node.js scripts and Husky git hooks that automate the complete development lifecycle:

```
Idea → Plan → Code → Test → Commit → Push → Ship → Document
```

Every step triggers automation. You write code; Ralph handles the rest.

### Key Principles

1. **Zero manual doc updates** — CHANGELOG, README, FEATURE_LOG, PRD all update automatically.
2. **Quality enforcement** — Secrets, linting, types, tests, and bundle size checked before every push.
3. **Convention enforcement** — Commit message format, branch names, and plan phases are all validated.
4. **Idempotent safety** — All scripts are safe to run multiple times without side effects.
5. **RALPH_AMEND guard** — When `phase-close.js` amends a commit, it sets `RALPH_AMEND=1` so the post-commit hook does not fire again.

---

## Quick Reference — All Commands

```bash
# ── Dashboard ─────────────────────────────────────────────────────────────
pnpm ralph                           # Full workspace dashboard
pnpm ralph:short                     # Compact summary

# ── Plan Lifecycle ────────────────────────────────────────────────────────
pnpm plan:new <slug> [--phases N]    # Create plan in planning/
pnpm plan:ready <slug>               # Approve → move to planned/
pnpm plan:start <slug>               # Begin → move to in-progress/
pnpm plan:run <slug> <N>             # Execute phase N
pnpm plan:done <slug>                # Ship → move to done/ + docs + PR
pnpm plan:status                     # Show all plans
pnpm plan:pr <slug>                  # Create GitHub PR manually

# ── Docs & Versioning ─────────────────────────────────────────────────────
pnpm docs:release                    # Full release flow
pnpm docs:release:dry                # Preview release (no changes)
pnpm docs:changelog                  # Update CHANGELOG
pnpm docs:readme                     # Refresh README
pnpm docs:organize                   # Clean + rebuild INDEX.md
pnpm docs:index                      # Rebuild INDEX.md only
pnpm docs:clean                      # Remove empty dirs

pnpm version:bump [patch|minor|major]  # Bump version
pnpm version:tag                       # Create git tag for current version
pnpm version:info                      # Show version + last tag

# ── Quality Checks ────────────────────────────────────────────────────────
pnpm preflight                       # lint + typecheck + test (all)
pnpm check:env                       # Validate env vars (all apps)
pnpm check:env:client                # Validate client-dashboard env only
pnpm check:secrets                   # Scan entire repo for secrets
pnpm check:bundle                    # Bundle size vs baseline
pnpm check:bundle:update             # Accept current bundle as baseline
pnpm check:bundle:report             # Full bundle breakdown
pnpm check:imports                   # Report circular imports
pnpm check:imports:fail              # Exit non-zero if cycles found
pnpm check:todos                     # All TODO/FIXME/HACK with author/age
pnpm check:todos:fixme               # FIXMEs only
pnpm check:todos:old                 # Items older than 30 days
pnpm check:db-drift                  # DB schema drift vs baseline
pnpm check:db-drift:schema           # Offline schema hash check
pnpm check:pre-deploy                # Full pre-deploy checklist
pnpm check:pre-deploy:fail           # Same, exits non-zero (CI mode)

# ── Hotfix ────────────────────────────────────────────────────────────────
pnpm hotfix:start <slug>             # Branch off master → hotfix/v{ver}-{slug}
pnpm hotfix:done <slug>              # Preflight + bump + tag + PR
pnpm hotfix:status                   # List active hotfix branches

# ── Dev ───────────────────────────────────────────────────────────────────
pnpm dev                             # All apps
pnpm dev:client                      # Client dashboard (port 3001)
pnpm dev:admin                       # Admin dashboard
pnpm dev:marketing                   # Marketing site
pnpm dev:scanner                     # Expo scanner app
pnpm db:generate                     # Prisma generate
pnpm db:studio                       # Prisma Studio
pnpm build                           # Build all
pnpm sync                            # Sync AI tools manually
pnpm setup:dev                       # Interactive dev onboarding
```

---

## The Ralph Dashboard

```bash
pnpm ralph          # full dashboard
pnpm ralph:short    # compact (git + plans only)
```

The dashboard shows 6 sections:

### 1. Git State

- Current branch + clean/dirty status
- Version + last tag
- Remote ahead/behind
- Last 5 commits (color-coded by type)

### 2. Plans

- All `in-progress/`, `planned/`, `planning/` plans
- Progress bar per plan (0–100%)
- Next incomplete phase

### 3. Git Hooks

- Status of all 5 Husky hooks (✓ present + executable / MISSING / NOT EXECUTABLE)

### 4. Automation Triggers

- Full trigger map (what fires when)

### 5. Quality Snapshot

- Circular imports (cycle count)
- Tech debt (FIXME / HACK / TODO counts)
- Bundle size vs baseline
- DB schema drift status

### 6. Recommended Next Action

- If a plan is in-progress: shows exact `pnpm plan:run <slug> <N>` command
- If plans are ready: shows `pnpm plan:start <slug>`
- If uncommitted changes: reminds to commit or stash

---

## Git Hooks — What Fires When

### `commit-msg` — Conventional Commits Enforcer

**Fires:** every `git commit`

**What it does:** Runs `commitlint` to validate the commit message format.

**Format required:** `type(scope): description`

**Valid types:**

```
feat, fix, chore, perf, docs, refactor, security, ci, test, hotfix,
revert, style, build
```

**Valid scopes (30 total):**

```
client, admin, scanner, mobile, portal, marketing, db, ui, types,
i18n, config, auth, qr, scans, gates, contacts, units, projects,
team, webhooks, analytics, api, notifications, billing, media, search,
realtime, cache, jobs, infra
```

**Examples:**

```bash
git commit -m "feat(client): add export button to scans page"
git commit -m "fix(db): resolve tenant isolation in unit query"
git commit -m "chore(config): update ESLint rules"
git commit -m "security(auth): harden JWT expiry validation"
```

**Config:** `commitlint.config.js` at repo root.

---

### `pre-commit` — Quality Gate

**Fires:** before every `git commit`

**Steps:**

1. **`scan-secrets.js`** — scans staged files for 12 HIGH patterns (blocks commit) and 4 MEDIUM patterns (warns). HIGH patterns include: AWS access keys, Stripe secret keys, GitHub PATs, OpenAI/Anthropic API keys, private keys, Twilio tokens.
2. **`lint-staged`** — runs ESLint + Prettier on staged `.ts`/`.tsx` files only (not the whole repo).
3. **Prisma guard** — if `schema.prisma` is staged, prints a reminder to run `pnpm prisma db push`.

**Skip secrets scan (emergency only):**

```bash
SKIP_SECRET_SCAN=1 git commit -m "..."
```

---

### `post-commit` — Automation Cascade

**Fires:** after every successful `git commit`

**Guard:** If `RALPH_AMEND=1` is set (meaning this is an auto-amend from `phase-close.js`), the hook exits immediately to prevent infinite loops.

**Steps:**

1. **`sync-ai-tools.sh`** — propagates config changes to all 7 AI tools.
2. **`ralph-docs.js changelog from-commit`** — auto-updates CHANGELOG for `feat(`, `fix(`, `perf(`, `security(` commits.
3. **`phase-close.js`** — parses commit message for phase references and marks them `[x]` in the PLAN file, then amends the commit.

**Phase auto-close patterns:**

```
"phase 3"             → closes phase 3 of any in-progress plan
"phase 3 of crm"      → closes phase 3 of plan "crm"
"[p3]"                → shorthand for phase 3
"closes phase 3"      → explicit close
"✓ phase 3"           → emoji style
```

---

### `pre-push` — Full Quality Gate

**Fires:** before every `git push`

**Steps:**

1. **Branch name enforcer** — validates branch matches pattern:

   ```
   feat/* | fix/* | chore/* | hotfix/* | refactor/* | docs/* | test/* | perf/* | ci/* | security/*
   ```

   Protected branches (`main`, `master`, `develop`, `staging`, `HEAD`) pass through.

2. **`pnpm preflight`** — runs `lint + typecheck + test` across all workspaces. Push is blocked if any check fails.

**Why:** Prevents broken code from reaching the remote. All quality gates are enforced locally before any code is shared.

---

### `post-merge` — Auto Patch-Bump

**Fires:** after a successful `git merge`

**What it does:** When a `feat/*` branch is merged into `master`/`main`, automatically bumps the patch version and creates an annotated git tag.

**Example:** Merging `feat/contacts-import` into `master` bumps `0.1.0` → `0.1.1` and creates tag `v0.1.1`.

---

## Plan Lifecycle

Plans live in `docs/plan/` and move through states:

```
planning/  →  planned/  →  in-progress/  →  done/
```

### Directory Structure

```
docs/plan/
├── planning/<slug>/
│   ├── PLAN_<slug>.md
│   └── PROMPT_<slug>_phase_N.md  (one per phase)
├── planned/<slug>/
│   └── (same files, moved)
├── in-progress/<slug>/
│   └── (same files, moved)
├── done/<slug>/
│   └── (same files, archived)
└── backlog/
    └── ALL_TASKS_BACKLOG.md
```

### Creating a Plan

```bash
pnpm plan:new my-feature --phases 5
```

This creates:

- `docs/plan/planning/my-feature/PLAN_my-feature.md` — phase table with checkboxes
- `docs/plan/planning/my-feature/PROMPT_my-feature_phase_1.md` through `_phase_5.md`

Edit the phase prompt files to describe what each phase should implement. Include: **Role**, **Goal**, **Steps**, **Acceptance criteria**, **Preferred tool**.

### Approving a Plan

```bash
pnpm plan:ready my-feature
```

Moves `planning/my-feature/` → `planned/my-feature/`. The plan is now queued for development.

### Starting Development

```bash
pnpm plan:start my-feature
```

- Moves `planned/` → `in-progress/`
- Updates PRD with "in progress" status
- Adds entry to CHANGELOG `[Unreleased]` section
- Creates git branch: `feat/v{major.minor}-my-feature`

### Running Phases

```bash
pnpm plan:run my-feature 1
```

- Loads `PROMPT_my-feature_phase_1.md`
- Selects the right CLI tool (as specified in the phase prompt)
- Executes the phase
- Marks phase 1 as `[x]` in `PLAN_my-feature.md`
- If this was the last phase: auto-moves to `done/`, updates docs, creates PR

### Completing a Plan

```bash
pnpm plan:done my-feature
```

Triggers `on-plan-done` which:

1. Moves `in-progress/my-feature/` → `done/my-feature/`
2. Updates `CHANGELOG.md` — closes the feature entry in `[Unreleased]`
3. Updates `FEATURE_LOG.md` — adds shipped feature entry
4. Updates `UPCOMING.md` — removes the feature from upcoming
5. Updates `PRD_v7.0.md` — marks feature as complete
6. Refreshes `README.md` — updates progress dashboards
7. Creates a GitHub Pull Request automatically

---

## Phase Runner

`pnpm plan:run <slug> <N>` is the core execution engine.

### What It Does

1. Finds the plan in `in-progress/<slug>/PLAN_<slug>.md`
2. Reads `PROMPT_<slug>_phase_<N>.md`
3. Checks the **Preferred tool** field in the phase prompt
4. Invokes the right CLI tool with the prompt
5. Marks phase `[x]` in the PLAN file
6. If all phases are now `[x]`: triggers `plan:done` automatically

### Preferred Tool Values

| Value      | CLI Invoked                 |
| :--------- | :-------------------------- |
| `Claude`   | Claude Code (this session)  |
| `Gemini`   | `gemini` CLI                |
| `OpenCode` | `opencode` CLI              |
| `Kiro`     | `kiro` CLI                  |
| `Kilo`     | `kilo` CLI                  |
| `Qwen`     | `qwen` CLI                  |
| `Cursor`   | Manual — you use Cursor IDE |

---

## Docs Automation

### Changelog Auto-Update

Fires automatically in `post-commit` for `feat(`, `fix(`, `perf(`, `security(` commits.

Manually:

```bash
pnpm docs:changelog
```

Format follows [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [Unreleased]

### Added

- feat(client): add export button to scans page

### Fixed

- fix(db): resolve tenant isolation in unit query
```

### README Refresh

```bash
pnpm docs:readme
```

Updates the README with latest plan progress, recent commits, and feature milestones.

### Docs Organization

```bash
pnpm docs:organize    # clean empty dirs + rebuild INDEX.md
pnpm docs:index       # rebuild INDEX.md only
pnpm docs:clean       # remove empty dirs and orphaned files
```

`INDEX.md` is auto-generated — never edit it manually.

### On-Plan-Done Cascade

When `plan:done` or `plan:run` (final phase) fires, all 5 doc updates run in sequence:

1. CHANGELOG — feature entry closed
2. FEATURE_LOG — entry added
3. UPCOMING — entry removed
4. PRD — marked complete
5. README — progress updated

---

## Semantic Versioning

Version source of truth: `package.json` at repo root.

### Commands

```bash
pnpm version:bump         # bump patch: 0.1.0 → 0.1.1
pnpm version:bump minor   # bump minor: 0.1.0 → 0.2.0
pnpm version:bump major   # bump major: 0.1.0 → 1.0.0
pnpm version:tag          # create annotated tag for current version
pnpm version:info         # show: current version + last git tag
```

### Branch Naming Convention

| Branch type | Pattern                      |
| :---------- | :--------------------------- |
| Feature     | `feat/v{major.minor}-{slug}` |
| Fix         | `fix/{slug}`                 |
| Hotfix      | `hotfix/v{version}-{slug}`   |
| Chore       | `chore/{slug}`               |

### Release Flow

```bash
# 1. Preview (no changes)
pnpm docs:release:dry

# 2. Full release
pnpm docs:release

# What docs:release does:
# a. Shows CHANGELOG preview for [Unreleased]
# b. Bumps version in package.json
# c. Closes [Unreleased] → [0.2.0] — 2026-03-23
# d. Creates annotated git tag v0.2.0
# e. Updates README version badge

# 3. Push tag → triggers GitHub Release auto-publish
git push && git push origin v0.2.0
```

The `release.yml` GitHub Action extracts the matching CHANGELOG section and creates a GitHub Release automatically.

---

## Quality Checks

### Secret Scanner

```bash
pnpm check:secrets              # scan entire repo
node scripts/scan-secrets.js    # scan staged files only (pre-commit)
```

**HIGH patterns (block commit):** AWS access keys, Stripe secret keys, GitHub PATs, OpenAI/Anthropic API keys, Twilio tokens, PEM private keys.

**MEDIUM patterns (warn, don't block):** Generic `password =`, `secret =`, JWT secrets, internal IPs.

**Skip patterns:** `node_modules/`, `.next/`, `.github/workflows/`, `*.test.ts`, `*.spec.ts`, `__tests__/`, `*.example`.

### Environment Validator

```bash
pnpm check:env                  # all apps
pnpm check:env:client           # client-dashboard only
```

Validates:

- Required vars are present
- Values are not placeholder strings (e.g., `"your-secret-here"`)
- Secrets meet minimum length requirements
- Respects `SKIP_ENV_VALIDATION=true` for CI environments

### Bundle Size Guard

```bash
pnpm check:bundle               # compare vs baseline
pnpm check:bundle:update        # accept current as new baseline
pnpm check:bundle:report        # full breakdown by file
```

- **Warn** if any workspace bundle grows >10%
- **Fail** if any workspace bundle grows >25%
- Baseline stored at `scripts/.bundle-baseline.json` (gitignored)
- Reads `.next/static/chunks/` sizes

### Circular Import Detector

```bash
pnpm check:imports              # report cycles (always exits 0)
pnpm check:imports:fail         # exit non-zero if any cycles found
```

Pure static analysis — no runtime dependencies. DFS cycle detection across all TypeScript/JavaScript files. Known cycles in the codebase (settings components, packages/types cross-imports) exist; use `check:imports` for monitoring, not as a hard gate.

### TODO/FIXME Report

```bash
pnpm check:todos                # all items (TODO, FIXME, HACK, NOTE)
pnpm check:todos:fixme          # FIXMEs only
pnpm check:todos:old            # items older than 30 days
```

Output includes: file path, line number, author (from git blame), age in days. Sorted by severity: FIXME → HACK → TODO → NOTE.

JSON output for scripting:

```bash
node scripts/todos.js --json
```

### DB Schema Drift Detector

```bash
pnpm check:db-drift             # check live DB + schema hash
pnpm check:db-drift:schema      # offline schema hash check only
```

Compares current `schema.prisma` hash against baseline stored in `packages/db/prisma/.schema-hash`. Run `pnpm check:db-drift --update` to accept current schema as new baseline after a migration.

---

## Hotfix Workflow

For critical production bugs that can't wait for a feature branch cycle.

### Start a Hotfix

```bash
pnpm hotfix:start critical-auth-bug
```

- Switches to `master` and pulls latest
- Bumps patch version: `0.1.5` → `0.1.6`
- Creates branch: `hotfix/v0.1.6-critical-auth-bug`
- Adds hotfix entry to CHANGELOG `[Unreleased]`

### Develop the Fix

```bash
# Work on the fix...
git add .
git commit -m "fix(auth): resolve JWT refresh race condition"
```

### Complete the Hotfix

```bash
pnpm hotfix:done critical-auth-bug
```

- Runs `pnpm preflight` (must pass)
- Closes CHANGELOG entry
- Creates annotated git tag `v0.1.6`
- Creates GitHub PR: `hotfix/v0.1.6-critical-auth-bug → master`
- Prints push instructions

### Check Active Hotfixes

```bash
pnpm hotfix:status
```

---

## GitHub Actions

### `ci.yml` — Continuous Integration

**Trigger:** Push to any branch, PR to master.

**Jobs:** `lint`, `typecheck`, `test` — run in parallel across all workspaces.

### `deploy.yml` — Vercel Deployment

**Trigger:** Push to master.

**Deploys:** client-dashboard, admin-dashboard, marketing, resident-portal to Vercel.

### `lighthouse.yml` — Performance Audits

**Trigger:** PR to master, daily cron.

**Thresholds:** Performance ≥90, Accessibility ≥95, SEO ≥95, Best Practices ≥90.

### `release.yml` — Auto GitHub Release

**Trigger:** `git push origin v*` (version tags).

**What it does:**

1. Extracts the matching `## [0.2.0]` section from CHANGELOG.md
2. Creates a GitHub Release with that content as the body
3. Marks as pre-release if version is `0.x.x`

### `pr-labels.yml` — PR Size Labels + Affected Packages

**Trigger:** PR opened or synchronized.

**Labels applied:**

| Label     | Lines Changed |
| :-------- | :------------ |
| `size/XS` | < 10          |
| `size/S`  | 10–99         |
| `size/M`  | 100–499       |
| `size/L`  | 500–999       |
| `size/XL` | ≥ 1000        |

Also posts/updates a bot comment listing which workspace packages are affected by the PR's changed files. The comment is updated (not duplicated) on each push.

---

## AI Tool Sync

All AI tool configurations (`Claude`, `Gemini`, `Kiro`, `OpenCode`, `Qwen`, `Kilo`, `Cursor`) are kept in sync via `scripts/sync-ai-tools.sh`.

```bash
pnpm sync           # manual sync
```

**Auto-fires:** after every `git commit` (post-commit hook).

**What it syncs:**

- Ralph commands (plan, docs, version, check, hotfix, dev, ralph)
- Project context and architecture overview
- Workspace structure and conventions
- Current active plan and phase

**Source:** `.agents/` directory (or equivalent workspace config).

**Note:** `.agent/` and `.crush/` directories are intentionally excluded from sync — they are deprecated formats.

---

## Dev Onboarding

```bash
pnpm setup:dev
```

Interactive script for first-time setup. Prompts for:

1. `DATABASE_URL` — PostgreSQL connection string
2. `NEXTAUTH_SECRET` — ≥32 char random string
3. `QR_SIGNING_SECRET` — ≥32 char random string
4. `ENCRYPTION_MASTER_KEY` — ≥32 char random string

Then automatically:

- Creates `.env.local` in `apps/client-dashboard/`, `apps/admin-dashboard/`
- Runs `pnpm prisma generate`
- Runs `pnpm prisma db push`
- Runs `pnpm check:env` to validate
- Installs Husky git hooks

---

## Pre-Deploy Checklist

```bash
pnpm check:pre-deploy          # warning mode (always exits 0)
pnpm check:pre-deploy:fail     # strict mode (exits non-zero on failure)
```

Runs 5 checks in sequence:

|  #  | Check                                              | Failure Mode |
| :-: | :------------------------------------------------- | :----------- |
|  1  | Environment variables (`check:env`)                | Warn         |
|  2  | Secret scanner — full repo (`check:secrets --all`) | Warn         |
|  3  | DB schema drift (`check:db-drift`)                 | **Fail**     |
|  4  | Circular imports (`check:imports`)                 | Warn         |
|  5  | Bundle size (`check:bundle`)                       | **Fail**     |

Use `check:pre-deploy:fail` in CI pipelines to block deployments when critical checks fail.

---

## Best Workflow — Step by Step

### Starting a New Feature

```bash
# 1. Check workspace state (always start here)
pnpm ralph

# 2. If any in-progress plan → continue it first
pnpm plan:run <slug> <next-phase>

# 3. If starting new work — create a plan
pnpm plan:new payments-integration --phases 4
# → Edit docs/plan/planning/payments-integration/PROMPT_*.md files
#    Each file needs: Role, Goal, Steps, Acceptance criteria, Preferred tool

# 4. Approve the plan
pnpm plan:ready payments-integration

# 5. Start development (auto-creates branch)
pnpm plan:start payments-integration

# 6. Execute phases one by one
pnpm plan:run payments-integration 1
# → After phase 1 is done, commit fires:
#   - lint-staged → reformats staged files
#   - phase-close.js → marks [x] in PLAN file
#   - post-commit → updates CHANGELOG

pnpm plan:run payments-integration 2
pnpm plan:run payments-integration 3
pnpm plan:run payments-integration 4
# → Last phase: auto-moves to done/, updates all docs, creates PR

# 7. If not using plan:run — ship manually
pnpm plan:done payments-integration
```

### Making a Focused Fix (No Plan Needed)

```bash
# 1. Check workspace
pnpm ralph

# 2. Make your changes
git add apps/client-dashboard/src/...

# 3. Commit (hooks fire automatically)
git commit -m "fix(client): correct timezone offset in scan timestamps"
# → pre-commit: lint-staged, secret scan
# → post-commit: changelog updated, AI tools synced

# 4. Push (pre-push hook fires)
git push origin fix/scan-timestamps
# → pre-push: branch check passes, preflight runs

# 5. Open PR (or let plan automation do it)
```

### Handling a Production Bug

```bash
# 1. Start hotfix
pnpm hotfix:start login-fails-on-mobile

# 2. Fix the bug
git add . && git commit -m "fix(auth): resolve mobile SSO redirect loop"

# 3. Complete
pnpm hotfix:done login-fails-on-mobile
# → preflight → bump 0.1.0 → 0.1.1 → tag v0.1.1 → PR created

# 4. Push everything
git push origin hotfix/v0.1.1-login-fails-on-mobile
git push origin v0.1.1
# → GitHub Release auto-published
```

### Releasing a Version

```bash
# 1. Preview the release
pnpm docs:release:dry

# 2. Run the release
pnpm docs:release
# → CHANGELOG [Unreleased] closes → [0.2.0] — 2026-03-23
# → package.json bumped
# → annotated tag created

# 3. Push code + tag
git push
git push origin v0.2.0
# → GitHub Release created from CHANGELOG section
# → Vercel deploy triggered
```

---

## Troubleshooting

### Commit is blocked — secret detected

```
[HIGH] Potential secret found: STRIPE_SECRET_KEY in .env.local
```

- Remove the secret from the staged file (never commit real secrets)
- Use `.env.local` (gitignored) for local secrets
- For CI/CD, use GitHub Secrets and environment variables
- Emergency bypass (use sparingly): `SKIP_SECRET_SCAN=1 git commit -m "..."`

### Commit is blocked — commitlint fails

```
✖   type must be one of [feat, fix, chore, ...]
```

- Check the format: `type(scope): description`
- Valid types: `feat`, `fix`, `chore`, `perf`, `docs`, `refactor`, `security`, `ci`, `test`, `hotfix`
- If scope is wrong, pick the closest from the 30 valid scopes or omit it: `feat: add button`

### Push is blocked — branch name invalid

```
[pre-push] Branch name 'my-branch' does not match pattern
```

- Rename your branch: `git branch -m feat/my-feature`

### Push is blocked — preflight fails

```
[pre-push] Preflight failed. Fix errors before pushing.
```

- Run `pnpm preflight` to see which check failed
- Fix lint errors, type errors, or test failures
- Then push again

### Phase auto-close is not working

Make sure your commit message contains a recognized pattern:

```
"phase 3"          ✓
"[p3]"             ✓
"closes phase 3"   ✓
"✓ phase 3"        ✓
```

And that there is at least one plan in `docs/plan/in-progress/`.

### `pnpm plan:run` fails to move plan to done

Check that `ralph-run.js` can find the plan file at:

```
docs/plan/in-progress/<slug>/PLAN_<slug>.md
```

Run `pnpm plan:status` to verify the plan is in `in-progress` state.

### `docs:release:dry` shows wrong version

The `--dry-run` flag must work regardless of argument order. If you see issues, pass the version explicitly:

```bash
node scripts/ralph-docs.js release 0.3.0 --dry-run
```

### CHANGELOG not updating after commit

The auto-update only fires for `feat(`, `fix(`, `perf(`, `security(` commit types. For `chore:`, `docs:`, `ci:` etc., update CHANGELOG manually or run:

```bash
pnpm docs:changelog
```

### AI tools are out of sync

```bash
pnpm sync    # manually propagate to all 7 AI tools
```

Or check if `sync-ai-tools.sh` ran successfully after the last commit (check the post-commit hook output).

---

_Auto-generated by the Ralph system. For updates run: `pnpm docs:organize`_
