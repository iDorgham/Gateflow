# GateFlow Last Changes & System Audit — 2026-08-19

**Date:** 2026-08-19  
**Scope:** Review of recent changes (PR #245, PR #277, Scanner Phase 05, Dashboard QR DB id persistence, security remediations, build & CI state), deep critique, pros/cons analysis, mandatory corrections ("Must Change"), and prioritized roadmap ("Must Do").  
**Auditor:** GateFlow System Auditor & Architect  
**Review Mode:** Static & Evidence Analysis (`static-review-only` + `device-evidence` evaluation)  
**Target Commit:** `ec9d248c13f099a7361a1389291c68df50ee5aa7` (master)

---

## 1. Executive Summary

Since the July 2026 security audit and the 2026-08-10 situation review, the repository has made significant progress across core system boundaries. The core security infrastructure (request-local tenant scoping, fail-closed cron triggers, elimination of unsecured bootstrap routes) is now fully active.

The recent cycles delivered:

1. **Scanner Phase 05 Hardening & UI Guards:** Integrated `BiometricGuard`, 5-minute inactivity timers with app state tracking, `DutyErrorBoundary`, and pure `Animated` transitions.
2. **Dashboard QR Persistence Fix (PR #277):** Resolved the critical QR validation failure mode where generated QR codes contained ephemeral mock UUIDs rather than PostgreSQL `QRCode` database IDs.
3. **Soft-Delete & Tenant Isolation Tightening (PR #245):** Enforced soft-delete filtering on `ScanLog` and `Incident` models where applicable, aligned Expo SDK 57 dependencies, and removed process-global tenant state leak risks.

**Current Core Blocker:** While unit tests, linting, and bundling pass cleanly, **`scanner-app` certification remains blocked**. Live device evidence contains shift-lock and replay-denial proof, but lacks the final **ACCESS GRANTED** scan on a real DB-backed QR code and the **offline-enqueue/reconnect-sync** device demonstration.

---

## 2. Detailed Review of Recent Changes

### A. Dashboard QR DB-ID Synchronization (PR #277 & `create-qr-client.tsx`)

- **What Changed:** In `apps/client-dashboard/src/app/[locale]/dashboard/organizations/[orgId]/qrcodes/create/actions.ts` and `create-qr-client.tsx`, QR generation now explicitly assigns `const qrId = randomUUID()`, binds Prisma `QRCode.create({ data: { id: qrId, ... } })`, and embeds that exact `qrId` inside the HMAC-signed payload and QR SVG/PNG code.
- **Why It Matters:** Scanner verification (`qr-verify.ts` and `POST /scans/validate`) performs a database lookup on `payload.qrId`. Generating HMAC payloads with unbound mock IDs previously caused all real scanner requests to fail closed with `QR_NOT_FOUND`.

### B. Scanner App Phase 05 (`BiometricGuard` & Inactivity Session Control)

- **What Changed:**
  - Pure function `shouldLock(lastActivityMs, nowMs, timeoutMs)` implemented in `src/lib/inactivity.ts`.
  - Foreground polling (1s) and backgrounding duration calculation (`AppState` transition) in `use-inactivity-timer.ts`.
  - Non-intrusive gesture observation via `PanResponder` in `BiometricGuard.tsx`.
  - Substituted heavy native dependency `react-native-reanimated` with React Native's built-in `Animated` API (`useNativeDriver: true`) to prevent native linkage breakage on Expo Go/Custom Dev Client.
- **Why It Matters:** Guards scanner devices against unattended access in guard booths without invalidating active duty shifts (`useShiftSession` stays preserved).

### C. Dependency & Build Alignment (`@babel/core` & Expo SDK 57)

- **What Changed:** Aligned `@babel/runtime` (`^7.26.0`) and scoped root `pnpm.overrides["@babel/core"]` to `^7.29.6`, enabling Metro to package 2,546+ modules without configuration crash.
- **Current Status:** Clean bundler pass for development, but `expo export` still hits a Hermes compiler packaging missing module in headless mode (`hermes-compiler/package.json`).

---

## 3. Pros and Cons Matrix

| Area                         | Pros (Strengths)                                                                                                                                                                  | Cons (Weaknesses / Risks)                                                                                                                                            |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **QR Signing & Persistence** | • Cryptographic HMAC-SHA256 fail-closed architecture.<br>• Nonce replay protection actively verified on-device.<br>• 1-to-1 matching between DB entity ID and payload ID.         | • Re-generating QR codes requires full client-side state sync.<br>• Test generation pages (`qr/create-test`) must be kept strictly separated from production routes. |
| **Scanner Security Shell**   | • Non-destructive touch observation (never swallows scroll/tap).<br>• Preserves guard shift state across UI lock/unlock.<br>• Fails closed if `EXPO_PUBLIC_QR_SECRET` is missing. | • `App.tsx` has ballooned to **2,118 lines**.<br>• Single state machine handles login, onboarding, unlock, scanning, and lock.                                       |
| **UI & Motion Framework**    | • Zero native binary risk by leveraging core RN `Animated`.<br>• Independent error boundaries per dashboard widget.<br>• Responsive 8pt grid token compliance.                    | • No `@gate-access/i18n` integration in `scanner-app` yet.<br>• RTL readiness is currently layout-only (direction-agnostic flex), not full Arabic localization.      |
| **Workflow & Evidence**      | • Strict anti-fabrication gates (blocks certification without real device screenshots).<br>• Deterministic `CHECK_ALL` JSON artifacts.                                            | • Stale page scores (47.33 avg from 2026-07-30) linger in workflow state.<br>• Parked files in `client-dashboard` trigger dirty-tree diff warnings.                  |

---

## 4. Critics, Code Smells & Vulnerabilities

1. **Monolithic Shell Anti-Pattern in `scanner-app/App.tsx` (2,118 lines):**
   - _Critic:_ `App.tsx` manages global state, biometric unlock, onboarding steps, camera frame rendering, tab switching, and auth hydration. This violates single-responsibility principles and increases regression risk on minor edits.
2. **Docs Drift in `apps/scanner-app/docs/README.md`:**
   - _Critic:_ The documentation still claims the app uses SQLite, Prisma client on device, `expo-barcode-scanner`, and Nativewind. In reality, it uses SecureStore, encrypted AsyncStorage queues, camera hooks, and ADS TypeScript tokens (`nativeTokensNewEra`).
3. **False RTL Completeness Claim:**
   - _Critic:_ Phase 05 marked RTL as audited because hardcoded `marginLeft`/`marginRight` were absent. However, zero Arabic translation keys (`i18n`) exist in `scanner-app`. True MENA compound operations require localized strings.
4. **Hermes Build Pipeline Incompleteness:**
   - _Critic:_ While `pnpm test` and `pnpm lint` pass 100%, `expo export --no-bytecode` passes but bytecode compilation fails on `hermes-compiler` dependency resolution. Standalone APK/IPA builds cannot be generated without addressing this environment configuration.
5. **Dirty Tree & Workspace Contamination:**
   - _Critic:_ Parked changes in `apps/client-dashboard` and repository root `AGENTS.md` break automated clean-worktree checks during `/check` runs.

---

## 5. Must Change (Hard Blockers & Anti-Patterns)

> [!CAUTION]
> The following items must be corrected before proceeding to pilot certification or production release:

1. **MUST CHANGE: Scanner Certification Bypass Attempts**
   - Under no circumstances may `PILOT_GATE_*.json` or `.ai/workflow-v2/state.json` be flipped to `passed` or `certified` using unit tests or replay-denial logs.
   - Evidence must show:
     1. Valid QR generated on `client-dashboard` with active DB record.
     2. Scanner camera capture resulting in **ACCESS GRANTED**.
     3. Offline scan queue incrementing in airplane mode and draining upon reconnect.

2. **MUST CHANGE: Unsynchronized `apps/scanner-app/docs/README.md`**
   - Rewrite the scanner documentation to accurately reflect SecureStore, AES offline queue, server-side HMAC validation, and ADS design tokens.

3. **MUST CHANGE: Unhandled Hermes Compiler Export Flag**
   - Configure release scripts to either use Expo Application Services (`eas build`) or ensure `hermes-compiler` is correctly aliased in monorepo dependencies.

4. **MUST CHANGE: Contaminated Git Worktree**
   - Stash or commit parked `client-dashboard` experiments to a feature branch so that `git status` on `master` remains pristine for automated check runners.

---

## 6. Must Do (Prioritized Action Plan)

### Step 1: Physical Device / Simulated QR Scan Proof (P0)

- Launch `client-dashboard` dev server and Postgres database.
- Create a resident visitor QR code (`createQRCode`).
- Point the physical scanner app or camera passthrough to the generated QR code.
- Capture screenshot showing **ACCESS GRANTED** (validating gate ID, visitor name, and active shift).
- Save screenshot to `docs/audits/scanner-app/evidence/2026-08-19/scan-access-granted.png`.

### Step 2: Device Offline Queue & Sync Proof (P0)

- Put the device in Airplane Mode (or sever network to backend).
- Scan a valid QR code → observe **QUEUED OFFLINE** indicator.
- Reconnect network → observe automatic sync via `POST /scans/bulk` and status update.
- Capture screenshots and save to `docs/audits/scanner-app/evidence/2026-08-19/`.

### Step 3: Refresh Workflow Artifacts & Run `/check` (P0)

- Update `PILOT_GATE_OWNED_2026-08-19.json` marking both owned steps as `passed`.
- Run `node scripts/workflow-v2/support-cli.js check-all scanner-app` to generate verified `CHECK_ALL` artifact.
- Transition `scanner-app` stage in `.ai/workflow-v2/state.json` to `audited` → `certified`.

### Step 4: Refactor & Decompose `App.tsx` (P1)

- Extract navigation state into a dedicated `AppNavigator.tsx`.
- Extract `CameraScannerView.tsx` from the root component.
- Reduce `App.tsx` from 2,118 lines to < 300 lines.

### Step 5: Implement `@gate-access/i18n` in Scanner App (P2)

- Wire Arabic translations for all onboarding, home, shift, and scan result strings.
- Validate RTL layout on an Arabic-configured device.

---

## 7. Audit Verification Artifact Matrix

| Artifact Path                                              | Purpose                                 | Freshness / Validity                     |
| :--------------------------------------------------------- | :-------------------------------------- | :--------------------------------------- |
| `docs/audits/GATEFLOW_LAST_CHANGES_AUDIT_2026-08-19.md`    | This audit document                     | Fresh (`2026-08-19`)                     |
| `docs/audits/scanner-app/CHECK_ALL_2026-08-19.json`        | Complete app verification data          | Valid (Blocked on pilot steps)           |
| `docs/audits/scanner-app/PILOT_GATE_OWNED_2026-08-19.json` | Pilot gate owned steps breakdown        | Valid (`partial`, requires device shots) |
| `docs/audits/scanner-app/evidence/2026-08-14/NOTES.md`     | Real device shift & replay denial proof | Partial evidence recorded                |
| `.ai/workflow-v2/state.json`                               | Canonical workflow v2 state             | Synced with master `ec9d248`             |

---

_Audit completed and saved to `docs/audits/GATEFLOW_LAST_CHANGES_AUDIT_2026-08-19.md` on 2026-08-19._
