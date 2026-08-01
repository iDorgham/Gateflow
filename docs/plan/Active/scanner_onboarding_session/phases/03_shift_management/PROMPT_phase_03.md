# Phase 3: Shift Management System & API

## Primary role

BACKEND-API

## Preferred tool

- [ ] Claude CLI — only if under 80% limit; proposals only until Cursor verifies
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [x] Cursor IDE — Tool 1 (API + client wiring; master verifies)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Focused app:** `scanner-app`; API routes may live under `apps/client-dashboard`
  (or gateway) only for `shift/start|end` — keep diff minimal and tenant-scoped
- **Pilot step:** enables accountable scanning (device proof still Phase 05)
- **Packages:** `@gate-access/db` for `ShiftLog` (already migrated); types as needed
- **Rules:** pnpm only; every query `organizationId` + `deletedAt: null` if field
  exists; SecureStore/session for client shift state
- **Refs:** `PLAN_scanner_onboarding_session.md`, `ShiftLog` schema,
  `docs/audits/scanner-app/AUDIT_2026-07-30.md`

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

- [x] Successful clock-in creates a `ShiftLog` record. (`POST /api/scanner/shift/start`)
- [x] Scan logs are associated with the active `ShiftId` when submitted. (`auditTrail.shiftLogId`)
- [x] Guards cannot scan without an active shift. (client + validate `no_active_shift`)
- [x] All tests pass (`scanner-app` 89; shift+validate API 35)
- [ ] Build green (`pnpm turbo build --filter=scanner-app`) — deferred to `/github` preflight
- [x] 100% IDOR protection: shift queries must maintain org context.
