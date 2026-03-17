# Skill Discovery Report

**Date:** 2026-03-17T07:33:27.841Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/admin-dashboard/src/app/globals.css:    --ds-background-default: #FFFFFF;
apps/admin-dashboard/src/app/globals.css:    --ds-background-subtle:  #F4F5F7;
apps/admin-dashboard/src/app/globals.css:    --ds-background-subtlest: #EBECF0;
apps/admin-dashboard/src/app/globals.css:    --ds-background-neutral: #F4F5F7;
apps/admin-dashboard/src/app/globals.css:    --ds-background-neutral-subtle: #FAFBFC;
apps/admin-dashboard/src/app/globals.css:    --ds-background-neutral-subtle-hovered: #F0F1F3;
apps/admin-dashboard/src/app/globals.css:    --ds-background-neutral-hovered: #EBECF0;
apps/admin-dashboard/src/app/globals.css:    --ds-background-neutral-pressed: #DFE1E6;
apps/admin-dashboard/src/app/globals.css:    --ds-background-selected: #DEEBFF;
apps/admin-dashboard/src/app/globals.css:    --ds-background-selected-hovered: #B3D4FF;

```

## 🔒 Security Invariants (Missing organizationId)

Potential multi-tenant isolation risks. Found `findMany` calls without an explicit `organizationId` filter.

```text
apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/page.tsx:    prisma.organization.findMany({
apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/page.tsx:  const gates = await prisma.gate.findMany({
apps/admin-dashboard/src/app/[locale]/(dashboard)/audit-logs/page.tsx:    prisma.scanLog.findMany({
apps/admin-dashboard/src/app/[locale]/(dashboard)/gates/page.tsx:  const gates = await prisma.gate.findMany({
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:    prisma.scanLog.findMany({

```

