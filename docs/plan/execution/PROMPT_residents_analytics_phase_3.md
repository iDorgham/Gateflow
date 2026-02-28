# Pro Prompt — Residents & Analytics: Phase 3 (Units: Table, Customizer, Inter-Page)

## Phase 3: Units — Table, Customizer, Inter-Page

### Primary role

**FRONTEND** — Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [x] Cursor (default)

### Context

- **Project:** GateFlow — Turborepo, pnpm, Next.js 14 App Router
- **Refs:** PLAN_residents_analytics.md, apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx, buildContactsUrl, buildUnitsUrl in lib/analytics

### Goal

Refactor the Units page with React Query and React Table; use ResidentsFilterBar; rename "Unit Name" to "Unit ID" in UI; add visitsInRange, passesInRange, lastVisitInRange, tag summary; table customizer; "View Contacts" row action; URL param sync (unitId on Contacts, contactId on Units).

### Scope (in)

- Units page: useUnits(filters) hook; React Table; same ResidentsFilterBar; columns: Unit ID (name), type, sizeSqm, visitsInRange, passesInRange, lastVisitInRange, linkedContactCount, tagSummary (e.g. "2 family, 1 maid"), linked resident, actions
- Table customizer for units (User.preferences.tableViews.units)
- Row action "View Contacts": modal listing linked contacts with their tags
- URL params: Contacts page accepts ?unitId= and pre-filters to contacts linked to that unit; Units page accepts ?contactId= and pre-filters to units linked to that contact. buildContactsUrl(locale, { ...filters, unitId }), buildUnitsUrl(locale, { ...filters, contactId })
- "Apply to linked page" / "Visualize Selection" from both pages: ensure current filters are passed to Analytics (buildAnalyticsUrl) or to the other page (buildContactsUrl/buildUnitsUrl with unitId/contactId when applicable)

### Scope (out)

- Analytics Marketing view implementation (Phase 4)
- Redis caching

### Steps (ordered)

1. Create useUnits(filters) hook: useQuery with GET /api/units and filter params; return data, isLoading, refetch.
2. Refactor Units page: use ResidentsFilterBar; read searchParams (including contactId); pass to useUnits; render React Table. Column header for unit name: use i18n key "units.table.unitId" (label "Unit ID"); keep data field as name.
3. Add columns: visitsInRange, passesInRange, lastVisitInRange, linkedContactCount, tagSummary (aggregate from linked contacts' tags; API must return this or compute from contact tags). Actions: Link Resident, Edit, Delete, View Contacts.
4. Table customizer: same pattern as Contacts; save/load User.preferences.tableViews.units.
5. View Contacts modal: on row action, open sheet/modal with unit.id; list linked contacts (from unit.contacts or refetch) with tags; optional metrics.
6. Extend buildContactsUrl and buildUnitsUrl in lib/analytics/build-analytics-url.ts to accept and append unitId and contactId to query string when provided.
7. Contacts page: on mount, read unitId from searchParams; if present, include in API request (e.g. /api/contacts?unitId=...) and show "Viewing unit: X" badge or filter state. Units page: same for contactId.
8. Add "Apply to Contacts" / "Apply to Units" links where applicable (e.g. from Contacts page link to Units with current filters + contactId if a single contact context; from Units link to Contacts with unitId).
9. i18n: add units.table.unitId = "Unit ID" (en, ar).
10. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.

### Acceptance criteria

- [ ] Units table shows Unit ID label and all aggregate/tag summary columns; customizer persists
- [ ] "View Contacts" modal shows linked contacts with tags
- [ ] Opening Contacts with ?unitId=X filters to that unit; opening Units with ?contactId=C filters to that contact
- [ ] buildContactsUrl/buildUnitsUrl include unitId/contactId when provided
- [ ] `pnpm turbo lint --filter=client-dashboard` and typecheck pass

### Files likely touched

- apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx
- apps/client-dashboard/src/lib/residents/use-units.ts (new)
- apps/client-dashboard/src/components/dashboard/residents/ViewContactsModal.tsx (new)
- apps/client-dashboard/src/lib/analytics/build-analytics-url.ts
- packages/i18n/src/locales/en.json, ar-EG.json
