# Pro Prompt — Phase 3: Dashboard & Marketing Consistency

Copy this prompt when running `/dev` for Phase 3 of the real estate palette plan.

---

## Phase 3: Dashboard & Marketing Consistency

### Primary role

**FRONTEND** — Use gf-design-guide context. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002), marketing (3000)
- **Rules**: pnpm only; semantic tokens only; less is more
- **Refs**: `docs/plan/context/IDEA_real_estate_palette.md`, `docs/guides/UI_DESIGN_GUIDE.md`

### Goal

Ensure client-dashboard, admin-dashboard, and marketing consistently use the real estate palette. Replace any stray hardcoded hex with semantic tokens. Limit scope to high-visibility surfaces: sidebar, primary buttons, CTAs, footer links.

### Scope (in)

- Client-dashboard: sidebar, primary buttons, links
- Admin-dashboard: sidebar, primary buttons, links
- Marketing: hero CTA, footer links, key accent elements

### Scope (out)

- Scanner app, resident portal
- New page layouts or flows
- Deep refactors of component libraries

### Steps (ordered)

1. **Audit** — Search for hardcoded hex in client-dashboard, admin-dashboard, marketing (e.g. `#ff6602`, `#424242`, `#020035`, `rgb(255,102,2)`). Focus on:
   - Sidebar components
   - Button variants (primary, accent)
   - Link styles
   - Marketing hero and footer

2. **Replace** — Swap hardcoded values with semantic tokens (`text-primary`, `bg-primary`, `text-muted-foreground`, `border-border`, etc.). Preserve contrast; use `primary-foreground` on `primary` backgrounds.

3. **Verify** — Spot-check key pages:
   - Client: login → dashboard → settings
   - Admin: login → dashboard
   - Marketing: home, pricing, contact

4. Run `pnpm preflight` (or `pnpm turbo lint && pnpm turbo typecheck && pnpm turbo test`). Fix any regressions.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **browser-use** | After implementation | "Login to client-dashboard and admin-dashboard. Navigate to sidebar, settings, analytics. Verify palette consistency and no visual regressions. Check marketing home and pricing." |

### Acceptance criteria

- [ ] No hardcoded hex for primary/accent/foreground in touched files.
- [ ] Visual pass: login → dashboard → marketing feels cohesive and professional.
- [ ] `pnpm preflight` passes.
- [ ] No new lint or type errors.

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`
- `apps/admin-dashboard/src/components/Sidebar.tsx`
- `apps/marketing/components/**/*.tsx` (hero, footer, CTAs)
- Any other files with hardcoded palette colors
