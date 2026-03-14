# GateFlow Plan Folder (Docs v2)

The `docs/plan/` folder is the **planning workspace** for GateFlow initiatives. All plans are driven by the `/idea` → `/plan` → `/dev` → `/guide` workflow.

## Directory Structure

```text
docs/plan/
  context/       # Initiative ideas (IDEA_<slug>.md) — created by /idea
  planning/      # Active plans being executed (PLAN, PROMPT, TASKS files)
  done/          # Completed plans (all phases passed)
  backlog/       # Raw unplanned tasks and quick-captures
  learning/      # Cross-phase patterns, incidents, decisions, CLI tracking
  guides/        # Workflow and methodology guides (ONE_MAN_*.md, PLAN_LIFECYCLE.md, etc.)
  execution/     # Legacy flat plan files (backward compatible)
```

## Folder Details

### `context/`
Initiative idea files (`IDEA_<slug>.md`) — goals, constraints, open questions.
Created via `/idea`. Example: `context/IDEA_docs_v2_refresh.md`.

### `planning/`
Active and upcoming plans. Each initiative gets a subfolder:
```
planning/<slug>/
  PLAN_<slug>.md              # Phase breakdown and scope
  PROMPT_<slug>_phase_<N>.md  # Pro prompt per phase (for /dev)
  TASKS_<slug>.md             # Phase checklist (tracked by /guide)
```
Created by `/plan`. Moved to `done/` when all phases complete.

### `done/`
Completed plan folders. Structure mirrors `planning/`. Treated as **read-only historical record**.

### `backlog/`
Raw task captures. Use `/man tasks add "Title"` for quick adds, or create `quick-YYYY-MM-DD.md` files.

### `learning/`
Cross-plan learning docs — updated after significant phases:
- `patterns.md` — recurring patterns and conventions.
- `incidents.md` — issues encountered and how they were resolved.
- `decisions.md` — key architectural/planning decisions with rationale.
- `CLI_TOOL_MEMORY.md`, `CLI_USAGE_AND_RESULTS.md`, `CLI_LIMITS_TRACKING.md` — CLI tracking.

### `guides/`
Workflow and methodology reference files:
- `PLAN_LIFECYCLE.md` — full plan lifecycle documentation.
- `ONE_MAN_*.md` — one-man SaaS workflow guides (brand, code, marketing, etc.).
- `VIBE_CODER_WORKFLOW.md`, `PLANNING_ENHANCEMENTS.md` — process guides.

### `execution/` (legacy)
Flat plan files for backward compatibility. New plans use `planning/<slug>/`.

## Workflow

```
/idea "description"         → creates context/IDEA_<slug>.md
/plan <slug>                → creates planning/<slug>/ with PLAN + PROMPT + TASKS
/plan ready <slug>          → moves planning/<slug>/ → planned/<slug>/
/dev <slug> <N>             → executes phase N; moves to in-progress/, then done/
/ship <slug>                → executes all remaining phases end-to-end
/guide                      → shows active plan, next phase, recommendations
/man                        → one-command orchestrator + task manager
/clis-team seo|refactor|audit → run a multi-CLI team for a task
```

## Kiro Hooks (Commands)

All commands are available as Kiro hooks in `.kiro/hooks/`:

| Hook file | Command | Purpose |
|-----------|---------|---------|
| `cmd-idea.json` | `/idea` | Capture & refine initiative |
| `cmd-plan.json` | `/plan` | Create phased plan + prompts |
| `cmd-dev.json` | `/dev` | Execute one phase |
| `cmd-ship.json` | `/ship` | Execute all phases |
| `cmd-man.json` | `/man` | Orchestrator + task manager |
| `cmd-guide.json` | `/guide` | Workspace status report |
| `cmd-clis-team.json` | `/clis-team` | Multi-CLI team runner |

## Plan Lifecycle

```
planning/<slug>/  →  planned/<slug>/  →  in-progress/<slug>/  →  done/<slug>/
   (/plan)           (/plan ready)         (/dev starts)          (/dev last phase)
```

---

[Return to Docs Root](../README.md)
