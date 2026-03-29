# Scripts

All workspace automation scripts. Run from `template-project/`.

## Workspace Setup

```bash
pnpm workspace:install    # guided interactive setup for new project
pnpm workspace:upgrade    # diff template version vs installed, show changes
```

## AI Folder Sync

```bash
pnpm ai:sync              # ops-core/ → .cursor/.claude/.antigravity/.gemini/.opencode
pnpm ai:check             # fail if AI folders drift from ops-core/
```

## Cache

```bash
pnpm cache:build          # scan project → docs/system/cache/WORKSPACE_INDEX.md
pnpm cache:check          # report stale files by TTL
```

## Memory & Docs

```bash
pnpm memory:init          # create docs/system/memory/ starter files
pnpm docs:index           # regenerate docs/README.md index
```

## Validation

```bash
pnpm template:validate    # check required structure + content
pnpm template:bootstrap   # validate + report pending checklist items
```

---

## File Map

| File                    | pnpm command         |
| ----------------------- | -------------------- |
| `install.js`            | `workspace:install`  |
| `upgrade.js`            | `workspace:upgrade`  |
| `sync-ai-folders.js`    | `ai:sync`            |
| `check-ai-drift.js`     | `ai:check`           |
| `cache-build.js`        | `cache:build`        |
| `cache-check.js`        | `cache:check`        |
| `memory-init.js`        | `memory:init`        |
| `docs-index.js`         | `docs:index`         |
| `template-validate.js`  | `template:validate`  |
| `bootstrap-template.sh` | `template:bootstrap` |
