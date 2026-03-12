You are an expert full-stack engineer working inside the GateFlow Turborepo monorepo.

Current Focus: Enhance the Contacts Page (`apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts`) to be a powerful, customizable data hub that feeds into analytics.

Core Objectives:
1. Advanced Filtering & Sorting: Date-range driven aggregates (visitsInRange, passesInRange), search, unitType, tags.
2. Table Customization: Users can reorder/hide columns, save views (no reload).
3. Tagging System: New `Tag` & `ContactTag` models for segmentation (family, maid, prospect).
4. Inter-Page Linking: Click contact → view linked Units with metrics.
5. Performance: React Query + Redis caching (per CACHE_STRATEGY.md), optimistic UI updates.

Technical Constraints:
- Next.js 14 App Router (Server Components + Client Components).
- Prisma (`packages/db`): Add `Tag` and `ContactTag` models. Scope all queries by `organizationId`.
- UI: shadcn/ui, Tailwind, React Table (TanStack).
- State: React Query for fetching/mutations.
- Security: RBAC (only TENANT_ADMIN can manage tags), Multi-tenancy enforced.

Detailed Requirements:

1. Data Model Updates (Prisma)
   - Create `Tag` model (id, name, color, orgId).
   - Create `ContactTag` join table (contactId, tagId).
   - Seed predefined tags: "family", "maid", "driver", "prospect", "agent".
   - Update `Contact` model relations if needed.

2. API Extensions (`/api/contacts`)
   - Add query params: `dateFrom`, `dateTo`, `tagIds`, `unitType`, `search`.
   - Compute aggregates server-side: `visitsInRange`, `passesInRange` (via Prisma conditional COUNT on ScanLog/QRCode).
   - Support sorting by aggregates (e.g., `sort=visitsInRange&order=desc`).
   - Endpoint for tag management (CRUD tags, assign/remove tags).

3. UI Enhancements
   - Filter Bar: Date range picker, Tag multi-select, Unit Type dropdown, Search.
   - Table: React Table with column visibility/ordering modal (save to `User.preferences`).
   - Tag Column: Inline multi-select dropdown per row + bulk action ("Add Tag to Selected").
   - Row Action: "View Units" → Opens modal/slide-over showing linked units with visit metrics.
   - "Visualize Selection" Button: Prepares filtered data for Analytics Dashboard (passes filters via URL).

4. Performance & Caching
   - Cache aggregates in Redis (key: `org:{id}:contacts:visits:{dateFrom}-{dateTo}`).
   - Optimistic UI for tag changes (update local cache before server response).
   - Pagination: Server-side (page, per_page) for large datasets.

Task:
1. Output a phased plan (Schema → API → UI → Polish).
2. Implement step-by-step. Ask for existing file contents if needed.
3. Ensure RTL/Arabic support for all new UI elements.
4. Respect existing conventions (Zod validation, error handling).

Begin with the phased plan.