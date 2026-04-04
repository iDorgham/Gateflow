# Pro Prompt: Atlassian Remake — Phase 5 (Admin Dashboard)

## Phase 5: Admin Dashboard — Platform Management

### Primary role

FRONTEND

### Preferred tool

- [x] Cursor (default)
- [x] browser_subagent (for component examples)

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform
- **App**: admin-dashboard (port 3002)
- **Goal**: Refactor the platform management screens in the Admin Dashboard to use the Atlassian-standard components (`DynamicTable`, `Pagination`, `Button`, `Badge`) established in Phase 4.

### Scope (in)

- **Organizations Management**: Refactor `src/app/[locale]/(dashboard)/organizations/` to use `DynamicTable`.
- **User Management**: Refactor `src/app/[locale]/(dashboard)/users/` to use `DynamicTable`.
- **Global Audit Logs**: Refactor `scans` and `audit-logs` global views.
- **UI Standardization**: Update `admin-dashboard` components to use standard `@gate-access/ui` variants (Primary, Subtle, etc.) and `PageHeader`.

### Scope (out)

- Client Dashboard refactoring (Phase 4 complete).
- Backend API restructuring.

### Steps (ordered)

1. **Refactor Organizations Module**:
   - Update `OrganizationsClient` to use `DynamicTable`.
   - Columns: `name` (with avatar/icon), `plan`, `createdAt`, `status` (Badge).
   - Integrate `Pagination` if items exceed 25.

2. **Refactor Users Module**:
   - Update `UsersClient` to use `DynamicTable`.
   - Columns: `user` (Avatar + name/email), `organization` (Link + plan badge), `role` (Badge), `status` (Badge), `actions`.
   - Ensure Row Click opens the `UserDetailSheet`.

3. **Refactor Global Access Logs**:
   - Update the global `scans` table to use `DynamicTable`.
   - Ensure the "Organization" / "Project" context is visible in the table.

4. **Standardize Layout & Shell**:
   - Complete any remaining `PageHeader` standardizations.
   - Audit all buttons in `admin-dashboard` to ensure they use Atlassian-compliant variants.

5. **Verify**:
   - Check sorting and interactions in the Admin Dashboard.
   - Run `pnpm turbo build --filter=admin-dashboard`.

### Acceptance criteria

- [ ] Organizations and Users tables use `DynamicTable` with consistent styling.
- [ ] Table actions and filtering follow Atlassian ergonomics.
- [ ] Atlassian badges (Success, Warning, Removed) applied to status fields.
- [ ] No regression in Superadmin functionality (Bulk delete, View details).
- [ ] Admin Dashboard builds successfully.
