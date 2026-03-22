# Skill Discovery Report

**Date:** 2026-03-22T17:54:35.931Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:    .replace(/'/g, '&#039;');
apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx:                      ? 'var(--ds-text-selected, #FAFAFA)'
apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx:                      : 'var(--ds-text-subtle, #A1A1AA)',
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/page.tsx:                <RefreshCw className={cn('h-3.5 w-3.5 text-[#6B778C]', isLoading && 'animate-spin')} />
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:        <QRCode value={qrValue} size={200} bgColor="#ffffff" fgColor="#0f172a" level="L" />
apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/create-qr-client.tsx:      ctx.fillStyle = '#ffffff';
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  border: '1px solid var(--ds-border, #DFE1E6)',
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  background: 'var(--ds-surface-overlay, #FFFFFF)',
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  color: 'var(--ds-text, #172B4D)',
apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-charts.tsx:  color: 'var(--ds-text, #172B4D)',

```

## 🔒 Security Invariants (Missing organizationId)

Potential multi-tenant isolation risks. Found `findMany` calls without an explicit `organizationId` filter.

```text
apps/client-dashboard/src/app/[locale]/dashboard/settings/gates/page.tsx:    prisma.gate.findMany({
apps/client-dashboard/src/app/[locale]/dashboard/settings/gates/page.tsx:    prisma.project.findMany({
apps/client-dashboard/src/app/[locale]/dashboard/settings/residents/actions.ts:    const units = await prisma.unit.findMany({
apps/client-dashboard/src/app/[locale]/dashboard/settings/residents/actions.ts:    return await prisma.residentLimit.findMany({
apps/client-dashboard/src/app/[locale]/dashboard/settings/projects/actions.ts:      prisma.gate.findMany({

```

