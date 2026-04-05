# TASKS: GateFlow Platform Evolution — Execution Checklist

## Phase 1: Nested Organizational Hierarchy

- [ ] **Infrastructure**:
  - [ ] Refactor Prisma: Add `organizationId` to `User` (if not already there), `Project`, and `Gate`.
  - [ ] Migration: Soft-move existing Users/Projects/Gates to a default organization if necessary.
- [ ] **Admin Dashboard Routing**:
  - [ ] Create `/org/[orgId]` directory in `apps/admin-dashboard`.
  - [ ] Migrate `users`, `projects`, and `gates` pages under the new dynamic route.
- [ ] **Sidebar Navigation**:
  - [ ] Build the "Organization Switcher" component (Combobox styled with ADS).
  - [ ] Logic to filter sidebar items based on current organization context.
  - [ ] Remove global links from the main sidebar shell.

## Phase 2: Advanced Settings & Integrations

- [ ] **RBAC & Teams**:
  - [ ] Create `TeamManagement` component.
  - [ ] Implement `inviteToOrganization` API.
  - [ ] Define and enforce Roles (Admin, Editor, Viewer).
- [ ] **Integrations Area**:
  - [ ] Build UI for "Integrations" within Org Settings.
  - [ ] Settings for Webhooks, API access, and common platform connectors.
- [ ] **Custom Metadata**:
  - [ ] Implement database fields and UI for script injection (GA, Meta Pixel).
  - [ ] Middleware/Provider to inject these tags in Marketing and Client frontends.

## Phase 3: Marketing Suite & Live CMS

- [ ] **Blog/Content**:
  - [ ] Design and implement Content model in DB.
  - [ ] Admin UI for drafting and publishing posts.
- [ ] **Landing Page Builder (Block-Based)**:
  - [ ] Component inventory for the builder (Hero, Features, Pricing, Form).
  - [ ] Drag-and-drop hierarchy engine.
  - [ ] Advanced "Live Preview" mode.
- [ ] **Analytics & Optimisation**:
  - [ ] Conversion tracking engine for landing page forms.
  - [ ] A/B testing dashboard showing reach and conversion ratios.

## Phase 4: Operational Suite (Task Manager & Support)

- [ ] **Internal Task Manager**:
  - [ ] Board-style UI components in Admin.
  - [ ] Support for multiple departments (Dev, Sales, Marketing, Technical).
  - [ ] Real-time state updates.
- [ ] **Support Chat Integration**:
  - [ ] Build Chat Widget for Marketing and Client sites.
  - [ ] Backend queue for support tickets/active chats.
- [ ] **Admin Feature Flags**:
  - [ ] "Feature Toggle" UI in Admin per Organization profile.

## Phase 5: Style Unification & Branding

- [ ] **Branding System**:
  - [ ] "Brand" tab in Settings (Logo upload, Accent color pickers).
  - [ ] Logic for dynamic CSS variable generation.
- [ ] **Optimization & Resilience (NEW)**:
  - [ ] Build UI for Security Hardening (Rate limiting, Session TTL).
  - [ ] Implement Caching settings (Revalidation controls).
  - [ ] Performance dashboard with toggles for image/asset optimization.
- [ ] **Shared UI Library**:
  - [ ] Sync all components in `packages/ui` to use the new ADS-compliant v7 tokens.

## Phase 6: Final Verification & Ship

- [ ] **Pre-ship Audit**: End-to-end testing of Org switches and permissions.
- [ ] **Deployment**: Launch the evolved platform.
