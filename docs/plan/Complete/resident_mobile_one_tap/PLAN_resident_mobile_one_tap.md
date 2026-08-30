# PLAN — resident_mobile_one_tap

**Initiative:** `resident_mobile_one_tap`  
**Target App:** `apps/resident-mobile`  
**Status:** ✅ Complete  
**Priority:** P1  
**Created:** 2026-08-30

---

## Executive Summary

Resident Mobile One-Tap delivers a high-speed, zero-friction, biometric-first pass experience for gated community residents. Upon launch, authenticated residents are presented with biometric authentication (Face ID / Touch ID) with seamless PIN fallback. On unlock in $\le 800\text{ms}$, a full-screen, high-contrast, cryptographically signed (HMAC-SHA256) QR code appears with offline caching, auto-refresh countdown, and 3-tap instant visitor sharing.

---

## Phase Breakdown

### Phase 1: Core Foundation + Biometric + QR Display

- **Role:** Mobile & Security Engineer
- **Scope:**
  - Create `src/features/one-tap/` architecture
  - Implement `useBiometricAuth.ts` with `expo-local-authentication` and 3-attempt failover
  - Implement `useSecureQR.ts` with `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`) and offline fallback
  - Build `BiometricGate.tsx`, `FullScreenQR.tsx`, `PinFallbackModal.tsx`, `OneTapHomeScreen.tsx`
  - Enforce session timeout (45–60s) via `AppState`
- **Done when:** Biometric unlock displays valid QR in $\le 800\text{ms}$ + PIN fallback functions reliably.

### Phase 2: Instant Visitor Sharing

- **Role:** Frontend & UX Engineer
- **Scope:**
  - Implement `src/features/visitor-share/` with templates (Family, Driver, Contractor, Day-Guest)
  - Create `useVisitorInvite.ts`, `useShareVisitor.ts`, `VisitorTemplatePicker.tsx`, `ShareSheet.tsx`
  - Local rate limiting (15 invites/hour) + invite status lifecycle tracking
- **Done when:** Visitor pass is generated and shared in $\le 3$ taps.

### Phase 3: Smart Arrival Notifications

- **Role:** Mobile & Backend Integrations Engineer
- **Scope:**
  - Implement `src/features/notifications/` with interactive push handling
  - Push token registration, interactive actions (Open Gate, Reject, Call Guard)
  - Latency SLA $\le 3$ seconds from guard scan event
- **Done when:** Interactive push triggers and actions execute in $\le 3\text{s}$.

### Phase 4: Security + Compliance + Audit

- **Role:** Security & Compliance Specialist
- **Scope:**
  - Implement `src/features/security/` with `useAuditLogger.ts` and `piiMasking.ts`
  - Strict `organizationId` isolation, zero sensitive PII in client UI
  - Replay and session hijacking protection
- **Done when:** Every mutation is audited with zero PII leaks.

### Phase 5: Final Polish + Quality

- **Role:** QA & Design System Specialist
- **Scope:**
  - ADS Comfortable Density token audit, dark/light mode, Arabic RTL & Cairo font
  - Loading skeletons, empty states, performance & battery benchmark
  - Automated unit & integration tests + preflight green
- **Done when:** 100% test pass rate and pristine visual polish.
