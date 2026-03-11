# TASKS: Watchlist UI/UX Upgrade

**Plan**: [PLAN_watchlist_ui.md](PLAN_watchlist_ui.md)
**Status**: Ready

## Phases

- [ ] **Phase 1: Table, Search & Add/Edit Sheet**
  - [ ] Page header (title, count badge, Add Entry button)
  - [ ] Search bar (real-time client-side filter)
  - [ ] Entry table (Name, Phone, ID Number, Notes, Added, Actions)
  - [ ] Add/Edit Sheet (create via POST, edit via PATCH)
  - [ ] Safe delete dialog (type "{name} remove" to confirm)
  - [ ] Empty state with shield icon
  - [ ] All mutations use csrfFetch
  - [ ] Lint passes

- [ ] **Phase 2: Stats Row, Sorting & Server Search**
  - [ ] Stats row (Total, This Month, Last Added)
  - [ ] Column sorting (Name, Added)
  - [ ] "Added by" attribution
  - [ ] Server-side search (?search= param on GET /api/watchlist)
  - [ ] Typecheck and lint pass

---
*Created: 2026-03-11*
