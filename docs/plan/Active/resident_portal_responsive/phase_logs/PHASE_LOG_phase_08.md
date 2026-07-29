# PHASE LOG — Phase 08 Pilot UX completion

**Plan:** `resident_portal_responsive`  
**Date:** 2026-07-29  
**Branch:** `feat/resident-portal-phase-06`  
**App:** `apps/resident-portal`  
**Head (Phase 07):** `d0dba59f` · PR https://github.com/iDorgham/Gateflow/pull/198

## Goal

Remove dead-end controls that block honest pilot demos: revoke/share/download,
Sign Out, hide missing settings pages, explicit unit-missing empty states.

## What changed

- `VisitorPassActions` — Share (Web Share / clipboard), Download (SVG/text),
  Revoke via `DELETE /api/resident/visitors/:id` (existing CD API)
- `signOutAction` + `SignOutButton` — clears `gf_access_token` /
  `gf_refresh_token` / csrf cookie, redirects `/login`
- Profile — removed `/settings/privacy` and `/settings/help` links
- `UnitRequiredEmpty` on `/visitors/new` and `/open-qr/new`
- Tests — `src/lib/phase08.test.ts` (revoke path, share payload, unit copy)

## Commands

```bash
pnpm --filter resident-portal test      # 21 pass
pnpm --filter resident-portal typecheck # pass
pnpm --filter resident-portal lint      # pass
```

## Residual / external gates

- Revoke depends on cookie forwarding through Next rewrite to CD API.
- Cross-subdomain session with CD login still unproven (Phase 10).

## Next

`/github` then Phase 09 — i18n/RTL, tests, measurable evidence.
