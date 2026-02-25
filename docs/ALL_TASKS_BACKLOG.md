# GateFlow — Tasks & Backlog (All Phases)

This document centralizes **all known tasks** across MVP launch, Phase 2 (Resident Portal + Mobile), and platform improvements. Use it as the single backlog, and keep it in sync with `PROJECT_PROGRESS_DASHBOARD.md`, `RESIDENT_PORTAL_SPEC.md`, and `SUGGESTED_IMPROVEMENTS_AND_FUNCTIONS.md`.

---

## Legend

- ✅ Complete
- ⚠️ Partial / In Progress
- ❌ Not Started
- 🔴 Critical
- 🟡 High Priority
- 🟠 Medium Priority
- 🟢 Complete / Good

---

## 1. MVP Launch – Critical Path (Pre‑Launch)

### 1.1 Database & Dependencies

1. 🔴 **Run production DB migrations**
   - Apply latest Prisma migrations (`prisma migrate deploy`) on staging/production.
   - Verify `Project` and other new models/columns are present and correct.
2. 🔴 **Install and verify analytics dependencies**
   - Install `recharts` via `pnpm`.
   - Confirm analytics pages in client-dashboard build and render correctly.

### 1.2 Security / Auth / Multi‑Project Correctness

3. 🟡 **Fix CSRF on ProjectSwitcher**
   - Ensure `/api/project/switch` POST in client-dashboard includes and validates CSRF token.
4. 🟡 **Enforce auth on supervisor override API**
   - Require valid Bearer token on the scanner override endpoint.
5. 🟡 **Scope scan log export by project**
   - Add `projectId` filtering to scans export endpoint.
6. 🟠 **Harden project caching**
   - Review `getValidatedProjectId` (and related helpers) to avoid stale `deletedAt` / project ID caching issues.

### 1.3 UX / Navigation / Admin Panel

7. 🟠 **Replace `window.location.href` in admin-dashboard**
   - Use Next.js router navigation for org row clicks and other navigations.

### 1.4 Testing & Deployment

8. 🟡 **Smoke tests (all apps)**
   - Marketing, client-dashboard, admin-dashboard, scanner-app, resident-portal shell (if present).
9. 🟡 **Scenario tests**
   - Multi-project switching (UI + APIs + exports).
   - Supervisor override flow (PIN attempts, auditTrail, auth).
   - Analytics export (including project scoping).
   - Offline sync in scanner-app (queue, dedup, bulk sync).
10. 🟡 **Staging & production rollout**
    - Deploy to staging, configure production-like env vars.
    - Set up monitoring + logging + rollback plan.

---

## 2. Resident Portal – Phase 2 (Web)

### 2.1 Data Model & Migrations

11. ❌ **Add Resident Portal models to Prisma**
    - `Unit` + `UnitType` enum.
    - `VisitorQR`.
    - `AccessRule` + `AccessRuleType` enum.
    - `ResidentLimit`.
    - Extend `UserRole` with `RESIDENT` and `QRCodeType` with `VISITOR` / `OPEN`.
12. ❌ **Create and apply migrations**
    - Add indexes/uniques exactly as in `RESIDENT_PORTAL_SPEC.md`.
    - Generate and test migrations locally, then in staging.

### 2.2 Quota Engine & Resident APIs

13. ❌ **Implement quota calculation**
    - `calculateMonthlyQuota(UnitType)` using base quotas + `ResidentLimit` overrides.
14. ❌ **Implement quota check/consume**
    - `checkAndConsumeQuota(unitId)` style function with monthly window, atomic behavior, and tests.
15. ❌ **Resident API endpoints**
    - `GET /api/resident/units` – fetch linked unit(s) for current resident.
    - `GET /api/resident/quota` – return usage/remaining/reset date.
    - `GET /api/resident/visitors` – list `VisitorQR` for resident.
    - `POST /api/resident/visitors` – create visitor QR with quota enforcement.
    - `POST /api/resident/visitors/open` – create Open QR (respect `canCreateOpenQR`).
    - `PATCH /api/resident/visitors/:id` – modify access rule.
    - `DELETE /api/resident/visitors/:id` – revoke visitor QR.

### 2.3 Scanner / Validation Integration

16. ❌ **Extend QR validation for VISITOR/OPEN**
    - Update `/api/qrcodes/validate` to handle `QRCodeType.VISITOR` and `QRCodeType.OPEN`.
    - Implement `validateVisitorQR` and `validateOpenQR` per spec (unit active, quotas, access windows).
17. ❌ **Reflect new statuses in scanner-app**
    - Ensure scanner UI clearly differentiates normal, visitor, and open QRs; show meaningful messages.

### 2.4 Web UI – Resident Experience

18. ❌ **Unit–user linking UI**
    - Admin-side or self-service flow to link a `User` with a `Unit`.
    - Enforce that `RESIDENT` users must have a linked unit to access portal.
19. ❌ **Resident dashboard page**
    - Route (per spec) like `/dashboard/residents`.
    - Sections: Unit info card, quota widget, quick actions, active visitors list, history.
20. ❌ **Create visitor QR form**
    - Inputs: name, phone, email, access type (one-time/date range/recurring), dates/times, gate selection.
    - Show remaining quota and clear error state when quota exceeded.
21. ❌ **Create Open QR form**
    - Inputs: access type (recurring/permanent), days, time range, gate selection.
    - Explain Open QR semantics (unit-level, no specific visitor name).
22. 🟠 **History & arrival views**
    - Resident-side history of past visitors and scan statuses.

### 2.5 Mobile-First Optimization

23. 🟠 **Mobile UI polish for Resident Portal**
    - Optimize for narrow viewports (large touch targets, simplified layout).
    - Easy QR display + “copy/share” actions.

---

## 3. Resident Mobile – Phase 2/3 (Expo)

24. ❌ **Resident mobile app skeleton**
    - Expo app with tabs: Passes, History, Settings.
25. ❌ **Push notifications**
    - Receive notifications when visitor QRs are scanned.
26. ❌ **Offline QR wallet**
    - Local caching of personal and visitor QRs for offline presentation.
27. ❌ **Biometric lock**
    - FaceID/TouchID gate before showing QR lists.

---

## 4. Platform Functions Map (High-Level)

*(Reference; see `SUGGESTED_IMPROVEMENTS_AND_FUNCTIONS.md` for more detail.)*

- **Client Dashboard** – Tenant management, QR creation (single/bulk), gates, scans, analytics, webhooks, API keys, projects.
- **Scanner App** – Fast QR scanning, offline validation/queue, sync, supervisor override.
- **Admin Dashboard** – Cross-tenant org/user oversight, system analytics/health (expanding).
- **Marketing** – Acquisition, pricing, lead capture.
- **Resident Portal** (planned) – Resident self-service visitor/Open QR + quotas.
- **Resident Mobile** (planned) – Native resident UX, notifications, wallet.

---

## 5. Suggested Improvements (Beyond Existing Docs)

These are **additional** improvements on top of `IMPROVEMENTS_AND_ROADMAP.md` and the security/performance audits.

### 5.1 Observability & Operations

28. 🟠 **Structured logging**
    - Introduce structured logging (e.g. pino/winston) for API routes and scanner sync.
    - Include correlation IDs (per request, per scanUuid) for easier debugging.
29. 🟠 **Centralized log + metrics**
    - Ship logs to a central sink (e.g. Logtail/Datadog) with dashboards for:
      - error rates,
      - webhook failures,
      - unusual override activity.
30. 🟠 **Health/config checks**
    - Add a startup health check that **fails** when critical env vars (JWT secret, QR_SIGNING_SECRET, DB URL, Upstash creds) are missing or weak, rather than using unsafe fallbacks.

### 5.2 Security & Data Governance

31. 🟡 **Hard-fail on missing secrets**
    - Replace any remaining “fallback default secret” patterns with explicit process exit on startup.
32. 🟠 **ScanLog retention policy**
    - Define and implement a retention/archival strategy for `ScanLog` (e.g. archive to cheaper storage after N months) rather than unbounded growth.
33. 🟠 **Webhook queue hardening**
    - If not already: ensure webhook deliveries are idempotent and retried with exponential backoff, and add dead-letter handling for permanently failing endpoints.

### 5.3 Developer Experience

34. 🟠 **Generated API docs**
    - Add OpenAPI/Swagger definitions for key public/internal APIs.
    - Optionally generate typed clients via `@gate-access/api-client`.
35. 🟠 **Feature flags**
    - Introduce a lightweight feature flag mechanism (env-based or config-based) to progressively roll out:
      - Resident Portal,
      - advanced analytics,
      - supervisor override enhancements.
36. 🟠 **Test coverage expansion**
    - Systematically extend test coverage for:
      - auth/CSRF flows,
      - multi-project logic,
      - resident quota & validation,
      - scanner offline/override behaviors.

---

## 6. How to Use This Backlog

- Use this file as the **source of truth for tasks**, and update statuses (✅ ⚠️ ❌) as work progresses.
- When a task is completed, cross-link the relevant PR and update any affected docs (`PROJECT_PROGRESS_DASHBOARD.md`, `RESIDENT_PORTAL_SPEC.md`, `SUGGESTED_IMPROVEMENTS_AND_FUNCTIONS.md`).
- For new features, add tasks here first, then reflect high-level changes back into the PRD and design docs.

