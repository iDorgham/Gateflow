# PROMPT: client_dashboard_v10_redesign — Phase 4

## Phase 4: Resource & Relationship Management

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

Add premium stagger entry animations to the Projects card list and Gates card grid,
and create a reusable `ResidentCard` component for high-density contact management.

### Scope (in)

- `projects-client.tsx` — stagger project cards with Framer Motion.
- `gate-client.tsx` — stagger gate cards with Framer Motion.
- `ResidentCard.tsx` (NEW) — standalone ADS card for contact display.

### Scope (out)

- Full contacts page rewrite.
- Data fetching, server actions, modals.

### Steps (ordered)

1. In `projects-client.tsx`: import `motion` from `framer-motion`; wrap project list in `motion.ul` with `staggerChildren: 0.06`; wrap each card in `motion.li` with spring item variant.
2. In `gate-client.tsx`: import `motion`; wrap gate grid `div` in a `motion.div` container with `staggerChildren: 0.05`; wrap each `GateCard` usage in `motion.div` item.
3. Create `ResidentCard.tsx` in `apps/client-dashboard/src/components/dashboard/residents/`.
4. Run lint + typecheck.

### ResidentCard spec

- Props: `contact: ContactRow`, `onView?: () => void`, `onEdit?: () => void`
- Shows: avatar initials (ADS neutral bg), full name (bold), email + phone subtly below, optional company/unit badge, status lozenge (Active/Inactive).
- Hover: `scale(1.01)` via motion.div, border shifts to `--ds-border-focused`.
- Uses only ADS CSS tokens — no raw hex values or Tailwind palette classes.

### Acceptance criteria

- [ ] Project cards stagger in on mount (opacity 0→1, y 16→0, spring).
- [ ] Gate cards stagger in on mount (same pattern).
- [ ] `ResidentCard` renders without errors when given a valid `ContactRow`.
- [ ] No raw hex values added — ADS CSS variables only.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/projects-client.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/gates/gate-client.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ResidentCard.tsx` (NEW)
