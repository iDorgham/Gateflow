# GateFlow Plan Folder (Docs v2)

The `docs/plan/` folder is the **planning workspace** for GateFlow. It is populated exclusively via `/idea`, `/plan`, `/dev`, and `/ship` flows.

## Structure

```text
docs/plan/
  context/     # Ideas and initiative briefs (IDEA_<slug>.md)
  execution/   # Plans and phase prompts (PLAN_<slug>.md, PROMPT_<slug>_phase_<N>.md)
  learning/    # Cross-initiative patterns, incidents, and decisions
```

### context/

- `IDEA_<slug>.md` — initiative description, goals, constraints, and open questions.
- Example: `IDEA_docs_v2_refresh.md`.

Created via `/idea`.

### execution/

- `PLAN_<slug>.md` — phased plan for an initiative.
- `PROMPT_<slug>_phase_<N>.md` — pro prompts for each phase, based on `.cursor/templates/TEMPLATE_PROMPT_phase.md`.
- Example: `PLAN_docs_v2_refresh.md`.

Created via `/plan` (plans) and `/dev` (phase prompts).

### learning/

- `patterns.md` — reusable patterns discovered while executing plans.
- `incidents.md` — planning/doc incidents and how they were resolved.
- `decisions.md` — key planning/doc decisions with rationale.

---

## How to use with Cursor

1. Run `/idea` with a short description (e.g. “Core security v6 hardening”).
2. `/plan` on the resulting IDEA file to create `PLAN_<slug>.md` and identify phases.
3. For each phase, generate a `PROMPT_<slug>_phase_<N>.md` using `.cursor/templates/TEMPLATE_PROMPT_phase.md`.
4. Run `/dev` with the phase prompt to implement and update docs/code.

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
