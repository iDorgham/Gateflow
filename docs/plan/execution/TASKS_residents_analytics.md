# Plan tasks — residents_analytics

Checklist for **PLAN_residents_analytics**. Use with `/dev` and phase prompts.

**Plan:** `docs/plan/execution/PLAN_residents_analytics.md`  
**Prompts:** `docs/plan/execution/PROMPT_residents_analytics_phase_N.md`

---

## Phase 1 — Schema & API Aggregates

- [x] **1.1** Prisma schema: `Tag`, `ContactTag`, `User.preferences`
- [x] **1.2** Migration created and applied
- [x] **1.3** Seed predefined tags per organization
- [x] **1.4** Extend `GET /api/contacts` filters + range aggregates
- [x] **1.5** Extend `GET /api/units` filters + range aggregates
- [x] **1.6** Implement tags APIs (CRUD + contact tag assign/remove + bulk)
- [x] **1.7** Implement `GET/PATCH /api/users/me/preferences`
- [x] **1.8** Lint, typecheck, tests pass; committed

**Status:** Done

---

## Phase 2 — Contacts: Filter Bar, Table, Tags

- [x] **2.1** Add React Query + React Table deps in `client-dashboard`
- [x] **2.2** Build shared `ResidentsFilterBar` with URL sync
- [x] **2.3** Create `useContacts(filters)` hook
- [x] **2.4** Refactor Contacts table with React Table columns + aggregates
- [x] **2.5** Add tag column inline add/remove + bulk tag actions
- [x] **2.6** Add contacts table customizer (order/visibility) + persist view
- [x] **2.7** Add "View Units" row action modal/sheet
- [x] **2.8** i18n/RTL for new Contacts UI strings
- [x] **2.9** Lint, typecheck, tests pass; committed

**Status:** Done

---

## Phase 3 — Units: Table, Customizer, Inter-Page

- [x] **3.1** Create `useUnits(filters)` hook
- [x] **3.2** Refactor Units page with React Table + ResidentsFilterBar
- [x] **3.3** Update UI terminology to "Unit ID" (label only)
- [x] **3.4** Add units aggregates columns + tag summary + linked contact count
- [x] **3.5** Add units table customizer + persist view
- [x] **3.6** Add "View Contacts" row action modal/sheet
- [x] **3.7** Support URL sync for `unitId` and `contactId` flows
- [x] **3.8** Ensure build URL helpers include `unitId` / `contactId`
- [x] **3.9** Lint, typecheck, tests pass; committed

**Status:** Done

---

## Phase 4 — Analytics Depth & Filter Sync

- [x] **4.1** Align Analytics URL filter schema with Contacts/Units
- [x] **4.2** Ensure "Apply to Contacts/Units" forwards full filter state
- [x] **4.3** Add/verify Marketing view placeholders (funnel, persona pie, ROI)
- [x] **4.4** (Optional) Add Redis caching for analytics summary/heatmap — skipped
- [x] **4.5** (If cached) Document keys/TTLs in `CACHE_STRATEGY.md` — N/A
- [x] **4.6** Verify RTL behavior for Analytics charts/tooltips/labels
- [x] **4.7** Lint, typecheck, tests pass; committed

**Status:** Done

---

## Phase 5 — Polish

- [x] **5.1** Complete i18n coverage (en + ar-EG) for Residents/Analytics additions
- [x] **5.2** Add Units "Potential Vacancy" indicator when applicable
- [x] **5.3** Tune React Query (`staleTime`, `gcTime`) for contacts/units
- [x] **5.4** Add optimistic updates for tag mutations where appropriate
- [x] **5.5** Finalize cache docs if Redis was introduced — N/A (no Redis)
- [x] **5.6** Verify RTL layouts for Contacts/Units/Analytics — manual check
- [x] **5.7** Lint, typecheck, tests pass; committed

**Status:** Done
