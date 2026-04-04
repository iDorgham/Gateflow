# PROMPT: client_dashboard_v10_redesign — Phase 5

## Phase 5: Settings V10 — The Administrative Node

### Primary role

FRONTEND | UI/UX | ANIMATOR

### Preferred tool

- [x] Cursor (default)

### Context

- **Project**: GateFlow — Turborepo monorepo
- **Apps**: client-dashboard (3001)
- **Packages**: ui
- **Rules**: pnpm only; ADS tokens; Framer Motion AnimatePresence for tab switching.

### Goal

Refactor `SettingsClient` to use `AnimatePresence` for animated tab content transitions,
replace the `forceMount + hidden` pattern with lazy per-tab rendering, and upgrade the
tab nav bar to use full ADS design tokens.

### Scope (in)

- `settings-client.tsx` — AnimatePresence tab switching, ADS tab nav, header polish.
- Tab nav: ADS lozenge-style active indicator instead of border-bottom hack.

### Scope (out)

- Individual tab file rewrites (workspace-tab, team-tab, etc.).
- New form fields or server actions.
- "Success Morph" save buttons (deferred — lives inside individual tab files).

### Steps (ordered)

1. Import `AnimatePresence` and `motion` from `framer-motion`.
2. Remove `forceMount` + `hidden` pattern from `TabsContent`.
3. Wrap the rendered tab content in `<AnimatePresence mode="wait">` with a `motion.div`
   keyed to `activeTab`. Variants: `{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }`, spring transition.
4. Replace the existing `TabsList` + `TabsTrigger` JSX with a custom scrollable nav bar
   using `<button>` elements + ADS CSS tokens (no raw hex). Active tab: `bg-[var(--ds-background-selected)]` + `text-[var(--ds-text-selected)]` + a `motion.div layoutId="settings-tab-indicator"` shared active pill.
5. Upgrade the header section to ADS tokens (`var(--ds-surface-raised)`, `var(--ds-border)`, `var(--ds-text)`, etc.).
6. Run lint + typecheck.

### Acceptance criteria

- [ ] Tab switching uses `AnimatePresence` — content fades + slides between tabs.
- [ ] Active tab indicator morphs between tabs via `layoutId` shared layout animation.
- [ ] Only the active tab's component is mounted (no `forceMount`).
- [ ] All colours use ADS CSS variables — no raw hex or Tailwind palette classes.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.

### Files touched

- `apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx`
