# GateFlow Plan Folder

<div align="center">

**Planning workspace for GateFlow initiatives**

_Driven by the `/idea` → `/plan` → `/dev` → `/guide` workflow_

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](#)
[![Ralph Loop](https://img.shields.io/badge/Automation-Ralph-orange?style=for-the-badge)](#)

</div>

---

## Directory Structure

```
docs/plan/
├── backlog/          # Raw unplanned tasks and quick-captures
├── context/          # Initiative ideas (IDEA_<slug>.md) — created by /idea
├── planning/         # Active plans being drafted
├── planned/          # Plans approved and ready for execution
├── in-progress/      # Plans currently being executed
├── done/             # Completed plans (read-only historical record)
├── learning/         # Cross-phase patterns, incidents, decisions
├── guidelines/       # Workflow and methodology guides
└── execution/        # Legacy flat plan files (backward compatible)
```

---

## Folder Details

### `context/`

Initiative idea files (`IDEA_<slug>.md`) — goals, constraints, open questions.
Created via `/idea`. Example: `context/IDEA_docs_v2_refresh.md`.

### `planning/`

Active and upcoming plans. Each initiative gets a subfolder:

```
planning/<slug>/
  PLAN_<slug>.md              # Phase breakdown and scope
  PROMPT_<slug>_phase_<N>.md  # Phase prompt for /dev
  TASKS_<slug>.md             # Phase checklist
```

### `done/`

Completed plan folders. Structure mirrors `planning/`. Read-only historical record.

### `backlog/`

Raw task captures. Use `/man tasks add "Title"` for quick adds, or create `quick-YYYY-MM-DD.md` files.

### `learning/`

Cross-plan learning docs:

- `patterns.md` — recurring patterns
- `incidents.md` — issues and resolutions
- `decisions.md` — architectural decisions
- `CLI_*.md` — CLI tracking

### `guidelines/`

Workflow and methodology reference:

- `PLAN_LIFECYCLE.md` — full lifecycle documentation
- `ONE_MAN_*.md` — one-man SaaS workflow guides
- `PHASED_DEVELOPMENT_WORKFLOW.md` — process guides

### `execution/` (legacy)

Flat plan files for backward compatibility. New plans use `planning/<slug>/`.

---

## Workflow

| Command               | Creates                                                 |
| :-------------------- | :------------------------------------------------------ |
| `/idea "description"` | `context/IDEA_<slug>.md`                                |
| `/plan <slug>`        | `planning/<slug>/` with PLAN + PROMPT + TASKS           |
| `/plan ready <slug>`  | Moves to `planned/<slug>/`                              |
| `/dev <slug> <N>`     | Executes phase N; moves to `in-progress/`, then `done/` |
| `/ship <slug>`        | Executes all remaining phases end-to-end                |
| `/guide`              | Shows active plan, next phase, recommendations          |
| `/man`                | One-command orchestrator + task manager                 |

---

## Plan Lifecycle

```
planning/<slug>/  →  planned/<slug>/  →  in-progress/<slug>/  →  done/<slug>/
   (/plan)              (/plan ready)        (/dev starts)        (/dev last phase)
```

---

## Kiro Hooks (Commands)

| Hook file            | Command      | Purpose                      |
| :------------------- | :----------- | :--------------------------- |
| `cmd-idea.json`      | `/idea`      | Capture & refine initiative  |
| `cmd-plan.json`      | `/plan`      | Create phased plan + prompts |
| `cmd-dev.json`       | `/dev`       | Execute one phase            |
| `cmd-ship.json`      | `/ship`      | Execute all phases           |
| `cmd-man.json`       | `/man`       | Orchestrator + task manager  |
| `cmd-guide.json`     | `/guide`     | Workspace status report      |
| `cmd-clis-team.json` | `/clis-team` | Multi-CLI team runner        |

---

<div align="center">

[Return to Docs Root](../README.md) · [Automation Guide](../guides/AUTOMATION_GUIDE.md)

</div>
