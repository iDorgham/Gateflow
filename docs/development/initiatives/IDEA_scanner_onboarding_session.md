# IDEA: Scanner App — Onboarding & Session Management

**Initiative:** `scanner_onboarding_session`
**Status:** 🆕 New — Ready to refine
**Target:** Q3 2026
**Champion:** TBD

---

## 1. Problem Statement

The Scanner App (`apps/scanner-app`) currently starts on a default dashboard or scan screen, offering limited "First Mile" experience for new guards. High-security environments require a structured onboarding flow (Permissions, Bio-Auth Setup, Passcode) and a clear "Shift Start" (Clock-in) before operations begin.

- **Missing Onboarding:** New guards start with a raw app, lacking guidance on permissions (Camera, Push) or security setup.
- **Security Gaps:** Lack of a mandatory "Passcode + FaceID" setup for device protection.
- **Operation Friction:** Guards need a "Daily Shift Check-in" to log when their gate duty starts and ends.
- **Home UX:** The current home screen is not optimized for a high-intensity gate operation (needs a "Master Scan Action" and "Shift Summary").

---

## 2. Strategic Goal

Implement a **Premium Onboarding Wizard** and a **Session-Managed Home Screen** using the **GateFlow ADS** design language.

### Success Metrics

| Metric                  | Target                                                               |
| :---------------------- | :------------------------------------------------------------------- |
| **Passcode Compliance** | 100% of first-time users set a 4 or 6-digit passcode                 |
| **Biometric Setup**     | 90% of supported devices enable FaceID/Fingerprint during onboarding |
| **Shift Accuracy**      | Log entry created for 100% of gate operations (Shift ID link)        |
| **UX Speed**            | < 1 second from "Home" to "Camera Active" (Central Scan Action)      |
| **ADS Score**           | 100% semantic token usage with no hardcoded hex codes                |

---

## 3. Scope

### In Scope

#### Phase 1: Foundation — Security & Auth Utilities

- Integration with `expo-local-authentication`.
- Secure Storage for passcodes.
- `useShiftSession` hook to manage "Active Duty" state.

#### Phase 2: Onboarding Wizard (UI/UX)

- **Welcome Slide:** Quick vision (Atlassian-style illustration).
- **Security Slide:** Passcode setup + Bio-auth toggle.
- **Permissions Slide:** Unified "Enable Camera & Notifications" request (with ADS-styled educational context).
- **Shift Activation:** Step to scan "Gate Permission QR" or "Duty QR" to finalize onboarding/start shift.

#### Phase 3: Shift Logging & Attendance

- `ShiftLog` schema updates in `packages/db`.
- API endpoint for `clockIn` and `clockOut`.
- Backend validation ensuring Shift is active for any `ScanLog` creation.

#### Phase 4: Home Screen Redesign (Master Action)

- Mobile Dashboard using **8pt Grid** and **Compact Density** tokens.
- **Master Scan Button:** Prominent, middle-aligned floating action with high contrast (`color.background.brand.bold`).
- **Shift Widget:** Displays duty start time, current location (Gate), and summary stats (e.g. Scans today).

#### Phase 5: Polish & Security Logic

- **Biometric Guard:** Prompt for FaceID when reopening app after 5 mins of inactivity.
- **RTL Support:** Full Arabic RTL layout for the wizard and dashboard.
- Page transitions using `framer-motion` for a premium, app-like feel.

### Out of Scope

- Resident onboarding (separate initiative).
- Hardware-specific device management (MDM).

---

## 4. UI/UX Design Brief (ADS Integration)

### Color Palette (Semantic)

- **Backgrounds:** `ds-surface` (Main), `ds-surface-sunken` (Form cards).
- **Actions:** `bg-ds-accent-bold` (Scan Button), `ds-accent-green` (Clock-in Success).
- **Typography:** `text-ds-text-heading` (Outfit Bold for Titles), `text-ds-text-subtle` (Inter for hints).

### Core Components

- **StepProgress:** Dotted or thin bar at top (`space.200` height).
- **ActionButton:** Full-width rounded (`radius.large`) with ADS `shadow.card`.
- **ScanFAB:** 72x72px circular button, centered at bottom, with high-contrast icon.

---

## 5. Risks & Challenges

| Risk                  | Mitigation                                                                   |
| :-------------------- | :--------------------------------------------------------------------------- |
| **Permission Denied** | Provide a "Settings Redirect" page if guard denies camera during onboarding. |
| **Hardware Fail**     | Always allow PIN-fallback if FaceID sensor is unavailable/broken.            |
| **Offline Sync**      | Queue `clockIn` events in local storage if network is flaky at the gate.     |

---

## 6. Open Questions

- [ ] Should the user set a 4 or 6-digit passcode? (Or allow choice?)
- [ ] Should the "Scan Permission QR" be required _once per device_ (first time) or
      _once per shift_?
- [ ] Should we support Dark Mode specifically for night-shift guards? (Priority:
      Yes, via ADS tokens).

_Created: 2026-03-31 | UI/UX & Security First Mile_
