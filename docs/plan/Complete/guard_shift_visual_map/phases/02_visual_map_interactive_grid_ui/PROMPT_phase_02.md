# PROMPT — Phase 02: Guard Shift Visual Map & Interactive Grid UI

**Slug:** `guard_shift_visual_map`  
**Phase:** 02  
**Target App:** `apps/client-dashboard`  
**Primary Role:** FRONTEND  
**Preferred Tool:** Cursor (or Gemini CLI)

---

## 1. Objective

Build the frontend UI for the Guard Shift Visual Map and interactive gate terminal monitoring in `apps/client-dashboard`, featuring an interactive perimeter map view, terminal card grid, live status badges, and top-level KPI metrics strip.

---

## 2. Scope & Touchpoints

- `apps/client-dashboard/src/components/dashboard/gates/GuardShiftVisualMap.tsx` (NEW)
- `apps/client-dashboard/src/components/dashboard/gates/GateTerminalCard.tsx` (NEW)
- `apps/client-dashboard/src/components/dashboard/gates/ShiftKpiSummary.tsx` (NEW)
- `apps/client-dashboard/src/lib/shifts/use-live-shifts.ts` (NEW)
- `apps/client-dashboard/src/app/[locale]/dashboard/organizations/[orgId]/gates/page.tsx` (MODIFY)

---

## 3. Invariants & Rules

- **ADS Token Compliance**: Use `@atlaskit/tokens` CSS variables (`var(--ds-...)`) for all colors, borders, and surfaces.
- **RTL Bidirectional Layout**: Support logical layout properties and bidirectional tooltips/badges (`ar-EG`, `ar-SA`).
- **CLS Prevention**: Reserve aspect ratio and skeleton states ($CLS = 0.00$).

---

## 4. Implementation Steps

1. **State & Data Hook (`use-live-shifts.ts`)**:
   - Polling hook (15s interval) fetching from `/api/shifts/live` with error/loading states.
2. **KPI Summary Bar (`ShiftKpiSummary.tsx`)**:
   - Display Total Gates, Active Gates, Unmanned Alerts, and On-Duty Guards with pulsing indicators.
3. **Visual Map Component (`GuardShiftVisualMap.tsx`)**:
   - Interactive perimeter schematic plotting gate nodes using relative coordinates (`latitude`, `longitude` or normalized grid placement).
   - Gate status color coding: Green (Active), Amber (Overrun / Warning), Red (Unmanned), Grey (Inactive).
   - Click node to open details or select terminal card.
4. **Terminal Card Grid (`GateTerminalCard.tsx`)**:
   - Responsive card grid displaying gate name, assigned guard avatar, shift duration timer, battery/network health, and quick actions.
5. **Page Integration**:
   - Embed map and grid view toggle in the Gates management page with project and status filters.
6. **Phase Log**:
   - Generate `phase_logs/PHASE_LOG_phase_02.md`.

---

## 5. Acceptance Criteria

- [x] Interactive perimeter map and terminal cards render live data from `/api/shifts/live`.
- [x] View toggle switches smoothly between Map and Grid views.
- [x] ADS tokens and dark mode tested.
- [x] Arab RTL layout verified.
