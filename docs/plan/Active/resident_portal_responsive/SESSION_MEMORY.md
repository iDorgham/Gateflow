# SESSION MEMORY — resident_portal_responsive

## Active state

- Plan status: Active (Workflow v2 stage **developing** after Phase 07)
- Focused app: `resident-portal`
- Branch: `feat/resident-portal-phase-06`
- Last phase completed: **07 — API proxy, scannable QR, offline read**
- Exact next action: push + new draft PR (PR #197 merged), then `/dev resident_portal_responsive 8`

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

## Gotchas

- `node --experimental-strip-types --test` needs `.ts` import suffixes; exclude
  `**/*.test.ts` from `tsconfig` so `tsc` stays green.
- Cross-host cookie sharing with CD login remains unproven.
- `offline-cache.ts` is client-only (IndexedDB); unit tests cover
  `resolveDisplayedQrCode` selection, not IDB itself.
- Push register uses same `resolveResidentApiBase()` as rewrites.

## State handoff

- Modified: `api-upstream.cjs`, `api-upstream.ts`, `next.config.js`, QR cards,
  offline-aware visitor QR, `resident-api-fetch.ts`, history/maintenance pages,
  push/register route, `phase07.test.ts`, `.env.example`, TASKS, phase log
- Evidence: `phase_logs/PHASE_LOG_phase_07.md`
- Tests: 16/16 pass (`pnpm --filter resident-portal test`)
- Typecheck/lint: pass
- Commit: not yet (await `/github`)

## Context budget

L0–L3 + L5 + phase 07 prompt; no speculative L4 schema pack.

## Resume from

`phases/08_pilot_ux/PROMPT_phase_08.md` (after `/github`)
