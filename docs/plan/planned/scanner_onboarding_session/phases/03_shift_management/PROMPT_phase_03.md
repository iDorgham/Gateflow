# Phase 3: Shift Management System & API

## Primary role

BACKEND-API

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
- **Apps**: scanner-app (the primary target)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `PLAN_scanner_onboarding_session.md`, `ShiftLog` schema.

## Goal

> Implement the logical backend for clock-in/out shifts and connect them to
> all scanning activities for accountability.

## Scope (in)

- API endpoint: `POST /api/scanner/shift/clock-in` (accepts Gate Permission QR).
- API endpoint: `POST /api/scanner/shift/clock-out`.
- `useShiftSession` hook in `scanner-app` to persist local shift status.
- Session middleware ensuring a Shift is active for any Scan submission.

## Scope (out)

- Home Screen redesign (Phase 4).
- High-density stats widget (Phase 4).

## Steps (ordered)

1. Build the `/api/scanner/shift/clock-in` endpoint in `client-dashboard/api`
   layer (bridging scanner app and db).
2. Validate the incoming "Gate Permission QR" matches the guard's Site/Org.
3. Build the `/api/scanner/shift/clock-out` endpoint.
4. Implement `apps/scanner-app/src/hooks/use-shift-session.ts` (storage).
5. Add `ShiftId` verification to the scan logic: block submission if the
   current session doesn't have an active shift.
6. Run `pnpm turbo lint --filter=scanner-app`
7. Run `pnpm turbo typecheck --filter=scanner-app`
8. Run `pnpm turbo test --filter=scanner-app`
9. Commit: `git commit -m "feat(scanner): shift-management logic with clock-in/out API"`

## Acceptance criteria

- [ ] Successful clock-in creates a `ShiftLog` record.
- [ ] Scan logs are associated with the active `ShiftId` when submitted.
- [ ] Guards cannot scan without an active shift.
- [ ] All tests pass (`pnpm turbo test --filter=scanner-app/db`)
- [ ] Build green (`pnpm turbo build --filter=scanner-app`)
- [ ] 100% IDOR protection: shift queries must maintain org context.
