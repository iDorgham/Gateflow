# Skill Discovery Report

**Date:** 2026-03-24T11:38:25.204Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:    .replace(/'/g, '&#039;');
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:           <h1 className="text-3xl font-black text-[#172B4D] dark:text-white tracking-tight uppercase">
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:           <p className="text-sm font-medium text-[#6B778C] dark:text-[#97A0AF]">
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:             <div className="px-8 py-6 border-b border-border bg-[#FAFBFC] dark:bg-[#091E42]/20">
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:               <h2 className="text-[18px] font-bold text-[#172B4D] dark:text-white">Residents Directory</h2>
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:               <p className="text-xs text-[#6B778C] font-medium mt-1">Full list of verified occupants and external consultants.</p>
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:             <div className="px-8 py-6 border-b border-border bg-[#FAFBFC] dark:bg-[#091E42]/20">
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:               <h2 className="text-[18px] font-bold text-[#172B4D] dark:text-white">Property Inventory</h2>
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:               <p className="text-xs text-[#6B778C] font-medium mt-1">Managed assets and occupancy tracking for this project.</p>
apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/crm/page.tsx:            <CardHeader className="bg-[#FAFBFC] dark:bg-[#091E42]/20 p-8 border-b border-border">

```

## 🔒 Security Invariants (Missing organizationId)

Potential multi-tenant isolation risks. Found `findMany` calls without an explicit `organizationId` filter.

```text
apps/client-dashboard/src/app/[locale]/dashboard/gates/page.tsx:33: prisma.gate.findMany({...})
apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx:134: prisma.scanLog.findMany({...})
apps/client-dashboard/src/app/api/gates/route.ts:41: prisma.gate.findMany({...})
apps/client-dashboard/src/app/api/resident/visitors/route.ts:41: prisma.visitorQR.findMany({...})
apps/client-dashboard/src/app/api/scans/export/route.ts:124: prisma.scanLog.findMany({...})
apps/client-dashboard/src/app/api/contacts/tags/bulk/route.ts:49: prisma.contactTag.findMany({...})
apps/client-dashboard/src/app/api/contacts/route.ts:258: prisma.contact.findMany({...})
apps/client-dashboard/src/app/api/contacts/[id]/tags/route.ts:53: prisma.contactTag.findMany({...})
apps/client-dashboard/src/app/api/qrcodes/route.ts:235: prisma.qRCode.findMany({...})
apps/client-dashboard/src/app/api/qrcodes/export/route.ts:197: prisma.qRCode.findMany({...})
apps/client-dashboard/src/app/api/workspace/export/route.ts:133: prisma.contactUnit.findMany({...})
apps/client-dashboard/src/app/api/workspace/export/route.ts:154: prisma.qRCode.findMany({...})
apps/client-dashboard/src/app/api/workspace/export/route.ts:172: prisma.scanLog.findMany({...})
apps/client-dashboard/src/app/api/crm/contacts/route.ts:56: prisma.contact.findMany({...})
apps/client-dashboard/src/app/api/crm/units/route.ts:51: prisma.unit.findMany({...})
apps/client-dashboard/src/app/api/units/route.ts:199: prisma.unit.findMany({...})
apps/client-dashboard/src/app/api/incidents/route.ts:53: prisma.incident.findMany({...})
apps/client-dashboard/src/app/api/analytics/export/route.ts:165: prisma.contact.findMany({...})
packages/db/prisma/seed.ts:23: prisma.organization.findMany({...})
packages/db/prisma/seed.ts:71: prisma.organization.findMany({...})
packages/db/prisma/fix-duplicate-compound-projects.ts:8: prisma.project.findMany({...})
packages/db/scripts/check-hashes.ts:4: prisma.user.findMany({...})
packages/db/scripts/migrate-webhook-secrets.ts:87: prisma.webhook.findMany({...})
packages/db/scripts/debug-qrcodes.ts:4: prisma.organization.findMany({...})

```
