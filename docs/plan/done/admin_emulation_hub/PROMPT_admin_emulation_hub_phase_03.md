# PROMPT: Admin Emulation Hub — Phase 3: Real-time Monitor & Job Control

## Goal

Enable real-time simulation monitoring and detailed auditing of emulation/seeding tasks via the Control Panel.

## Role & Tool

- **Primary Role**: Frontend Engineer
- **Preferred Tool**: Cursor / Gemini CLI

## Context

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/monitoring/hub/page.tsx`: Ops Hub page.
- `apps/admin-dashboard/src/app/api/admin/emulation-history/route.ts`: API history.
- `aiActionLog` schema: `status`, `result`, `metadata` (JSON).

## Steps

### 1. High-Density Emulation History Table

In `MonitoringHub`:

- Refactor the simple history list into a dedicated `EmulationHistoryTable`.
- Columns: `Actor`, `Target Org`, `Action Type`, `Status (Badge)`, `Relational Summary (Scans)`, `Timestamp`.
- Status Badges:
  - `EXECUTED` (Success/Green)
  - `FAILED` (Error/Red)
  - `RUNNING` (Loading/Blue) — if applicable.

### 2. Run Detail Side Drawer

Create `EmulationDetailDrawer` (re-using `Sheet` or `Drawer` from `@gate-access/ui`):

- Header: `Action ID` and `Status`.
- Content:
  - JSON Viewer for `intentJson` and `metadata`.
  - Display relational results: `QR Code ID`, `Total Scans`, `Window Range`.
  - Links to the `Organization` or `Project` details for quick verification.

### 3. Real-time Refresh Polling

In `MonitoringHub`:

- Implement a `usePolling` hook (or simple `useEffect` with `setInterval`) to refresh history every 5–10 seconds.
- Show a "Refreshing..." toast or subtle progress bar if a job is in progress.
- Handle error states (e.g. 429 rate limit exceeded) gracefully.

### 4. Job Management

- Add an "Abort" action if possible (conceptually, or just a generic "Force Clear Status").
- Note: This may be mock for now if simulations are synchronous/short-lived.

## Acceptance Criteria

- [ ] Table follows ADS compact pattern.
- [ ] Drawer opens and displays the full audit metadata correctly.
- [ ] History updates live during an emulation run (opened in another tab).
- [ ] JSON Viewer handles large payloads without crashing.
