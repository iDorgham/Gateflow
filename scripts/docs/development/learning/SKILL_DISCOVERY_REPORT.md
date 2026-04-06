# Skill Discovery Report

**Date:** 2026-04-06T04:59:40.403Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/admin-dashboard/src/components/crm/crm-dashboard.tsx:                          Successfully analyzed Lead #482 (MENA Region).
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-primary': '#0052CC',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-primary-foreground': '#FFFFFF',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-background': '#FFFFFF',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-surface': '#F4F5F7',
apps/design-system/src/app/(docs)/packages/page.tsx:                    <div className="p-3 bg-[#09090b] rounded-xl flex items-center justify-between group shadow-sm">
apps/design-system/src/app/(docs)/guidelines/page.tsx:          <Card className="flex-1 rounded-[2.5rem] p-10 border-[var(--ds-border-subtle)] bg-[#09090b] text-white shadow-2xl relative overflow-hidden group">
apps/design-system/src/app/(docs)/guidelines/page.tsx:                Hardcoding hex colors as `text-[#ff0000]` or `bg-white` is
apps/design-system/src/app/(docs)/guidelines/page.tsx:                  <code className="text-xs text-red-400">text-[#0052cc]</code>
apps/design-system/src/components/gallery/GalleryItem.tsx:          <div className="rounded-3xl border border-[var(--ds-border-subtle)] bg-[#09090b] overflow-hidden">

```
