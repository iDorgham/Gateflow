# Skill Discovery Report

**Date:** 2026-03-17T08:37:20.160Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:          <div className="bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0747A6)] font-bold h-6 px-3 rounded-full flex items-center text-xs">
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:      <div className="bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] rounded-xl p-5 shadow-none space-y-4">
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:              <Building2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest,#A5ADBA)] group-focus-within:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:                className="ltr:pl-9 rtl:pr-9 h-9 rounded-[var(--ds-border-radius-100,#3px)] bg-[var(--ds-background-input,#F4F5F7)] border-[var(--ds-border,#DFE1E6)] focus:border-[var(--ds-border-focused,#4C9AFF)] text-sm font-semibold focus:bg-[var(--ds-background-default,#FFFFFF)] transition-all outline-none"
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:              className="w-full h-9 rounded-[var(--ds-border-radius-100,#3px)] border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-default,#FFFFFF)] px-3 text-xs font-semibold text-[var(--ds-text,#172B4D)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:            <div className="grid grid-cols-2 gap-2 h-9 p-1 bg-[var(--ds-background-input,#F4F5F7)] rounded-[var(--ds-border-radius-100,#3px)] border border-[var(--ds-border,#DFE1E6)]">
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:                className="bg-transparent border-none text-[var(--ds-text,#172B4D)] px-2 outline-none text-xs font-semibold"
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:                className="bg-transparent border-none text-[var(--ds-text,#172B4D)] px-2 outline-none text-xs font-semibold"
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:            <Button type="submit" className="h-9 px-6 font-semibold shadow-none flex-1 bg-[var(--ds-background-brand-bold,#0052CC)] hover:bg-[var(--ds-background-brand-bold-hovered,#004EBE)] text-white rounded-[var(--ds-border-radius-100,#3px)]">
apps/admin-dashboard/src/app/[locale]/(dashboard)/scans/page.tsx:            <Button variant="outline" className="h-9 w-9 p-0 rounded-[var(--ds-border-radius-100,#3px)] border-[var(--ds-border,#DFE1E6)]" asChild>

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

