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
/dev <slug> <N>             → executes phase N; mark done in TASKS
/guide                      → shows active plan, next phase, recommendations
```

When all phases in a plan are complete, move the folder:
```bash
git mv docs/plan/planning/<slug> docs/plan/done/<slug>
```

---

[Return to Docs Root](../README.md)
