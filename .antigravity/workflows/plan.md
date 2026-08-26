---
name: plan
description: Turn draft or FOR_PLAN_PROMPT into phased PLAN_<slug>.md, TASKS_<slug>.md, and per-phase prompts under docs/plan/Draft/<slug>/.
---

# /plan — Phased Plan Generation

Render Workflow v2 responses with
`.agents/contracts/GUIDE_RESPONSE_CONTRACT.md`.

## Workflow v2 gate

Before planning, run `workflow-v2 status --json`. Require one focused app at
stage `audited`, fresh audit/page-score evidence, and no phase scoped to another
application. Convert only approved scored gaps into ordered phases. Every phase
must name its app scope, pilot step, page acceptance criteria, security
boundaries, tests, and required shared-package changes. Planning never
implements code. After valid artifacts exist, transition with
`workflow-v2 transition planned`.

Use **`/plan <slug>`** after **`/draft`** and **`/prompt`** to produce a formal phased plan.

## Inputs

- `docs/plan/Draft/<slug>/DRAFT_<slug>.md`
- `docs/plan/Draft/<slug>/FOR_PLAN_PROMPT.md` (from `/prompt <slug>`)
- Optional: `docs/development/initiatives/IDEA_<slug>.md`

## Outputs (under `docs/plan/Draft/<slug>/`)

- **`PLAN_<slug>.md`** — phases, goals, acceptance overview
- **`TASKS_<slug>.md`** — checklist per phase
- **`phases/NN_<title>/PROMPT_phase_NN.md`** — one prompt per phase (TDD, role, acceptance criteria)
- Optional: **`CONTEXT_<slug>.md`**, **`SESSION_MEMORY.md`** when plan template requires

Use templates under `docs/development/plan-templates/` and `docs/development/guidelines/TEMPLATE_PROMPT_phase.md`.

## Subcommands

| Subcommand               | Purpose                                                                    |
| ------------------------ | -------------------------------------------------------------------------- |
| **`/plan <slug>`**       | Generate or refresh plan artifacts from draft/prompt                       |
| **`/plan ready <slug>`** | Move `docs/plan/Draft/<slug>/` → `docs/plan/Ready/<slug>/`; update backlog |
| **`/plan phase <n>`**    | Regenerate or add prompt for phase N only                                  |

## Rules

- Plans start in **`Draft/`** until **`/plan ready`**.
- Update **`docs/plan/backlog/ALL_TASKS_BACKLOG.md`** when status changes.
- Do not implement code here — use **`/dev`** for execution.
- Adopt **`planning`** agent role; load **`gf-strategist`** / architecture skills when scope is large.

## Lifecycle

Draft → Ready → Active (on first `/dev`) → Complete (last phase done). See `docs/development/PLAN_LIFECYCLE.md`.

## Related

- **`/prompt <slug>`** — builds `FOR_PLAN_PROMPT.md`
- **`/dev`** — execute one phase
- **`/guide`** — next step when unsure
