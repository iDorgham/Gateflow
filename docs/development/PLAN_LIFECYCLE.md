# GateFlow — Plan lifecycle

**Canonical folder layout:** `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`

## States

| State    | Folder                       | Typical command           |
| -------- | ---------------------------- | ------------------------- |
| Draft    | `docs/plan/Draft/<slug>/`    | `/plan <slug>`            |
| Ready    | `docs/plan/Ready/<slug>/`    | `/plan ready <slug>`      |
| Active   | `docs/plan/Active/<slug>/`   | `/dev` (moves from Ready) |
| Complete | `docs/plan/Complete/<slug>/` | `/dev` after last phase   |

## Transitions

See `.antigravity/commands-ref/plan-move.md` for shell-style moves. The **entire** plan directory (including `phases/`, `context/`, `phase_logs/`, `assets/`) moves together.

## Older archived plans

Completed initiatives live under `docs/plan/Complete/<slug>/` (same shape as Ready/Active). Very old plans may still use flat `PROMPT_<slug>_phase_N.md` next to `PLAN_<slug>.md` inside that folder; new work should use `phases/NN_<title>/PROMPT_phase_NN.md` only.

**`docs/plan/execution/`** has been removed. Use **`/draft`** → **`/plan`** → lifecycle folders for new work.
