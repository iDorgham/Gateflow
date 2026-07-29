# SESSION MEMORY — resident_portal_responsive

## Active state

- Plan status: Active (Workflow v2 stage **developing** after Phase 08)
- Focused app: `resident-portal`
- Branch: `feat/resident-portal-phase-06`
- Draft PR: https://github.com/iDorgham/Gateflow/pull/198 (Phase 07 at `d0dba59f`)
- Last phase completed: **08 — Pilot UX completion**
- Exact next action: `/github` (commit/push Phase 08 onto PR 198) then
  `/dev resident_portal_responsive 9`

## Durable decisions

- Single writer for Resident Portal pilot readiness: this plan slug.
- Do not re-build PortalShell/BottomNav unless acceptance fails.
- `/visitors/new` and `/open-qr/new` both stay (different permission shapes).
- Do not create empty pages for privacy/help links — remove/hide instead.
- Security > DX > UI when ordering remaining work.
- Session identity: prefer `orgId`, fall back to legacy `org`; never `dev-*` IDs.
- JWT secret: fail-closed via `getJwtSecretKey()` — no insecure default.
- API upstream: `RESIDENT_API_UPSTREAM` preferred over `NEXT_PUBLIC_API_URL`;
  production fail-closed (no localhost rewrite default).
- Portal never mints unsigned QR — only renders server-signed `code` strings.
- Revoke uses existing CD `DELETE /api/resident/visitors/:id` via portal rewrite.
- Sign Out clears client session cookies only (no secret leakage).

## Gotchas

- `node --experimental-strip-types --test` needs `.ts` import suffixes; exclude
  `**/*.test.ts` from `tsconfig` so `tsc` stays green.
- Cross-host cookie sharing with CD login remains unproven.
- `offline-cache.ts` is client-only (IndexedDB); unit tests cover
  `resolveDisplayedQrCode` selection, not IDB itself.
- Push register uses same `resolveResidentApiBase()` as rewrites.
- PR #197 (Phase 06) is merged; Phase 07+ continues on same branch via PR #198.
- Pre-push runs broad turbo checks — expect long push times.

## State handoff

- Phase 08 modified: profile, visitor detail actions, create empty states,
  auth cookie clear, sign-out action, `pilot-ux.ts` + phase08 tests
- Evidence: `phase_logs/PHASE_LOG_phase_08.md`
- Tests: 21/21 pass
- Typecheck/lint: pass
- Commit: not yet (await `/github`)

## Context budget

L0–L3 + L5 + phase 08 prompt; no speculative L4 schema pack.

## Resume from

`phases/09_*/PROMPT_phase_09.md` (after `/github`)
