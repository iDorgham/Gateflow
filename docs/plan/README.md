# GateFlow Plan Folder (Docs v2)

The `docs/plan/` folder is the **planning workspace** for GateFlow. Use **`/man`** as the one-command orchestrator.

## Structure (Task Manager)

```text
docs/plan/
  backlog/       # Raw tasks, ideas (ALL_TASKS_BACKLOG.md)
  context/       # Refined initiatives (IDEA_<slug>.md)
  planning/      # Draft plans — /plan creates here
  planned/       # Approved plans — ready for /dev
  in-progress/   # Plans being developed
  done/          # Completed plans
  execution/     # Legacy (backward compatible)
  learning/      # Patterns, incidents, decisions
```

**Flow:** Backlog → Context → Planning → Planned → In Progress → Done

See **`docs/plan/PLAN_LIFECYCLE.md`** and **`docs/plan/ONE_MAN_CODE.md`** (One Man Code: `/man`, `/man tasks`, `/man settings`).

### context/

- `IDEA_<slug>.md` — initiative description, goals, constraints, and open questions.
- Example: `IDEA_docs_v2_refresh.md`.

Created via `/idea`.

### Plan lifecycle (planning | planned | in-progress | done)

- **planning/** — Draft plans. `/plan` creates `planning/<slug>/` with `PLAN_<slug>.md`, `PROMPT_<slug>_phase_<N>.md`, `TASKS_<slug>.md`.
- **planned/** — When you approve a plan, run `/plan ready <slug>` to move it here.
- **in-progress/** — `/dev` moves a plan from `planned/` when starting a phase.
- **done/** — `/dev` moves a plan here when the last phase is complete.

### execution/ (legacy)

- Flat structure: `PLAN_<slug>.md`, `PROMPT_<slug>_phase_<N>.md`, `TASKS_<slug>.md`.
- Still supported for backward compatibility. New plans use the lifecycle folders.

### learning/

- `patterns.md` — reusable patterns discovered while executing plans.
- `incidents.md` — planning/doc incidents and how they were resolved.
- `decisions.md` — key planning/doc decisions with rationale.

---

## How to use with Cursor

1. Run `/idea` with a short description (e.g. “Core security v6 hardening”).
2. `/plan` on the resulting IDEA file to create `planning/<slug>/PLAN_<slug>.md` and phase prompts.
3. When the plan is ready, run `/plan ready <slug>` to move it to `planned/`.
4. Run `/dev` to implement phases; `/dev` moves the plan to `in-progress/` when starting and to `done/` when finished.

Capture patterns, incidents, and decisions in `learning/` as you go.

# GateFlow Plan Directory

> [!IMPORTANT]
> **Start Here:** [**MASTER_PLAN.md**](./MASTER_PLAN.md) — The central hub for project status, roadmap, and documentation.

This directory contains the structured plan for GateFlow development and operations.

## 📁 Subdirectories

- [**Overview**](./overview/) - Progress dashboard, Readme, and development guides.
- [**Phase 1 (MVP)**](./phase-1-mvp/specs/) - Performance audits, security reviews, and PRD v5.0.
- [**Phase 2 (Resident Portal)**](./phase-2-resident-portal/specs/) - Specifications for the portal and mobile features.
- [**Phase 3 (Marketing & AI)**](./phase-3-marketing-ai/specs/) - Omni-channel marketing and AI strategy.
- [**Architecture**](./architecture/ ) - Monorepo structure, UI components, and design tokens.
- [**Operations**](./operations/ ) - Deployment guides, env vars, and security audits.
- [**Guidelines**](./guidelines/ ) - Rules for agents, skills, and required expertise.
- [**Backlog**](./backlog/ ) - Task backlog and suggested improvements.
- [**Execution**](./execution/ ) - Phased plans (`PLAN_<slug>.md`) and per-phase prompts (`PROMPT_<slug>_phase_<N>.md`).
- [**Context**](./context/ ) - Idea files (`IDEA_<slug>.md`), `PRODUCT_BRAIN.md`, and `GATEFLOW_CONFIG.md` that seed plans and backlog entries.
- [**Learning**](./learning/ ) - Long-lived learnings: `patterns.md`, `incidents.md`, `decisions.md`.

Together, **Context** (idea + product + config), **Backlog**, **Execution**, **Guidelines**, and **Learning** form the shared planning and learning “brain” for GateFlow.  
All tools (Cursor, Kiro, Antigravity, CLIs) must treat this tree as the single read/write source of truth for ideas, plans, prompts, and cross‑phase learnings.

---
[Return to Root Docs](../README.md)
