You are an expert full-stack engineer working inside the GateFlow Turborepo monorepo.

Current Focus: Enhance the Units Page (`apps/client-dashboard/src/app/[locale]/dashboard/residents/units`) to reflect occupancy intelligence and link deeply with Contacts.

Core Objectives:
1. Terminology Update: Rename "Unit Name" → "Unit ID" in UI (keep DB field `name`).
2. Occupancy Metrics: Date-range driven visits, passes, occupancy status (occupied/vacant).
3. Table Customization: Reorder/hide columns, save personal views (no reload).
4. Inter-Page Linking: Click unit → view linked Contacts with tags/roles.
5. Performance: React Query + Redis caching, no full page reloads on filter change.

Technical Constraints:
- Next.js 14 App Router.
- Prisma (`packages/db`): Scope by `organizationId`, respect `deletedAt`.
- UI: shadcn/ui, Tailwind, React Table.
- Caching: Follow `CACHE_STRATEGY.md` (TTLs based on data freshness).
- Security: RBAC (Units management restricted to ADMIN/TENANT_ADMIN).

Detailed Requirements:

1. API Extensions (`/api/units`)
   - Add query params: `dateFrom`, `dateTo`, `unitType`, `contactTagIds`, `search`.
   - Compute aggregates: `visitsInRange`, `passesInRange`, `lastVisit`, `linkedContactCount`.
   - Logic: If `visitsInRange === 0` over 60 days → flag as "Potential Vacancy".
   - Support sorting by aggregates (e.g., `sort=visitsInRange`).

2. UI Enhancements
   - Filter Bar: Date range, Unit Type (Villa, Apt, etc.), Occupancy Status, Search.
   - Table: React Table with customization modal (save to `User.preferences.tableViews`).
   - Column Updates: Rename "Unit Name" header to "Unit ID". Add "Visits (Range)" & "Passes (Range)".
   - Row Action: "View Contacts" → Opens modal showing residents/contacts linked to this unit (with tags).
   - "Visualize Selection" Button: Passes current filters to Analytics Dashboard.

3. Inter-Page Communication
   - Sync filters with Contacts page via URL params (e.g., clicking unit sets `?unitId=...` on Contacts page).
   - Reflect Contact tags on Unit row (e.g., badge showing "2 Family, 1 Maid").

4. Performance & Caching
   - Redis cache for unit aggregates (key: `org:{id}:units:metrics:{dateRange}`).
   - Prefetch common date ranges (Last 7d, Last 30d) on page load.
   - Infinite scroll or cursor pagination for >100 units.

Task:
1. Output a phased plan (API Aggregates → UI Table → Customization → Inter-page links).
2. Implement step-by-step. Ask for existing file contents if needed.
3. Ensure i18n keys are updated for "Unit ID" terminology.
4. Respect existing conventions (Zod, error envelopes).

Begin with the phased plan.