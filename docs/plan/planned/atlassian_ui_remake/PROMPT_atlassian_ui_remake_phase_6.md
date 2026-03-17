# Pro Prompt: Atlassian Remake — Phase 6 (Polish & Global Audit)

## Phase 6: Global Polish & Audit

### Primary role

QA | FRONTEND

### Preferred tool

- [x] Cursor (default)
- [x] Gemini CLI (for structural analysis and hex value scanning)

### Context

- **Project**: GateFlow — Zero-Zero Trust digital gate platform
- **Apps**: admin-dashboard, client-dashboard, marketing, scanner-app, resident-portal
- **Goal**: Perform a comprehensive audit and polish pass to ensure 100% compliance with the Atlassian Design System. Eliminate hardcoded visual styles and ensure consistency across all modules.

### Scope (in)

- **Global Hex Audit**: Search all `.tsx`, `.css`, and `.ts` files for hardcoded hex values (`#...`) and replace with Atlassian Design Tokens.
- **Component Consistency**: Audit all dashboards for consistent use of `Button`, `Badge`, `NativeSelect`, and `PageHeader`.
- **Theming & Spacing**: Verify light/dark mode parity and spacing tokens (Atlassian Foundations).
- **Secondary Modules**: Polish Gate management, Project settings, and Profile pages.

### Scope (out)

- Core business logic changes.
- Database schema changes.

### Steps (ordered)

1. **Perform Global Hex Audit**:
    - Run `grep -r "#[0-9a-fA-F]\{3,6\}" apps/ packages/` to find hardcoded colors.
    - Exclude `public/`, `node_modules/`, and `dist/`.
    - Replace identified values with tokens from `@gate-access/ui/src/tokens.ts` or CSS variables (e.g., `var(--ds-background-neutral)`).

2. **Standardize Components**:
    - Audit `admin-dashboard` and `client-dashboard` for raw `select` and `input` elements.
    - Replace with `@gate-access/ui` `NativeSelect` and `Input`.

3. **Verify Global Header Consistency**:
    - Ensure all pages use `PageHeader` with correct breadcrumbs and action patterns.

4. **Verify Theming**:
    - Check RTL support and Light/Dark mode transitions on primary flows.

5. **Verify**:
    - Run `pnpm turbo lint`.
    - Run `pnpm turbo typecheck`.
    - Run `pnpm turbo build`.

### Acceptance criteria

- [ ] Zero hardcoded hex values in UI-related code (excluding images/icons).
- [ ] All primary dashboard modules use `DynamicTable` and Atlassian-standard buttons/badges.
- [ ] Consistent spacing and typography across all apps.
- [ ] Success/Error toasts use Atlassian visual language.
- [ ] All apps build successfully.
