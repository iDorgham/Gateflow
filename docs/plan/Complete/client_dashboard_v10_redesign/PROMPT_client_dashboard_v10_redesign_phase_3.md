# PROMPT: client_dashboard_v10_redesign — Phase 3

## Phase 3: High-Density Scan & QR Operations

### Primary role

FRONTEND | UI/UX | ANIMATOR

### Preferred tool

- [x] Cursor (default)

### Context

- **Project**: GateFlow — Turborepo monorepo
- **Apps**: client-dashboard (3001)
- **Packages**: ui
- **Rules**: pnpm only; ADS tokens; Framer Motion AnimatePresence for detail views.

### Goal

Redesign the Scans and QR Codes tables for high-volume data management with
compact density mode, ADS lozenges, and spring-animated drawer-based detail views.

### Scope (in)

- `DynamicTable` compact density prop.
- `ScanDetailDrawer` — AnimatePresence spring slide-in from right.
- `QRDetailDrawer` — same for QR codes.
- ScansTable + QRCodesTable: row click opens drawer, compact rows.

### Scope (out)

- Data fetching, pagination, or server-side changes.
- Other pages outside scans/qrcodes.

### Steps (ordered)

1. Add `density?: 'default' | 'compact'` prop to `DynamicTable` (packages/ui).
2. Create `ScanDetailDrawer.tsx` using AnimatePresence + motion.div spring slide.
3. Update `ScansTable.tsx`: add drawer state, `onRowClick`, `density="compact"`.
4. Create `QRDetailDrawer.tsx` — same pattern for QR rows.
5. Update `QRCodesTable.tsx`: drawer + compact density.
6. Run lint + typecheck.

### Acceptance criteria

- [ ] Tables display in compact mode (reduced row height) via `density` prop.
- [ ] Clicking a scan row opens `ScanDetailDrawer` with spring slide animation.
- [ ] Clicking a QR row opens `QRDetailDrawer` with spring slide animation.
- [ ] Both drawers use `AnimatePresence` so exit animations play correctly.
- [ ] Status badges are ADS lozenges (`rounded-[3px]`, compact padding).
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo lint --filter=@gate-access/ui` passes.
- [ ] `pnpm turbo typecheck --filter=@gate-access/ui` passes.

### Files likely touched

- `packages/ui/src/components/ui/dynamic-table.tsx`
- `apps/client-dashboard/src/components/dashboard/scans/ScanDetailDrawer.tsx` (NEW)
- `apps/client-dashboard/src/components/dashboard/scans/ScansTable.tsx`
- `apps/client-dashboard/src/components/dashboard/qrcodes/QRDetailDrawer.tsx` (NEW)
- `apps/client-dashboard/src/components/dashboard/qrcodes/QRCodesTable.tsx`
