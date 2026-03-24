# Skill Discovery Report

**Date:** 2026-03-24T22:47:32.278Z

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
packages/db/prisma/seed.ts:23: prisma.organization.findMany({...})
packages/db/prisma/seed.ts:71: prisma.organization.findMany({...})
packages/db/prisma/fix-duplicate-compound-projects.ts:8: prisma.project.findMany({...})
packages/db/scripts/check-hashes.ts:4: prisma.user.findMany({...})
packages/db/scripts/migrate-webhook-secrets.ts:87: prisma.webhook.findMany({...})
packages/db/scripts/debug-qrcodes.ts:4: prisma.organization.findMany({...})

```
