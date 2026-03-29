# Scripts

Source: `scripts/`

## Workspace Setup

| Script       | Command                  | What it does                                           |
| ------------ | ------------------------ | ------------------------------------------------------ |
| `install.js` | `pnpm workspace:install` | Interactive scaffolder — guided setup for new projects |
| `upgrade.js` | `pnpm workspace:upgrade` | Diff installed template vs current, show what changed  |

## AI Folder Sync

| Script               | Command         | What it does                                                        |
| -------------------- | --------------- | ------------------------------------------------------------------- |
| `sync-ai-folders.js` | `pnpm ai:sync`  | Merge ops-core/ into .cursor/.claude/.antigravity/.gemini/.opencode |
| `check-ai-drift.js`  | `pnpm ai:check` | Fail if AI folders differ from ops-core/ source                     |

## Cache

| Script           | Command            | What it does                                    |
| ---------------- | ------------------ | ----------------------------------------------- |
| `cache-build.js` | `pnpm cache:build` | Scan project → auto-generate WORKSPACE_INDEX.md |
| `cache-check.js` | `pnpm cache:check` | Report stale cache files by TTL frontmatter     |

## Memory & Docs

| Script           | Command            | What it does                                              |
| ---------------- | ------------------ | --------------------------------------------------------- |
| `memory-init.js` | `pnpm memory:init` | Create docs/system/memory/ starter files (safe to re-run) |
| `docs-index.js`  | `pnpm docs:index`  | Auto-regenerate docs/README.md from folder structure      |

## Validation

| Script                  | Command                   | What it does                              |
| ----------------------- | ------------------------- | ----------------------------------------- |
| `template-validate.js`  | `pnpm template:validate`  | Check required structure and content      |
| `bootstrap-template.sh` | `pnpm template:bootstrap` | Validate + report pending checklist items |
