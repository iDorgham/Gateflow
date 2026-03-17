# Phase 6: Finance & Plans / Billing

## Primary role
FULLSTACK

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/components/Sidebar.tsx` — add Finance nav item
  - `packages/db/prisma/schema.prisma` — Organization.plan (Plan enum: FREE | PRO | ENTERPRISE)
  - `@gate-access/ui` — Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn
  - `recharts` (installed in Phase 2)

## Goal
New Finance section accessible from the sidebar. Provides: subscriptions list per org (plan + status + estimated MRR), revenue summary cards, plan trend chart (Recharts area), and placeholder for Stripe/billing integration.

## Scope (in)
- **Add "Finance" nav item to `Sidebar.tsx`**:
  - Add to the "System" group (or create a new "Revenue" group): `{ href: '/finance', label: 'Finance', icon: CreditCard }`
- **New page** `src/app/[locale]/(dashboard)/finance/page.tsx`:
  - Server component
  - `<PageHeader title="Finance" subtitle="Subscriptions, plans, and revenue overview" />`
  - Revenue summary row (3 cards):
    1. **MRR (estimated)** — computed from plan counts × fixed prices (FREE=0, PRO=99, ENTERPRISE=499 USD — placeholder values)
    2. **PRO subscriptions** — count of active PRO orgs
    3. **Enterprise subscriptions** — count of active ENTERPRISE orgs
  - Plan distribution bar chart (Recharts `BarChart`) — FREE / PRO / ENTERPRISE counts
  - Subscriptions table: org name | plan badge | users count | scans this month | status | joined date | MRR
  - Stripe webhook placeholder section: `<CompliancePlaceholder title="Stripe Integration" description="Connect Stripe to enable real billing data, invoice management, and subscription webhooks." />`
- **New API route** `src/app/[locale]/api/admin/finance/route.ts`:
  - `GET` — returns:
    ```ts
    {
      planCounts: { FREE: number, PRO: number, ENTERPRISE: number },
      orgsWithPlans: { id, name, plan, userCount, scansThisMonth, createdAt }[],
      mrr: number,
    }
    ```
  - Auth: `isAdminAuthenticated()`
- **Components**:
  - `src/components/finance/SubscriptionTable.tsx` — client component table
  - `src/components/finance/RevenueSummaryCards.tsx` — 3 KPI cards
  - `src/components/finance/PlanTrendChart.tsx` — recharts BarChart of plan distribution
  - `src/components/finance/BillingPlaceholder.tsx` — stripe/billing placeholder card with a "Coming soon" badge

## Steps (ordered)
1. Add `{ href: '/finance', label: 'Finance', icon: CreditCard }` to Sidebar.tsx nav groups.
2. Create `src/app/[locale]/api/admin/finance/route.ts`.
3. Create `src/components/finance/` components (4 files).
4. Create `src/app/[locale]/(dashboard)/finance/page.tsx` — server component.
5. Run `pnpm turbo lint --filter=admin-dashboard`.
6. Run `pnpm turbo typecheck --filter=admin-dashboard`.
7. Commit: `feat(admin): finance & plans — subscriptions, MRR estimate, billing placeholder (phase 6)`.

## Scope (out)
- Real Stripe integration (placeholder only)
- Invoice generation / download
- Per-org billing history (deferred)

## Acceptance criteria
- [ ] Finance nav item appears in sidebar.
- [ ] Finance page loads with real plan counts from DB.
- [ ] MRR estimate card shows correct value (plan counts × prices).
- [ ] Subscriptions table lists all active orgs with plan badges.
- [ ] Plan distribution BarChart renders.
- [ ] Stripe placeholder section is clearly marked "Coming soon".
- [ ] API returns 401 if unauthenticated.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): finance & plans — subscriptions, MRR estimate, billing placeholder (phase 6)
```
