# Pro Prompt — projects_crm — Phase 4

## Phase 4: CRM Density & Table Intelligence

### Primary role

`frontend.md`

### Tool Selection

|                            | Tool         | Why                                              |
| -------------------------- | ------------ | ------------------------------------------------ |
| **Tool 1** (best quality)  | OpenCode CLI | Best for UI generation and component separation. |
| **Tool 2** (free fallback) | Cursor       | Reusable hooks & context.                        |

### Skills to load

- [x] `ui-ux-pro-max` — Dashboard widgets & density
- [x] `gf-ads-core-tokens` — ADS compliance (Color/Spacing)
- [x] `gf-ads-data-density` — High-density tables
- [x] `gf-i18n` — RTL audit
- [x] `using-superpowers`

### Goal

Implement high-density UI features, persistence for user preferences, and "Saved Views" into the CRM tables.

### Scope (in)

- **UI Toggles**: Add `Density` (Compact | Default) to the CRM `DataTable` component.
- **Persistence**: Store `tableViews` (order, visibility, density) in the database via `/api/user/preferences`.
- **Saved Views**: Add the "Save View" button in the CRM toolbar to store filtered presets.

### Steps (ordered)

1. Add `tableViews` JSON field to the `UserPreferences` model (if not already there).
2. Integrate `useUserPreferences` hook into the CRM table components.
3. Replace pure `localStorage` column states with the server-persisted user preferences.
4. Add the "Density Toggles" logic (css modules or conditional classes via ADS tokens).
5. Build the "Saved View" manager (dropdown + name input modal).
6. Verify RTL layout for the new TableCustomizer and SavedView modals.

### Acceptance criteria

- [ ] User can switch table density, and it persists upon page refresh/re-login.
- [ ] "Saved Views" correctly restore filters and sorting for property managers.
- [ ] 0 Design System violations for the new "Density" buttons.
- [ ] Accessibility: Every interactive element has a unique ID and proper `aria-` labels.

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/crm/DataTable.tsx`
- `apps/client-dashboard/src/hooks/use-user-preferences.ts`
- `apps/client-dashboard/src/app/api/user/preferences/route.ts`
- `packages/ui/src/components/tables/DensityToggle.tsx` (new)
- `apps/client-dashboard/src/components/dashboard/crm/SavedViewManager.tsx` (new)
