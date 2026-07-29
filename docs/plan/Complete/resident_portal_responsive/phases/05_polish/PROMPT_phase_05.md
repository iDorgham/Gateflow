# Phase 5: Polish – Transitions, Gestures & QA

## Primary role

QA

## Preferred tool

- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [x] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [ ] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: resident-portal (the primary target)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `PLAN_resident_portal_responsive.md` (plan folder root), `CONTEXT_resident_portal_responsive.md`, `context/`

## Goal

> Elevate the experience with smooth page transitions, mobile swipe gestures,
> perfect RTL alignment, and a final accessibility/PWA audit.

## Scope (in)

- Framer Motion page transitions for all `resident-portal` routes.
- Swipe-to-go-back gesture handling for mobile users.
- Pull-to-refresh on mobile list views.
- Global RTL audit for Arabic across all breakpoints.
- Accessibility (Keyboard, Screen Reader) audit.
- Loading/error boundaries for all routes.
- Final PWA audit (Lighthouse PWA: 95+).

## Scope (out)

- New feature additions other than polish/QA.

## Steps (ordered)

1. Implement route-level page transitions in `(portal)/layout.tsx` using
   `AnimatePresence`.
2. Add `framer-motion` swipe gesture listeners for mobile back navigation.
3. Integrate `pull-to-refresh` component for mobile lists (Home, Visitors,
   History).
4. Full RTL walkthrough: verify `ms-*`/`me-*` and horizontal scroll alignment
   in Arabic.
5. Create `apps/resident-portal/src/app/(portal)/error.tsx` and `loading.tsx`.
6. Run `pnpm turbo lint --filter=resident-portal`
7. Run `pnpm turbo typecheck --filter=resident-portal`
8. Run final Lighthouse audit (`lhci autorun` if available).
9. Commit: `git commit -m "feat(portal): final polish, RTL audit, and PWA
certification"`
10. When this is the **last** phase, move the entire plan folder to `docs/plan/Complete/resident_portal_responsive/` per `docs/development/PLAN_LIFECYCLE.md` and update `docs/plan/backlog/ALL_TASKS_BACKLOG.md` if that file references this plan.

## Acceptance criteria

- [ ] Route changes are smooth with zero flicker.
- [ ] Mobile users can swipe to return or pull lists to refresh.
- [ ] RTL layout is perfect across all 4 breakpoints.
- [ ] Lighthouse PWA score is ≥ 95.
- [ ] All tests pass (`pnpm turbo test --filter=resident-portal`)
- [ ] Build green (`pnpm turbo build --filter=resident-portal`)
- [ ] No regression on previously certified performance or security metrics.
