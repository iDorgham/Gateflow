# Phase 4: Units & Residents Quotas

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: ui, api-client, db
- **Rules**: Multi-tenant scoping.
- **Refs**: `docs/PRD_v7.0.md` Section: Resident Portal & Quotas.

## Goal
Implement the Units & Residents tab with specialized quota management and resident defaults.

## Scope (in)
- **Unit Types & Quotas**: Table for managing types (e.g., Studio, 3BR) and their default slots.
- **Resident Defaults**: Form for global resident behavior (WhatsApp sharing, quiet hours).
- **Units Overview**: Searchable table with quota usage progress bars.
- Bulk update for unit quotas.

## Scope (out)
- Individual resident registration (handled in main Resident dashboard).

## Steps (ordered)
1. Build the sub-tabbed navigation for the Units & Residents tab.
2. Create the Unit Type management table and "Add Type" sheet.
3. Implement the Resident Defaults form using `react-hook-form`.
4. Build the Units Overview table with custom progress bar components for quota visualization.
5. Integrate with React Query for real-time quota updates.
6. Verify visibility and editing rules (only admins should edit quotas).
7. Run `pnpm turbo lint`.
8. After verification: `/github` — commit as `feat(settings): units and resident quota management (phase 4)`.

## Acceptance criteria
- [ ] Quotas are clearly visualized with progress bars.
- [ ] Unit types can be created and assigned slots.
- [ ] Resident defaults (channels, hours) persist in the database.
- [ ] Table filtering and search are responsive.
- [ ] `pnpm turbo lint` passes.
