# Phase 10: Pilot gate & certification packet

## Primary role

QA

## Preferred tool

- [x] Cursor IDE

## App scope

Evidence + Workflow v2 state for `resident-portal` only. No deploy/migrate.

## Pilot steps

Refresh all resident-owned steps in `PILOT_GATE`; mark CD/Scanner steps n/a.

## Goal

Produce a certification-ready evidence packet and honest coverage status for
`/check` → `/pilot` → `/certify`.

## Scope (in)

- Refresh `docs/audits/resident-portal/PILOT_GATE_*.json`
- Browser evidence where claimed; otherwise `static-review-only` with blockers
- Deferrals: owner, reason, expiry
- Packet listing commit, checks, pilot coverage, page scores pointer

## Scope (out)

- Production deploy, secret rotation, Vercel mutations without authorization
- Focusing Scanner App

## Acceptance

- Owned pilot steps no longer `missing` without a documented external gate
- Workflow can enter `/check all` without inventing browser proof

## Done when

TASKS Phase 10 checked; phase log written; SESSION_MEMORY points to cert packet.
