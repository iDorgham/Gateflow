# Phase 8: Notifications & Hardening

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Packages**: ui, i18n, api-client
- **Rules**: Accessibility compliance.
- **Refs**: `docs/guides/UI_DESIGN_GUIDE.md`.

## Goal
Implement notification preferences and perform final UI/UX polish across all tabs.

## Scope (in)
- System and resident notification preferences form.
- Notification template previewer.
- Accessibility audit and keyboard navigation fixes.
- Global search logic integration (filtering settings sections).
- Final UI polish (spacing, consistency, animations).

## Scope (out)
- Custom email template editor (Phase 13).

## Steps (ordered)
1. Implement the Notification preferences cards with multi-channel selectors (Email/SMS/Push).
2. Build the template previewer with placeholder support.
3. Integrate the global settings search bar to filter visible tabs or sections by keywords.
4. Perform an accessibility sweep using `axe-core` or similar tools and fix high-priority items.
5. Apply final animations (Framer Motion) for seamless transitions between tabs.
6. Run `pnpm turbo lint`.
7. After verification: `/github` — commit as `feat(settings): notifications and final ui polish (phase 8)`.

## Acceptance criteria
- [ ] Notification channels are correctly persisted.
- [ ] Template preview reflects the placeholders.
- [ ] Settings search bar accurately filters content.
- [ ] Keyboard navigation is functional across all tabs.
- [ ] `pnpm turbo lint` passes.
