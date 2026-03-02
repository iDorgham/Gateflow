# Plan Lifecycle

Plans move through four folders as they progress from draft to completion.

## Folder Structure (Task Manager)

```text
docs/plan/
  backlog/         # Raw tasks, ideas — not yet planned
  context/         # IDEA_<slug>.md (refined initiatives)
  planning/         # Draft plans — /plan creates here
    <slug>/
      PLAN_<slug>.md
      PROMPT_<slug>_phase_<N>.md
      TASKS_<slug>.md
  planned/          # Ready for development — move when plan is approved
    <slug>/
      ...
  in-progress/      # Actively being developed — /dev moves here when starting
    <slug>/
      ...
  done/             # All phases complete — /dev moves here when finished
    <slug>/
      ...
```

## Lifecycle States

| State        | Folder        | When                                       |
|-------------|---------------|--------------------------------------------|
| **Planning**| `planning/`   | `/plan` creates or refines a plan         |
| **Planned** | `planned/`    | User approves plan ready for development   |
| **In Progress** | `in-progress/` | `/dev` starts first or next phase       |
| **Done**    | `done/`       | `/dev` completes the last phase            |

## Commands & Transitions

- **`/plan`** — Creates/updates plan in `planning/<slug>/` until you decide it's ready.
- **`/plan ready <slug>`** — Moves `planning/<slug>/` → `planned/<slug>/`.
- **`/dev`** — When starting a phase:
  - If plan is in `planned/`: move `planned/<slug>/` → `in-progress/<slug>/`.
  - Reads from `in-progress/<slug>/` (or `planned/<slug>/` if already there).
- **`/dev`** (when completing last phase) — Moves `in-progress/<slug>/` → `done/<slug>/`.

## Lookup Order

When resolving a plan by slug, check in order:

1. `in-progress/<slug>/`
2. `planned/<slug>/`
3. `planning/<slug>/`
4. `docs/plan/execution/` (legacy — flat `PLAN_<slug>.md`, `PROMPT_*`)

Legacy plans in `execution/` are treated as active (equivalent to `in-progress` or `planned`).

## Plan Bundle (per slug)

A plan bundle in any lifecycle folder contains:

- `PLAN_<slug>.md` — Phased plan with scope and deliverables.
- `PROMPT_<slug>_phase_<N>.md` — One prompt per phase.
- `TASKS_<slug>.md` — Phase checklist (updated during `/dev`).
