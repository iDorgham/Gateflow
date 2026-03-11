# TASKS: Docs v2 Refresh (PRD v6 Aligned)

**Plan**: [PLAN_docs_v2_refresh.md](PLAN_docs_v2_refresh.md)
**Status**: Ready

## Phases

- [x] **Phase 1: Baseline Audit & README Update**
  - [x] `docs/README.md` updated — remove "upcoming" block, list all current guides
  - [x] `docs/PRD_v6.0.md` scanned — one historical v5 ref at line 735 (correct, not stale)
  - [x] Archive boundary confirmed — plan-legacy + root-legacy, no duplication

- [x] **Phase 2: Core Guides v2 — Review & Update**
  - [x] `ARCHITECTURE.md` — stale "(to be generated)" ref removed; all 6 apps + 6 packages accurate
  - [x] `SECURITY_OVERVIEW.md` — "Key invariants" table (7 invariants) added as section 3
  - [x] `DEVELOPMENT_GUIDE.md` — dev ports table + /guide command added; plan file paths corrected
  - [x] `ENVIRONMENT_VARIABLES.md` — ANTHROPIC_API_KEY, EXPO_PUBLIC_QR_SECRET, NEXT_PUBLIC_DEFAULT_ORG_ID added

- [x] **Phase 3: Plan Folder Cleanup & Alignment**
  - [x] 5 completed plans moved from `planning/` → `done/` (ai_assistant_v2, crm_followups, dashboard_polish, qr_create_wizard, watchlist_ui)
  - [x] 11 workflow files moved to `docs/plan/guides/` (ONE_MAN_*.md, PLAN_LIFECYCLE, PLANNING_ENHANCEMENTS, VIBE_CODER_WORKFLOW, MAN_WORKFLOW)
  - [x] `docs/plan/README.md` fully rewritten with accurate directory map and workflow

- [ ] **Phase 4: Extended Guides Review & Learning Docs Curation**
  - [ ] `SCANNER_OPERATIONS.md` — watchlist matching + offline mode covered
  - [ ] `RESIDENT_EXPERIENCE.md` — Phase 2 items clearly marked "Planned"
  - [ ] `patterns.md` — ≥ 5 entries
  - [ ] `decisions.md` — ≥ 3 entries

---
*Created: 2026-03-11*
