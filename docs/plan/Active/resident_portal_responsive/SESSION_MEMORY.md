# SESSION MEMORY — resident_portal_responsive

## Active state

- Plan status: Active (Workflow v2 stage **checking** after Phase 09)
- Focused app: `resident-portal`
- Branch: `feat/resident-portal-phase-09`
- Last phase completed: **09 — i18n/RTL, tests, measurable evidence**
- Exact next action: `/dev resident_portal_responsive 10` (after PR green)

## Durable decisions

- Single writer for Resident Portal pilot readiness: this plan slug.
- Do not re-build PortalShell/BottomNav unless acceptance fails.
- `/visitors/new` and `/open-qr/new` both stay (different permission shapes).
- Do not create empty pages for privacy/help links — remove/hide instead.
- Security > DX > UI when ordering remaining work.
- Session identity: prefer `orgId`, fall back to legacy `org`; never `dev-*` IDs;
  trim whitespace on org claims.
- JWT secret: fail-closed via `getJwtSecretKey()` — no insecure default.
- API upstream: `RESIDENT_API_UPSTREAM` preferred over `NEXT_PUBLIC_API_URL`;
  production fail-closed (no localhost rewrite default).
- Portal never mints unsigned QR — only renders server-signed `code` strings;
  whitespace-only codes treated as empty.
- Revoke uses existing CD `DELETE /api/resident/visitors/:id` via portal rewrite.
- Sign Out clears client session cookies only (no secret leakage).
- **i18n interim (Phase 09):** EN-only with explicit `lang`/`dir="ltr"`;
  logical CSS on P0; full AR pack deferred to `2026-08-31` (owner
  `resident-portal-pilot`). See `portal-i18n.ts`.
- **Lighthouse/PWA:** dated deferral
  `docs/audits/resident-portal/LIGHTHOUSE_PWA_DEFERRAL_2026-07-29.md`
  (expiry 2026-08-31).

## Gotchas

- `node --experimental-strip-types --test` needs `.ts` import suffixes; exclude
  `**/*.test.ts` from `tsconfig` so `tsc` stays green.
- Do not import modules that pull `next/headers` from node:test — use pure
  helpers (`resident-api-url.ts`, `portal-i18n.ts`, etc.).
- Cross-host cookie sharing with CD login remains unproven.
- `offline-cache.ts` is client-only (IndexedDB); unit tests cover
  `resolveDisplayedQrCode` selection, not IDB itself.
- Push register uses same `resolveResidentApiBase()` as rewrites.
- Phases 06–08 landed via PRs #197–#199 on master; Phase 09 continues on
  `feat/resident-portal-phase-09`.

## State handoff

- Phase 09 modified: root layout lang/dir, logical CSS on P0 components,
  portal-i18n, qr-display/session trim, resident-api-url, phase09 tests,
  Lighthouse deferral doc, phase logs 01–05 + 09
- Evidence:
  - `phase_logs/PHASE_LOG_phase_09.md`
  - `docs/audits/resident-portal/LIGHTHOUSE_PWA_DEFERRAL_2026-07-29.md`
- Tests: 30/30 pass
- Typecheck/lint: pass
- Workflow stage: `checking` (lock released)
- Commit: not yet (await `/github`)

## Context budget

L0–L3 + L5 + phase 09 prompt; no speculative L4 schema pack.

## Resume from

`phases/10_*/PROMPT_phase_10.md` (after `/github`)
