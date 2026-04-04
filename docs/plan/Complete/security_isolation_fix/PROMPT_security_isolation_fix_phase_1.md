# Pro Prompt — security_isolation_fix — Phase 1: Gates & Scans

This phase fixes the top-priority vulnerabilities in the core dashboard and API for gates and scan logs.

---

## Phase 1: Core Operations Audit & Fix (Gates & Scans)

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
- **References**: `getAuthSession` in API routes; server components with `auth()` or `getServerSession`.

### Goal

Secure the Prisma queries for Gates and Scans to ensure no organization can view another's data.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/gates/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx`
- `apps/client-dashboard/src/app/api/gates/route.ts`
- `apps/client-dashboard/src/app/api/scans/export/route.ts`

### Scope (out)

- CRM (Phase 2), QR/Exports (Phase 3), Analytics (Phase 4).

### Steps (ordered)

1. **Verify Session**: Ensure `getAuthSession()` or `auth()` is present and valid in each target file.
2. **Inject Filters**: Modify `prisma.gate.findMany` and `prisma.scanLog.findMany` to include:
   ```typescript
   where: {
     organizationId: session.user.organizationId,
     deletedAt: null,
     // ... existing filters
   }
   ```
3. **Audit**: Run `node scripts/ralph-skill-discover.js` specifically for the modified files.
4. **Acceptance Test**: Verify the API correctly filters when different org IDs are injected.
5. **Git Cycle**: git add, commit, push.

### Acceptance criteria

- [ ] `api/gates` returns 401/403 or empty array if no session/organizationId.
- [ ] Dashboard Gates and Scans pages only display tenant-specific logs.
- [ ] All queries include the `organizationId` filter.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/gates/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx`
- `apps/client-dashboard/src/app/api/gates/route.ts`
- `apps/client-dashboard/src/app/api/scans/export/route.ts`
