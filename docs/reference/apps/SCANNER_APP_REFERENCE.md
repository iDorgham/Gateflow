# GateFlow Scanner App Reference

Comprehensive reference for `apps/scanner-app` including implemented scope, UI structure, function/services, and data contract touchpoints.

## Coverage Status

- Pages/routes: covered (single-app shell model).
- Menu/tabs/navigation: covered.
- API routes inside scanner app: not applicable (none present).
- UI component inventory: covered.
- Function/service modules: covered.
- DB model mapping: covered at domain level via upstream APIs.

## App Purpose

- Field-facing mobile scanner for gate operators.
- Optimized for fast scan response, offline continuity, and secure replay-safe sync.
- Designed to preserve access decisions under weak/no network conditions.

## What Has Been Completed

- Multi-tab operator workflow (Scanner, Today, Log, Chat, Settings).
- Offline queue flow and sync behavior with queue diagnostics.
- QR verification/security support modules and tests.
- Supervisor override + secure PIN flow.
- ID capture and maintenance-reporting modal flows.
- Auth client and scan history support logic.

## Application Structure

## Core Surface

- Entry shell: `App.tsx`
- UI components: `src/components/*`
- Service and domain logic: `src/lib/*`
- Device hooks: `src/hooks/*`
- Tests/mocks: `src/lib/*.test.ts`, `__mocks__/*`, `jest.setup.ts`

## UI/UX Architecture

Component inventory in `src/components`:

- Operational tabs:
  - `TodayVisitsTab.tsx`
  - `HistoryTab.tsx`
  - `ChatTab.tsx`
  - `SettingsTab.tsx`
- Scan lifecycle and feedback:
  - `ScanResultOverlay.tsx`
  - `QueueStatusBadge.tsx`
  - `QueueStatus.tsx`
  - `DiagnosticsOverlay.tsx`
- Control/safety flows:
  - `SupervisorOverride.tsx`
  - `SupervisorOverrideModal.tsx`
  - `GateSelector.tsx`
  - `IDCaptureModal.tsx`
  - `PassCancelDialog.tsx`
  - `MaintenanceReportModal.tsx`

## Navigation / Menu Model

Current UX is tab-driven inside the app shell (not route-driven App Router):

- Scanner
- Today
- Log
- Chat
- Settings

## API Surface

- No local `app/api` route handlers exist in `apps/scanner-app`.
- Scanner app communicates with backend APIs through client/service modules.

## Function and Service Layer

Primary modules in `src/lib`:

- Scan and verification:
  - `scanner.ts`
  - `qr-verify.ts`
  - `scan-history.ts`
- Offline sync and resilience:
  - `offline-queue.ts`
  - `maintenance-queue.ts`
- Security and auth:
  - `auth-client.ts`
  - `security/secure-pin.ts`
- User/device preferences:
  - `preferences.ts`
- Shared exports and utility entrypoint:
  - `index.ts`

Supporting hook:

- `hooks/use-biometry.ts`

## Data and DB Domain Mapping (via backend contracts)

Scanner operations map to these primary backend schema domains:

- Access control: `QRCode`, `ScanLog`, `Gate`, `GateAssignment`.
- Security workflows: `Incident`, `ScanAttachment`, `WatchlistEntry`.
- Audit/telemetry: `EventLog`, `AuditLog`, `ShiftLog`.
- User/org context: `User`, `Organization`.

## Testing and Quality Signals

Current test-bearing modules:

- `lib/scanner.test.ts`
- `lib/offline-queue.test.ts`
- `lib/qr-verify.test.ts`
- `lib/auth-client.test.ts`

Jest/runtime support:

- `jest.setup.ts`
- `__mocks__/async-storage.ts`
- `__mocks__/expo-network.ts`
- `__mocks__/expo-crypto.ts`
- `__mocks__/expo-secure-store.ts`

## Planning Notes for AI Tools

- Treat scanner as an offline-first state machine, not only a UI client.
- Preserve scan dedup and replay safety semantics when changing queue logic.
- Keep security paths (QR verify, supervisor override, auth-client) isolated and test-backed.
- Ensure mobile changes maintain low-latency UX under unstable connectivity.
