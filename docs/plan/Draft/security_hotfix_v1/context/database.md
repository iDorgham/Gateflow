# Database Context — security_hotfix_v1

Primary schema reference: `packages/db/prisma/schema.prisma`.

## Expected touchpoints

- Phase 1 primarily affects write-path safety, not schema changes.
- Verify `ScanLog` insert data remains tenant-scoped and structurally valid.

## Rules

- No schema migration is expected in this hotfix.
- Any read-path added during fixes should preserve soft-delete and tenant rules.
