# Phase 8: Pilot UX completion

## Primary role

FRONTEND

## Preferred tool

- [x] Cursor IDE
- Free fallback: Opencode

## App scope

`apps/resident-portal` UI only (+ existing resident APIs).

## Pilot steps

- QR display actions (share/download if in scope)
- Permission lifecycle (revoke when API exists)
- Profile session end (Sign Out)

## Goal

Remove dead-end controls that block honest pilot demos.

## Scope (in)

- Wire revoke and/or share/download on `/visitors/[id]` when backend supports it
- Sign Out clears session cookie / redirects to `/login`
- Remove or hide `/settings/privacy` and `/settings/help` links — **no empty pages**
- Explicit empty/error when unit missing on create pages

## Scope (out)

- Building new privacy/help content sites
- Scanner or CD UI

## Page acceptance

| Route                           | Criterion                                    |
| ------------------------------- | -------------------------------------------- |
| `/visitors/[id]`                | No inert primary actions without explanation |
| `/profile`                      | Sign Out works                               |
| `/visitors/new`, `/open-qr/new` | Clear empty state if no unit                 |

## Security boundaries

- Revoke must be authenticated + tenant-scoped
- Sign Out must invalidate client session cookie only (no secret leakage)

## Tests

- Sign Out / revoke happy-path unit or component test where practical

## Done when

TASKS Phase 8 checked; phase log written.
