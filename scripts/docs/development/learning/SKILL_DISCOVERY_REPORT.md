# Skill Discovery Report

**Date:** 2026-04-29T14:03:22.758Z

## 🎨 Design System Violations (Hardcoded Hex)

Detected raw hex values instead of Atlassian Design System tokens (`var(--ds-...)`).

```text
apps/client-dashboard/src/app/[locale]/login/login-page-layout-2026.tsx:          className="inline-flex h-10 min-w-[4rem] items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] dark:focus-visible:ring-offset-[#0f172a]"
apps/client-dashboard/src/app/[locale]/login/login-page-layout-2026.tsx:        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020E73] dark:focus-visible:ring-offset-[#0f172a]"
packages/ui/src/globals.css:    --background: 240 4% 4%;      /* #111112 Exactly */
packages/ui/src/globals.css:    --card: 220 6% 10%;           /* #191a1c Exactly */
packages/ui/src/globals.css:    --secondary: 222 5% 12%;      /* #1e1f21 Exactly */
packages/ui/src/globals.css:    --muted: 222 5% 12%;          /* #1e1f21 Exactly */
packages/ui/src/globals.css:    --border: 240 4% 19%;         /* Gray border #2f2f33 */
packages/ui/src/globals.css:    --ds-background-default: rgb(25, 26, 28);      /* #191a1c */
packages/ui/src/globals.css:    --ds-background-subtle: rgb(17, 17, 18);       /* #111112 */
packages/ui/src/globals.css:    --ds-background-neutral: rgb(25, 26, 28);     /* #191a1c */

```

## 🔒 Security Invariants (Missing organizationId)

Potential multi-tenant isolation risks. Found `findMany` calls without an explicit `organizationId` filter.

```text
packages/db/scripts/seed-crm.ts:13: prisma.organization.findMany({...})

```

