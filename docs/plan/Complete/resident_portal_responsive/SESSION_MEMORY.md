# SESSION MEMORY — resident_portal_responsive

## Active state

- Plan status: **Complete** (all 10 phases done; app still Workflow `checking`)
- Focused app: `resident-portal`
- Branch: `feat/resident-portal-phase-10`
- Draft PR: https://github.com/iDorgham/Gateflow/pull/201
- Head SHA: (update after check evidence commit)
- Base: `origin/master` @ `a7a9548a` (PR #200 merged)
- Last phase completed: **10 — Pilot gate & certification packet**
- Exact next action: clear browser/session deferrals before `/pilot`; do not `/certify`
- Check evidence: `docs/audits/resident-portal/CHECK_ALL_2026-07-29.json` (status blocked on pilot)

## Durable decisions

- Single writer for Resident Portal pilot readiness: this plan slug.
- Certification packet is honest `valid:false` while owned steps are `partial`
  and browser evidence is deferred.
- Owned pilot steps must never be undocumented `missing` — use `partial` +
  deferral/externalGate with owner/expiry.
- `aggregateEvidence` treats `n/a` as non-blocking (other-app steps).
- i18n interim EN-only; Lighthouse/PWA deferred to 2026-08-31.
- Security > DX > UI; no unsigned QR; JWT/API upstream fail-closed.

## Gotchas

- Plan folder now under `docs/plan/Complete/resident_portal_responsive/`.
- Full pilot-evidence ready=false until 4 owned steps are `passed`.
- Cross-subdomain session is an operations external gate.
- Page scores still `securityBoundaryProven=false` (capped).

## State handoff

- Phase 10 artifacts:
  - `docs/audits/resident-portal/PILOT_GATE_2026-07-29-phase10.json`
  - `docs/audits/resident-portal/PILOT_GATE_OWNED_2026-07-29-phase10.json`
  - `docs/audits/resident-portal/DEFERRALS_2026-07-29.json`
  - `docs/audits/resident-portal/CERTIFICATION_PACKET_2026-07-29.{json,md}`
  - `scripts/workflow-v2/support.js` (n/a ignore)
- Tests: resident-portal 30/30; workflow support 8/8
- Commit: await `/github`

## Context budget

L0–L3 + L5 + phase 10 prompt; no L4 schema pack.

## Resume from

`/github` → `/check all` (static). Browser gates before `/pilot` / `/certify`.
