# Phase 6: Auth, session, tenant containment

## Primary role

SECURITY

## Preferred tool

- [x] Claude CLI — auth/tenant reasoning (apply via Cursor)
- [x] Cursor IDE — orchestration, verify, commit
- [ ] Opencode / Kiro / Qwen — free fallback if Claude at 80%+

## App scope

`apps/resident-portal` only (unless a shared auth helper already lives in packages).

## Pilot steps

- Resident activation (login gate / session required)
- All P0 authenticated routes safe without `dev-*` identity

## Goal

Unauthenticated users cannot load portal data pages. Authenticated residents
use real JWT `sub` + `orgId`. Missing JWT secret fails closed.

## Scope (in)

- `(portal)/layout.tsx`: `redirect('/login')` when `!claims?.sub`
- Remove `dev-resident-id` / `dev-org-id` from all data `page.tsx` files
- Align org claim: `(claims.org as string) || (claims.orgId as string)` or prefer `orgId`
- `src/lib/auth.ts`: throw if secret env missing (no `dev-insecure-fallback`)
- Tests proving unauthenticated redirect / denied data path

## Scope (out)

- Cookie Domain changes on client-dashboard (document as external gate if needed)
- QR rendering, API rewrite (Phase 07)

## Page acceptance

| Route                                                                           | Criterion                             |
| ------------------------------------------------------------------------------- | ------------------------------------- |
| `/login`                                                                        | Reachable without session             |
| `/`, `/visitors`, `/visitors/new`, `/visitors/[id]`, `/open-qr/new`, `/profile` | Require session; no fallback IDs      |
| `/no-unit-linked`                                                               | Still used for residents without unit |

## Security boundaries

- Load `gf-security` + `CONTRACTS.md`
- No secrets in logs or commits
- organizationId required on Prisma resident queries

## Tests

- Unauthenticated access to a portal page redirects or 401s (as designed)
- Page/org helpers reject missing org claim

## Shared packages

None required unless extracting a tiny claim helper — prefer local fix first.

## Done when

TASKS Phase 6 checked; `PHASE_LOG_phase_06.md` written; `pnpm preflight` for touched work green.
