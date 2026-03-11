# Pro Prompt — Phase 4: Settings Page & Tabs

Copy this prompt when running `/dev` for Phase 4 of the client dashboard UI refinement plan.

---

## Phase 4: Settings Page & Tabs

### Primary role

**FRONTEND** — Use gf-design-guide and tokens-design context. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; semantic tokens only; no hardcoded hex
- **Refs**: `docs/plan/context/IDEA_client_dashboard_ui_refine.md`, `docs/guides/UI_DESIGN_GUIDE.md`

### Goal

Apply semantic tokens to settings page layout and all 11 tabs.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/settings/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/`:
  - general-tab.tsx, profile-tab.tsx, workspace-tab.tsx
  - projects-tab.tsx, api-keys-tab.tsx, webhooks-tab.tsx
  - billing-tab.tsx, team-tab.tsx, roles-tab.tsx
  - notifications-tab.tsx, integrations-tab.tsx

### Scope (out)

- Workspace sub-pages (`/dashboard/workspace/settings`, `/dashboard/workspace/billing`, etc.) — separate scope
- Admin dashboard

### Steps (ordered)

1. **Audit** — Search for hardcoded hex/rgb in settings-client and all tab files. List occurrences.
2. **Replace** — Swap with semantic tokens:
   - Tab triggers: rely on Tabs component; ensure active uses `text-primary` or equivalent
   - Cards: `bg-card`, `border-border`, `text-card-foreground`
   - Tables: `text-foreground`, `text-muted-foreground`
   - Forms: `bg-background`, `border-input`
   - Buttons: `bg-primary`, `text-primary-foreground`
3. **TabsList/TabsTrigger** — If using @gate-access/ui Tabs, verify it consumes semantic tokens; if custom, apply tokens.
4. Run `pnpm preflight`. Fix any regressions.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **browser-use** | After implementation | "Login at localhost:3001, navigate to /dashboard/settings. Cycle through all tabs (General, Profile, Workspace, Projects, API Keys, Webhooks, Billing, Team, Roles, Notifications, Integrations). Verify palette consistency." |

### Acceptance criteria

- [ ] No hardcoded hex in settings page and all 11 tab files.
- [ ] All tabs render correctly; tab switching works.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/settings/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/settings-client.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/*.tsx`
