# Phase 4: Extended Guides Review & Learning Docs Curation

## Primary role
CONTENT / DX

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow Docs v2
- **Refs**:
  - `docs/guides/SCANNER_OPERATIONS.md` — exists
  - `docs/guides/RESIDENT_EXPERIENCE.md` — exists
  - `docs/plan/learning/patterns.md`, `incidents.md`, `decisions.md` — exist but may be sparse
  - `docs/PRD_v7.0.md` — canonical source for Phase 2 features

## Goal
Review and update the two extended guides so they accurately reflect PRD v6. Curate the learning docs with at least the top patterns and decisions from the project so far.

## Scope (in)
- **`SCANNER_OPERATIONS.md`**:
  - Confirm guard flows, gate assignment, offline mode, HMAC verification, and supervisor override are covered.
  - Add a **"Watchlist matching"** section explaining how scanner uses the watchlist at scan time (server-side flag in validate response).
  - Add a **"Offline mode"** summary: AES-256 queue, PBKDF2 key, LWW sync, scanUuid dedup.
- **`RESIDENT_EXPERIENCE.md`**:
  - Mark Phase 2 (Resident Portal) items as "Planned — Q3–Q4 2026" clearly.
  - Confirm the `Unit`, `VisitorQR`, `AccessRule`, `ResidentLimit` data models described match the schema plan in `PRD_v7.0.md`.
  - Remove any sections that describe features not yet started as if they were complete.
- **`docs/plan/learning/patterns.md`**:
  - Add at least 5 cross-cutting patterns discovered during dashboard_polish, watchlist_ui, crm_followups. Examples:
    - `PageHeader` + `FilterBar` — unified component approach for all pages.
    - Server-side search with 300ms debounce — preferred over client-side filter for scalability.
    - Soft deletes — always filter `deletedAt: null`, never hard delete.
    - Multi-tenancy — every query must include `organizationId`.
    - `NativeSelect` for icon-prefixed dropdowns in filter bars.
- **`docs/plan/learning/decisions.md`**:
  - Add at least 3 decisions made this session, e.g.:
    - `PageHeader` extracted as shared component instead of per-page styles.
    - `FilterBar` composable sub-components over a single monolithic filter.
    - Stats row computed from full list on initial load to avoid search-result distortion.

## Steps (ordered)
1. Read `SCANNER_OPERATIONS.md`. Add "Watchlist matching" and "Offline mode" sections if missing.
2. Read `RESIDENT_EXPERIENCE.md`. Add "Planned" markers to Phase 2 items; remove any completed-sounding prose for unbuilt features.
3. Open `docs/plan/learning/patterns.md`. Append 5+ new patterns (use today's session as source).
4. Open `docs/plan/learning/decisions.md`. Append 3+ recent decisions.
5. Commit: `docs: update scanner/resident guides, curate learning docs (phase 4)`.

## Acceptance criteria
- [ ] `SCANNER_OPERATIONS.md` covers watchlist matching and offline queue behaviour.
- [ ] `RESIDENT_EXPERIENCE.md` clearly marks Phase 2 features as "Planned".
- [ ] `patterns.md` has ≥ 5 entries (new or existing).
- [ ] `decisions.md` has ≥ 3 entries (new or existing).
