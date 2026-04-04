# Pro Prompt — security_isolation_fix — Phase 4: Analytics & Incidents

This phase secures the analytics export and incident management routes.

---

## Phase 4: Analytics & Incidents

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

Secure the Prisma queries for Analytics and Incidents.

### Scope (in)

- `apps/client-dashboard/src/app/api/analytics/export/route.ts`
- `apps/client-dashboard/src/app/api/incidents/route.ts`

### Scope (out)

- Certification (Phase 5).

### Steps (ordered)

1. **Verify Session**: Ensure `getAuthSession()` or `auth()` is present and valid.
2. **Inject Filters**: Modify `prisma.incident.findMany` and analytics lookups to include `organizationId`.
3. **Audit**: Run `node scripts/ralph-skill-discover.js` specifically for these remaining routes.
4. **Git Cycle**: git add, commit, push.

### Acceptance criteria

- [ ] Analytics reports are strictly filtered by the requesting organization.
- [ ] Incident management is tenant-scoped.
- [ ] All remaining routes include standard multi-tenant guards.

### Files likely touched

- `apps/client-dashboard/src/app/api/analytics/export/route.ts`
- `apps/client-dashboard/src/app/api/incidents/route.ts`
