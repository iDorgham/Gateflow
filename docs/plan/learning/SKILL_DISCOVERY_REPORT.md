# Skill Discovery Report

**Date:** 2026-03-24T13:07:03.182Z

## 🎨 Design System Violations (Hardcoded Hex) — FIXED ✅

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx: all hardcoded hex colors
```

**Fix applied:** Replaced all 22 hardcoded hex colors with ADS semantic tokens (`var(--ds-text,#172B4D)`,
`var(--ds-text-subtlest,#6B778C)`, `var(--ds-text-subtle,#97A0AF)`,
`var(--ds-background-subtle,#FAFBFC)`, `var(--ds-background-information-subtle,#091E42)`).

**Commit:** `e0981d7` — fix(crm): replace hardcoded hex colors with ADS tokens

---

## 🔒 Security Invariants (Missing organizationId) — AUDITED ✅

**Audit date:** 2026-03-24
**Auditor:** roles/security agent

### Summary

Of 23 flagged `findMany` calls, **18 were production routes**. Results:

| Verdict                                                     | Count |
| :---------------------------------------------------------- | :---- |
| ✅ SAFE — `organizationId` in `where` clause                | 14    |
| ⚠️ LIKELY SAFE — scoping via JOIN (`qrCode.organizationId`) | 3     |
| ❌ VULNERABLE — no `organizationId` filter                  | 1     |
| Seed/Admin scripts (out of scope)                           | 6     |

### Details

| File                                                                  | Line | Verdict        | Fix needed?                                         |
| --------------------------------------------------------------------- | ---- | -------------- | --------------------------------------------------- |
| `apps/client-dashboard/src/app/[locale]/dashboard/gates/page.tsx:33`  | 33   | ✅ SAFE        | No — `organizationId` in `gateFilter`               |
| `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx:134` | 134  | ✅ SAFE        | No — scoped via `qrCode.organizationId`             |
| `apps/client-dashboard/src/app/api/gates/route.ts:41`                 | 41   | ✅ SAFE        | No — `organizationId` in `gateWhere`                |
| `apps/client-dashboard/src/app/api/resident/visitors/route.ts:41`     | 41   | ⚠️ LIKELY SAFE | No — scoped via `qrCode.organizationId` JOIN        |
| `apps/client-dashboard/src/app/api/scans/export/route.ts:124`         | 124  | ✅ SAFE        | No — scoped via `qrCode.organizationId`             |
| `apps/client-dashboard/src/app/api/contacts/tags/bulk/route.ts:49`    | 49   | ✅ SAFE        | No — `validContactIds` already org-scoped           |
| `apps/client-dashboard/src/app/api/contacts/route.ts:258`             | 258  | ✅ SAFE        | No — `organizationId` in `where`                    |
| `apps/client-dashboard/src/app/api/contacts/[id]/tags/route.ts:53`    | 53   | ✅ SAFE        | No — `contactId` is org-scoped                      |
| `apps/client-dashboard/src/app/api/qrcodes/route.ts:235`              | 235  | ✅ SAFE        | No — `organizationId` in `where`                    |
| `apps/client-dashboard/src/app/api/qrcodes/export/route.ts:197`       | 197  | ✅ SAFE        | No — `organizationId` in `where`                    |
| `apps/client-dashboard/src/app/api/workspace/export/route.ts:133`     | 133  | ❌ VULNERABLE  | **FIXED** ✅                                        |
| `apps/client-dashboard/src/app/api/workspace/export/route.ts:154`     | 154  | ✅ SAFE        | No — `organizationId` in `qrWhere`                  |
| `apps/client-dashboard/src/app/api/workspace/export/route.ts:172`     | 172  | ✅ SAFE        | No — scoped via `qrCodeId` from org-scoped QR codes |
| `apps/client-dashboard/src/app/api/crm/contacts/route.ts:56`          | 56   | ✅ SAFE        | No — `organizationId` in `where`                    |
| `apps/client-dashboard/src/app/api/crm/units/route.ts:51`             | 51   | ✅ SAFE        | No — `organizationId` in `where`                    |
| `apps/client-dashboard/src/app/api/units/route.ts:199`                | 199  | ✅ SAFE        | No — `organizationId` in `where`                    |
| `apps/client-dashboard/src/app/api/incidents/route.ts:53`             | 53   | ✅ SAFE        | No — `organizationId` in `where`                    |
| `apps/client-dashboard/src/app/api/analytics/export/route.ts:165`     | 165  | ✅ SAFE        | No — `organizationId` in `where`                    |
| `packages/db/prisma/seed.ts:23`                                       | —    | ⏭️ SKIP        | Admin seed — no orgId needed                        |
| `packages/db/prisma/seed.ts:71`                                       | —    | ⏭️ SKIP        | Admin seed — no orgId needed                        |
| `packages/db/prisma/fix-duplicate-compound-projects.ts:8`             | —    | ⏭️ SKIP        | Admin script                                        |
| `packages/db/scripts/check-hashes.ts:4`                               | —    | ⏭️ SKIP        | Admin script                                        |
| `packages/db/scripts/migrate-webhook-secrets.ts:87`                   | —    | ⏭️ SKIP        | Admin script                                        |
| `packages/db/scripts/debug-qrcodes.ts:4`                              | —    | ⏭️ SKIP        | Admin script                                        |

### VULNERABLE — FIXED: `apps/client-dashboard/src/app/api/workspace/export/route.ts:133`

**Issue:** `prisma.contactUnit.findMany()` lacked `organizationId` filtering on the junction table.
While `contactIds` was derived from org-scoped contacts, the junction table query itself didn't verify
organization, violating the defense-in-depth principle.

**Fix applied:**

```diff
  const contactUnits = await prisma.contactUnit.findMany({
    where: {
+     contact: { organizationId: orgId },
+     unit: { organizationId: orgId },
      ...(contactIds.length > 0 ? { contactId: { in: contactIds } } : {}),
      ...(unitIds.length > 0 ? { unitId: { in: unitIds } } : {}),
    },
  });
```

**Commit:** `4005487` — fix(security): add organizationId scoping to contactUnit.findMany

---

_Report updated: 2026-03-24. All flagged items resolved._
