# TASKS — ralph_plan_status_fix

**Goal:** Stabilize `pnpm plan:status` progress rendering and prevent repeat-count crash.

---

## Phase 1 — Fix status progress parsing and bar clamping ✅

### Deliverables

- [x] Added `parsePhaseProgress()` helper in `scripts/ralph-plan.js`
- [x] Limited done/total counting to phase table rows
- [x] Added safe clamp for filled/empty progress bar segments
- [x] Verified `pnpm plan:status docs_workspace_template_cursor_bootstrap` exits successfully

### Status

Done.
