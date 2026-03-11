# Phase 1: Table, Search & Add/Edit Sheet

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: ui
- **Rules**: Use `csrfFetch` for all mutating calls; no raw `fetch` with POST/PATCH/DELETE.
- **Refs**:
  - `apps/client-dashboard/src/app/[locale]/dashboard/team/watchlist/watchlist-client.tsx` — current 165-line component to replace
  - `apps/client-dashboard/src/app/[locale]/dashboard/team/watchlist/page.tsx` — server wrapper
  - `apps/client-dashboard/src/app/api/watchlist/route.ts` — GET/POST/DELETE
  - `apps/client-dashboard/src/app/api/watchlist/[id]/route.ts` — PATCH
  - `apps/client-dashboard/src/components/settings/projects/project-sheet.tsx` — Add/Edit sheet pattern
  - `apps/client-dashboard/src/lib/csrf.ts` — csrfFetch utility

## Goal
Rewrite the watchlist page from a flat inline form + list into a polished table-driven UI with search, add/edit sheet, and safe delete — matching the quality of the Contacts and Units pages.

## Scope (in)
- **Page header**: title "Watchlist", entry count badge, "Add Entry" primary button.
- **Search bar**: `<Input>` with search icon, client-side real-time filter by name, phone, ID number.
- **Entry table**: columns — Name, Phone, ID Number, Notes (truncated), Added (date). Actions column: Edit (pencil icon) + Delete (trash icon).
- **Add/Edit Sheet**: right-side `<Sheet>` with 4 fields (Name *, Phone, ID Number, Notes as `<Textarea>`). Create → POST `/api/watchlist`. Edit → PATCH `/api/watchlist/{id}`. Close on success, toast feedback.
- **Safe delete modal**: `<Dialog>` requiring the user to type `"{entry.name} remove"` before enabling the confirm button. DELETE `/api/watchlist?id=`.
- **Empty state**: centered card with `ShieldAlert` icon and copy: "No watchlist entries. Add people to block them at the gate."
- All mutating calls must use `csrfFetch` (not raw `fetch`).

## Scope (out)
- Server-side search (Phase 2).
- Stats row (Phase 2).
- Sorting (Phase 2).

## Steps (ordered)
1. Read `watchlist-client.tsx`, `page.tsx`, and both API routes in full to understand current data shape.
2. Rewrite `watchlist-client.tsx` from scratch as a proper table component. Keep the same `Entry` interface plus add `createdBy?: string | null`.
3. Build the **page header** section: title + count badge + Add Entry button (opens the sheet).
4. Build the **search bar** using `<Input>` + a `useState` for `search` string. Filter entries in `useMemo`.
5. Build the **entry table** using the existing `<Table>` pattern from `@gate-access/ui`:
   - 6 columns: Name, Phone, ID Number, Notes, Added, Actions
   - Notes: `line-clamp-1 max-w-[160px]` to prevent overflow
   - Added: format as `toLocaleDateString`
   - Actions: ghost icon buttons (pencil = open edit sheet, trash = open delete dialog)
6. Build the **Add/Edit Sheet** (reuse `<Sheet>` from `@gate-access/ui`):
   - State: `sheetMode: 'closed' | 'add' | 'edit'` and `editingEntry: Entry | null`
   - On submit: if `add` → `csrfFetch('/api/watchlist', { method: 'POST', ... })`, if `edit` → `csrfFetch('/api/watchlist/${id}', { method: 'PATCH', ... })`
   - On success: update `entries` state, close sheet, show toast
7. Build the **safe delete dialog**:
   - State: `deletingEntry: Entry | null`, `confirmText: string`
   - Confirm enabled only when `confirmText === '${deletingEntry.name} remove'`
   - On confirm: `csrfFetch('/api/watchlist?id=${id}', { method: 'DELETE' })`
8. Build the **empty state** for when `filteredEntries.length === 0`.
9. Update `page.tsx` if needed (ensure it passes no props that break the rewrite).
10. Run `pnpm turbo lint --filter=client-dashboard`.
11. Commit: `feat(watchlist): table, search, add/edit sheet, safe delete (phase 1)`.

## Acceptance criteria
- [ ] Table renders all entries with Name, Phone, ID Number, Notes, Added columns.
- [ ] Search bar filters entries in real-time by name, phone, or ID number.
- [ ] "Add Entry" opens the sheet; form submits and new entry appears in the table.
- [ ] Clicking the pencil icon opens the sheet pre-filled with the entry's data; saving updates the row.
- [ ] Clicking the trash icon opens the safe delete dialog; confirm requires typing `"{name} remove"`.
- [ ] Empty state is shown when no entries match or none exist.
- [ ] All mutations use `csrfFetch`.
- [ ] `pnpm turbo lint` passes.
