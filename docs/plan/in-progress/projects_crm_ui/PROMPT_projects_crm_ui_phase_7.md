# Pro Prompt — Phase 7: Column reorder & persistence

## Phase 7: Column reorder & persistence

### Primary role

FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [x] react — React/Next.js patterns
- [x] gf-design-guide — layout, tokens
- [ ] gf-testing — Jest, test patterns

### Preferred tool

- [x] **Cursor (default)** — column reorder, localStorage persistence (per GUIDE_PREFERENCES.md)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project:** GateFlow — client-dashboard. Phase 6 (TanStack Table base for QR Codes) must be done.
- **Rules:** `.cursor/contracts/CONTRACTS.md` — no secrets in client; persistence via localStorage is acceptable for column order.

### Goal

Enable **drag-and-drop column reordering** on the QR Codes table and **persist column order** per user (localStorage key e.g. `client-dashboard.qrcodes.columns`).

### Scope (in)

- Column headers show a grip/drag icon (e.g. `lucide-react` GripVertical) where reorder is allowed.
- User can drag column headers to reorder; order is persisted to localStorage and restored on load.
- Use TanStack Table’s column order state and a persistence layer (localStorage); key namespaced by table (e.g. `client-dashboard.qrcodes.columns`).

### Scope (out)

- No API for column order yet (API/user-preference can be a later phase).
- Contacts and Units tables not in scope for this phase.

### Steps (ordered)

1. Implement column reordering with TanStack Table (e.g. `columnOrder` state + drag handle on header).
2. Add drag handle (GripVertical) to table headers; wire to table state.
3. On column order change, persist to `localStorage` under a namespaced key; on mount, read and apply saved order if valid.
4. Ensure RTL layout still works (column order is logical, not visual if needed).
5. Run `pnpm turbo lint --filter=client-dashboard`, `pnpm turbo typecheck --filter=client-dashboard`, `pnpm turbo test --filter=client-dashboard`.

### Acceptance criteria

- [ ] User can drag column headers to reorder columns on QR Codes table.
- [ ] Column order is persisted to localStorage and restored on next visit.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (no regression).

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx`
- Optional: `apps/client-dashboard/src/lib/table-persistence.ts` (localStorage helpers)
