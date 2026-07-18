# Context snapshot — security_hotfix_v1

> Frozen at: 2026-04-30. Refresh if schema/contracts/security requirements change during execution.

## Relevant schema / models

- `packages/db/prisma/schema.prisma`
- Hot path entities expected in scans bulk flow:
  - `ScanLog`
  - `QRCode`
  - `Gate`
  - `User` / role-bearing session linkage

## Target files (phase scoped)

### Phase 1

- `apps/client-dashboard/src/app/api/scans/bulk/route.ts`

### Phase 2

- `packages/utils/src/crypto.ts` (new)
- `apps/scanner-app/src/lib/security/secure-pin.ts`
- Any encryption helper using `crypto-js` in web/admin/client apps
- `packages/types/test_qr.js` (delete)

### Phase 3

- `apps/client-dashboard/next.config.js`
- `apps/admin-dashboard/next.config.js`
- `apps/resident-portal/next.config.js`
- `apps/marketing/next.config.js`

## Invariants to preserve

- Tenant scoping by `organizationId`.
- Soft-delete safety (`deletedAt: null`) on operational reads.
- Auth and RBAC on API boundaries.
- HMAC + encryption posture as documented in workspace security rules.
- No secrets in repository.

## Verification commands

- `pnpm preflight`
- `rg "crypto-js" apps packages`
- `curl -I http://localhost:3000` (and equivalent app ports when running)
