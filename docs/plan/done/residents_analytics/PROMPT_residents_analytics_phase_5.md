# Pro Prompt — Residents & Analytics: Phase 5 (Polish)

## Phase 5: Polish

### Primary role

**FRONTEND + i18n** — Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [x] Cursor (default)

### Context

- **Project:** GateFlow — client-dashboard; packages/i18n (en, ar-EG)
- **Refs:** PLAN_residents_analytics.md

### Goal

Complete i18n for all new strings (Unit ID, table customizer, View Units/View Contacts, tag labels, filter labels); add "Potential Vacancy" indicator on Units when applicable; tune React Query and optimistic updates; document Redis caching if used.

### Scope (in)

- i18n: audit Contacts and Units pages and Residents components for hardcoded strings. Add keys to packages/i18n (en.json, ar-EG.json): units.table.unitId, residents.filterDateRange, residents.customizeColumns, residents.viewUnits, residents.viewContacts, residents.addTagToSelected, residents.potentialVacancy, tag names (family, maid, driver, prospect, agent), filter labels, customizer save/load.
- Units: when API returns potentialVacancy (or when visitsInRange === 0 over 60d), show badge or column "Potential Vacancy" with i18n key.
- Performance: set React Query staleTime (e.g. 60_000) and gcTime for useContacts/useUnits; prefetch on hover or on filter bar focus for common date ranges if desired; optimistic updates for tag add/remove (update cache before server response, rollback on error).
- If Redis was added in Phase 4: ensure CACHE_STRATEGY.md (or equivalent) documents key patterns (org:{id}:analytics:..., org:{id}:contacts:..., org:{id}:units:...) and TTLs.

### Scope (out)

- New features; schema changes; new API routes

### Steps (ordered)

1. Audit Contacts page, Units page, ResidentsFilterBar, TableCustomizerModal, ViewUnitsModal, ViewContactsModal for hardcoded English. Add all missing keys to packages/i18n/src/locales/en.json and ar-EG.json under dashboard namespace (contacts, units, residents).
2. Use t('...') for Unit ID header, customizer title, "View Units", "View Contacts", "Add tag to selected", "Potential Vacancy", date range labels, tag names.
3. Units table: add column or badge for "Potential Vacancy" when data.potentialVacancy === true (or equivalent); style with muted or warning color.
4. In use-contacts and use-units: set staleTime and gcTime in useQuery options; in tag mutation handlers use optimistic update (update cache in onMutate, rollback in onError).
5. Update or create CACHE_STRATEGY.md if Redis caching was added in Phase 4: list key patterns and TTLs.
6. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`. Manually verify RTL on Contacts and Units with Arabic locale.

### Acceptance criteria

- [ ] No missing i18n keys for new UI; en and ar-EG have entries
- [ ] "Potential Vacancy" appears on Units when applicable
- [ ] React Query uses staleTime/gcTime; tag mutations use optimistic updates where appropriate
- [ ] CACHE_STRATEGY.md is present and accurate if Redis is used
- [ ] `pnpm turbo lint --filter=client-dashboard` and typecheck pass
- [ ] RTL layout verified for Contacts and Units

### Files likely touched

- packages/i18n/src/locales/en.json
- packages/i18n/src/locales/ar-EG.json
- apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx (vacancy badge)
- apps/client-dashboard/src/lib/residents/use-contacts.ts
- apps/client-dashboard/src/lib/residents/use-units.ts
- docs/CACHE_STRATEGY.md or docs/plan/.../CACHE_STRATEGY.md
