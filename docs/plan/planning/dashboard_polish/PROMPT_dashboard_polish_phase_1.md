# Phase 1: Sidebar Groups + Remove Theme Toggle

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Refs**:
  - `apps/client-dashboard/src/components/dashboard/sidebar.tsx` — `getNavGroups()` currently returns one flat "Operations" group
  - `apps/client-dashboard/src/components/dashboard/shell.tsx` — `<ThemeToggle />` in header right section
  - `apps/client-dashboard/src/components/dashboard/header-user-menu.tsx` — dropdown menu for user; add theme toggle here
  - `apps/client-dashboard/src/components/dashboard/theme-toggle.tsx` — component to move

## Goal
Reorganize the sidebar navigation into 4 semantic groups for clarity, and move the theme toggle from the header to the user dropdown menu.

## Scope (in)
- **Sidebar grouping**: Replace the single `MAIN_NAV` flat array with 4 named groups:
  - **WORKSPACE** (label: `t('sidebar.groupWorkspace', 'Workspace')`): Overview, Projects, Analytics
  - **RESIDENTS** (label: `t('sidebar.groupResidents', 'Residents')`): Contacts, Units
  - **ACCESS CONTROL** (label: `t('sidebar.groupAccessControl', 'Access Control')`): QR Codes, Access Logs, Gates, Gate Assignments
  - **SECURITY** (label: `t('sidebar.groupSecurity', 'Security')`): Watchlist, Incidents
- **Group header style** (when expanded):
  ```
  text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 px-3.5 pt-5 pb-1 first:pt-2
  ```
- **Collapsed state**: Group headers hidden; add a `<div className="h-px bg-sidebar-border/30 mx-3 my-2" />` divider between groups instead.
- **Remove `ThemeToggle`** from `shell.tsx` header (the line `<ThemeToggle />` and its import).
- **Add theme toggle to `header-user-menu.tsx`**: Add a menu item "Toggle theme" with Sun/Moon icon that calls `toggleTheme()` (same logic as ThemeToggle component).

## Scope (out)
- No changes to sidebar icon sizes or nav item styling.
- No changes to page layouts.

## Steps (ordered)
1. Open `sidebar.tsx`. In `getNavGroups()`, split `MAIN_NAV` into 4 separate arrays: `WORKSPACE_NAV`, `RESIDENTS_NAV`, `ACCESS_CONTROL_NAV`, `SECURITY_NAV`. Apply permission filtering to each.
2. Update the `groups` return to:
   ```ts
   [
     { label: t('sidebar.groupWorkspace', 'Workspace'), items: WORKSPACE_NAV },
     { label: t('sidebar.groupResidents', 'Residents'), items: RESIDENTS_NAV },
     { label: t('sidebar.groupAccessControl', 'Access Control'), items: ACCESS_CONTROL_NAV },
     { label: t('sidebar.groupSecurity', 'Security'), items: SECURITY_NAV },
   ].filter(g => g.items.length > 0)
   ```
3. In the sidebar JSX (where groups are rendered), update the group header section:
   - When `!isCollapsed`: render `<p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 px-3.5 pt-5 pb-1">` for the group label.
   - When `isCollapsed`: render a `<div className="h-px bg-sidebar-border/30 mx-3 my-2" />` divider (and skip the label text).
   - First group: `pt-2` instead of `pt-5` to avoid top gap.
4. Open `shell.tsx`. Remove `import { ThemeToggle } from './theme-toggle'` and the `<ThemeToggle />` JSX element from the header.
5. Open `header-user-menu.tsx`. Import `useTheme` from `next-themes` and `Sun`, `Moon` from `lucide-react`. Add a `DropdownMenuItem` near the top of the menu:
   ```tsx
   <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
     {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
     {theme === 'dark' ? 'Light mode' : 'Dark mode'}
   </DropdownMenuItem>
   ```
6. Run `pnpm turbo lint --filter=client-dashboard`.
7. Commit: `feat(sidebar): 4 semantic nav groups + move theme toggle to user menu (phase 1)`.

## Acceptance criteria
- [ ] Sidebar shows 4 labeled groups when expanded: Workspace, Residents, Access Control, Security.
- [ ] Sidebar shows dividers (no text labels) between groups when collapsed.
- [ ] Theme toggle no longer visible in the header bar.
- [ ] Theme can be toggled from the user dropdown menu.
- [ ] `pnpm turbo lint` passes.
