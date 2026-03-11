# PLAN: Watchlist UI/UX Upgrade

**Slug:** `watchlist_ui`
**App:** `client-dashboard`
**Status:** Ready

---

## Problem

The current watchlist page (`team/watchlist/`) is a minimal 165-line component:
- Flat inline form (no sheet/slide panel)
- Plain `<ul>` list with no sorting, search, or pagination
- No edit capability — only add and delete
- No visual hierarchy, no stats, no empty-state design
- Doesn't match the quality of Contacts, Units, or Gates pages

## Goal

Replace the flat form+list with a polished, table-driven watchlist page that matches the dashboard's CRM-quality UX standard: entry table with search, add/edit sheet, safe-delete confirmation, and a clear page header with count stats.

---

## Phases

### Phase 1 — Table, Search & Add/Edit Sheet
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- Rewrite `watchlist-client.tsx` into a proper table component.
- **Search bar** — client-side filter by name, phone, ID number.
- **Entry table** — columns: Name, Phone, ID Number, Notes, Added (date), Actions.
- **Add/Edit Sheet** — right-side panel (Sheet from `@gate-access/ui`) with all 4 fields; create = POST, edit = PATCH to `/api/watchlist/[id]`.
- **Safe delete modal** — require typing `"{name} remove"` before confirming; calls DELETE `/api/watchlist?id=`.
- **Page header** — title "Watchlist", badge with total count, "Add Entry" button.
- **Empty state** — styled card with a shield icon and descriptive copy.
- **CSRF** — use `csrfFetch` for all mutating calls.

**Acceptance criteria:**
- [ ] Table renders all entries with correct columns.
- [ ] Search filters by name, phone, ID number in real-time.
- [ ] Add/Edit sheet opens, submits, and updates table without page reload.
- [ ] Safe delete requires name confirmation before firing.
- [ ] `pnpm turbo lint` passes.

---

### Phase 2 — Page Polish & Stats Row
**Role:** FRONTEND | **Tool:** Cursor

**Scope:**
- **Stats row** — 3 stat cards above the table: Total Entries, Added This Month, Last Updated.
- **Column sorting** — click-to-sort on Name and Added date.
- **"Added by" column** — display `createdBy` field when present.
- **Threat level badge** (optional) — color-coded badge based on whether the entry has idNumber (higher match confidence).
- **API search param** — extend GET `/api/watchlist` to support `?search=` for server-side filtering; update client to debounce and pass param.

**Acceptance criteria:**
- [ ] Stats row shows accurate counts.
- [ ] Sorting works for Name and Added columns.
- [ ] Server-side search reduces payload on large lists.
- [ ] `pnpm turbo lint` and `pnpm turbo typecheck` pass.

---

## Key Files

| File | Change |
|------|--------|
| `apps/client-dashboard/src/app/[locale]/dashboard/team/watchlist/watchlist-client.tsx` | Full rewrite |
| `apps/client-dashboard/src/app/[locale]/dashboard/team/watchlist/page.tsx` | Minor update (pass entry count) |
| `apps/client-dashboard/src/app/api/watchlist/route.ts` | Phase 2: add `?search=` param |

## References

- Add/Edit sheet pattern: `apps/client-dashboard/src/components/settings/projects/project-sheet.tsx`
- Safe delete pattern: `apps/client-dashboard/src/components/settings/projects/project-table.tsx`
- CSRF fetch: `apps/client-dashboard/src/lib/csrf.ts`
- Stats pattern: `apps/client-dashboard/src/app/[locale]/dashboard/` (any analytics page)
