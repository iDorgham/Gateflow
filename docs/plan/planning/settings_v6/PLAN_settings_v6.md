# PLAN: Advanced & Professional Settings Page (v6.0)

## Overview
Reconstruct the GateFlow Client Dashboard Settings Page into a high-performance, enterprise-grade control center with 11 specialized tabs, advanced security, and seamless internationalization.

## Phases

### Phase 1: Layout & Navigation
**Primary Role**: FRONTEND
**Preferred Tool**: Cursor
- **Scope**: Rebuild the main settings layout with a vertical sidebar (desktop) and horizontal scrollable tabs (mobile).
- **Deliverables**: `SettingsLayout` component, sidebar navigation, global search bar placeholder.
- **Acceptance Criteria**: Responsive layout, tab switching works (empty states), global search UI present.

### Phase 2: Core Tabs (General & Workspace)
**Primary Role**: FRONTEND
**Preferred Tool**: Cursor
- **Scope**: Implement General (theme, language, regional) and Workspace (branding, info) tabs.
- **Deliverables**: Form components for General/Workspace, logo upload logic, theme switcher integration.
- **Acceptance Criteria**: Live theme switching, language toggle (RTL check), workspace info saves to DB.

### Phase 3: Project & Resource Mapping
**Primary Role**: BACKEND-API
**Preferred Tool**: Cursor
- **Scope**: Implement Projects and resource mapping tabs.
- **Deliverables**: Project management table, resource assignment sheet, API endpoints for project CRUD.
- **Acceptance Criteria**: Projects can be created/edited/deleted, stats cards show correct gate/unit counts.

### Phase 4: Units & Residents Quotas
**Primary Role**: FRONTEND
**Preferred Tool**: Cursor
- **Scope**: Implement Units & Residents tab with quota management.
- **Deliverables**: Unit type table, resident defaults form, quota progress bars.
- **Acceptance Criteria**: Quotas are editable, progress bars reflect usage accurately.

### Phase 5: Team & RBAC
**Primary Role**: SECURITY
**Preferred Tool**: Multi-CLI (Claude + Gemini) — high-risk/security-critical
- **Scope**: Implement Team, Roles & Permissions tabs.
- **Deliverables**: Team member table, invitation flow, granular permission matrix component.
- **Acceptance Criteria**: Invitations send successfully, role permissions can be toggled and saved.

### Phase 6: Gates & Scanners
**Primary Role**: BACKEND-API
**Preferred Tool**: Cursor
- **Scope**: Implement Gates & Scanners tab.
- **Deliverables**: Gate management table, scanner rule configuration form.
- **Acceptance Criteria**: Gates can be added with location/radius, global scanner rules persist.

### Phase 7: Connectivity (API, Webhooks, Integrations)
**Primary Role**: BACKEND-API
**Preferred Tool**: Cursor
- **Scope**: Implement API & Webhooks, Integrations tabs.
- **Deliverables**: API key generation, webhook setup UI, marketing pixel integration cards.
- **Acceptance Criteria**: API keys generate/revoke, webhook tests succeed, pixels persist in config.

### Phase 8: Notifications & Hardening
**Primary Role**: FRONTEND
**Preferred Tool**: Cursor
- **Scope**: Implement Notifications tab and add final polish/hardening.
- **Deliverables**: Notification preferences form, email template preview, audit log visibility.
- **Acceptance Criteria**: Preferences save, template preview works, audit logs reflect settings changes.

### Phase 9: Danger Zone & Final Verification
**Primary Role**: QA
**Preferred Tool**: Multi-CLI (Claude + OpenCode) — high-risk/complexity
- **Scope**: Implement Danger Zone and perform final E2E verification.
- **Deliverables**: Danger card components, bulk deletion logic, E2E tests for the settings page.
- **Acceptance Criteria**: Full verification pass (preflight + E2E), danger zone actions require high-stakes confirmation.

## Risks
- **Complexity**: 11 tabs is a significant amount of UI; requires careful component modularization.
- **Security**: RBAC and Danger Zone actions must be strictly validated on the backend.
- **Performance**: Large tables (Units, Scans) need virtualization or efficient pagination.

## Dependencies
- `@gate-access/ui`
- `@gate-access/api-client`
- Prisma schema updates (if any for new quota/integration fields)
