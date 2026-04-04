# Context snapshot — `scanner_onboarding_session`

> Regenerate or extend when `ShiftLog`, scanner APIs, or auth flows change. Deeper notes: `context/` (api, contracts, database, design, structure, documentation).

## Product

- **Goal:** Onboarding wizard, biometric/passcode gate, shift session management, premium home scan UX.
- **Plan:** `PLAN_scanner_onboarding_session.md` (plan folder root).

## Schema / data

- **`ShiftLog`** — guard shift windows; all queries scoped by `organizationId` with soft-delete rules where applicable.

## Key paths

- `apps/scanner-app/` — Expo scanner app
- `packages/db/prisma/schema.prisma` — `ShiftLog` and related models
- `@gate-access/ui/tokens` — native-safe resolved tokens (not raw `token()` CSS refs)

## Contracts

- `.antigravity/contracts/CONTRACTS.md` — tenant scoping, SecureStore for secrets, signed QR invariants unchanged.

## Env (typical)

- Scanner API base URL, org context — per app config (no secrets here).
