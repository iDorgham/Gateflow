# Phase 2: Page Polish & Stats Row

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: ui
- **Refs**:
  - `apps/client-dashboard/src/app/[locale]/dashboard/team/watchlist/watchlist-client.tsx` — Phase 1 output
  - `apps/client-dashboard/src/app/api/watchlist/route.ts` — extend with `?search=` param

## Goal
Polish the watchlist page with a stats row, column sorting, "added by" attribution, and server-side search for scalability.

## Scope (in)
- **Stats row**: 3 small stat cards above the table:
  1. Total Entries (count of all non-deleted entries)
  2. Added This Month (entries with `createdAt >= start of current month`)
  3. Last Added (relative time of most recent entry, or "—")
- **Column sorting**: click-to-sort on Name (A–Z / Z–A) and Added (newest / oldest). State: `{ sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc' }`. Client-side sort on `filteredEntries`.
- **"Added by" column**: show `createdBy` when present (next to Added date or as a sub-line). If `createdBy` is a user ID, map to name via a simple lookup (or display the ID truncated if no mapping available).
- **Confidence badge** (optional): show a small badge next to the name — "ID Verified" (has idNumber) in amber vs no badge. Helps operators know which entries have stronger match signals.
- **Server-side search**: add `?search=` query param to `GET /api/watchlist` route:
  - Filter by `name CONTAINS`, `phone CONTAINS`, `idNumber CONTAINS` (case-insensitive).
  - Debounce the client input (300ms) and pass `?search=` to the API.
  - Remove client-side filter when server-side search is active.

## Scope (out)
- Bulk delete.
- CSV import/export (separate backlog item).
- Scanner-side enforcement (separate `core_security_v6` track).

## Steps (ordered)
1. Open `apps/client-dashboard/src/app/api/watchlist/route.ts`. Add optional `search` query param to the Zod schema and include a Prisma `where` filter:
   ```ts
   ...(search ? {
     OR: [
       { name: { contains: search, mode: 'insensitive' } },
       { phone: { contains: search, mode: 'insensitive' } },
       { idNumber: { contains: search, mode: 'insensitive' } },
     ]
   } : {})
   ```
2. Update `watchlist-client.tsx`:
   - Replace client-side `useMemo` filter with a debounced `useEffect` that fetches `/api/watchlist?search=` when search changes.
   - Add `sortBy` + `sortDir` state and a `useMemo` that sorts `entries`.
   - Add sort toggle on Name and Added column headers.
3. Build the **stats row** above the table:
   - Compute stats client-side from the loaded entries (or request from a separate `/api/watchlist/stats` if preferred).
   - 3 `<Card>` components in a `grid-cols-3` layout with icon, number, and label.
4. Add **"Added by"** to the table rows — a `text-xs text-muted-foreground` sub-line below the name or as a separate column.
5. (Optional) Add **confidence badge** next to the name: a small `<Badge>` when `idNumber` is present.
6. Run `pnpm turbo lint --filter=client-dashboard`.
7. Run `pnpm turbo typecheck --filter=client-dashboard`.
8. Commit: `feat(watchlist): stats row, sorting, added-by, server-side search (phase 2)`.

## Acceptance criteria
- [ ] Stats row shows correct Total, This Month, and Last Added values.
- [ ] Clicking Name or Added header toggles sort direction.
- [ ] "Added by" is visible when `createdBy` is present.
- [ ] Server-side search reduces API results when `?search=` is passed; debounce prevents excessive requests.
- [ ] Typecheck and lint both pass.
