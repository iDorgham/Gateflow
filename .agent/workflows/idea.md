---
name: idea
description: Capture and refine GateFlow initiatives into IDEA_<slug>.md and backlog entries.
---

# /idea — Capture & Refine Initiatives

Use `/idea` to turn a fuzzy request into a well-scoped initiative plus backlog entries, following the GateFlow God Mode plan.

## What `/idea` does

- Reads core context:
  - `CLAUDE.md`
  - `docs/plan/context/README.md`
  - `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
  - Relevant specs (e.g. `docs/plan/phase-1-mvp/specs/PRD_v5.0.md`, `docs/plan/phase-2-resident-portal/specs/RESIDENT_PORTAL_SPEC.md`)
- Conversationally refines:
  - Goals, constraints, metrics, and success criteria
  - Scope vs. out-of-scope work
- Writes/updates:
  - `docs/plan/context/IDEA_<slug>.md` for this initiative
  - A section in `docs/plan/backlog/ALL_TASKS_BACKLOG.md` linked to that IDEA

## How to use it

- `/idea` — Refine the current default idea for this repo using recent context.
- `/idea new` — Start a completely new initiative; propose a slug and create `IDEA_<slug>.md`.
- `/idea <slug>` — Continue refining an existing idea file.

## Implementation notes (for agents)

- Treat `docs/plan/context/IDEA_<slug>.md` and `docs/plan/backlog/ALL_TASKS_BACKLOG.md` as the **only** persistence layer for ideas/backlog.
- Keep ideas high level; detailed execution belongs in `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md` created by `/plan`.
- Follow skills:
  - `.cursor/skills/gf-planner/SKILL.md` for plan-oriented questions.
  - `.cursor/skills/gf-dev/SKILL.md` for commands/workflows.
  - `.cursor/skills/superdesign/SKILL.md` when the idea is primarily UI/UX.

# Idea

Capture and refine product ideas into structured IDEA docs and backlog entries.

## Purpose

- Turn loose goals into clear, constrained initiatives.
- Write or update `docs/plan/context/IDEA_<slug>.md`.
- Ensure `docs/plan/backlog/ALL_TASKS_BACKLOG.md` has a section for the idea.

## When to use

- You have a new feature/epic in mind and need to shape it.
- You want to refine or de-scope an existing initiative before planning phases.
- You want to ensure an idea is captured consistently across tools (Cursor, CLIs, other IDEs).

## Workflow

1. Load repo context: `CLAUDE.md`, `docs/PRD_v5.0.md`, relevant specs in `docs/`.
2. Talk through goals, constraints, metrics, and risks.
3. Save or update `IDEA_<slug>.md` under `docs/plan/context/`.
4. Add or update the corresponding section in `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.

## Usage

- `/idea` — refine the current default idea for the repo.
- `/idea new` — start a completely new idea (choose a new `<slug>`).
- `/idea <slug>` — continue working on an existing `IDEA_<slug>.md`.

## /idea — Idea refinement & capture

**Purpose:** Turn a raw idea or in-progress project into a sharp, executable concept, then automatically capture it into planning docs for later `/plan` and `/ship`.

### What this command does

- **Refines the idea** with a back-and-forth conversation, using GateFlow skills and role agents.
- **Understands the context** (existing code, docs, constraints, markets).
- **Improves the idea** for product success (MVP slice, scope, risks, metrics).
- **Captures the result** into structured planning docs that other commands can use.

### Flow (high level)

1. **Load core context**
   - `CLAUDE.md`
   - `docs/PRD_v5.0.md`
   - `docs/plan/backlog/ALL_TASKS_BACKLOG.md` (if it exists)
2. **Invoke skills**
   - `gf-planner` for phased thinking
   - `gf-dev` for feasibility and stack fit
   - `superdesign` when the idea is UI/UX heavy
3. **Adopt role agents**
   - Primary: planning + architecture
   - Optional: security, backend, mobile, i18n depending on the idea
4. **Have a conversation**
   - Ask clarifying questions
   - Propose improvements and alternatives
   - Check against GateFlow constraints (multi-tenancy, QR security, pnpm-only, etc.)
5. **When the user says the idea is “good enough”**
   - Create `docs/plan/context/IDEA_<name>.md` with:
     - Problem, vision, constraints, existing assets
     - Success criteria and metrics
     - Open questions and risks
   - Update or create a section in `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
   - Optionally create `docs/plan/execution/PLAN_<name>_draft.md` as input for `/plan`

### How this connects to other commands

- `/plan` uses `IDEA_<name>.md` (and optional `PLAN_<name>_draft.md`) to build a full multi-phase plan and per‑phase prompts.
- `/dev` and `/ship` never re‑ask the “what are we building?” questions — they consume the captured idea and plan.

