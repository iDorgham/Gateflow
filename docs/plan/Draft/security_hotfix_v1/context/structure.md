# Structure Context — security_hotfix_v1

## Ownership map

- API hotfix: `apps/client-dashboard/src/app/api/scans/bulk/route.ts`
- Crypto utility destination: `packages/utils/src/crypto.ts`
- Scanner security consumer: `apps/scanner-app/src/lib/security/secure-pin.ts`
- Config headers targets:
  - `apps/client-dashboard/next.config.js`
  - `apps/admin-dashboard/next.config.js`
  - `apps/resident-portal/next.config.js`
  - `apps/marketing/next.config.js`

## Execution note

- Keep cross-package edits minimal and traceable by phase.
