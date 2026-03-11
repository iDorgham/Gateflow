# Phase 1: Baseline Audit & README Update

## Primary role
CONTENT / DX

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow Docs v2
- **Refs**:
  - `docs/README.md` — exists but says guides are "upcoming" (they already exist)
  - `docs/PRD_v6.0.md` — canonical PRD (exists)
  - `docs/guides/` — ARCHITECTURE, SECURITY_OVERVIEW, DEVELOPMENT_GUIDE, ENVIRONMENT_VARIABLES, SCANNER_OPERATIONS, RESIDENT_EXPERIENCE + others
  - `docs/archive/plan-legacy/` — legacy docs (exists)

## Goal
Bring `docs/README.md` in sync with the actual current state, confirm `PRD_v6.0.md` is the single canonical PRD, and verify the archive boundary is clean. No code changes.

## Scope (in)
- **Update `docs/README.md`**:
  - Remove the "Upcoming, via the Docs v2 refresh plan" section — those guides already exist.
  - Add a complete **"What's in `docs/guides/`"** section listing all current guides with a one-line description each.
  - Confirm the legacy docs pointer (`docs/archive/plan-legacy/**`) is accurate.
  - Add a **"How to contribute docs"** note: PRD changes go in `PRD_v6.0.md`; new initiatives start with `/idea` → `/plan` → `/dev`.
- **Validate PRD**: Open `docs/PRD_v6.0.md` and confirm it does not reference a v5 PRD as "current" or contain unresolved TODOs that would mislead a new reader.
- **Confirm archive boundary**: Spot-check `docs/archive/plan-legacy/` contains old v1/v5 plan docs and none of those older docs are duplicated in the live `docs/` tree.

## Steps (ordered)
1. Open `docs/README.md`. Rewrite the "What to read first" and guides sections to reflect the full, current `docs/guides/` inventory.
2. Remove the "Upcoming" block; replace with an accurate guides list (table format: Guide | Purpose).
3. Add a short "Contributing to docs" section at the bottom of the README.
4. Open `docs/PRD_v6.0.md`, scan first 50 and last 50 lines for any unresolved TODOs or v5 cross-references. Note any found — no changes required if clean.
5. Confirm `docs/archive/plan-legacy/` has at least the old `PRD_v5.0.md` or equivalent. No moves needed unless something is obviously misplaced.
6. Commit: `docs: update README to reflect current docs/guides inventory (phase 1)`.

## Acceptance criteria
- [ ] `docs/README.md` accurately lists all guides in `docs/guides/` with descriptions.
- [ ] No "upcoming" or future-tense references to guides that already exist.
- [ ] PRD_v6.0.md has no unresolved `TODO:` markers visible in a quick scan.
- [ ] Archive boundary confirmed — no duplication of legacy docs in live tree.
