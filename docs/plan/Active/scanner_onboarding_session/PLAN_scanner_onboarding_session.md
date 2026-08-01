# PLAN: Scanner App — Onboarding & Session Management

**Slug:** `scanner_onboarding_session`  
**Initiative:** Structured Onboarding + Security + Shift Logs (ADS UI/UX)  
**Goal:** Wire device security, first-run onboarding, shift-gated scanning, and
device-proven pilot evidence for scanner-owned P0 steps.  
**Status:** Active — Phase 01 complete (aligned to audit `docs/audits/scanner-app/AUDIT_2026-07-30.md`)  
**Primary app:** `apps/scanner-app`  
**App scope:** `scanner-app` only (CD/API touch only where noted in Phase 03)  
**Target:** Q3 2026  
**Branch:** `feat/scanner_onboarding_session`  
**Audit commit baseline:** `a01ef8a5`  
**Workflow:** focused app `scanner-app` → stage `planned` after this refresh

---

## Architecture & ADS invariants

- Component library: Expo + React Native + `@gate-access/ui/tokens` (`nativeTokens`).
- Auth tokens: SecureStore only (never AsyncStorage for JWT).
- QR: HMAC-SHA256 via `@gate-access/types`; fail closed without `EXPO_PUBLIC_QR_SECRET`.
- Offline: encrypted queue; `scanUuid` is the dedup key.
- Global auth: `BiometricGuard` wrapping scanner operations after login/onboarding.
- Session: `ShiftSessionContext` — no scan without active shift (Phase 03).
- RTL/i18n: EN + AR on wizard and home (Phase 05 minimum; interim EN OK earlier).
- Tenant: any API/DB work must scope `organizationId`; soft-delete only when model has `deletedAt`.

---

## Audit-driven P0 gaps (must close before certify)

| Gap                                                    | Target phase              |
| ------------------------------------------------------ | ------------------------- |
| Wire biometric / secure PIN into runtime shell         | 01 (+ Guard polish in 05) |
| Fail closed on empty `EXPO_PUBLIC_QR_SECRET` (non-dev) | 01                        |
| Device-prove Security scans the QR + offline sync      | 05                        |
| Shift gate before scan                                 | 03                        |
| Onboarding wizard (PIN/bio/permissions)                | 02                        |

---

## Success metrics

- Device passcode or biometric required before scanner ops.
- Shift start/end logged per guard with org/gate scope.
- ADS semantic color/space tokens on new UI (no raw hex in new screens).
- Owned pilot steps device-proven (not unit-only).

---

## Phased roadmap

| Phase  | Title                              | Role              | Tool 1 | Goal                                                          |
| ------ | ---------------------------------- | ----------------- | ------ | ------------------------------------------------------------- |
| **01** | Security wiring & QR fail-closed   | MOBILE / SECURITY | Cursor | Wire existing PIN/bio hooks; fail closed QR secret; phase log |
| **02** | Onboarding wizard UI               | FRONTEND / MOBILE | Cursor | First-run wizard (welcome, PIN/bio, permissions)              |
| **03** | Shift logic & API                  | BACKEND-API       | Cursor | `shift/start                                                  | end` + block scan without active shift |
| **04** | Home screen redesign               | FRONTEND / MOBILE | Cursor | Master scan FAB + shift widget (8pt grid)                     |
| **05** | Polish, Guard, RTL, pilot evidence | QA / MOBILE       | Cursor | BiometricGuard inactivity, RTL, device pilot proofs           |

Phase 01 foundation (hooks, `ShiftLog` migration) is largely **done** in source —
remaining work is **wiring + fail-closed + evidence log**.

---

## Phase prompts

| Phase | Folder                         | Prompt               |
| ----- | ------------------------------ | -------------------- |
| 1     | `phases/01_security_auth/`     | `PROMPT_phase_01.md` |
| 2     | `phases/02_onboarding_wizard/` | `PROMPT_phase_02.md` |
| 3     | `phases/03_shift_management/`  | `PROMPT_phase_03.md` |
| 4     | `phases/04_home_redesign/`     | `PROMPT_phase_04.md` |
| 5     | `phases/05_polish_qa/`         | `PROMPT_phase_05.md` |

Supporting: `TASKS_scanner_onboarding_session.md`, `CONTEXT_scanner_onboarding_session.md`,
`SESSION_MEMORY.md`, `context/`, `phase_logs/`, `assets/`.

---

## After each phase

- Append `phase_logs/PHASE_LOG_phase_NN.md`.
- Tick `TASKS_scanner_onboarding_session.md` in the same commit.
- Run `pnpm --filter scanner-app test` (and lint/typecheck for touched surface).
- Do not `/certify` until Phase 05 device evidence refreshes
  `docs/audits/scanner-app/PILOT_GATE_*.json` to owned `passed`.

---

## Dependencies & risks

- `ShiftLog` already migrated — Phase 03 must use existing model + org scoping.
- Hardware biometrics vary across Android/iOS — always provide PIN fallback.
- Offline shift status at gate — define fail-closed vs last-known policy in Phase 03.
- Monolithic `App.tsx` (~1879 lines) — prefer extract modules when touching shell.

---

## Out of scope (this plan)

- Client Dashboard / Resident Portal product changes.
- Expo Router migration (docs drift cleanup only; optional small P1).
- Chat tab product redesign (P3 from audit).

---

_Aligned: 2026-07-30 audit · Original draft: 2026-03-31_
