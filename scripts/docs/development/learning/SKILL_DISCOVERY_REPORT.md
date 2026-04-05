# Skill Discovery Report

**Date:** 2026-04-05T13:56:12.436Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/admin-dashboard/src/components/crm/crm-dashboard.tsx:                             Successfully analyzed Lead #482 (MENA Region). Assinged score of 84 based on organization vertical alignment.
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-primary': '#0052CC',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-primary-foreground': '#FFFFFF',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-background': '#FFFFFF',
apps/admin-dashboard/src/components/theming/StyleEditor.tsx:    '--gf-color-surface': '#F4F5F7',
packages/ui/src/globals.css:    --background: 240 4% 4%;      /* #111112 Exactly */
packages/ui/src/globals.css:    --card: 220 6% 10%;           /* #191a1c Exactly */
packages/ui/src/globals.css:    --secondary: 222 5% 12%;      /* #1e1f21 Exactly */
packages/ui/src/globals.css:    --muted: 222 5% 12%;          /* #1e1f21 Exactly */
packages/ui/src/globals.css:    --border: 240 4% 19%;         /* Gray border #2f2f33 */

```
