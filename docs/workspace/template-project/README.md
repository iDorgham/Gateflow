# Workspace Template

A reusable workspace operating system for AI-first development.
Copy this folder into any new project and run `pnpm workspace:install`.

---

## Structure

```
template-project/
├── docs/
│   ├── system/          # AI context — cache, memory, learning, ideas
│   ├── workspace/       # Workspace OS — rules, agents, skills, commands
│   ├── product/         # PRD, specs, roadmap
│   ├── arch/            # Architecture docs
│   ├── api/             # API reference
│   ├── guides/          # How-to guides
│   └── decisions/       # Architecture Decision Records (ADRs)
├── plan/
│   ├── planned/         # Approved, ready to start
│   ├── in-progress/     # Active work
│   └── done/            # Completed
├── ops-core/            # Edit here — syncs to all AI folders
│   ├── cursor/   →  .cursor/
│   ├── claude/   →  .claude/
│   ├── antigravity/  →  .antigravity/
│   ├── gemini/   →  .gemini/
│   └── opencode/ →  .opencode/
└── scripts/             # All automation
```

---

## Quick Start

```bash
pnpm install
pnpm workspace:install    # guided setup: name, slug, branch
pnpm cache:build          # auto-scan project → WORKSPACE_INDEX.md
pnpm memory:init          # create AI memory starter files
pnpm docs:index           # generate docs/README.md
pnpm template:validate    # confirm everything is wired
```

---

## Scripts

| Command                   | What it does                                                   |
| ------------------------- | -------------------------------------------------------------- |
| `pnpm workspace:install`  | Interactive scaffolder — creates all folders and starter files |
| `pnpm workspace:upgrade`  | Diff installed version against current template                |
| `pnpm ai:sync`            | Copy ops-core/ → AI folders (merge strategy)                   |
| `pnpm ai:check`           | Fail CI if AI folders drift from ops-core/                     |
| `pnpm cache:build`        | Scan project → auto-generate WORKSPACE_INDEX.md                |
| `pnpm cache:check`        | Report stale cache files by TTL                                |
| `pnpm memory:init`        | Create docs/system/memory/ starter files                       |
| `pnpm docs:index`         | Regenerate docs/README.md from folder structure                |
| `pnpm template:validate`  | Validate required structure and content                        |
| `pnpm template:bootstrap` | Validate + report pending checklist items                      |

---

## Rule: Edit only in ops-core/

Never edit `.cursor/`, `.claude/`, `.antigravity/`, `.gemini/`, or `.opencode/` directly.
Edit `ops-core/` then run `pnpm ai:sync`. CI enforces this via `pnpm ai:check`.

---

## Key Docs

- `docs/workspace/QUICKSTART.md` — fastest path to get started
- `docs/workspace/PRD.md` — fill this first with your product requirements
- `docs/workspace/POST_INSTALL_CHECKLIST.md` — readiness checklist
- `docs/README.md` — auto-generated docs index
