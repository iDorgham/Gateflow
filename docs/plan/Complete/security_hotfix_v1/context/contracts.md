# Contract and Invariants — security_hotfix_v1

## Non-Negotiable Contracts

- Multi-tenancy: all tenant-scoped access must include `organizationId`.
- Soft delete: enforce `deletedAt: null` logic for operational reads where relevant.
- Security:
  - auth/RBAC enforced on API routes touched by this hotfix
  - AES-256-GCM for sensitive field encryption in migrated paths
  - no secrets committed
- Tooling: `pnpm` only.

## Hotfix Acceptance Contracts

### Phase 1

- Anonymous call to scans bulk endpoint returns `401`.
- Valid scoped call inserts only into caller tenant context.

### Phase 2

- `crypto-js` removed from active source and dependency graph where applicable.
- Native encrypt/decrypt utilities roundtrip successfully.

### Phase 3

- Response headers include:
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Content-Security-Policy`
