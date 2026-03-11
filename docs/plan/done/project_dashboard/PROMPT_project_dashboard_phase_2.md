# Pro Prompt — Phase 2: Project Detail Page Shell

Copy this prompt when running `/dev` for Phase 2 of the project dashboard plan.

---

## Phase 2: Project Detail Page Shell

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

Build the visual shell for the project detail page: hero/cover image, title, location, description, responsive layout using semantic tokens.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- Hero section (coverUrl, fallback placeholder)
- Title, location badge, description block

### Scope (out)

- KPI cards, gates list, team, logs (Phase 3)

### Steps (ordered)

1. **Hero section** — Full-width header with:
   - `coverUrl` image (next/image) or gradient placeholder if null
   - Overlay for text contrast
   - Project name (title), location badge
2. **Description** — Card or block below hero with `description` (markdown or plain text).
3. **Semantic tokens** — Use `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, etc. No hardcoded hex.
4. **Responsive** — Mobile-first; hero scales; description readable.
5. **RTL** — Ensure layout works for `ar-EG` (dir, text alignment).
6. Run `pnpm preflight`. Fix any regressions.

### SuperDesign (optional)

If design clarity is needed: run `superdesign create-design-draft` for "real estate project hero and detail layout" with `--context-file` pointing to `docs/guides/UI_DESIGN_GUIDE.md`.

### Acceptance criteria

- [ ] Hero renders with cover image or gradient fallback.
- [ ] Title, location, description visible.
- [ ] Semantic tokens only.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
