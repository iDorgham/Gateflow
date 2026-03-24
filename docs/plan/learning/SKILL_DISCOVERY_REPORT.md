# Skill Discovery Report

**Date:** 2026-03-24T21:32:52.200Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:    .replace(/'/g, '&#039;');
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:          bgColor={token('elevation.surface', '#FFFFFF')}
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:          fgColor={token('color.text', '#172B4D')}
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:      ctx.fillStyle = '#ffffff';
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  border: '1px solid var(--ds-border, #DFE1E6)',
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  background: 'var(--ds-surface-overlay, #FFFFFF)',
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  color: 'var(--ds-text, #172B4D)',
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  color: 'var(--ds-text, #172B4D)',
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  color: 'var(--ds-text-subtle, #42526E)',
apps/client-dashboard/src/app/[locale]/login/login-page-layout-2026.tsx:          className="inline-flex h-10 min-w-[4rem] items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] dark:focus-visible:ring-offset-[#0f172a]"

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
apps/client-dashboard/src/app/api/workspace/export/route.ts:176: prisma.qRCode.findMany({...})
apps/client-dashboard/src/app/api/workspace/export/route.ts:194: prisma.scanLog.findMany({...})
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
