# Skill Discovery Report

**Date:** 2026-04-08T14:12:30.565Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/admin-dashboard/src/components/crm/crm-dashboard.tsx:                          Successfully analyzed Lead #482 (MENA Region).
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-primary': '#0052CC',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-primary-foreground': '#FFFFFF',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-background': '#FFFFFF',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-surface': '#F4F5F7',
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:              <div className="bg-[#09090b] rounded-xl p-4 text-xs font-mono text-zinc-400">
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:              <div className="bg-[#09090b] rounded-xl p-4 text-xs font-mono text-zinc-400">
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:            <pre className="bg-[#09090b] rounded-2xl p-6 text-xs text-blue-300 overflow-x-auto border border-white/10">
apps/design-system/src/app/(docs)/foundations/tokens-system/page.tsx:                  subject: 'Maintenance Ticket #4021',
apps/design-system/src/app/(docs)/packages/page.tsx:                    <div className="p-3 bg-[#09090b] rounded-xl flex items-center justify-between group shadow-sm">

```
