# Scanner Operations Guide (Docs v2)

**Version:** 2.0  
**Aligned with:** `docs/PRD.md` (Scanner App Onboarding, Shift Session Management, Biometric Security, Patrol Checkpoints)

---

## 1. Purpose & Personas

This guide describes how the **scanner-app** should be operated day‑to‑day by:

- **Gate Operators & Patrol Guards** — guards scanning visitors at gates and executing perimeter checkpoint patrols.
- **Security Managers / Supervisors** — configuring gates, managing shift allocations, monitoring patrol compliance, reviewing incidents, and overseeing overrides.

---

## 2. Guard First-Mile Onboarding & Device Setup

Upon launching the scanner application for the first time:

1. **Vision & Terms Step**: Operator reviews zero-trust gate operational mandates.
2. **Hardware Permissions Step**:
   - Camera and Haptic feedback permissions are requested.
   - If blocked by system settings, the operator taps **Open Settings** to deep-link directly into iOS/Android app settings (`Linking.openSettings()`).
3. **Security & Biometric Setup Step**:
   - The device checks hardware biometrics via `expo-local-authentication` (FaceID, TouchID, Android Fingerprint).
   - If biometrics are available, the guard is prompted to enroll their biometrics for fast unlocks.
   - A mandatory 6-digit Master PIN is created via custom on-screen numeric keypad (`PinKeypad`) with 6-dot animated feedback (`PinDots`).
   - PIN hashes are salted with SHA-256 and stored in `expo-secure-store`.
4. **Duty Gate Activation Step**:
   - Operator selects their initial duty terminal lane.

---

## 3. Shift Clock-In & Scan-Blocking Invariant

To ensure accountability and prevent unauthorized gate operations:

- **Shift Gating Rule**: Barcode camera scanner callbacks are **hard-blocked** unless the guard has an active shift session matching the assigned gate (`canScanWithShift(session, gateId) === true`).
- **Clock-In Flow**:
  1. Operator opens the duty dashboard.
  2. Selects assigned Gate.
  3. Taps **Start Duty Shift**. The app calls `POST /api/scanner/shift/start` and securely saves the session payload.
- **Clock-Out Flow**:
  1. Operator taps **End Shift** or uses the supervisor handover drawer.
  2. App executes `POST /api/scanner/shift/end`, recording duration and total scan counts.
  3. A durable tombstone marker (`SHIFT_TOMBSTONE_KEY`) is stored to prevent stale session resurrection.

---

## 4. Master Scan Home Screen Operations

The redesigned home screen acts as the guard's command center:

- **72x72px Master Scan FAB**: Located at the center bottom (`nativeTokens.colors.primary` with `brandGlow` elevation). Tapping immediately launches the camera scanner in $<1\text{s}$.
- **Shift Telemetry Widget (`ShiftInfoWidget`)**:
  - Live duty timer displays elapsed shift duration, updating every second in an isolated render cycle.
  - Semantic status pill indicates **On duty** (green) vs **Off duty** (muted).
- **Operational Stats Grid**:
  - **Scans Today**: Real-time counter of granted/denied passes processed.
  - **Pending Sync**: Offline queue counter indicating passes awaiting upload.
  - **Network Status**: Live indicator showing online/offline status.

---

## 5. Biometric Inactivity Guard

- **5-Minute Auto-Lock**: If the device is idle or backgrounded for 5 minutes (`DEFAULT_INACTIVITY_TIMEOUT_MS = 300,000ms`), `BiometricGuard` locks the interface.
- **Unlock Prompt**: The operator is prompted with native FaceID / Fingerprint verification or 6-digit PIN.
- **Rate-Limiting**: 3 consecutive failed PIN attempts trigger a 60-second lockout timer.

---

## 6. Perimeter Guard Patrol Checkpoint Scanning

Guards assigned to perimeter patrol routes execute checkpoint scans:

1. Guard navigates the perimeter route sequence.
2. At each physical checkpoint sign/beacon, guard scans the **HMAC-signed Checkpoint QR**.
3. Scanner validates the HMAC-SHA256 signature locally against `EXPO_PUBLIC_QR_SECRET`.
4. The scan posts to `POST /api/patrols/scan`.
5. The Client Dashboard (`GuardShiftVisualMap.tsx`) updates live polyline map telemetry and marks the checkpoint as **On-Time** or **Delayed**.

---

## 7. Offline Verification & Queue Sync

When cellular or Wi-Fi connectivity drops at remote compound gates:

- **Local Crypto Validation**: Scanner validates cryptographic HMAC-SHA256 signatures offline (<120ms).
- **Encrypted Queue**: Scans are encrypted with **AES-256** and queued in AsyncStorage.
- **Automatic Drainage**: When connection restores, the queue syncs via `POST /api/scans/bulk` using immutable `scanUuid` deduplication.

---

## 8. Supervisor Override & Incident Reporting

- **Supervisor Emergency Override**: For damaged physical visitor passes or exceptional approvals, authorized security leads enter their supervisor PIN to force-open the barrier lane.
- **Incident Logging**: Guards can attach incident reports and National ID photos directly to access logs or standalone facility maintenance tickets.
