# IDEA: Scanner App — Biometric Identity Verification

**Initiative:** `scanner_biometric_auth`
**Status:** 🆕 New — Ready to refine
**Target:** Q3 2026
**Champion:** TBD

---

## 1. Problem Statement

The Scanner App (`apps/scanner-app`) currently allows any user who has the device and is logged in to perform scans. In high-security environments, there's a need to ensure that the individual performing the scan is specifically authorized and that the device hasn't been shared or left unattended.

- **Accountability:** Ensuring the person performing the scan is the authorized guard.
- **Unauthorized Access:** Preventing someone with a lost/stolen device from performing scans before session timeout.
- **Compliance:** Meeting security audits for sensitive sites requiring multi-factor or biometric verification for entry/exit operations.

---

## 2. Strategic Goal

Require **biometric identity verification (FaceID or Fingerprint)** before allowing a guard to access the scanner screen or initiate a QR scan.

### Success Metrics

| Metric | Target |
| :--- | :--- |
| **Authentication Rate** | 100% of scans preceded by successful biometric verify (when enabled) |
| **Verification Speed** | < 1.5 seconds for biometric prompt + success |
| **Fail-safe Logic** | Fallback to device PIN if biometric fails multiple times |
| **Organization Control** | Admins can toggle this requirement per gate/site |
| **Audit Trail** | Record that a scan was "Biometric-Verified" in activity logs |

---

## 3. Scope

### In Scope
- Integrate `expo-local-authentication` into `apps/scanner-app`.
- Create a global `BiometricAuditGuard` Higher-Order Component or Hook.
- Implement a configurable setting in the `admin-dashboard` to require bio-auth for specific gates.
- Add "Biometric Verified" flag to the `ScanLog` schema in `packages/db`.
- Localized biometric prompts (Arabic/English).

### Out of Scope
- Biometric verification for residents in `resident-portal` (out of scope for now).
- Retinal or Voice recognition (limit to FaceID/Fingerprint supported by `expo-local-authentication`).
- Hardware-specific bypass methods.

---

## 4. Technical Architecture

- **Auth Provider**: `expo-local-authentication`.
- **Logic Flow**:
    1. Guard taps "Open Scanner".
    2. App checks if site/gate requires bio-auth.
    3. If yes, `authenticateAsync()` is called.
    4. Upon success, scanner opens.
    5. Token/Timestamp is stored temporarily (e.g., 5-minute grace period) to avoid redundant prompts.
- **Data Persistence**: Update `ScanLog` model to include `biometricVerified: Boolean`.

---

## 5. Risks & Challenges

| Risk | Mitigation |
| :--- | :--- |
| **Hardware Incompatibility** | Use `hasHardwareAsync()` to detect support; fallback to device PIN. |
| **UX Friction** | Implement a "session grace period" (e.g. valid for 5-10 minutes) so guards don't authenticate every 5 seconds for a queue of cars. |
| **Lighting/Environment** | FaceID might fail in very dark/bright outdoor gate environments; ensure fingerprint/PIN fallback is seamless. |

---

## 6. Open Questions

- [ ] Should the biometric check happen *before the scanner opens* or *before the scan is submitted*?
- [ ] Do we need to store the "Verified" status in the database, or is it purely a local device check?
- [ ] Should the grace period be configurable by the admin?

_Created: 2026-03-31 | Strategic Security Enhancement_
