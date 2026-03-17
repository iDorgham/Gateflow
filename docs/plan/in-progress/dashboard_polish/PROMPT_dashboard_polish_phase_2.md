# Phase 2: Unified PageHeader + Spacing

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Refs**:
  - `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/page.tsx` — current title pattern
  - `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx` — current title
  - `apps/client-dashboard/src/app/[locale]/dashboard/gates/page.tsx` — current title (inside gate-client.tsx)
  - `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx` — current title

## Goal
Create a single `PageHeader` component and apply it consistently across all major dashboard pages so titles, subtitles, and action buttons look identical everywhere.

## Scope (in)
- **New component** `apps/client-dashboard/src/components/dashboard/page-header.tsx`:
  ```tsx
  interface PageHeaderProps {
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;   // e.g. count badge
    actions?: React.ReactNode; // e.g. buttons
    className?: string;
  }
  ```
  - Layout: `flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between`
  - Title block: title (`text-xl font-black uppercase tracking-tight text-foreground`) + optional badge inline + subtitle below
  - Actions: right-aligned, `shrink-0`
- **Apply to** these pages (replace their existing h1/header divs):
  1. `qrcodes/page.tsx` — title "QR Codes", subtitle from i18n
  2. `scans/page.tsx` — title "Access Logs"
  3. `analytics/analytics-client.tsx` — title "Analytics" (already upgraded; ensure it uses component)
  4. `gates/page.tsx` or `gate-client.tsx` — title "Gates"
- **Spacing**: Ensure every page that uses `PageHeader` wraps its content in `<div className="space-y-6 flex flex-col flex-1">`.

## Steps (ordered)
1. Create `apps/client-dashboard/src/components/dashboard/page-header.tsx`:
   ```tsx
   'use client';
   import { cn } from '@gate-access/ui';
   export function PageHeader({ title, subtitle, badge, actions, className }: PageHeaderProps) {
     return (
       <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
         <div className="min-w-0">
           <div className="flex items-center gap-2.5">
             <h1 className="text-xl font-black uppercase tracking-tight text-foreground">{title}</h1>
             {badge}
           </div>
           {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
         </div>
         {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
       </div>
     );
   }
   ```
2. Apply `PageHeader` to `qrcodes/page.tsx` — replace existing title div with `<PageHeader title={t('qrcodes.title', 'QR Codes')} subtitle={t('qrcodes.description', '...')} actions={<Button>...</Button>} />`.
3. Apply to `scans/page.tsx`.
4. Apply to `analytics/analytics-client.tsx` (replace the h1 block).
5. Apply to `gates/page.tsx` or the client component it uses.
6. Confirm all applied pages have `space-y-6` wrapping their sections.
7. Run `pnpm turbo lint --filter=client-dashboard`.
8. Commit: `feat(ui): unified PageHeader component applied to major pages (phase 2)`.

## Acceptance criteria
- [ ] `PageHeader` component exists with title, subtitle, badge, and actions props.
- [ ] Same title style on QR Codes, Access Logs, Analytics, and Gates pages.
- [ ] All applied pages use `space-y-6` section spacing.
- [ ] Typecheck and lint pass.
