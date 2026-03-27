# Pro Prompt: Phase 4 — Field Reporting (Guard / Scanner App)

## Context

- **Initiative**: `maintenance_management`
- **Goal**: Enable guards to report hardware issues (e.g., broken gate, malfunctioning scanner) directly from the Scanner App.
- **App**: `apps/scanner-app` (Expo/React Native)
- **Primary Role**: `mobile.md`
- **Preferred Tool**: `Gemini CLI` (Free tier capable for routine UI/logic)

## Scope

- [ ] **UI Component**: Create `MaintenanceReportModal.tsx` for capturing issue title and description.
- [ ] **Integration**: Add "Report Hardware Issue" button to `ScanResultOverlay.tsx`.
- [ ] **State Management**: Track current `gateId` and latest `scanLogId` to link reports.
- [ ] **API Client**: Implement `createMaintenanceRequest` in `apps/scanner-app/src/lib/api-client.ts`.
- [ ] **Offline Readiness**: Use the existing queue/sync pattern if available, or ensure errors are handled gracefully for offline reporting.

## Steps

1. **Load Context**: Read `PLAN_maintenance_management.md` and check `apps/scanner-app/src/components/ScanResultOverlay.tsx`.
2. **Create Modal**: Implement `apps/scanner-app/src/components/MaintenanceReportModal.tsx`.
   - Title input (required).
   - Description input (optional).
   - Category selection (HARDWARE/FACILITY).
   - "Submit" and "Cancel" buttons.
3. **Update Overlay**: Add the reporting button to `ScanResultOverlay.tsx`.
   - Show only when `visible` is true.
   - Trigger the `MaintenanceReportModal`.
4. **API Integration**:
   - Add maintenance request call to the scanner's API layer.
   - Payload: `{ title, description, category, gateId, scanLogId }`.
5. **Verification**:
   - `pnpm turbo lint --filter=scanner-app`
   - `pnpm turbo typecheck --filter=scanner-app`
   - (Optional) Run `App.tsx` logic check.

## Acceptance Criteria

- [ ] Guard can open the report modal from any scan result.
- [ ] Submitting a report calls the backend maintenance API.
- [ ] The report is correctly linked to the active `Gate`.
- [ ] RTL support for Arabic strings in the modal.
- [ ] No regressions in scan flow performance.

## Files Touched

- `apps/scanner-app/src/components/MaintenanceReportModal.tsx` (New)
- `apps/scanner-app/src/components/ScanResultOverlay.tsx`
- `apps/scanner-app/src/lib/api-client.ts`
- `apps/scanner-app/App.tsx` (State linkage)
