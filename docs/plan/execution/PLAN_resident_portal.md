## Plan: Resident Portal & Resident Mobile (Phase 2)

### Summary

GateFlow Resident Portal brings self-service visitor management to unit owners, with clear quotas, flexible access rules, and mobile-friendly flows, while keeping all existing security and multi-tenant invariants intact. This plan delivers the schema, backend APIs, resident web portal, and a foundation for the resident mobile app, so that residents can create and manage visitor QR codes safely and easily.

### Goals

- Enable residents to create and manage visitor QR codes with quota-aware access rules (one-time, date-range, recurring, permanent, open QR).
- Provide a mobile-optimised resident web portal and a minimal resident mobile app for QR display and sharing.
- Maintain strict security: organization scoping, soft deletes, QR signing, RBAC, and auditability across all new flows.

### Out of scope (for this plan)

- Full marketing intelligence suite and advanced resident analytics (handled in a separate marketing/analytics plan).
- Hardware integration, scanner watchlists, and location-based scanner rules (covered by scanner rules plan).
- Production push notification infrastructure beyond what is needed for basic resident notifications.

---

## Phases

Each phase is designed to fit in one focused implementation session with `/dev`, gated by lint/typecheck/tests for affected workspaces.

| # | Title | Primary role | Brief |
|---|-------|-------------|-------|
| 1 | Schema & RBAC foundations for Resident models | BACKEND-Database | Add Unit/VisitorQR/AccessRule/ResidentLimit models and update roles/RBAC to support residents safely. |
| 2 | Resident Portal web shell & authentication | FRONTEND | Scaffold `apps/resident-portal`, RESIDENT login, basic layout, and navigation. |
| 3 | Visitor QR creation & quota enforcement (web) | BACKEND-API | Implement resident-facing APIs and UI for creating visitor and open QRs with quota checks. |
| 4 | Visitor history & notification pipeline (backend) | BACKEND-API | Expose resident visitor history and wire scan-success events to a notification pipeline. |
| 5 | Resident mobile foundation (Expo app) | MOBILE | Create minimal resident mobile app with auth, QR list/detail, and basic share/display flows. |

---

### Phase 1 — Schema & RBAC foundations for Resident models

- **Primary role:** BACKEND-Database  
- **Scope:**  
  - Add `Unit`, `VisitorQR`, `AccessRule`, and `ResidentLimit` models to `packages/db/prisma/schema.prisma` following PRD v6.0 section 4.5 and existing conventions (multi-tenant, soft deletes where appropriate).  
  - Update relevant enums (`UserRole`, `QRCodeType`) and any seed data to support RESIDENT role and new QR types, staying compatible with current code that uses these enums.  
  - Add or update Prisma client exports and seeds in `@gate-access/db` for resident models.  
- **Depends on:** Existing MVP schema, auth & RBAC from Phase 1 MVP.  
- **Deliverables:**  
  - Updated Prisma schema with new resident-related models and enums.  
  - Seeds updated for Resident role and any baseline `ResidentLimit` configuration.  
  - Successful `prisma migrate dev` and `pnpm turbo build` for affected workspaces.  
- **Test criteria:**  
  - `pnpm turbo lint --filter=@gate-access/db` passes.  
  - `pnpm turbo typecheck --filter=@gate-access/db` passes.  
  - New models are visible and editable in Prisma Studio.  

### Phase 2 — Resident Portal web shell & authentication

- **Primary role:** FRONTEND  
- **Scope:**  
  - Scaffold `apps/resident-portal` (Next.js 14 App Router) with shared configuration aligned to client-dashboard and marketing apps.  
  - Implement RESIDENT login flow (using existing auth stack) and basic layout: sidebar/top-nav, home/dashboard shell, and routing skeleton for Visitor QRs and History.  
  - Ensure RESIDENT users are scoped by `organizationId` and only see their own unit context once Phase 1 is in place.  
- **Depends on:** Phase 1 schema & RBAC foundations.  
- **Deliverables:**  
  - Resident portal app running at its designated port with login and minimal dashboard shell.  
  - Shared UI components wired from `@gate-access/ui` and i18n from `@gate-access/i18n` where appropriate.  
- **Test criteria:**  
  - `pnpm turbo lint --filter=resident-portal` passes.  
  - `pnpm turbo typecheck --filter=resident-portal` passes.  
  - Manual smoke: test RESIDENT login and navigation between main routes.  

### Phase 3 — Visitor QR creation & quota enforcement (web)

- **Primary role:** BACKEND-API  
- **Scope:**  
  - Implement resident-facing APIs (under `/api/resident/*`) to create `VisitorQR` and `AccessRule` records, and generate signed QR codes reusing existing QR signing logic.  
  - Enforce `ResidentLimit` quotas at organization + unit level for monthly visitor allowance and open-QR eligibility.  
  - Build resident-portal UI for creating one-time, date-range, recurring, and open QRs, with clear quota feedback and errors surfaced to the user.  
- **Depends on:** Phases 1–2.  
- **Deliverables:**  
  - API routes for create/list resident visitor QRs with full auth, org scoping, and soft-delete behavior.  
  - Resident-portal pages/forms for managing visitor QRs, backed by these APIs.  
- **Test criteria:**  
  - `pnpm turbo lint --filter=@gate-access/db --filter=resident-portal --filter=client-dashboard` passes.  
  - `pnpm turbo typecheck --filter=@gate-access/db --filter=resident-portal --filter=client-dashboard` passes.  
  - Jest tests (or additions to existing tests) cover at least: quota enforcement, access rule date/time validation, and QR signing invariants.  

### Phase 4 — Visitor history & notification pipeline (backend)

- **Primary role:** BACKEND-API  
- **Scope:**  
  - Extend scan logging and query APIs so residents can view visitor history scoped to their unit(s).  
  - Introduce a backend notification pipeline that listens for scan-success events on resident visitor QRs and can trigger resident notifications (initially via webhook or stubbed push integration).  
  - Expose a simple resident-portal history page backed by these APIs.  
- **Depends on:** Phases 1–3.  
- **Deliverables:**  
  - APIs to fetch resident visitor history with correct org and unit scoping.  
  - Event hook from scan logs into a notification service abstraction suitable for future mobile push integration.  
  - Resident-portal history UI listing recent visits.  
- **Test criteria:**  
  - `pnpm turbo lint --filter=client-dashboard --filter=resident-portal` passes.  
  - `pnpm turbo typecheck --filter=client-dashboard --filter=resident-portal` passes.  
  - Tests assert that residents only see history for their own unit(s) and that notifications are emitted once per scan-success event.  

### Phase 5 — Resident mobile foundation (Expo app)

- **Primary role:** MOBILE  
- **Scope:**  
  - Scaffold `apps/resident-mobile` (Expo SDK 54) with login, basic navigation, and screens for listing and viewing resident visitor QRs.  
  - Implement offline-safe QR display (cached QRs) plus basic share to WhatsApp/Email/SMS using native share sheet.  
  - Reuse the same resident APIs created in earlier phases for fetching QRs and history.  
- **Depends on:** Phases 1–4.  
- **Deliverables:**  
  - Running Expo app with RESIDENT login, visitor QR list/detail, and share flow.  
  - Shared types pulled from `@gate-access/types` and network utilities from `@gate-access/api-client` where appropriate.  
- **Test criteria:**  
  - `pnpm turbo lint --filter=resident-mobile` passes.  
  - `pnpm turbo typecheck --filter=resident-mobile` passes.  
  - Manual smoke via Expo: login, see existing QRs, open QR details, and share link/QR.  

