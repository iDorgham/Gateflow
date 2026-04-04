# Pro Prompt — projects_crm_ui — Phase 7

## Phase 7: Final Audit — Polish, RTL & Security

### Primary role

SECURITY | QA | i18n

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: ui, i18n
- **Rules**: pnpm only; standard RTL; multi-tenant.
- **Refs**: `docs/plan/Draft/PLAN_projects_crm_ui.md`, all Phase 1-6 implementation.

### Goal

Conduct a global UI/UX and security audit of the newly integrated Projects CRM Hub, ensuring 100% RTL compliance and zero tenant isolation leaks.

### Scope (in)

- All pages in `/[locale]/dashboard/projects/` (RTL review)
- All CRM API routes (Security check)
- Layout animations/transitions (Polish)

### Scope (out)

- Scanner app
- Multi-tenancy implementation (this is an audit of it).

### Steps (ordered)

1. **Conduct RTL Audit**: Navigate through all new project and CRM pages in Arabic (`/ar/dashboard/projects/[projectId]`).
   - Fix any broken padding (`pl-` / `pr-`) with logical properties (`ps-` / `pe-`).
   - Ensure `EditPanel` correctly slides from the opposite side in RTL.
   - Flip table headers, sorting arrows, and KPI indicators.
2. **Tenant Isolation Review**: Perform an "Adversarial Check" on key API endpoints from Phases 2, 5, and 6:
   - Attempt to manually access a Project detail of a different Org ID.
   - Attempt to POST a Contact to a Unit that doesn't belong to the user's Org.
   - Ensure all server actions are protected with session validation.
3. **UX Polish**: Add subtle Framer Motion transitions/animations:
   - Fade-in for the Project Hero.
   - Slide-up for KPI cards.
   - Layout morphs when switching between overview and table tabs.
4. **Login/Shell Particles**: Ensure the "Real Estate Palette" is consistently applied to the Shell and Login backgrounds.
5. **Final QA**: Run full `pnpm turbo build` and ensure zero lint/type errors.
6. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### Subagents

| Subagent        | When              | Prompt                                                                                                                                                  |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **browser-use** | RTL verification  | "Navigate through the dashboard in Arabic. Verify that the sidebar is on the right, text is right-aligned, and all icons/arrows are flipped correctly." |
| **shell**       | Final build check | "Run pnpm turbo build, lint, typecheck, and test. Report failures."                                                                                     |

### Acceptance criteria

- [ ] All new components are 100% RTL compliant in Arabic.
- [ ] Zero IDOR (Insecure Direct Object Reference) vulnerabilities in CRM/Projects API.
- [ ] UI performance feels "premium" with smooth transitions and zero CLS (Cumulative Layout Shift) in tables.
- [ ] `pnpm turbo build` passes for the entire monorepo.

### Files likely touched

- `packages/i18n/src/locales/ar-EG.json`
- `apps/client-dashboard/src/app/[locale]/globals.css`
- `packages/ui/src/components/panels/EditPanel.tsx`
- `apps/client-dashboard/src/app/api/crm/contacts/route.ts` (Security adjustments)
- `apps/client-dashboard/src/app/api/crm/units/route.ts` (Security adjustments)

### Adversarial Review (Mandatory for High-Risk)

**Trigger**: This is a Security Audit phase.

1. **Invoke Adversary**: Use Claude or Opencode to "Break the system."
2. **Challenge**: "Give me a script or manual method to leak data from Org A to Org B using the new CRM table endpoints."
3. **Loop**: If a hole is found, fix it immediately.
4. **Verification**: State total corrected flaws in walkthrough.
