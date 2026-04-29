# Skill Discovery Report

**Date:** 2026-04-29T08:43:24.725Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
packages/ui/src/globals.css:    --background: 240 4% 4%;      /* #111112 Exactly */
packages/ui/src/globals.css:    --card: 220 6% 10%;           /* #191a1c Exactly */
packages/ui/src/globals.css:    --secondary: 222 5% 12%;      /* #1e1f21 Exactly */
packages/ui/src/globals.css:    --muted: 222 5% 12%;          /* #1e1f21 Exactly */
packages/ui/src/globals.css:    --border: 240 4% 19%;         /* Gray border #2f2f33 */
packages/ui/src/globals.css:    --ds-background-default: rgb(25, 26, 28);      /* #191a1c */
packages/ui/src/globals.css:    --ds-background-subtle: rgb(17, 17, 18);       /* #111112 */
packages/ui/src/globals.css:    --ds-background-neutral: rgb(25, 26, 28);     /* #191a1c */
packages/ui/src/globals.css:    --ds-background-card: rgb(25, 26, 28);         /* #191a1c */
packages/ui/src/globals.css:    --ds-border: rgb(47, 47, 51);                  /* #2f2f33 */

```

## 🔒 Security Invariants (Missing organizationId)

Potential multi-tenant isolation risks. Found `findMany` calls without an explicit `organizationId` filter.

```text
apps/client-dashboard/src/components/dashboard/dashboard-overview.tsx:119: prisma.gate.findMany({...})

```

