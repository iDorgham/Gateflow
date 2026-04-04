# Phase 1: Security & Auth Hooks

## Primary role

BACKEND

## Preferred tool

- [x] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [ ] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: scanner-app (Expo/ReactNative)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `docs/development/initiatives/IDEA_scanner_onboarding_session.md`, `PLAN_scanner_onboarding_session.md` (plan folder root), `CONTEXT_scanner_onboarding_session.md`, `context/`

## Goal

> Establish the security and data foundation for biometric authentication and
> shift logging in the scanner app.

## Scope (in)

- `expo-local-authentication` and `expo-secure-store` setup in `apps/scanner-app`.
- `SecurePINStorage` utility for 4-digit and 6-digit guard passcodes.
- `useBiometry` hook to abstract FaceID/Fingerprint authentication logic.
- `ShiftLog` schema update in `packages/db/prisma/schema.prisma` (id, guardId,
  gateId, startTime, endTime, organizationId).
- `shift:migrate` task to run migrations.

## Scope (out)

- Onboarding Wizard UI (Phase 2).
- Shift Clock-in/out API (Phase 3).

## Steps (ordered)

1. Add `expo-local-authentication` and `expo-secure-store` to `scanner-app`.
2. Implement `apps/scanner-app/src/lib/security/secure-pin.ts` (storage).
3. Build `apps/scanner-app/src/hooks/use-biometry.ts` (authentication).
4. Update `packages/db/prisma/schema.prisma` with the `ShiftLog` model.
5. Create a new migration: `pnpm turbo db:migrate --filter=db`.
6. Run `pnpm turbo lint --filter=scanner-app`
7. Run `pnpm turbo typecheck --filter=scanner-app`
8. Run `pnpm turbo test --filter=scanner-app`
9. Commit: `git commit -m "feat(scanner): biometric and shift log foundation"`

## Acceptance criteria

- [ ] Device biometric support is detectable via `useBiometry`.
- [ ] Passcodes can be securely stored and retrieved without being readable.
- [ ] `ShiftLog` model exists in the database with `organizationId` scoping.
- [ ] All tests pass (`pnpm turbo test --filter=scanner-app`)
- [ ] Build green (`pnpm turbo build --filter=scanner-app`)
- [ ] Multi-tenant isolation verified on `ShiftLog` model.
