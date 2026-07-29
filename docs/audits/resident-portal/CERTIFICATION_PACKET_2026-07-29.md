# Resident Portal — Certification packet (Phase 10)

**Packet ID:** `RESIDENT_PORTAL_CERTIFICATION_PACKET_2026_07_29`  
**App:** `resident-portal`  
**Commit:** `a7a9548a` (master after PR #200; Phase 10 adds evidence docs)  
**Created:** 2026-07-29  
**Expires:** 2026-08-31  
**`valid`:** `false` (honest — not certify-ready)  
**Review mode:** `static-review-only`  
**Phase 09 PR (merged):** https://github.com/iDorgham/Gateflow/pull/200

## Verdict

Phase 06–09 closed the **source/unit** P0 gaps from the 2026-07-29 audit
(auth/tenant, API upstream, scannable QR, offline read, pilot UX, i18n interim).
Owned pilot steps are no longer undocumented `missing`; each is `partial` with
source evidence plus a dated deferral or external gate.

**Do not run `/certify`.** Workflow stage stays `checking`. Use this packet for
`/check all` without inventing browser proof.

## Checks (app-scoped)

| Check      | Status | Evidence                                   |
| ---------- | ------ | ------------------------------------------ |
| Unit tests | passed | 30/30 `pnpm --filter resident-portal test` |
| Typecheck  | passed | `pnpm --filter resident-portal typecheck`  |
| Lint       | passed | `pnpm --filter resident-portal lint`       |
| PR CI      | passed | PR #200 Lint/Typecheck/Test/Security/CI OK |

## Pilot coverage

| Scope                        | Result                                      |
| ---------------------------- | ------------------------------------------- |
| Full matrix (9 steps)        | 0 passed · 4 partial · 5 n/a (CD/Scanner)   |
| Owned (4 steps)              | 0 passed · 4 partial with evidence+deferral |
| Undocumented owned `missing` | **0**                                       |

Artifacts:

- Full: `PILOT_GATE_2026-07-29-phase10.json`
- Owned-only: `PILOT_GATE_OWNED_2026-07-29-phase10.json`
- Deferrals: `DEFERRALS_2026-07-29.json`

## Deferrals blocking certify

| ID                      | Owner                 | Expiry     |
| ----------------------- | --------------------- | ---------- |
| cross-subdomain-session | operations            | 2026-08-31 |
| browser-create-guest    | resident-portal-pilot | 2026-08-31 |
| browser-qr-scan         | resident-portal-pilot | 2026-08-31 |
| browser-offline-qr      | resident-portal-pilot | 2026-08-31 |

Non-blocking: Lighthouse/PWA scores; full AR content pack (same expiry).

## Page scores

Pointer: `PAGE_SCORES_2026-07-29.json` (`securityBoundaryProven=false`, average capped).

## Path to certify

1. Clear cross-subdomain session gate (operations).
2. Collect EN browser evidence for create + QR + offline on preview/prod.
3. Refresh `PILOT_GATE` owned steps to `passed` with browser artifacts.
4. Set packet `valid: true` bound to that commit.
5. `/check all` → `/pilot` → `/certify` with explicit authorization.

## Related phase logs

`docs/plan/Complete/resident_portal_responsive/phase_logs/PHASE_LOG_phase_06.md` …
`PHASE_LOG_phase_10.md`.
