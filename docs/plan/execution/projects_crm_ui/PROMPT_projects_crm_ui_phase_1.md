# Pro Prompt — projects_crm_ui — Phase 1

## Phase 1: Foundation — Real Estate Palette & Tokens

### Primary role

ARCHITECTURE | DESIGN-TOKEN

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002)
- **Packages**: ui, config
- **Rules**: pnpm only; use semantic tokens; Midnight Blue (#020035) & Kimchi Orange (#ED4B00) palette.
- **Refs**: `docs/plan/planning/PLAN_projects_crm_ui.md`, `packages/ui/src/globals.css`

### Goal

Apply the professional "Real Estate" color palette across the dashboard by updating the core semantic tokens in the UI package.

### Scope (in)

- `packages/ui/src/globals.css` (Base tokens)
- `packages/ui/src/components/auth/login-shell.tsx` (Theme application)
- `apps/client-dashboard/src/components/layout/sidebar.tsx` (Sidebar theme)
- `tailwind.config.ts` (Theme extensions if needed)

### Scope (out)

- Scanner app UI
- Marketing website UI (unless shared tokens are affected)

### Steps (ordered)

1. **Update Tokens**: Modify `packages/ui/src/globals.css` to implement the new palette:
   - `--background`: Anti-Flash White `#F2F3F4` (Light) / Midnight Blue `#020035` (Dark).
   - `--foreground`: Midnight Blue `#020035` (Light) / Anti-Flash White `#F2F3F4` (Dark).
   - `--primary`: Kimchi Orange `#ED4B00`.
   - `--sidebar-background`: Midnight Blue `#020035`.
2. **Apply to Shell**: Ensure the `DashboardShell` and `LoginShell` correctly use these tokens for a "Midnight Blue" sidebar experience.
3. **Verify Contrast**: Check primary text headers in the dashboard to ensure they meet AAA contrast (19:1).
4. **Cleanup**: Remove any hardcoded `zinc` or `slate` references in key layout files.
5. Run `pnpm turbo build --filter=@gate-access/ui` and `pnpm turbo typecheck --filter=client-dashboard`
6. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### SuperDesign

Run *before* implementation:

| Scenario | Action |
|----------|--------|
| Redesign | `superdesign iterate-design-draft` with "Apply Midnight Blue & Kimchi palette to dashboard shell", `--context-file` for sidebar |

### Acceptance criteria

- [ ] Dashboard sidebar is Midnight Blue with white text.
- [ ] Primary buttons use Kimchi Orange.
- [ ] Background is Anti-Flash White for a clean, professional "Real Estate" feel.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes

### Files likely touched

- `packages/ui/src/globals.css`
- `apps/client-dashboard/src/app/globals.css`
- `apps/client-dashboard/src/components/layout/sidebar.tsx`
- `packages/ui/src/components/auth/login-shell.tsx`
