# Phase 4: Fallback PIN Verification & Anti-Brute-Force Lockout

## Primary Role

SECURITY / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (PIN UI & lockout timer)
- **Tool 2**: Claude CLI (Cryptographic bounds & anti-brute-force)

## Context

- **Focused App**: `apps/scanner-app`
- **Scope**: `FallbackPinModal.tsx`, `secure-pin.ts`, `lockout-manager.ts`.
- **Packages**: `expo-secure-store`, `crypto-js`.

## Goal

Implement a 4-digit master device PIN fallback modal when biometrics fail or hardware is unavailable, reinforced by anti-brute-force rate limiting and lockout cooldown timers.

## Scope (In)

1. Fallback PIN Modal:
   - Provide a clean numeric pad modal allowing guard to enter the 4-digit device master PIN.
   - Verify PIN against salt-hashed storage in SecureStore (`verifyDevicePin`).
2. Brute-Force Protection:
   - Track consecutive failed PIN attempts.
   - Trigger 60-second lockout after 3 consecutive failures.
   - Display countdown timer on locked screen.
3. Unit tests:
   - Correct PIN unlocks device.
   - Failed PIN increments failure counter.
   - 3rd failed PIN triggers lockout timer.
4. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] PIN fallback works reliably when biometrics fail or are cancelled.
- [ ] 3 consecutive incorrect PIN entries locks the device for 60 seconds.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
