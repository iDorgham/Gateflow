# Pro Prompt: GateFlow AI Redesign Phase 3 — Cinematic Shell & Motion

## Goal
Inject the "Soul" into GateFlow Command: Implement the cinematic entry and purposeful layout transitions.

### Primary role
FRONTEND (with UI/UX Animator)

### Preferred tool
Cursor

### Context
- **Guideline**: [ADS Motion](https://atlassian.design/foundations/motion)
- **Skills**: `gf-creative-ui-animation`, `gf-uiux-animator`.
- **Target**: `apps/client-dashboard/src/components/command/CommandShell`

### Scope (in)
- **Cinematic Entry**: Staggered load for the sidebar, feed, and chat area when the Command Center opens.
- **Layout Transitions**: Use `framer-motion` layout-id for smooth sidebar toggle and folder expand/collapse.
- **Attention Guidance**: Pulsing animations for `AlertBadge` when high-severity anomalies occur.
- **Input Pulses**: Inviting pulse effect on the command bar when the system expects user input.

### Scope (out)
- Context logic (Phase 4).
- Tagging UI integration (Phase 6).

### Steps
1. Assembly the `CommandShell` in the dashboard using the components from Phase 2.
2. Apply `AnimatePresence` and `layout` props to the workspace containers.
3. Implement the `EntryCinematic` staggering hook.
4. Ensure animations are smooth (60fps) and respect `prefers-reduced-motion`.

### Acceptance criteria
- [ ] Smooth 60fps motion for all transitions.
- [ ] Motion guides attention rather than distracting.
- [ ] ADS motion tokens respected.
