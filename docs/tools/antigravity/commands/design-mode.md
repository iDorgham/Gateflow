# Antigravity Design Mode — UI/UX Design Brief Prompt

Copy this prompt into Antigravity (or any CLI) to get a structured design brief + layout + token + motion plan + responsive plan for a UI/UX task. Wire it as a macro or command if your IDE supports it.

---

## Copy-paste prompt

```text
**Command:** Design mode (UI/UX design brief)

**Request:** Produce a design brief for the following UI/UX task. Output:

1. **Design brief** — Purpose, target user, constraints (responsive, RTL, dark mode, WCAG AA).
2. **Layout plan** — Structure (grid/flex), component hierarchy, key screens.
3. **Token plan** — Which design tokens from `packages/ui/src/tokens.ts` to use (colors, spacing, radius).
4. **Motion plan** — Where and how to add animations (duration, easing, prefers-reduced-motion fallback).
5. **Responsive plan** — Breakpoints, mobile-first adjustments, touch targets.

**Context to load:**
- `docs/guides/UI_DESIGN_GUIDE.md`
- `docs/guides/MOTION_AND_ANIMATION.md`
- `packages/ui/src/tokens.ts`
- `apps/client-dashboard/src/app/globals.css` (CSS variables)

**User task (replace with your description):**
[Describe the page, component, or flow you want to design — e.g. "Analytics dashboard card for scan counts" or "Login page with animated particle background"]

**Stack:** Next.js 14, @gate-access/ui, Tailwind 3.4. Use semantic tokens only. Support AR/EN and RTL.
```

---

## Usage

1. Replace `[Describe...]` with your actual design task.
2. Copy the full block and paste into Antigravity chat or any CLI.
3. Use the output to guide implementation or SuperDesign drafts.
