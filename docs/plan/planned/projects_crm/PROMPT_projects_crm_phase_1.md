# Pro Prompt — projects_crm — Phase 1

## Phase 1: Communication Gateway & Notification Schema

### Primary role

`backend-database.md`

### Tool Selection

|                            | Tool       | Why                                         |
| -------------------------- | ---------- | ------------------------------------------- |
| **Tool 1** (best quality)  | Gemini CLI | Best for Prisma schema & structural design. |
| **Tool 2** (free fallback) | Cursor     | Direct file editing & local verification.   |

### Skills to load

- [x] `gf-database` — Prisma, migrations, queries
- [x] `gf-security` — Multi-tenant invariants
- [x] `gf-api` — Audit logging patterns
- [x] `verification-before-completion`
- [x] `executing-plans`

### Goal

Implement the core data models for communication tracking and notification settings, and integrate mandatory audit logging for CRM exports.

### Scope (in)

- **Schema**: Add `CommunicationLog` model (orgId, userId, contactId, provider, type, status, metadata).
- **Schema**: Add `OrganizationCommunicationConfig` (apiKey, providerSettings) for tenant-scoped gateway config.
- **Audit**: Update `apps/client-dashboard/src/app/api/contacts/route.ts` (or equivalent CSV export logic) to create an `AuditLog` entry.
- **Audit**: Update `apps/client-dashboard/src/app/api/units/route.ts` to create an `AuditLog` entry.

### Steps (ordered)

1. Read `packages/db/prisma/schema.prisma` and current `AuditLog` implementations.
2. Update `schema.prisma` with the new models.
3. Run migration: `cd packages/db && pnpm prisma migrate dev --name projects_crm_phase_1`.
4. Implement the audit logging logic in the CRM export routes.
5. Create a simple test to verify that `AuditLog` is created upon a mock CSV export request.
6. Verify security invariants: Every new query must include `organizationId`.

### Acceptance criteria

- [ ] `CommunicationLog` and `OrganizationCommunicationConfig` tables exist in the DB.
- [ ] `AuditLog` entry is created with `rowCount` and `userId` metadata on Contacts/Units CSV export.
- [ ] `pnpm turbo build --filter=marketing --filter=client-dashboard` passes.
- [ ] `node scripts/enforce-security-invariants.js` reports 0 violations.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/contacts/route.ts`
- `apps/client-dashboard/src/app/api/units/route.ts`
- `packages/db/src/index.ts` (exports)
