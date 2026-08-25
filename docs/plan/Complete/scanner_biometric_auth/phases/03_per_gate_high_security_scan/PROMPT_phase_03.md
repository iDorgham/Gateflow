# Phase 3: Per-Gate High-Security Scan Enforcement

## Primary Role

FRONTEND / MOBILE

## Tool Selection

- **Tool 1**: Cursor IDE (Scanner view & scan pipeline integration)
- **Tool 2**: Opencode CLI (Scan log metadata tests)

## Context

- **Focused App**: `apps/scanner-app`
- **Scope**: `ScannerScreen.tsx`, scan pipeline, and scan log serialization.
- **Packages**: `@gate-access/types`, `packages/db`.

## Goal

Implement gate-level biometric security policy enforcement that prompts for biometric verification on high-security gates and records the biometric verification status in scan audit trails.

## Scope (In)

1. Gate Policy Hook:
   - Check if current active gate requires biometric verification (`gate.requireBiometric`).
2. Scan Gate Check:
   - When scanning at a high-security gate with an expired grace period, prompt biometric verify before submitting scan payload.
3. Audit Log Metadata:
   - Append `biometricVerified: true` to local `ScanLog` record and server sync payload.
4. Unit tests:
   - High-security gate vs standard gate scan policy evaluation.
   - Scan log payload serialization tests.
5. Write `phase_logs/PHASE_LOG_phase_03.md`.

## Acceptance Criteria

- [ ] Standard gates scan smoothly without blocking.
- [ ] High-security gates trigger biometric check when grace period is expired.
- [ ] `biometricVerified: true` is persisted in scan logs.
- [ ] Unit tests pass cleanly.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_03.md` created.
