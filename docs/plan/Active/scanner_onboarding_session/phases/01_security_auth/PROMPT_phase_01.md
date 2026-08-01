# Phase 1: Security wiring & QR fail-closed

## Primary role

MOBILE / SECURITY

## Tool selection

|            | Tool            | Why                                                |
| ---------- | --------------- | -------------------------------------------------- |
| **Tool 1** | Cursor          | Mobile/Expo shell edits; master applies + verifies |
| **Tool 2** | Qwen CLI (free) | Fallback if Cursor busy; obey 80% CLI limits       |

## Context

- **Focused app:** `scanner-app` (stage `planned` → developing on `/dev`)
- **Plan:** `docs/plan/Ready/scanner_onboarding_session/`
- **Audit:** `docs/audits/scanner-app/AUDIT_2026-07-30.md`
- **Existing foundation (do not re-create):** `src/lib/security/secure-pin.ts`,
  `src/hooks/use-biometry.ts`, Prisma `ShiftLog` migration applied
- **Rules:** pnpm only; SecureStore for tokens/PIN; HMAC QR; no unsigned QR;
  `organizationId` on any DB touch; no product work outside `apps/scanner-app`
  except docs/tests for this phase
- **Pilot step:** Security scans the QR (enablement — device proof in Phase 05)

## Goal

Wire existing PIN/biometric helpers into the post-login path and fail closed
when the QR HMAC secret is missing outside explicit development.

## Scope (in)

- Post-login device unlock gate before scanner shell (PIN and/or biometrics).
- Fail-closed behavior for empty `EXPO_PUBLIC_QR_SECRET` when not in explicit
  local/dev mode.
- Unit tests for new helpers / fail-closed branches.
- `phase_logs/PHASE_LOG_phase_01.md`.

## Scope (out)

- Onboarding wizard UI (Phase 02).
- Shift APIs (Phase 03).
- Home redesign (Phase 04).
- Device pilot screenshots (Phase 05).
- Expo Router migration.

## Shared packages

- Read-only: `@gate-access/types` (QR verify), `@gate-access/ui/tokens`.
- No Prisma schema changes expected this phase.

## Security boundaries

- Never log PIN or tokens.
- Tokens remain in SecureStore.
- QR secret must not be committed; empty secret must not allow production scans.
- Do not weaken HMAC verification.

## Page / screen acceptance

| Screen            | Criteria                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `/login` → unlock | After successful login (or session restore), unlock required before tabs |
| `/scanner`        | Unreachable without unlock when PIN/bio configured                       |
| QR path           | With empty secret in non-dev, scan path refuses with clear error         |

## Steps (ordered)

1. TDD: failing tests for fail-closed QR secret helper and unlock gate.
2. Implement fail-closed check used by scan path in `App.tsx` / `scanner` lib.
3. Wire `secure-pin` + `useBiometry` into post-auth unlock UI (minimal, ADS tokens).
4. Keep PIN fallback when biometrics unavailable.
5. `pnpm --filter scanner-app test` (and lint/typecheck for touched files).
6. Write `phase_logs/PHASE_LOG_phase_01.md`; tick TASKS.
7. Commit on `feat/scanner_onboarding_session` when user asks `/github` or commit.

## Acceptance criteria

- [ ] Unlock gate runs before scanner shell when PIN or bio enrolled.
- [ ] Empty `EXPO_PUBLIC_QR_SECRET` fails closed outside explicit dev mode.
- [ ] Existing HMAC verify tests still pass; new tests cover fail-closed/unlock.
- [ ] `pnpm --filter scanner-app test` green.
- [ ] Phase log + TASKS updated.
- [ ] No parked-app product code in the diff.

## Stop conditions

- Do not implement wizard, shift APIs, or home redesign.
- Do not claim device pilot evidence in this phase.
