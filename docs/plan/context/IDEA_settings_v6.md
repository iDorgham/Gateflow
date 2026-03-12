# IDEA: Advanced & Professional Settings Page (v6.0)

## Goal
Rebuild the Settings Page in GateFlow's Client Dashboard into an enterprise-grade control center.

## Core Features
- **Tabbed Interface**: 11 tabs (General, Workspace, Projects, Units & Residents, Team, Roles & Permissions, Gates & Scanners, Notifications, API & Webhooks, Integrations, Danger Zone).
- **Professional UX**: Sidebar navigation (desktop), horizontal tabs (mobile), global search, consistent card/form designs.
- **Enterprise Capabilities**: Granular RBAC, white-labeling, privacy/retention policies, real-time integrations (GTM, HubSpot), and security hardening.
- **Security & Compliance**: All changes audit-logged, role-based visibility, soft deletes.
- **i18n & RTL**: Full support for English and Arabic.

## Target Users
- Property Managers
- Security Heads
- Event Organizers
- Marketing Teams

## Technical Stack
- Next.js 14 (App Router)
- React Hook Form + Zod
- React Query + `@gate-access/api-client`
- Prisma (Organization, Gate, Unit, Role, ApiKey, Webhook)
- Shared UI: `@gate-access/ui`

## Context
Based on `PRD_v7.0.md` and legacy settings implementation.
