# IDEA: projects_crm_ui — Unified Real Estate CRM & Operations Hub

## Goal

Transform the Client Dashboard from a collection of fragmented lists into a cohesive, project-centric environment. This initiative merges Project Management, CRM (Contacts/Units), and Gate Operations into a single premium interface utilizing the new "Real Estate Palette" and "Advanced CRM Tables."

## Background

Currently, Property Managers must jump between `/dashboard/projects`, `/dashboard/gates`, and `/dashboard/team` to manage their compound. By unifying these under a single "Project Hub," we reduce cognitive load and provide a "Command Center" feel. This is the cornerstone of the v10 "Growth & Autonomy" vision.

## Constraints

- **Multi-tenancy**: All data strictly scoped by `organizationId`.
- **Performance**: High-density tables must use server-side pagination (TanStack Table).
- **Design**: 100% adherence to the Real Estate Palette (Midnight Blue + Kimchi Orange).
- **Correctness**: Maintain auth/RBAC integrity across all new CRM actions.

## Scope

### Phase 1: Real Estate Palette & Tokens (P0)

- Apply the professional "Real Estate" color palette (Midnight Blue #020035, Anti-Flash White #F2F3F4, Kimchi #ED4B00).
- Update `globals.css` with semantic tokens across all dashboard apps.

### Phase 2: Schema & API - Core CRM Extensions (P0)

- Extend `GateAssignment` in `schema.prisma` with optional `startTime`, `endTime`, or `schedule` JSON for shift support.
- Add `Project` helper methods for aggregate stats (Contacts count, QR metrics, active Scan frequency).
- Implement server-side sorting/filtering for Contacts and Units.

### Phase 3: Shared EditPanel & Base Layout (P1)

- Create a reusable `EditPanel` component (Slide-from-right, dim overlay).
- Implement the "Project Hub" layout skeleton with a rich header and navigation.

### Phase 4: Unified Project Detail Page (P1)

- Create `/[locale]/dashboard/projects/[projectId]/page.tsx`.
- Integrate Project Hero (cover/logo), KPI cards, and sectioned project overview.

### Phase 5: Advanced CRM Tables - Contacts & Units (P1)

- Build the high-density table engine using TanStack Table v8.
- Implement column reordering, density toggles, and multi-field search.

### Phase 6: Gate Operations & Project Logs (P2)

- Integrate project-scoped Scan Logs directly into the Project detail page.
- Implement "Gate Assignment" management in the project context.

## Success Criteria

- [ ] Users can manage all project-related resources (Gates, Contacts, Units) without leaving the Project Detail page.
- [ ] CRM tables handle 10,000+ records with smooth server-side transitions.
- [ ] Dashboard UI feels "institutional" and "trustworthy" using the Midnight Blue palette.
- [ ] Every CRM mutation is validated against `organizationId` and RBAC permissions.
