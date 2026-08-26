---
name: organize
description: Docs folder cleanup — scan structure, remove empty dirs and dead symlinks, rebuild docs/INDEX.md.
---

# /organize — Docs Organization

Use `/organize` to keep the `docs/` folder clean, structured, and navigable.

## Commands

```bash
pnpm docs:organize          # scan + auto-clean + rebuild INDEX.md (default)
pnpm docs:clean             # remove empty dirs + dead symlinks only
pnpm docs:index             # regenerate docs/INDEX.md (11 sections)
node scripts/ralph-organize.js scan      # audit only, no writes
node scripts/ralph-organize.js archive <path>  # move file to docs/archive/
```

## docs/ structure

```
docs/
├── arch/        🏗️  Architecture, code quality, project structure
├── core/        🧠  CLAUDE.md, GATEFLOW_CONFIG, progress dashboard
├── deployment/  🚀  Per-app deployment guides
├── design/      🎨  UI specs, screen drafts, design system notes
├── errors/      🐛  Documented bugs and resolutions
├── guides/      📖  Dev workflow, security, analytics, component guides
├── plan/        📋  Feature plans, phases, learning log, backlog
│   ├── planning/     → features being designed
│   ├── planned/      → ready to start
│   ├── in-progress/  → active development
│   └── done/         → shipped features (archive)
├── product/     📦  PRD, FEATURE_LOG, UPCOMING
├── tools/       🔧  AI tool configs reference
└── archive/     📁  Legacy docs, old PRDs
```

## When to run

- After adding/removing docs files
- After `pnpm plan:done` (clean up execution dirs)
- Weekly maintenance: `pnpm docs:organize`
- Before a release: ensures INDEX.md is current

## docs/INDEX.md

Auto-generated table of contents linking every section and file. Rebuilt on every run of `pnpm docs:organize` or `pnpm docs:index`.
