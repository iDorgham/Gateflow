# NOTEBOOKLM SOURCE 4: GateFlow Phased Plans, Development Lifecycle & Workflow v2

## 1. Development Methodology & Phased Planning Framework

GateFlow enforces a structured, phase-driven development process designed for AI-assisted and multi-agent pair-programming.

### Initiative Lifecycle Stages (`docs/plan/`)

All technical initiatives move sequentially through strict folder stages:

1. **`Draft/` (`docs/plan/Draft/<slug>/`):** Initial feature proposal (`DRAFT_<slug>.md`) or initiative breakdown (`IDEA_<slug>.md`).
2. **`Ready/` (`docs/plan/Ready/<slug>/`):** Approved phased implementation plan (`PLAN_<slug>.md`), phase prompt files (`PROMPT_<slug>_phase_<N>.md`), and task checklists (`TASKS_<slug>.md`).
3. **`Active/` (`docs/plan/Active/<slug>/`):** Currently executing implementation phase.
4. **`Complete/` (`docs/plan/Complete/<slug>/`):** Fully implemented, verified, and merged initiative.

---

## 2. Phase Execution Protocol (`/dev` Command)

Each implementation phase follows a standardized execution loop:

1. **Pre-flight Check:** Verify branch status and ensure baseline repository builds without errors.
2. **Context Resolution:** Load specific phase instructions from `PROMPT_<slug>_phase_<N>.md`.
3. **Test-Driven / Focused Implementation:** Apply changes to target apps or packages without modifying out-of-scope files.
4. **Verification:** Run targeted linting, type-checking, and tests (`pnpm turbo test --filter=<target-app>`).
5. **Git Commit & Tagging:** Create conventional commit (`feat(<slug>): complete phase <N>`) and tag phase completion.
6. **Lifecycle Transition:** Move plan directory upon final phase completion to `Complete/`.

---

## 3. Backlog & Initiative Tracking

All active, upcoming, and completed tasks are tracked centrally in `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
This is a required manual step, not automatic: after moving a plan between `Draft/`, `Ready/`, `Active/`, and `Complete/`, update `ALL_TASKS_BACKLOG.md` (paths and status) so it — and the `/guide` and `/man` workflows that read it — stay aligned with the filesystem layout.
