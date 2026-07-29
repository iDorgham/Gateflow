# SESSION MEMORY — resident_portal_responsive

## Active state

- Plan status: **Complete** (all 10 phases done; app still Workflow `checking`)
- Focused app: `resident-portal`
- Branch: `feat/resident-portal-phase-10`
- Draft PR: https://github.com/iDorgham/Gateflow/pull/201
- Head SHA (pre-cookie-fix): `31558779`
- Base: `origin/master` @ `a7a9548a` (PR #200 merged)
- Last phase completed: **10 — Pilot gate & certification packet**
- Browser probe: `BROWSER_SESSION_EVIDENCE_2026-07-29.md` — SSO **failed** live
- Exact next action: set `AUTH_COOKIE_DOMAIN=.gateflow.site` on CD prod + deploy;
  create RESIDENT+unit fixture; re-run portal browser create/QR/offline
- Do **not** `/certify` (packet `valid:false`)

## Durable decisions

- Single writer for Resident Portal pilot readiness: this plan slug.
- Certification packet stays honest `valid:false` until owned steps are `passed`.
- Owned pilot steps use `partial` + deferral/externalGate (never undocumented `missing`).
- `aggregateEvidence` treats `n/a` as non-blocking (other-app steps).
- Live 2026-07-29: host-only cookies block portal SSO; Domain via `AUTH_COOKIE_DOMAIN`.
- Live 2026-07-29: mediaBubble **Residents: 0** — fixture required for portal flows.
- Security > DX > UI; no unsigned QR; JWT/API upstream fail-closed.

## Gotchas

- Portal host is `portal.gateflow.site` (not `resident.gateflow.site`).
- Cookie Domain fix lives in **client-dashboard**, not resident-portal.
- CSRF cookie on login should share the same parent domain as auth cookies.
- Full pilot-evidence ready=false until 4 owned steps are `passed`.

## State handoff

- Browser evidence:
  - `docs/audits/resident-portal/BROWSER_SESSION_EVIDENCE_2026-07-29.md`
  - `docs/audits/resident-portal/evidence/2026-07-29-browser/`
- Updated:
  - `PILOT_GATE_2026-07-29-phase10.json` (+ owned)
  - `DEFERRALS_2026-07-29.json`
  - `CERTIFICATION_PACKET_2026-07-29.{json,md}`
- Code staged (may be uncommitted): `apps/client-dashboard/src/lib/auth-cookies.ts`
  (+ login/onboarding CSRF/domain wiring, tests, env docs)
