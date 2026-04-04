# Phase 3: Plan Folder Cleanup & Alignment

## Primary role

CONTENT / DX

## Preferred tool

- [x] Cursor (default)

## Context

- **Project**: GateFlow Docs v2
- **Refs**:
  - `docs/plan/` — current state has: backlog/, context/, done/, execution/, in-progress/, learning/, MAN*WORKFLOW.md, ONE_MAN*\*.md, PLAN_LIFECYCLE.md, planned/, planning/, PLANNING_ENHANCEMENTS.md, README.md, VIBE_CODER_WORKFLOW.md
  - Target: `context/`, `planning/`, `done/`, `learning/` as the main active dirs
  - `docs/plan/Complete/` — PLAN_docs_v2_refresh.md and PROMPT files live here

## Goal

Tidy the `docs/plan/` tree so it matches the target structure from the IDEA: minimal, nav-friendly, and machine-readable for `/guide` and `/dev`.

## Scope (in)

- **`docs/plan/README.md`** — update (or create) to explain the folder layout:
  - `context/` — initiative ideas (IDEA\_\*.md)
  - `planning/` — plans being drafted (PLAN*\*.md + PROMPT*_.md + TASKS\__.md)
  - `done/` — completed plans (moved here after all phases pass)
  - `learning/` — patterns, incidents, decisions, CLI tracking
  - `backlog/` — raw unplanned tasks
- **Completed plans still in `planning/`** — Move to `done/` (they have all phases complete):
  - `dashboard_polish/`
  - `watchlist_ui/`
  - `qr_create_wizard/`
  - `crm_followups/`
  - `ai_assistant_v2/`
- **ONE*MAN*\*.md and workflow files** — These are not plan files; move to a `docs/development/plan-guides/` subfolder or to `docs/archive/plan-legacy/`. Do not delete.
- **`docs/plan/Complete/`** — Confirm PLAN_docs_v2_refresh.md and all 4 PROMPT files exist here. This directory can also hold future plans.

## Steps (ordered)

1. Move completed plan folders from `docs/plan/Draft/` to `docs/plan/Complete/`:
   - `dashboard_polish/`, `watchlist_ui/`, `qr_create_wizard/`, `crm_followups/`, `ai_assistant_v2/`
2. Move `ONE_MAN_*.md`, `MAN_WORKFLOW.md`, `VIBE_CODER_WORKFLOW.md`, `PLAN_LIFECYCLE.md`, `PLANNING_ENHANCEMENTS.md` to `docs/development/plan-guides/` (new subfolder).
3. Update (or create) `docs/plan/README.md` with an accurate directory map and one-line descriptions.
4. Confirm `docs/plan/Complete/docs_v2_refresh/PLAN_docs_v2_refresh.md` and `PROMPT_docs_v2_refresh_phase_*.md` exist (or are in `planning/docs_v2_refresh/`).
5. Commit: `docs: clean up plan folder — move done plans, reorganise workflow files (phase 3)`.

## Acceptance criteria

- [ ] Completed plans are in `done/` not `planning/`.
- [ ] `docs/plan/README.md` accurately reflects the folder layout.
- [ ] `ONE_MAN_*.md` workflow files are out of the root of `docs/plan/`.
- [ ] `docs/plan/Draft/` contains only in-progress or upcoming plans.
