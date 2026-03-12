# Pro Prompt — Phase 5: Edit Panel (Shared Component)

Copy this prompt when running `/dev` for Phase 5 of the project dashboard plan.

---

## Phase 5: Edit Panel (Shared Component)

### Primary role

**FRONTEND** — Use gf-design-guide and tokens-design. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; semantic tokens only; no hardcoded hex
- **Refs**: `docs/plan/context/IDEA_project_dashboard.md`, `docs/guides/UI_DESIGN_GUIDE.md`

### Goal

Create a reusable EditPanel component: slides from right, dims the page, blocks interaction until Save or Quit. Will be used in project page, contacts page, units page, and more.

### Scope (in)

- `apps/client-dashboard/src/components/dashboard/EditPanel.tsx` (new)

### Scope (out)

- Integration into pages (Phase 6)

### Steps (ordered)

1. **Create EditPanel** — Props: open, onOpenChange, title, children, onSave, saveLabel?, isLoading?
2. **Overlay** — Fixed inset-0, z-50, bg-background/80 or bg-black/50, backdrop-blur-sm. Does NOT close on click (only Save/Quit close). pointer-events: auto to block interaction.
3. **Panel** — Fixed, right: 0 (left: 0 in RTL), top/bottom 0, w-full max-w-lg or max-w-xl, bg-card, border-l border-border, shadow-xl. Slides in with transition. ScrollArea for content.
4. **Header** — Title, optional close X (calls onOpenChange(false)).
5. **Footer** — Save button (primary, calls onSave), Quit button (outline, calls onOpenChange(false)).
6. **RTL** — Use `dir` from document or locale; panel slides from left when RTL.
7. **Semantic tokens** — bg-card, border-border, text-foreground, bg-primary, text-primary-foreground.
8. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] EditPanel renders with overlay + panel.
- [ ] Overlay blocks interaction; does not close on overlay click.
- [ ] Only Save and Quit close the panel.
- [ ] RTL: panel slides from left.
- [ ] Semantic tokens only.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/EditPanel.tsx` (new)
