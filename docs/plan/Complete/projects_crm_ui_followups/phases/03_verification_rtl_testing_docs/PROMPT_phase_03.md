# PROMPT — Phase 03: Verification, RTL Testing & Documentation

**Slug:** `projects_crm_ui_followups`  
**Phase:** 03  
**Target App:** `apps/client-dashboard`  
**Primary Role:** QA / DEVOPS  
**Preferred Tool:** Cursor (or Gemini CLI / Kilo)

---

## 1. Objective

Perform end-to-end verification, accessibility/RTL audits, and workspace documentation updates for the `projects_crm_ui_followups` initiative.

---

## 2. Scope & Touchpoints

- `apps/client-dashboard/`
- `docs/audits/`
- `CHANGELOG.md`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
- `docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md`

---

## 3. Invariants & Rules

- **Zero Tolerance on PII**: Inspect audit log tables to guarantee no PII is logged on exports.
- **Monorepo Green Preflight**: `pnpm preflight` must complete without errors.
- **Changelog Integrity**: Changelog follows standardized structure verified by `pnpm docs:changelog:check`.

---

## 4. Implementation Steps

1. **PII & Security Inspection**:
   - Verify sample `AuditLog` rows created during export test runs.
2. **RTL & Accessibility Validation**:
   - Check table density selectors, tooltips, and modals in `dir="rtl"` mode.
3. **Workspace Preflight**:
   - Run `pnpm preflight` across all workspaces.
4. **Documentation & Backlog Sync**:
   - Update `CHANGELOG.md` under `apps/client-dashboard`.
   - Mark items complete in `docs/plan/backlog/PROJECTS_CRM_UI_FOLLOWUPS.md` and `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
5. **Phase Log**:
   - Complete `phase_logs/PHASE_LOG_phase_03.md`.

---

## 5. Verification Command

```bash
pnpm preflight
```
