# API Context — security_hotfix_v1

## Phase 1 Target API

- Route: `apps/client-dashboard/src/app/api/scans/bulk/route.ts`
- Method target: `POST`
- Required status handling:
  - `401` unauthenticated/unauthorized
  - `400` invalid payload
  - `201` accepted insert result

## Contract Expectations

- Session-derived `organizationId` must be present for writes.
- Role check must allow users with scans write permission (`Gate Operator`, `Security Manager` per `BUILT_IN_ROLES` in `packages/types/src/user.ts`).
- Payload must be array and capped at 500 items.
- Insert path should use `skipDuplicates: true`.
