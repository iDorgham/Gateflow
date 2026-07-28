# SESSION MEMORY — resident_portal_responsive

## Active state

- Plan status: Active (Workflow v2 stage **checking** after Phase 06)
- Focused app: `resident-portal`
- Branch: `feat/resident-portal-phase-06`
- Last phase completed: **06 — Auth, session, tenant containment**
- Exact next action: `/github` (commit/push) then `/dev resident_portal_responsive 7`

## Durable decisions

- Single writer for Resident Portal pilot readiness: this plan slug.
- Do not re-build PortalShell/BottomNav unless acceptance fails.
- `/visitors/new` and `/open-qr/new` both stay (different permission shapes).
- Do not create empty pages for privacy/help links — remove/hide instead.
- Security > DX > UI when ordering remaining work.
- Session identity: prefer `orgId`, fall back to legacy `org`; never `dev-*` IDs.
- JWT secret: fail-closed via `getJwtSecretKey()` — no insecure default.

## Gotchas

- `node --experimental-strip-types --test` needs `.ts` import suffixes; exclude
  `**/*.test.ts` from `tsconfig` so `tsc` stays green.
- Cross-host cookie sharing with CD login remains unproven.
- `next.config.js` still rewrites `/api/resident/*` to localhost (Phase 07).
- `VisitorQRCard` still text placeholder (Phase 07).

## State handoff

- Modified: portal layout, data pages, auth/jwt-secret, session-claims,
  notifications/push org resolution, package.json test script, tsconfig
- Evidence: `phase_logs/PHASE_LOG_phase_06.md`
- Tests: 8/8 pass (`pnpm --filter resident-portal test`)
- Typecheck/lint: pass

## Resume from

`phases/07_api_qr_offline/PROMPT_phase_07.md`
