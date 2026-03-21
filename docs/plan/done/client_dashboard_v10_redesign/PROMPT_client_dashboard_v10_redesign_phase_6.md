# PROMPT: client_dashboard_v10_redesign — Phase 6

## Phase 6: Global Polish & RTL Audit

### Primary role
FRONTEND | QA | PERFORMANCE

### Preferred tool
- [x] Cursor (default)

### Context
- **Project**: GateFlow — Turborepo monorepo
- **Apps**: client-dashboard (3001), packages/ui
- **Rules**: pnpm only; ADS tokens; RTL-first for ar-EG / ar-SA.

### Goal
Final zero-jank verification: fix RTL regressions introduced during phases 1-5,
add strategic `next/dynamic` imports for the heaviest animation bundles, and
confirm `pnpm turbo lint + typecheck` is GREEN across both workspaces.

### Scope (in)
- RTL regression fixes across all phase 1-5 touched files.
- `next/dynamic` lazy imports for `ScanDetailDrawer` and `QRDetailDrawer` (only
  rendered on row click — ideal candidates for code-splitting).
- Restore `dir` attribute on settings page nav (removed with Tabs refactor).
- Run full workspace lint + typecheck as final gate.

### Scope (out)
- New features or tab rewrites.
- Visual regression screenshots.

### Steps (ordered)
1. **RTL audit** — check every phase 1-5 file for hardcoded `left/right` CSS
   or non-logical Tailwind classes that break RTL.
2. **settings-client.tsx** — restore `dir` attribute (was on `<Tabs>`, now needs
   to be on the outer wrapper or nav element).
3. **ScansTable.tsx / QRCodesTable.tsx** — convert `ScanDetailDrawer` and
   `QRDetailDrawer` imports to `next/dynamic` with `ssr: false`.
4. Run `pnpm turbo lint --filter=client-dashboard --filter=@gate-access/ui`.
5. Run `pnpm turbo typecheck --filter=client-dashboard --filter=@gate-access/ui`.
6. Move plan `in-progress/client_dashboard_v10_redesign/` → `done/`.

### Acceptance criteria
- [ ] `settings-client.tsx` applies `dir="rtl"` for ar-EG/ar-SA locales.
- [ ] `ScanDetailDrawer` and `QRDetailDrawer` are loaded via `next/dynamic`.
- [ ] No new `left-*` / `right-*` non-logical Tailwind classes in phase 1-5 files.
- [ ] `pnpm turbo lint --filter=client-dashboard` — 0 errors.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` — 0 errors.
- [ ] `pnpm turbo lint --filter=@gate-access/ui` — 0 errors.
- [ ] `pnpm turbo typecheck --filter=@gate-access/ui` — 0 errors.
- [ ] Plan moved to `done/`.
