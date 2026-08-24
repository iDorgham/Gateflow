# GateFlow Scanner App Reference

Comprehensive reference for `apps/scanner-app` including implemented scope, UI structure, function/services, and data contract touchpoints.

## Coverage Status

- Pages/routes: covered (single-app shell model).
- Menu/tabs/navigation: covered.
- API routes inside scanner app: not applicable (none present; consumes backend REST API).
- UI component inventory: covered.
- Function/service modules: covered.
- DB model mapping: covered at domain level via upstream APIs.
- Pilot Certification: **CERTIFIED** 🟢 (`scanner-app-certification-2026-08-23`).

## App Purpose

- Field-facing mobile scanner for gate operators and compound security guards.
- Optimized for sub-second scan response, offline continuity, and secure replay-safe sync.
- Operates reliably under weak, intermittent, or zero compound cellular coverage.

## What Has Been Completed

- **Multi-tab Operator Workflow:** Scanner, Today, Log, Chat, Settings.
- **Offline Queue & Reconnection Sync:** AES-CBC v3 payload encryption for stored scans; automatic drainage via `POST /scans/bulk` upon reconnection.
- **QR Cryptographic Verification:** Client HMAC-SHA256 signature checking, nonce consumption, and DB ID synchronization.
- **BiometricGuard & Inactivity Session Control:** Non-intrusive pan-gesture observation with 5-minute auto-lock while preserving active guard duty shifts.
- **Supervisor Override + Secure PIN Flow:** Emergency bypass for authorized security leads.
- **Physical Device Proof:** ACCESS GRANTED, offline queuing, and reconnect sync validated on physical iPhone hardware ([CAPTURE_CHECKLIST.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/audits/scanner-app/evidence/2026-08-22/CAPTURE_CHECKLIST.md)).

## Application Structure

### Core Surface

- Entry shell: `App.tsx`
- UI components: `src/components/*`
- Service and domain logic: `src/lib/*`
- Device hooks: `src/hooks/*`
- Tests/mocks: `src/lib/*.test.ts`, `__mocks__/*`, `jest.setup.ts`

### UI/UX Architecture

Component inventory in `src/components`:

- **Operational tabs:**
  - `TodayVisitsTab.tsx`
  - `HistoryTab.tsx`
  - `ChatTab.tsx`
  - `SettingsTab.tsx`
- **Scan Lifecycle & Feedback:**
  - `ScanResultOverlay.tsx` (or `result-overlay.tsx`)
  - `QueueStatusBadge.tsx`
  - `QueueStatus.tsx`
  - `DiagnosticsOverlay.tsx`
- **Security & Session Controls:**
  - `BiometricGuard.tsx`
  - `DutyErrorBoundary.tsx`
  - `SupervisorOverride.tsx`
  - `SupervisorOverrideModal.tsx`
  - `GateSelector.tsx`
  - `IDCaptureModal.tsx`
  - `PassCancelDialog.tsx`
  - `MaintenanceReportModal.tsx`

## Navigation / Menu Model

Current UX is tab-driven inside the app shell:

- Scanner (Camera viewport with active targeting grid)
- Today (Scheduled visitor passes and guest list)
- Log (Audited scan logs with status filters)
- Chat (Gatehouse intercom / guard dispatch)
- Settings (Gate selection, biometrics, sync diagnostics)

## Function and Service Layer

Primary modules in `src/lib`:

- **Scan & Verification:**
  - `scanner.ts` — Server validation and offline queue dispatch.
  - `qr-verify.ts` — Local cryptographic verification.
  - `scan-history.ts` — Local storage history cache.
- **Offline Sync & Resilience:**
  - `offline-queue.ts` — AES-CBC encrypted AsyncStorage queue.
  - `inactivity.ts` — Inactivity timeout calculations.
  - `maintenance-queue.ts` — Offline incident reporting.
- **Security & Auth:**
  - `auth-client.ts` — Token refresh and Argon2id session handling.
  - `security/secure-pin.ts` — PIN hashing and hardware store isolation.
  - `shift-session.ts` — Guard shift lifecycle and gate assignment.
- **User/Device Preferences:**
  - `preferences.ts`

Supporting hooks:

- `hooks/use-biometry.ts`
- `hooks/use-inactivity-timer.ts`

## Data and DB Domain Mapping (via backend contracts)

Scanner operations map to these primary backend schema domains:

- **Access control:** `QRCode`, `ScanLog`, `Gate`, `GateAssignment`.
- **Security workflows:** `Incident`, `ScanAttachment`, `WatchlistEntry`.
- **Audit/telemetry:** `EventLog`, `AuditLog`, `ShiftLog`.
- **User/org context:** `User`, `Organization`.

## Testing and Quality Signals

Current test-bearing modules:

- `lib/scanner.test.ts`
- `lib/offline-queue.test.ts`
- `lib/qr-verify.test.ts`
- `lib/auth-client.test.ts`
- `lib/inactivity.test.ts`

## Planning Notes for AI Tools

- Treat scanner as an offline-first state machine, not only a UI client.
- Preserve scan deduplication and replay safety semantics when changing queue logic.
- Keep security paths (QR verify, supervisor override, auth-client, BiometricGuard) isolated and test-backed.
- Ensure mobile changes maintain sub-second latency on physical camera viewports.
