# Phase 8: Client Dashboard Multi-Step UI Wizard (Atlassian ADS)

> **Checklist (mandatory):** `docs/plan/Complete/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/Complete/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**FRONTEND**

### Tool selection

|               | Tool                | Why                 |
| ------------- | ------------------- | ------------------- |
| **Preferred** | **Cursor**          | Component iteration |
| **Fallback**  | OpenCode CLI (free) | Form boilerplate    |

### Skills to load (mandatory for this phase)

1. `.antigravity/skills/gf-security/SKILL.md` — no tokens in browser storage for admin session beyond existing patterns
2. `.antigravity/skills/gf-design/SKILL.md` — ADS tokens, spacing, typography — fallback: `.cursor/skills/design-guide/SKILL.md`, `.cursor/skills/ads-*`
3. `.antigravity/skills/gf-uiux/SKILL.md` — wizard, validation, WCAG 2.1 AA — fallback: `.cursor/skills/responsive-design/SKILL.md`, `.cursor/skills/i18n/SKILL.md`
4. **SuperDesign** (optional): `.agents/skills/superdesign/SKILL.md` for layout review
5. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
6. **Token refs:** `packages/ui/src/tokens.ts`, `apps/client-dashboard/src/app/globals.css` (ADS CSS variables)

### Context

- **Depends on:** Phase 7 API stable.
- **Objective:** Page under client dashboard (e.g. `/{locale}/dashboard/emulation`) with **6 steps**: (1) org/range overview (2) unit ID format (3) contact/nationality mix (4) unit hierarchy params (5) rush scenario (6) review + submit.
- **UX:** Progressive disclosure, inline validation, keyboard navigation, focus management between steps, screen-reader labels (`aria-*`).
- **Theming:** Light/dark via existing client-dashboard theme behavior; semantic tokens `--ds-background`, `--ds-text`, `--ds-primary`, etc.
- **Data contract:** Wizard defaults and summary fields must map to current client tables (`ContactTable`, `UnitTable`, `QRCodesTable`, `ScansTable`) and real Prisma fields.

### Goal

Production-ready wizard posting to `/api/admin/emulate-traffic` with loading states, batch progress display (polling or SSE optional — start with simple spinner + result summary), error toast.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/emulation/page.tsx` (align with locale routing)
- `apps/client-dashboard/src/components/dashboard/emulation/*` — step components, `EmulationWizard`, summary
- Components from `@gate-access/ui` where possible
- Client-side Zod mirror of API schema for instant validation

### Scope (out)

- Resident portal; admin-dashboard; marketing.

### Steps (ordered)

1. Discover client dashboard layout/shell; add nav link “Emulation” for Super Admins only.
2. Build step state machine (`useReducer` or `react-hook-form` multi-step).
3. Wire fetch to Phase 7 API with credentials.
4. Add progress UI: disabled submit while pending; success summary with counts from response metadata.
5. Run axe or eslint-plugin-jsx-a11y on new files; manual keyboard pass.
6. `pnpm turbo lint typecheck test --filter=client-dashboard`
7. Commit: `feat(seeding): phase 8 — client dashboard emulation wizard (ADS)`

### Security checklist

- [ ] UI only visible to Super Admin (same gate as API)
- [ ] No `QR_SIGNING_SECRET` or Redis tokens in client bundle
- [ ] Display `organizationId` only as non-sensitive label if needed

### Acceptance criteria — functional & UI/UX

- [ ] **Functional:** Completing wizard triggers API; errors surfaced accessibly.
- [ ] **UI/UX:** WCAG 2.1 AA intent: labels, focus ring, heading order, touch targets.
- [ ] **UI/UX:** Responsive: desktop-first; usable width on mobile.
- [ ] **UI/UX:** Light/dark modes use CSS variables / tokens consistently.
- [ ] **Quality:** `pnpm turbo lint --filter=client-dashboard` passes
- [ ] **Quality:** `pnpm turbo typecheck --filter=client-dashboard` passes
- [ ] **Quality:** `pnpm turbo test --filter=client-dashboard` passes (add component/hook tests if missing)

### Files likely touched

- `apps/client-dashboard/src/app/**/dashboard/emulation/**`
- `apps/client-dashboard/src/components/dashboard/emulation/**`
- Client dashboard nav/sidebar component

### Handoff to Phase 9

Operators can run seeds from UI; CLI flags remain for CI/automation.
