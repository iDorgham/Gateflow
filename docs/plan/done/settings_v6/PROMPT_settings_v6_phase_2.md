# Phase 2: Core Tabs (General & Workspace)

## Primary role
FRONTEND

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard (3001)
- **Packages**: ui, i18n, db
- **Rules**: Organization scoping; soft deletes; pnpm only.
- **Refs**: `docs/plan/planning/settings_v6/PLAN_settings_v6.md`, `docs/PRD_v7.0.md`

## Goal
Implement General and Workspace settings tabs with support for themes, language, and white-label branding.

## Scope (in)
- **General Tab**:
  - Theme selector (Light/Dark/System).
  - Language selector (English/Arabic).
  - Timezone and Date format selectors.
- **Workspace Tab**:
  - Workspace name and administrative email editing.
  - Logo upload (PNG/JPG/SVG) with preview.
  - Organization accent color picker.
  - Data Retention policy sliders (v6.0 privacy feature).

## Scope (out)
- Custom domain verification (Phase 7).

## Steps (ordered)
1. Implement General tab form using `react-hook-form` and `zod`.
2. Connect theme switcher and language toggle to global state/context.
3. Implement Workspace tab form with branding fields.
4. Integrate with `@gate-access/api-client` to save organization settings.
5. Add client-side validation for emails and character limits.
6. Verify RTL layout flips when switching to Arabic.
7. Run `pnpm preflight`.
8. After verification: `/github` — commit as `feat(settings): general and workspace tabs (phase 2)`.

## SuperDesign
**SuperDesign iterate design draft for the General/Workspace forms. Ensure high-density layout and professional styling.**

## Subagents
**Subagent (browser-use):**
"Login at localhost:3001, go to General settings, switch theme to Dark and verify colors. Switch language to Arabic and verify RTL layout. Go to Workspace settings, update the workspace name, and verify the success toast."

## Acceptance criteria
- [ ] Theme switching works instantly.
- [ ] Language switching triggers RTL and persists.
- [ ] Branding info (name, color) saves and updates the UI.
- [ ] Logo upload allows file selection and shows a preview.
- [ ] `pnpm preflight` passes.
