# PROMPT — Phase 03: Shift Handover Drawer, Real-Time Alerts & Documentation

**Slug:** `guard_shift_visual_map`  
**Phase:** 03  
**Target App:** `apps/client-dashboard`  
**Primary Role:** QA / DEVOPS  
**Preferred Tool:** Cursor (or Gemini CLI / Kilo)

---

## 1. Objective

Deliver the Shift Detail Drawer with supervisor emergency handover action, operational warning banners for unmanned gates and shift overruns, full Arabic RTL audit, monorepo preflight verification, and changelog synchronization.

---

## 2. Scope & Touchpoints

- `apps/client-dashboard/src/components/dashboard/gates/ShiftDetailDrawer.tsx` (NEW)
- `apps/client-dashboard/src/app/api/shifts/handover/route.ts` (NEW)
- `CHANGELOG.md`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

---

## 3. Invariants & Rules

- **Zero Tolerance on PII**: Shift handover mutations must emit `AuditLog` (`SHIFT_HANDOVER`) without raw PII.
- **Monorepo Green Preflight**: `pnpm preflight` must complete without errors.
- **Changelog Integrity**: Changelog validated via `pnpm docs:changelog:check`.

---

## 4. Implementation Steps

1. **Shift Handover API & Mutation**:
   - `POST /api/shifts/handover`: End current `ShiftLog` and create new `ShiftLog` for incoming guard.
   - Emit `AuditLog` entry for audit trail.
2. **Shift Detail Drawer**:
   - Slide-over drawer with guard contact, clock-in timestamp, shift elapsed duration, and "End Shift / Handover" button.
3. **Operational Warning Banners**:
   - Alert banner on dashboard when unmanned gates $>0$ or active shifts $>8\text{h}$.
4. **Verification & Testing**:
   - Unit tests for handover route and components.
   - Arabic RTL audit with screenshot or DOM validation.
5. **Documentation & Changelog**:
   - Update `CHANGELOG.md` under `[Unreleased]` -> `### Apps` -> `[Client]`.
   - Update `ALL_TASKS_BACKLOG.md` and complete plan.
6. **Phase Log**:
   - Generate `phase_logs/PHASE_LOG_phase_03.md`.

---

## 5. Acceptance Criteria

- [x] Emergency shift handover action functions properly with audit logging.
- [x] Warning banners display when gates are unmanned or shifts overrun.
- [x] `pnpm preflight` green on entire monorepo.
- [x] `CHANGELOG.md` verified via `pnpm docs:changelog:check`.
