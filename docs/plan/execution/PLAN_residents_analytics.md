# PLAN_residents_analytics — Residents & Analytics Hub

**Initiative:** residents_analytics  
**Source:** [IDEA_residents_analytics.md](../context/IDEA_residents_analytics.md); RMS docs (Analytics, Contacts, Units)  
**Status:** Not started  
**Estimated:** 5 phases

---

## 1. Objectives

- **Analytics:** Dual-mode dashboard (Security ↔ Marketing), filter bar, KPIs, heatmap, operator leaderboard; filter inheritance to/from Contacts and Units.
- **Contacts:** Filter bar, date-range aggregates (visitsInRange, passesInRange), tagging (Tag, ContactTag), table customization (reorder/hide, saved views), "View Units" row action.
- **Units:** "Unit ID" terminology, same filter bar, aggregates (visitsInRange, passesInRange, lastVisit, potential vacancy), table customization, "View Contacts" row action, tag summary per unit.
- **Inter-page:** URL params (unitId, contactId, dateFrom, dateTo, tagIds, unitType, search); "Apply to Contacts/Units" from Analytics; "Visualize Selection" from Contacts/Units to Analytics.

---

## 2. Prerequisites

| Dependency | Status |
|------------|--------|
| Contacts/Units pages | Exist |
| Analytics page (shell, filter bar, KPIs, heatmap, operators) | Exists (current branch) |
| buildAnalyticsUrl, buildContactsUrl, buildUnitsUrl | Exist |
| React Query, React Table | To be added |
| Tag, ContactTag, User.preferences | To be added (schema) |

---

## 3. Phases Overview

| # | Phase | Primary role | Summary |
|---|--------|--------------|---------|
| 1 | Schema & API aggregates | BACKEND-Database + BACKEND-API | Tag, ContactTag, User.preferences; extend GET /api/contacts, GET /api/units with filters and visitsInRange/passesInRange |
| 2 | Contacts: filter bar, table, tags | FRONTEND + BACKEND-API | ResidentsFilterBar, React Query + React Table, tag column + tag APIs, table customizer, View Units modal |
| 3 | Units: table, customizer, inter-page | FRONTEND | Unit ID label, React Table, customizer, visits/passes columns, View Contacts modal, URL sync (unitId, contactId) |
| 4 | Analytics depth & filter sync | FRONTEND + BACKEND-API | Ensure Analytics URL params align with Contacts/Units; Marketing view placeholders; optional Redis caching |
| 5 | Polish | FRONTEND + i18n | i18n keys (Unit ID, new strings), RTL for charts, CACHE_STRATEGY.md if Redis used, vacancy flag (Units), performance |

---

## 4. Phase 1 — Schema & API Aggregates

**Primary role:** BACKEND-Database + BACKEND-API

**Scope**

- Prisma: Add `Tag` (id, name, color, organizationId, deletedAt), `ContactTag` (contactId, tagId). Add `User.preferences Json?`.
- Migration + seed predefined tags per org: family, maid, driver, prospect, agent.
- Extend `GET /api/contacts`: query params dateFrom, dateTo, tagIds, unitType, search, sort, sortDir, page, pageSize. Return visitsInRange, passesInRange, lastVisitInRange (attribution: Contact → ContactUnit → Unit → VisitorQR → ScanLog).
- Extend `GET /api/units`: same params; return visitsInRange, passesInRange, lastVisitInRange, linkedContactCount. Optionally flag "Potential Vacancy" if visitsInRange === 0 over 60 days.
- Tag CRUD: `GET/POST /api/tags`, `PATCH/DELETE /api/tags/[id]`; `POST/DELETE /api/contacts/[id]/tags`; bulk `POST /api/contacts/tags/bulk`.
- User preferences: `GET/PATCH /api/users/me/preferences` for tableViews (contacts, units).

**Deliverables**

- Schema migration; seed tags.
- Extended contacts/units APIs with filters and aggregates.
- Tag and preferences APIs.

**Depends on:** None

**Test criteria**

- Migration applies; seed creates tags.
- GET /api/contacts and /api/units accept new params and return aggregates.
- Tag CRUD and preferences endpoints work; org-scoped.

---

## 5. Phase 2 — Contacts: Filter Bar, Table, Tags

**Primary role:** FRONTEND + BACKEND-API

**Scope**

- Add `@tanstack/react-query`, `@tanstack/react-table` to client-dashboard.
- Shared `ResidentsFilterBar`: date range (7d/30d/custom), search, unitType, tag multi-select. Sync to URL.
- Contacts page: use React Query (useContacts) with filter params; React Table with column defs. Columns: avatar, firstName, lastName, birthday, company, phone, email, tags, units, visitsInRange, passesInRange, lastVisitInRange, actions.
- Tag column: inline multi-select; bulk "Add tag to selected". Filter by tagIds.
- Table customizer modal: drag-drop reorder, hide/show columns; save/load from User.preferences.tableViews.contacts.
- Row action "View Units": modal/sheet listing linked units with optional per-unit metrics.

**Deliverables**

- ResidentsFilterBar component.
- Contacts page refactor with React Query + React Table; tag column; customizer; View Units modal.

**Depends on:** Phase 1

**Test criteria**

- Filter bar updates URL; data refetches with new params.
- Tag add/remove (single and bulk) works; customizer persists and restores columns.
- `pnpm turbo lint --filter=client-dashboard` and typecheck pass.

---

## 6. Phase 3 — Units: Table, Customizer, Inter-Page

**Primary role:** FRONTEND

**Scope**

- Units page: React Query (useUnits) + React Table; same ResidentsFilterBar; columns include Unit ID (label only; DB field remains `name`), type, sizeSqm, visitsInRange, passesInRange, lastVisitInRange, linkedContactCount, tag summary (e.g. "2 family, 1 maid"), actions.
- Table customizer for units (save to User.preferences.tableViews.units).
- Row action "View Contacts": modal listing linked contacts with tags.
- URL params: support unitId (on Contacts page to pre-filter by unit), contactId (on Units page to pre-filter by contact). buildContactsUrl/buildUnitsUrl include unitId/contactId when provided.
- "Apply to linked page" / "Visualize Selection": navigate to Analytics with current filters.

**Deliverables**

- Units page refactor with React Table, customizer, View Contacts modal.
- URL param handling for unitId, contactId on both pages.
- i18n key for "Unit ID".

**Depends on:** Phase 1, 2

**Test criteria**

- Units table shows aggregates and tag summary; customizer persists.
- Opening Contacts with ?unitId=X filters to that unit; opening Units with ?contactId=C filters to that contact.
- `pnpm turbo lint --filter=client-dashboard` and typecheck pass.

---

## 7. Phase 4 — Analytics Depth & Filter Sync

**Primary role:** FRONTEND + BACKEND-API

**Scope**

- Ensure Analytics page accepts same filter set from URL (dateFrom, dateTo, projectId, gateId, unitType, search, tagIds if supported). buildAnalyticsUrl and parseFiltersFromSearchParams aligned with Contacts/Units.
- Marketing view: placeholders for funnel chart, persona/tag pie, ROI widget (or stubs).
- Optional: Redis caching for analytics summary/heatmap (key pattern org:{orgId}:analytics:...); document in CACHE_STRATEGY.md if added.
- RTL support for Analytics charts (axis labels, tooltips).

**Deliverables**

- Unified filter schema across Analytics, Contacts, Units URLs.
- Marketing placeholders or minimal implementations.
- Optional Redis + CACHE_STRATEGY.md.

**Depends on:** Phases 1–3

**Test criteria**

- Navigating from Contacts/Units with filters opens Analytics with same filters; "Apply to Contacts/Units" applies current Analytics filters on target page.
- `pnpm preflight` passes.

---

## 8. Phase 5 — Polish

**Primary role:** FRONTEND + i18n

**Scope**

- i18n: all new strings in en.json and ar-EG.json (Unit ID, table customizer, View Units/View Contacts, tag labels, filter labels, etc.).
- Units: "Potential Vacancy" badge or column when visitsInRange === 0 over 60 days (configurable window).
- Performance: React Query staleTime/gcTime; prefetch common date ranges; optimistic updates for tag mutations.
- CACHE_STRATEGY.md: document Redis keys and TTLs if used in Phase 4.

**Deliverables**

- Complete i18n for new UI; RTL verified.
- Vacancy indicator on Units; performance tuning; caching doc.

**Depends on:** Phases 1–4

**Test criteria**

- No missing translation keys; RTL layout correct.
- `pnpm turbo lint --filter=client-dashboard` and typecheck pass.

---

## 9. Risks & Notes

- **Attribution:** Contact visitsInRange = sum of visits from linked units (ScanLog → QRCode → VisitorQR → unitId). No contactId on ScanLog today.
- **RBAC:** Tag management and preferences restricted per existing roles (e.g. TENANT_ADMIN for tag CRUD).
- **Redis:** Optional; fallback to no cache or in-memory if Redis unavailable.
