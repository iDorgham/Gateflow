# Ultra-Detailed Context Reference: Scanner App (`apps/scanner-app`)

> **Comprehensive Technical Specification for AI Assistants & Senior Engineers**  
> **Application**: `apps/scanner-app`  
> **Platform**: Expo SDK 57 / React Native (iOS / Android / Web)  
> **Last Verified**: August 28, 2026

---

## 1. Architectural Topology & Offline Engine

The GateFlow Scanner App is a field-hardened mobile client designed for zero-latency barrier operations, offline cryptographic validation, and strict guard accountability.

### Technology Stack:

- **Framework**: React Native 0.76+ via Expo SDK 57
- **Hardware Integration**: `expo-camera` (Barcode scanning), `expo-local-authentication` (Biometrics), `expo-secure-store` (Hardware PIN vault), `expo-haptics`
- **Offline Storage**: AsyncStorage with AES-256-CBC payload encryption and PBKDF2 key derivation
- **Styling**: `StyleSheet` with 100% token binding to `@gateflow/ui/tokens` (`nativeTokens`)

---

## 2. Deep Dive: Biometric Security & Shift Invariants

### 2.1 Fail-Closed Biometric & PIN Vault (`src/lib/security/`)

- **Hardware Detection (`biometrics.ts`)**:
  - Executes `LocalAuthentication.hasHardwareAsync()` and `LocalAuthentication.isEnrolledAsync()`.
  - Distinguishes between `FACIAL_RECOGNITION`, `FINGERPRINT`, and `IRIS`.
  - If hardware is missing or enrollment fails, strictly requires a 6-digit Master PIN.
- **Constant-Time PIN Matching (`secure-pin.ts`)**:
  - Passcodes are salted and hashed with SHA-256 before writing to `expo-secure-store`.
  - Verifies inputs using constant-time byte-by-byte XOR comparison to eliminate side-channel timing attack vectors.
- **Lockout Manager (`lockout-manager.ts`)**:
  - Tracks consecutive failed attempts in volatile state.
  - Exceeding 3 failed attempts triggers an immediate 60-second hardware lockout timer with countdown UI.

### 2.2 Shift Session Management & Scan Blocking (`src/lib/shift-session.ts`)

- **Scan-Blocking Gate**:
  - `canScanWithShift(session, gateId)` requires `session.shiftLogId` to exist and `session.gateId === gateId`.
  - `CameraScannerView.tsx` evaluates `canScan` and unbinds `onBarcodeScanned` when false.
- **Tombstone Protection**:
  - Calling `endShiftSession()` immediately writes `SHIFT_TOMBSTONE_KEY` to SecureStore.
  - Ensures app restarts cannot resurrect a terminated shift session from stale cache.

---

## 3. Deep Dive: 72x72px Master Scan FAB & Telemetry

### 3.1 Master Scan FAB (`src/components/home/master-scan-fab.tsx`)

- Circular dimensions: $72\text{px} \times 72\text{px}$ with `borderRadius: 36px`.
- Styled with `nativeTokens.colors.primary` (`#1868db`) and `nativeTokens.shadows.brandGlow`.
- Provides sub-second trigger into camera viewfinder ($<1\text{s}$ latency).

### 3.2 Live Duty Telemetry Card (`src/components/home/shift-info-widget.tsx`)

- Owns its internal `setInterval` timer ticking every 1,000ms.
- Calculates elapsed duration via `formatElapsedDuration(startTime, now)` without updating React Native root context.
