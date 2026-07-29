# PHASE LOG — Phase 09 i18n/RTL, tests, measurable evidence

**Plan:** `resident_portal_responsive`  
**Date:** 2026-07-29  
**Branch:** `feat/resident-portal-phase-09`  
**App:** `apps/resident-portal`

## Goal

Close a11y/RTL debt on P0 routes with an explicit EN interim strategy; expand
Phase 06–07 regression tests; record Lighthouse/PWA deferral; backfill logs 01–05.

## What changed

- `portal-i18n.ts` — EN-only interim policy; `resolveHtmlDocumentAttrs`; logical
  class mapper; AR `dir` ready when locale is supplied later
- Root layout — explicit `lang` + `dir` from policy (no bare `lang="en"` only)
- Logical CSS on P0-touched UI: visitor/open-QR cards & forms, visitors list,
  FAB, maintenance form controls, notification toggle
- `session-claims` / `qr-display` — trim whitespace so blank IDs/codes fail closed
- `resident-api-url.ts` — pure path join for tests without `next/headers`
- Tests — `phase09.test.ts` (+ package.json test script); suite **30/30**
- Evidence — `docs/audits/resident-portal/LIGHTHOUSE_PWA_DEFERRAL_2026-07-29.md`
- Backfill — `PHASE_LOG_phase_01` … `05`

## Commands

```bash
pnpm --filter resident-portal test      # 30 pass
pnpm --filter resident-portal typecheck # pass
pnpm --filter resident-portal lint      # pass
```

## Workflow

- Focused app: `resident-portal`
- Stage after phase: `checking`
- Scope diff: focused-app OK
- Lock: released (`cursor-dev-phase09`)

## Residual / external gates

- Full AR content pack deferred (expiry 2026-08-31).
- Lighthouse/PWA measurement deferred to Phase 10
  (`LIGHTHOUSE_PWA_DEFERRAL_2026-07-29.md`).

## Next

`/github` then Phase 10 — pilot gate & certification packet.
