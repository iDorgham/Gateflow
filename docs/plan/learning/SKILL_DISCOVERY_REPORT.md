# Skill Discovery Report

**Date:** 2026-03-21T16:00:08.120Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-background-default: #F2F3F4;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-surface: #FFFFFF;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-text: #020035;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-text-subtle: #02066F;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-text-subtlest: #6B7280;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-brand: #ED4B00;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-neutral: #EDE9E8;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-success: #16A34A;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:      --ds-border: #DEDDE3;
apps/client-dashboard/src/app/[locale]/s/[shortId]/route.ts:    .btn-primary { background: var(--ds-brand); color: #FFFFFF; }

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

