# Pro Prompt — security_isolation_fix — Phase 2: CRM & Management

This phase fixes the vulnerable global `findMany` calls in the Real Estate CRM modules.

---

## Phase 2: CRM & Management Hardening (Contacts & Units)

### Primary role

BACKEND | SECURITY

### Preferred tool

- [x] Claude CLI — Security audit, request validation, org scoping
- [ ] Gemini CLI — Schema/logic verification

### Context

- **Project**: GateFlow (Monorepo)
- **Initiative**: `security_isolation_fix`
- **File**: `docs/plan/Draft/security_isolation_fix/PLAN_security_isolation_fix.md`
- **Report**: `docs/development/learning/SKILL_DISCOVERY_REPORT.md` (Security violations)
- **Rule**: Every `findMany` or `findFirst` must include `organizationId: session.user.organizationId` and `deletedAt: null`.

### Goal

Secure the Prisma queries for the CRM components (Contacts and Units).

### Scope (in)

- `apps/client-dashboard/src/app/api/contacts/route.ts`
- `apps/client-dashboard/src/app/api/contacts/[id]/tags/route.ts`
- `apps/client-dashboard/src/app/api/contacts/tags/bulk/route.ts`
- `apps/client-dashboard/src/app/api/crm/contacts/route.ts`
- `apps/client-dashboard/src/app/api/crm/units/route.ts`
- `apps/client-dashboard/src/app/api/units/route.ts`

### Scope (out)

- QR/Exports (Phase 3), Analytics/Incidents (Phase 4).

### Steps (ordered)

1. **Verify Session**: Ensure `getAuthSession()` or `auth()` is present and valid.
2. **Inject Filters**: Modify `prisma.contact.findMany`, `prisma.unit.findMany`, and tag lookups to include `organizationId`.
3. **Audit**: Run `node scripts/ralph-skill-discover.js` specifically for these CRM routes.
4. **Git Cycle**: git add, commit, push.

### Acceptance criteria

- [ ] CRM data is strictly filtered by the current organization.
- [ ] Bulk tag operations for one organization never touch another organization's tags.
- [ ] Prisma queries include the standard tenant filters.

### Files likely touched

- `apps/client-dashboard/src/app/api/contacts/route.ts`
- `apps/client-dashboard/src/app/api/contacts/[id]/tags/route.ts`
- `apps/client-dashboard/src/app/api/contacts/tags/bulk/route.ts`
- `apps/client-dashboard/src/app/api/crm/contacts/route.ts`
- `apps/client-dashboard/src/app/api/crm/units/route.ts`
- `apps/client-dashboard/src/app/api/units/route.ts`
