# TASKS: Watchlist UI/UX Upgrade

**Plan**: [PLAN_watchlist_ui.md](PLAN_watchlist_ui.md)
**Status**: Ready

## Phases

- [x] **Phase 1: Table, Search & Add/Edit Sheet**
  - [x] Page header (title, count badge, Add Entry button)
  - [x] Search bar (real-time client-side filter)
  - [x] Entry table (Name, Phone, ID Number, Notes, Added, Actions)
  - [x] Add/Edit Sheet (create via POST, edit via PATCH)
  - [x] Safe delete dialog (type "{name} remove" to confirm)
  - [x] Empty state with shield icon
  - [x] All mutations use csrfFetch
  - [x] Lint passes

- [ ] **Phase 2: Stats Row, Sorting & Server Search**
  - [ ] Stats row (Total, This Month, Last Added)
  - [ ] Column sorting (Name, Added)
  - [ ] "Added by" attribution
  - [ ] Server-side search (?search= param on GET /api/watchlist)
  - [ ] Typecheck and lint pass

---
*Created: 2026-03-11*
