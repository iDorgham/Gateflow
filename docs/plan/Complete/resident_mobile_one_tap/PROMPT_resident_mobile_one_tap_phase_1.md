# PROMPT — resident_mobile_one_tap — Phase 1

**Plan:** `docs/plan/Active/resident_mobile_one_tap/PLAN_resident_mobile_one_tap.md`  
**Phase:** 1 — Core Foundation + Biometric + QR Display  
**Target:** `apps/resident-mobile`  
**Role:** Mobile & Security Engineer

---

## Objective

Implement a fail-closed, biometric-first authentication gate and full-screen HMAC QR display in `apps/resident-mobile`. Deliver time-to-QR in $\le 800\text{ms}$, 3-attempt PIN fallback, SecureStore encryption with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, 45–60s session timeout via AppState, and seamless offline QR caching.

## Deliverables

1. `src/features/one-tap/hooks/useBiometricAuth.ts`
2. `src/features/one-tap/hooks/useSecureQR.ts`
3. `src/features/one-tap/components/BiometricGate.tsx`
4. `src/features/one-tap/components/FullScreenQR.tsx`
5. `src/features/one-tap/components/PinFallbackModal.tsx`
6. `src/features/one-tap/screens/OneTapHomeScreen.tsx`
7. `src/features/one-tap/index.ts`
8. Integration in `apps/resident-mobile/app/index.tsx`
9. Unit tests for hooks and components
