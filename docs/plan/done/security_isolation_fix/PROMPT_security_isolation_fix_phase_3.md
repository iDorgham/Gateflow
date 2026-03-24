# Pro Prompt — security_isolation_fix — Phase 3: QR Codes & Exports

This phase secures high-sensitivity QR generation and whole-workspace export routes.

---

## Phase 3: QR Codes & Workspace Exports

### Primary role

BACKEND | SECURITY

### Preferred tool

- [x] Claude CLI — Security audit, request validation, org scoping
- [ ] Gemini CLI — Schema/logic verification

### Context

- **Project**: GateFlow (Monorepo)
- **Initiative**: `security_isolation_fix`
- **File**: `docs/plan/planning/security_isolation_fix/PLAN_security_isolation_fix.md`
- **Report**: `docs/plan/learning/SKILL_DISCOVERY_REPORT.md` (Security violations)
- **Rule**: Every `findMany` or `findFirst` must include `organizationId: session.user.organizationId` and `deletedAt: null`.

### Goal

Secure the Prisma queries for QR Codes and Workspace/ShortId Exports.

### Scope (in)

- `apps/client-dashboard/src/app/api/qrcodes/route.ts`
- `apps/client-dashboard/src/app/api/qrcodes/export/route.ts`
- `apps/client-dashboard/src/app/api/workspace/export/route.ts`
- `apps/client-dashboard/src/app/api/resident/visitors/route.ts`

### Scope (out)

- Analytics/Incidents (Phase 4), Certification (Phase 5).

### Steps (ordered)

1. **Verify Session**: Ensure `getAuthSession()` or `auth()` is present and valid.
2. **Inject Filters**: Modify `prisma.qRCode.findMany`, `prisma.contactUnit.findMany`, and `prisma.visitorQR.findMany`.
3. **Audit**: Run `node scripts/ralph-skill-discover.js` specifically for the modified export routes.
4. **Git Cycle**: git add, commit, push.

### Acceptance criteria

- [ ] Workspace exports return exactly zero rows from other organizations.
- [ ] QR Code generation/lookup is strictly tenant-scoped.
- [ ] All sensitive export routes include the standard tenant filters.

### Files likely touched

- `apps/client-dashboard/src/app/api/qrcodes/route.ts`
- `apps/client-dashboard/src/app/api/qrcodes/export/route.ts`
- `apps/client-dashboard/src/app/api/workspace/export/route.ts`
- `apps/client-dashboard/src/app/api/resident/visitors/route.ts`
