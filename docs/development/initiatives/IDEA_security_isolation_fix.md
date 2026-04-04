# IDEA — security_isolation_fix — High-Risk Security Hardening

This initiative addresses critical multi-tenant isolation risks discovered by the Ralph Skill Discovery engine.

---

## 🧭 **Context**

- **Problem**: 15+ API routes and dashboard pages currently use Prisma `findMany` without explicit `organizationId` filtering, potentially allowing one organization to access another's data.
- **Affected Areas**: Gates, Scans, CRM (Contacts/Units), QR Codes, Exports, Analytics, and Incidents.
- **Rules**: Every query _must_ include `organizationId` retrieved from a validated session.

## 🎯 **Goals**

- **Hardening**: Remediate all 15+ vulnerable routes identified in the `SKILL_DISCOVERY_REPORT.md`.
- **Zero-Trust**: Ensure no endpoint can return data outside the current user's organization.
- **Automation**: Use `ralph-skill-discover.js` to verify 100% compliance post-fix.

## 📏 **Constraints & Metrics**

- **Correctness**: 100% compliance with `organizationId` scoping.
- **Performance**: No regressions in query speed.
- **Safety**: Maintain soft-delete logic (`deletedAt: null`).

## 📈 **Success Criteria**

1. `ralph-skill-discover.js` returns zero violations for "Missing organizationId guards".
2. All export routes (CSV/PDF) correctly filter by the user's organization.
3. Smoke tests for Gates, CRM, and Scans pass with active session checks.

## 🔗 **Links**

- **Report**: `docs/development/learning/SKILL_DISCOVERY_REPORT.md`
- **Backlog**: `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
