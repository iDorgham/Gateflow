# Phase 5: Polish, BiometricGuard, RTL, pilot evidence

## Primary role

QA / MOBILE

## Tool selection

|            | Tool                   | Why                                              |
| ---------- | ---------------------- | ------------------------------------------------ |
| **Tool 1** | Cursor                 | Device evidence + mobile polish; master verifies |
| **Tool 2** | Opencode / Qwen (free) | Secondary review only; obey 80% CLI limits       |

## Context

- **Focused app:** `scanner-app`
- **Plan:** `docs/plan/Ready/scanner_onboarding_session/`
- **Audit / pilot:** `docs/audits/scanner-app/AUDIT_2026-07-30.md`,
  `PILOT_GATE_2026-07-30.json`
- **Pilot steps (owned):** Security scans the QR; Offline scan sync
- **Rules:** Never invent device evidence; screenshots + dated notes required.
  Receipts/evidence only — no checkbox-as-proof.

## Goal

Production-ready session security polish, RTL pass, and **device-proven**
owned pilot steps so `/check` → `/pilot` can clear scanner blockers.

## Scope (in)

- Global `BiometricGuard` with inactivity timeout.
- Motion polish on wizard/home (Reanimated).
- RTL / Arabic layout pass for wizard + home (logical positioning).
- Error boundaries + loading states for duty widgets.
- Device run: scan a signed QR; capture evidence.
- Device run: offline enqueue + sync; capture evidence.
- Update `docs/audits/scanner-app/PILOT_GATE_*.json` owned steps to `passed`
  with artifact paths (new dated evidence folder).

## Scope (out)

- New product features beyond onboarding/session.
- Certify (user must run `/certify` after gates clear).
- CD/Resident Portal changes.

## Shared packages

- `@gate-access/ui/tokens`, `@gate-access/types` (read).
- Optional `@gate-access/i18n` if already suitable for RN — otherwise local
  interim strings with RTL layout only (document choice in phase log).

## Security boundaries

- Guard must not store PIN in logs or AsyncStorage.
- Device evidence must not include secrets, full JWTs, or `.env`.
- Offline sync must preserve `scanUuid` dedup contract.

## Page / screen acceptance

| Screen      | Criteria                                                              |
| ----------- | --------------------------------------------------------------------- |
| Shell       | Inactivity re-locks; unlock restores scanner                          |
| Wizard/home | RTL layout does not break primary actions                             |
| `/scanner`  | Live device scan of signed QR succeeds or fails for documented reason |
| Offline     | Enqueued scan syncs with `scanUuid` after reconnect                   |

## Steps (ordered)

1. Implement/wire `BiometricGuard` inactivity lock around scanner shell.
2. Motion + error/loading polish for duty widgets.
3. RTL walkthrough (AR) for wizard + home; fix logical layout issues.
4. Device evidence session (signed QR + offline sync); store under
   `docs/audits/scanner-app/evidence/<date>/`.
5. Refresh pilot gate + brief evidence markdown.
6. `pnpm --filter scanner-app test`; phase log + TASKS.
7. Stop before `/certify` unless user explicitly runs it.

## Acceptance criteria

- [ ] BiometricGuard inactivity lock works with PIN fallback.
- [ ] RTL pass documented (issues fixed or deferred with expiry).
- [ ] Owned pilot steps `passed` with real artifact paths.
- [ ] Tests still green.
- [ ] Phase log + TASKS updated.

## Stop conditions

- Do not fabricate screenshots or mark pilot `passed` from unit tests alone.
- Do not `/certify` inside this phase without explicit user command.
