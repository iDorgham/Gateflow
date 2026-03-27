# Workspace Automations

This document summarizes all workspace automation layers: local hooks, scripts, Ralph Loop, and GitHub Actions.

## Local Automation

### Husky Hooks (`.husky/`)

- `pre-commit` - secret scan + lint-staged + schema guards.
- `commit-msg` - conventional commit enforcement.
- `post-commit` - docs/update automation hooks.
- `pre-push` - branch policy + preflight checks.
- `post-merge` - post-merge maintenance actions.

### Script Automation (`scripts/*.js`)

- Ralph core: `ralph.js`, `ralph-plan.js`, `ralph-run.js`, `ralph-docs.js`, `ralph-organize.js`, `ralph-version.js`, `ralph-hotfix.js`, `ralph-git.js`, `ralph-prioritize.js`, `ralph-skill-discover.js`
- Quality/security: `check-security.js`, `scan-secrets.js`, `enforce-security-invariants.js`, `check-imports.js`, `check-db-drift.js`, `check-bundle-size.js`, `check-env.js`, `pre-deploy.js`
- Docs/changelog: `check-changelog.js`, `format-changelog.js`
- Utilities: `phase-close.js`, `setup-dev.js`, `todos.js`

## GitHub Automation

### Actions Workflows (`.github/workflows/`)

- `ci.yml` - setup, lint, typecheck, tests, security scan, performance budget, summary gate.
- `deploy.yml` - multi-app Vercel deployment + DB migrate gate.
- `release.yml` - release generation on `v*` tags from changelog entries.
- `pr-labels.yml` - PR size labels + affected packages comment automation.
- `lighthouse.yml` - Lighthouse CI audits and PR score reporting.
- `sync-ai-tools.yml` - sync AI tool configs/log when source config changes.
- `codeql-analysis.yml` - scheduled and PR/push static security scanning.
