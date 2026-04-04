# PROMPT: client_dashboard_v10_redesign — Phase 1

## Phase 1: Global Shell & Premium Navigation

### Primary role

FRONTEND | UI/UX | ANIMATOR

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — for complex animation logic if needed

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: ui, i18n
- **Rules**: pnpm only; 100% ADS Token adherence; Framer Motion for premium feel.
- **Refs**: `CLAUDE.md`, `packages/ui/src/globals.css`, `packages/ui/src/tokens.ts`.

### Goal

Refactor the client dashboard's global shell and navigation to provide a
"buttery-smooth" premium experience using Framer Motion shared layout morphs
and ADS tokens.

### Scope (in)

- Sidebar collapse/expand animation.
- Active state transitions (morphing indicator).
- Glassmorphism effects for Header and Sidebar.
- Full RTL (Arabic) support for the new navigation mechanics.

### Scope (out)

- Individual page content (focus on the Shell/Navigation only).
- Analytics charts (Phase 2).

### Steps (ordered)

1. **Source Audit**: Trace `apps/client-dashboard/src/components/dashboard/`
   `sidebar.tsx` and `header.tsx` to identify existing layout constraints.
2. **Refactor Shell**:
   - Update the Dashboard Layout to support `AnimatePresence`.
   - Refactor Sidebar to use `motion.aside` and `motion.div` for the
     collapse/expand bridge.
   - Implement `layoutId="active-nav-indicator"` for the sidebar active state.
3. **Apply Glassmorphism & Tokens**:
   - Use `bg-ds-surface/80 backdrop-blur-md border-ds-border` for the shell
     components.
   - Ensure all elements use strictly `ds.*` tokens from
     `packages/ui/src/tokens.ts`.
4. **RTL Verification**: Ensure `framer-motion` directions flip correctly
   when `dir="rtl"`.
5. Run `pnpm turbo lint --filter=client-dashboard`,
   `pnpm turbo typecheck --filter=client-dashboard`.
6. After phase passes: `/github` — git add, commit (conventional: `feat(client-`
   `dashboard): v10 global shell & premium navigation`), push.

### Acceptance criteria

- [ ] Sidebar collapse/expand is animated with a spring.
- [ ] Active menu item has a shared layout indicator that slides between items.
- [ ] Header and Sidebar use ADS tokens and backdrop blur.
- [ ] Navigation works perfectly in both LTR (EN) and RTL (AR).
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/layout.tsx`
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/header.tsx`
- `packages/ui/src/components/tabs.tsx`
