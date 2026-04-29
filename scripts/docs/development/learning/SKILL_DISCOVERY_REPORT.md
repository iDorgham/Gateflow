# Skill Discovery Report

**Date:** 2026-04-29T05:55:31.617Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/admin-dashboard/src/components/crm/crm-dashboard.tsx:                          Successfully analyzed Lead #482 (MENA Region).
apps/admin-dashboard/src/components/analytics/charts.tsx:  { value: 100, name: 'Scanned', fill: '#8884d8' },
apps/admin-dashboard/src/components/analytics/charts.tsx:  { value: 80, name: 'Validated', fill: '#83a6ed' },
apps/admin-dashboard/src/components/analytics/charts.tsx:  { value: 50, name: 'Authorized', fill: '#8dd1e1' },
apps/admin-dashboard/src/components/analytics/charts.tsx:  { value: 40, name: 'Entered', fill: '#82ca9d' },
apps/admin-dashboard/src/components/analytics/charts.tsx:const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:              <div className="bg-[#09090b] rounded-xl p-4 text-xs font-mono text-zinc-400">
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:              <div className="bg-[#09090b] rounded-xl p-4 text-xs font-mono text-zinc-400">
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:            <pre className="bg-[#09090b] rounded-2xl p-6 text-xs text-blue-300 overflow-x-auto border border-white/10">
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:                  subject: 'Maintenance Ticket #4021',

```
