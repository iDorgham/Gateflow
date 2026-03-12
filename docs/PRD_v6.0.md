# GateFlow — Product Requirements Document v6.0

**Product Name:** GateFlow  
**Version:** 6.0  
**Author:** Founder + Engineering + Marketing Team  
**Target Markets:** Egypt & Gulf (MENA gated compounds, real-estate developers, private schools, beach clubs, marinas, wedding venues, nightclubs, corporate events)  
**Business Model:** B2B recurring SaaS (monthly/annual subscriptions) + per-event / per-scan hybrid options  
**Status:** MVP ~75% Complete \| Phase 2 (Resident Portal + Marketing Suite + Scanner Rules)

---

## 1. Executive Summary

### Product Vision

GateFlow is the **Zero-Trust Digital Gate Infrastructure Platform** for physical spaces — replacing chaotic WhatsApp lists, paper guest books, and screenshot QR chaos with secure, auditable, real-time controlled access.

With v6.0, GateFlow evolves from pure access control into a **marketing-first access infrastructure**: every entry becomes a data point, every visitor a potential lead, and every compound a smart marketing channel — while strengthening RBAC and gate-level controls.

### Problem It Solves

- **Compounds/Schools/Marinas:** Manual guest lists → security holes, resident complaints, lost control
- **Events/Weddings:** Disorganized invitations → gate bottlenecks, VIP fraud, poor analytics
- **Clubs/Nightlife:** Guest-list chaos → long queues, fake entries, revenue leakage
- **All Venues:** No real-time visibility, no audit trail for disputes, weak team/role separation
- **Marketing teams:** No attribution between digital spend and physical visits

### Core Value Proposition

- **Stripe-level infrastructure for physical access** — controlled entry + live intelligence + enterprise-grade security & integrations.
- **Marketing-first access** — UTM-tagged, pixel-enabled visitor flows for attribution and retargeting.
- **Resident-first experience** — self-service visitor management, notifications, and mobile-friendly flows.

### The Five Apps Strategy

GateFlow consists of **5 interconnected applications**:

| #   | App                   | Purpose                    | Users               | Status  |
| --- | --------------------- | -------------------------- | ------------------- | ------- |
| 1   | **Admin Dashboard**   | Super admin management     | Platform operators  | ~85%    |
| 2   | **Client Dashboard**  | Property/Org management    | Admins, managers    | ~80%    |
| 3   | **Scanner App**       | Gate scanning              | Security/operators  | ~90%    |
| 4   | **Marketing Website** | Public marketing           | Prospects           | ~20%    |
| 5   | **Resident Portal**   | Self-service for residents | Unit owners/renters | **NEW** |

---

## 2. Target Users & Personas

### Updated Persona Table

| Persona                  | Role / Job-to-be-Done | Pain Points                                      | Must-have Features                                     |
| ------------------------ | --------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| **Platform Admin**       | Super admin           | No platform visibility                           | Org management, system analytics, billing oversight    |
| **Property Manager**     | Compound/School Admin | Security breaches, resident complaints, no logs  | Bulk CSV, team RBAC, live dashboard, audit logs        |
| **Event Organizer**      | Project Manager       | Gate chaos, VIP fraud, poor data                 | Per-event projects, bulk + manual QR, analytics export |
| **Security Head**        | Gate Supervisor       | Fake entries, operator abuse, no visibility      | Live scan feed, operator management, override logs     |
| **Gate Operator**        | Gate Operator         | Fast & reliable scanning                         | Offline-capable mobile app, vibration/sound, simple UI |
| **Resident**             | Unit Owner/Renter     | Can't give guests access easily, complex process | Self-service QR creation, quota tracking, Open QR      |
| **Real Estate Marketing Manager** | Marketing | No link between digital ads and physical gate visits | Marketing suite, UTM attribution, pixels, CRM webhooks |
| **Brokerage Owner / Developer** | Owner | Needs per-project and per-owner attribution      | Brokerage view, project separation, campaign analytics |
| **Developer/Integrator** | Developer             | Easy CRM/booking sync                            | Full REST API, webhooks, API keys with scopes          |
| **Analytics Viewer**     | Analytics Viewer      | No data on attendance                            | Read-only analytics, exports, trends                   |

### Resident Persona Deep Dive

**Pain Points:**

- Must contact property management for every guest
- No visibility into who has visited
- Can't give permanent access to close family/friends
- Complicated process for recurring visitors (maids, drivers)
- No mobile-friendly way to manage access

**Needs:**

- Simple mobile app to create visitor QR codes
- Clear quota limits based on unit size
- Ability to set time restrictions (e.g., maid only 8AM–6PM)
- Open QR for family with permanent access
- View history of who visited their unit
- Get notified when visitors arrive

---

## 3. Full Scope: All 5 Apps

### 3.1 Admin Dashboard (apps/admin-dashboard)

| Feature                     | Priority | Status                                   |
| --------------------------- | -------- | ---------------------------------------- |
| Organization management     | P0       | ✅ Done (list + detail sheet + suspend)  |
| User management (global)    | P0       | ✅ Done (cross-org, role change, deactivate) |
| System-wide analytics       | P1       | ✅ Done (Recharts: scans, orgs, plans)   |
| AI assistant panel          | P1       | ✅ Done (Gemini + 5 admin tools)         |
| Finance / billing overview  | P1       | ✅ Done (MRR estimate, Stripe placeholder) |
| Server health monitoring    | P1       | ✅ Done (live 30s polling, DB/Redis)     |
| Platform settings           | P2       | ✅ Done (env config, security checklist) |
| Compliance reporting        | P2       | Placeholder (Coming Q4 2026)             |
| Stripe real integration     | P2       | Not started                              |
| MFA for admin               | P3       | Not started                              |

### 3.2 Client Dashboard (apps/client-dashboard)

| Feature                             | Priority | Status  |
| ----------------------------------- | -------- | ------- |
| Organization management             | P0       | ~90%    |
| QR code management (single)         | P0       | ~95%    |
| QR code management (bulk CSV)       | P0       | ~100%   |
| Gate management                     | P0       | ~90%    |
| Team/RBAC (roles + permissions)     | P0       | ~85%    |
| Analytics dashboard                 | P1       | ~70%    |
| Webhooks                            | P1       | ~80%    |
| API keys                            | P1       | ~70%    |
| Resident unit management            | P1       | **NEW** |
| Visitor QR management               | P1       | **NEW** |
| Marketing suite (pixels, UTM, CRM) | P1       | **NEW** |

### 3.3 Scanner App (apps/scanner-app)

| Feature                       | Priority | Status  |
| ----------------------------- | -------- | ------- |
| Login/auth                    | P0       | ~95%    |
| Camera scanning               | P0       | ~100%   |
| Offline mode + sync           | P0       | ~100%   |
| Supervisor override           | P1       | **NEW** |
| Gate selector                 | P1       | 0%      |
| Scan history                  | P2       | 0%      |
| Queue status UI               | P2       | 0%      |
| Gate–account assignment rules | P1       | **NEW** |
| Optional location-based rules | P2       | **NEW** |

### 3.4 Marketing Website (apps/marketing)

| Feature           | Priority | Status |
| ----------------- | -------- | ------ |
| Landing page      | P0       | ~30%   |
| Features page     | P1       | 0%     |
| Pricing page      | P1       | ~20%   |
| Contact form      | P1       | ~20%   |
| Blog/Case studies | P2       | 0%     |
| Documentation     | P2       | 0%     |

### 3.5 Resident Portal (apps/resident-portal + apps/resident-mobile)

| Feature                           | Priority | Status  |
| --------------------------------- | -------- | ------- |
| Unit linking                      | P0       | **NEW** |
| Visitor QR creation               | P0       | **NEW** |
| Quota tracking                    | P0       | **NEW** |
| Open QR creation                  | P1       | **NEW** |
| Visitor history                   | P1       | **NEW** |
| Access time controls              | P1       | **NEW** |
| Mobile-optimized web              | P1       | **NEW** |
| Native mobile app                 | P2       | **NEW** |
| Push notifications (scan + arrival) | P2     | **NEW** |
| Guest navigation (GPS)            | P2       | **NEW** |
| Contact-based QR share (WhatsApp/Email) | P0 | **NEW** |
| Scan notification (visitor scanned at gate) | P0 | **NEW** |
| Arrival notification (guest at unit) | P1    | **NEW** |
| Quota widget, who visited today, one-tap share | P2 | **NEW** |

---

## 4. Resident Portal Detailed Requirements

### 4.1 Architecture

**Two Components:**

1. **Resident Portal (Web)** - `/apps/resident-portal`
   - Next.js 14 App Router
   - Mobile-optimized responsive design
   - Same auth as client-dashboard (RESIDENT role)

2. **Resident Mobile (App)** - `/apps/resident-mobile`
   - Expo/React Native
   - Simplified experience
   - Push notifications for visitor arrivals and check-ins

### 4.2 Unit-Based Quotas

| Unit Type | Monthly Visitor Quota | Can Create Open QR |
| --------- | --------------------- | ------------------ |
| Studio    | 3                     | No                 |
| 1 Bedroom | 5                     | No                 |
| 2 Bedroom | 10                    | Yes                |
| 3 Bedroom | 15                    | Yes                |
| 4 Bedroom | 20                    | Yes                |
| Penthouse | 25                    | Yes                |
| Villa     | 30                    | Yes                |

### 4.3 Access Rule Types

| Type           | Description                     | Use Case         |
| -------------- | ------------------------------- | ---------------- |
| **One-Time**   | Single use, specific date       | One-time guests  |
| **Date Range** | Multiple uses within date range | Weekend visitors |
| **Recurring**  | Specific days + time window     | Weekly helpers   |
| **Permanent**  | No time restrictions            | Family members   |

### 4.4 Open QR Feature

- **What:** Permanent QR code linked to unit (not visitor)
- **Who can create:** Units with `canCreateOpenQR = true`
- **Verification:** Scanner checks unit is active, not quota
- **Display:** Shows unit number, not visitor name
- **Use Case:** Close friends/family with ongoing access

### 4.5 Data Models (New)

```prisma
// Unit - residence in compound
model Unit {
  id              String   @id @default(cuid())
  unitNumber      String
  unitType        UnitType
  building        String?
  user            User?    @relation(fields: [userId], references: [id])
  userId          String?  @unique
  organization    Organization @relation(...)
  organizationId  String
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())

  visitorQRs      VisitorQR[]
}

enum UnitType {
  STUDIO, ONE_BEDROOM, TWO_BEDROOM, THREE_BEDROOM, FOUR_BEDROOM, PENTHOUSE, VILLA
}

// Visitor QR - created by resident
model VisitorQR {
  id              String        @id @default(cuid())
  qrCode          QRCode        @relation(...)
  qrCodeId        String        @unique
  unit            Unit          @relation(...)
  unitId          String
  visitorName     String?       // null for Open QR
  visitorPhone    String?
  visitorEmail    String?
  isOpenQR        Boolean       @default(false)
  accessRule      AccessRule?   @relation(...)
  createdBy       String
  createdAt       DateTime      @default(now())
}

// Access Rule - when visitor can access
model AccessRule {
  id              String            @id @default(cuid())
  type            AccessRuleType    // ONETIME, DATERANGE, RECURRING, PERMANENT
  startDate       DateTime?
  endDate         DateTime?
  recurringDays   Int[]?           // 0-6 (Sunday=0)
  startTime       String?          // \"09:00\"
  endTime         String?          // \"22:00\"
  visitorQR       VisitorQR?
}

enum AccessRuleType {
  ONETIME, DATERANGE, RECURRING, PERMANENT
}

// Quota limits per org
model ResidentLimit {
  id              String   @id @default(cuid())
  organization    Organization @relation(...)
  organizationId  String
  unitType        UnitType
  monthlyQuota    Int
  canCreateOpenQR Boolean @default(false)
}

// Updated UserRole
enum UserRole {
  ADMIN, TENANT_ADMIN, TENANT_USER, VISITOR, RESIDENT
}

// Updated QRCodeType
enum QRCodeType {
  SINGLE, RECURRING, PERMANENT, VISITOR, OPEN
}
```

---

## 5. Technical Stack

| Component           | Technology               | Version |
| ------------------- | ------------------------ | ------- |
| Frontend (Web Apps) | Next.js                  | 14.x    |
| Mobile (Scanner)    | Expo/React Native        | SDK 54  |
| Mobile (Resident)   | Expo/React Native        | SDK 54  |
| Database            | PostgreSQL               | 15+     |
| ORM                 | Prisma                   | 5.x     |
| Auth                | JWT (jose) + Argon2id    | Latest  |
| Package Manager     | pnpm                     | 8.x     |
| Build System        | Turborepo                | 2.x     |
| UI Components       | Custom (shadcn/ui style) | —       |
| QR Signing          | HMAC-SHA256 (crypto-js)  | Latest  |
| Rate Limiting       | Upstash Redis            | Latest  |
| Encryption          | AES-256                  | —       |

---

## 6. Updated MVP Scope

### Completed (~75%)

| #   | Feature                              | Status |
| --- | ------------------------------------ | ------ |
| 1   | Organization CRUD                    | ✅     |
| 2   | User authentication (JWT + Argon2id) | ✅     |
| 3   | Single QR creation                   | ✅     |
| 4   | Bulk CSV QR creation                 | ✅     |
| 5   | Gate management                      | ✅     |
| 6   | Mobile scanner (offline)             | ✅     |
| 7   | Basic RBAC                           | ✅     |
| 8   | Live dashboard                       | ✅     |
| 9   | Webhooks                             | ✅     |
| 10  | API keys                             | ✅     |
| 11  | CSRF protection                      | ✅     |
| 12  | Rate limiting (Redis)                | ✅     |
| 13  | Token rotation                       | ✅     |
| 14  | Field encryption                     | ✅     |

### Remaining MVP / Phase 2

| #   | Feature                                                 | Priority | Status |
| --- | ------------------------------------------------------- | -------- | ------ |
| 1   | Supervisor override (scanner)                           | P1       | ❌     |
| 2   | Advanced analytics (incl. resident engagement metrics)  | P1       | ❌     |
| 3   | Multi-project support                                   | P2       | ❌     |
| 4   | Admin dashboard basics                                  | P1       | ⚠️     |
| 5   | Marketing website polish                                | P2       | ❌     |
| 6   | Resident Portal (web + mobile) rollout                  | P0       | ❌     |
| 7   | Marketing Intelligence Suite (pixels, UTM, CRM)         | P0       | ❌     |
| 8   | Team roles & custom roles UI                            | P1       | ❌     |
| 9   | Scanner gate–account assignment + location rule         | P1       | ❌     |
| 10  | Resident privacy & data retention controls              | P1       | ❌     |

---

## 7. Phase 2 Roadmap (Q3–Q4 2026)

| Feature                  | Target Month | Effort  |
| ------------------------ | ------------ | ------- |
| Resident Portal (Web)    | Month 1      | 3 weeks |
| Resident Portal (Mobile) | Month 2      | 2 weeks |
| Quota enforcement        | Month 1      | 1 week  |
| Open QR feature          | Month 2      | 1 week  |
| Supervisor override      | Month 2      | 1 week  |
| Contact-based share (WhatsApp/Email) | Month 2 | 1 week  |
| Scan notification (push to resident) | Month 2 | 1 week  |
| GPS guide + \"I've arrived\" + arrival notification | Month 3 | 2 weeks |
| Resident delight (quota widget, who visited today, one-tap share) | Month 3 | 1 week  |
| Resident privacy & data retention controls | Month 3–4 | 2 weeks |
| Advanced analytics (incl. resident engagement, unit-type segmentation) | Month 3–4 | 3 weeks |
| Multi-project            | Month 3–4    | 4 weeks |
| Marketing Suite Core     | Month 3–4    | 4 weeks |
| Team & custom roles      | Month 4      | 2 weeks |
| Scanner rules (gate + location, gate hours, device binding, supervisor queue UX) | Month 4–5 | 3 weeks |

---

## 8. Security & Compliance

| Requirement                        | Status | Notes                                           |
| ---------------------------------- | ------ | ------------------------------------------------ |
| JWT Authentication                 | ✅     | 15-min access token                             |
| Password Hashing (Argon2id)        | ✅     | t=3, m=65536, p=4                               |
| Multi-tenant isolation             | ✅     | Row-level                                       |
| Audit logs                         | ✅     | Full trail                                      |
| Rate limiting (Redis)              | ✅     | Multi-instance                                  |
| CSRF protection                    | ✅     | Double-submit cookie                            |
| Token rotation                     | ✅     | Refresh token                                   |
| Field encryption                   | ✅     | Webhook secrets                                 |
| Resident privacy controls          | ❌     | Planned: masking options, guest visibility, unit-location sharing toggles |
| Data retention per tenant          | ❌     | Planned: configurable retention windows for visitor history and scan logs |
| Data residency                     | ❌     | Not implemented                                 |
| Immutable logs                     | ❌     | Not implemented                                 |

---

## 9. API Summary

| App              | Base Path         | Auth                                   |
| ---------------- | ----------------- | -------------------------------------- |
| Client Dashboard | `/api/*`          | JWT (ADMIN, TENANT_ADMIN, TENANT_USER) |
| Scanner App      | `/api/*`          | Bearer token                           |
| Resident Portal  | `/api/resident/*` | JWT (RESIDENT)                         |
| Admin            | `/api/admin/*`    | JWT (PLATFORM_ADMIN)                   |

---

## 10. Pricing Tiers (Unchanged)

| Tier       | QR/month  | Team      | Features       | Price (EGP) |
| ---------- | --------- | --------- | -------------- | ----------- |
| Starter    | 5,000     | 3         | Basic          | 499–799     |
| Pro        | 50,000    | 10        | Full + export  | 1,999–2,999 |
| Enterprise | Unlimited | Unlimited | Advanced + SLA | 5k–30k+     |

---

## 11. Marketing Intelligence Suite (Phase 2)

This section summarizes the **marketing-first** capabilities introduced in the earlier v6 marketing draft, now folded into the canonical PRD.

**Goals:**

- Attribute physical gate visits back to digital campaigns.
- Give marketing and brokerage teams a self-serve view of performance by project, owner, and campaign.
- Track resident adoption and engagement (e.g., % of units using resident portal/mobile, visitors per unit, repeat visitors).
- Understand usage by unit type (studio vs villa) to guide product and education.
- Enable retargeting flows via pixels, GTM, and CRM webhooks.

**Key requirements (high level):**

- **Pixel / GTM Injection:** Configure GA4, Meta Pixel, and GTM IDs per project; inject into visitor landing pages.
- **UTM Persistence Engine:** Capture `utm_*` parameters from invite links, persist through landing page and into scan logs.
- **Campaign Separation:** Ensure analytics and exports are scoped correctly by organization, project, owner, and campaign.
- **Visitor Landing Page:** Mobile-optimized, QR-centric page with optional consent banner and marketing scripts.
- **Direct Share Utilities:** Pre-filled WhatsApp/Email/SMS sharing of UTM-tagged invite links, with native contact picker integration.
- **CRM Webhook Sync:** Deliver scan events + attribution context into HubSpot/Salesforce or custom endpoints.

The detailed functional breakdown (FR-201–FR-206) and timelines are preserved in the original marketing-focused document, which is now treated as an **archived supporting spec**.

---

## 12. Team Roles and Custom Roles

### 12.1 Current Role Model

GateFlow already has a flexible role system:

- **Model:** `Role` in `packages/db/prisma/schema.prisma`
  - `name` — human-readable name (e.g. \"Organization Admin\").
  - `description` — optional description.
  - `permissions` — JSON map of permission keys → booleans.
  - `isBuiltIn` — true for platform-provided roles, false for org-created.
  - `organizationId` — null for global roles; set for org-scoped custom roles.
- **User → Role:** `User.roleId` points to a `Role`, replacing the older `UserRole` enum as the primary RBAC source for dashboards and APIs.

Seeded roles (see `packages/db/src/seed-roles.js`):

- **Super Admin** — platform-level role for internal team.
- **Organization Admin** — full tenant access.
- **Security Manager** — security-focused; can override scans.
- **Gate Operator** — scanner-only access with minimal permissions.
- **Resident** — resident-portal access with visitor QR creation.

Each built-in role is backed by a permission map, e.g.:

- `gates:manage`, `qr:create`, `qr:manage`, `scans:view`, `scans:override`,
  `workspace:manage`, `roles:manage`, `users:manage`, `analytics:view`,
  `projects:manage`, `units:manage`, `contacts:manage`, etc.

### 12.2 Product Requirements (Team Roles)

**Built-in roles (v6.0):**

- Must remain available in every tenant; at least one Organization Admin must always exist.
- Cannot be deleted by tenants; only edited via platform migrations/seeds.
- Are the default roles for new users unless overridden with custom roles.

**Permissions matrix (conceptual):**

- PRD maintains a table of permission keys → built-in roles that have them (see seed script).
- Some permissions primarily affect:
  - **Scanner flows** (e.g. `scans:view`, `scans:override`, future gate-assignment rules).
  - **Dashboard flows** (e.g. `analytics:view`, `projects:manage`).

### 12.3 Product Requirements (Custom Roles)

Custom roles give tenants more control without changing the underlying security model.

**Requirements:**

- Org admins can:
  - Create **custom roles** scoped to their organization.
  - Choose a name and description.
  - Toggle individual permission keys (subset of supported keys).
  - Assign custom roles to users in their org.
- Custom roles:
  - Cannot grant more permissions than the creating admin currently has.
  - Are always confined to a single organization.
  - Can be edited or deleted as long as at least one usable admin role remains.

**Acceptance Criteria:**

- A tenant can define roles like \"Reception\", \"Finance Read-Only\", or \"Marketing Analyst\" with tailored access.
- Users assigned to custom roles see only the operations allowed by that role’s permission map.
- Security remains enforced server-side; the UI cannot bypass permission checks.

---

## 13. Scanner Rules and Gate–Account Assignment

Scanner rules control **where** and **how** a scanner account can be used.

### 13.1 Gate–Account Assignment

**Goal:** Allow a scanner user (e.g. Gate Operator) to be restricted to specific gates.

**Behavior:**

- Org admins can assign users (or roles) to one or more gates.
- When assignments exist:
  - The **scanner app** only shows and allows selection of those gates.
  - Server-side **validation and scan-log APIs** reject scans for gates the user is not assigned to.
- When no assignments exist:
  - Behavior is configurable per org/role:
    - Option A: User sees all gates in the organization (current behavior).
    - Option B: User sees no gates and is prompted to contact admin.

**Data Model (conceptual, for implementation):**

- New many-to-many relation between `User` and `Gate`, e.g.:
  - `GateAssignment` with `userId`, `gateId`, `organizationId`, timestamps.

### 13.2 Scanner Rules (Policy Layer)

Scanner rules define **policies** applied to scan attempts.

Initial rule types:

1. **Gate restriction rule (P1)**
   - Only allow scans when the requesting user is assigned to the selected gate.
   - If user attempts to scan at a non-assigned gate:
     - API returns a clear error (e.g. \"You are not allowed to scan at this gate\").
     - Scanner app surfaces the message visibly.

2. **Location rule (optional, P2)**
   - When enabled at the org or gate level, a scan is accepted only if the device’s location is within a defined radius of the gate (e.g. 50–100 m).
   - If location is missing or outside the radius:
     - API returns a clear error (e.g. \"Scan only allowed at gate location\").
     - Scanner app can prompt operator to move closer or enable location.

**Data Model considerations:**

- To support the location rule, gates need coordinates:
  - Option A: Add `latitude`, `longitude`, `locationRadiusMeters` to `Gate`.
  - Option B: Introduce a `GateLocation` model.
- v6.0 PRD states this requirement; exact schema is chosen in implementation.

### 13.3 \"Not on Location\" Behavior

You requested that a scanner account **cannot** be used when not physically at the gate.

**Interpretation (v6.0):**

- The **location rule** is an opt-in policy:
  - When ON:
    - Scanner must send device coordinates with scan context.
    - Backend checks distance between device location and gate coordinates.
    - If outside the configured radius, the scan is rejected with a clear error.
  - When OFF:
    - Location is recorded (if available) but not enforced.

**User Experience:**

- Operators see which gates they’re assigned to.
- When trying to scan far from a gate with location enforcement:
  - They get a clear, localized message like \"Scanning is only allowed at the gate location for this account\".

### 13.4 Visitor Identity & Trust Levels

GateFlow supports multiple levels of visitor identity assurance so tenants can choose the right balance of friction and security.

**Trust levels (configurable per tenant, per gate, and per scenario):**

| Level | Description | Typical use cases |
|-------|-------------|-------------------|
| Level 0 | Basic details only: name + phone (current behavior). | Casual guests, low-risk events. |
| Level 1 | ID photo capture at gate (front/back), stored with the scan. | Contractors, vendors, longer-term visitors. |
| Level 2 | ID OCR + field matching (e.g., name/ID number vs invite data). | High-security compounds, sensitive facilities. |

**Behavior:**

- Tenants can configure required trust level:
  - Globally (organization default).
  - Per gate (e.g., main gate: Level 2, side gate: Level 1).
  - Optionally per project or scenario (events vs residents).
- Scanner UX guides guards through required steps (e.g., \"Capture ID front\", \"Confirm ID matches name\").
- ID artifacts (photos, OCR text) are attached to the underlying scan/incident records and respect data retention policies.

### 13.5 Watchlists & Blocklists

GateFlow exposes tenant-managed watchlists and blocklists to help security teams enforce long-term decisions.

**Concepts:**

- **Person watchlist entry**: name + optional ID number, phone, notes.
- **Vehicle watchlist entry** (future): plate number + optional notes.

**Behavior:**

- On every scan (online or later when syncing), the platform checks:
  - Visitor identity details (name, phone, ID fields when available).
  - Optional plate field when present.
- If a match is found:
  - Scanner app shows a **hard stop** with a clear reason (e.g., \"Blocked person on security list\").
  - A corresponding incident is automatically created for review.
- All watchlist add/remove operations are:
  - Role-gated (e.g., only Security Manager or Org Admin).
  - Logged with who changed what and when.

### 13.6 Guard Shifts & Incidents

GateFlow must hold guards accountable and give Security Managers a single pane of glass for daily operations.

**Guard shifts:**

- Operators start and end **shifts** in the scanner app (optionally tied to a specific gate or gate group).
- Every scan, override, and incident is linked to a shift and operator identity.
- Analytics expose:
  - Scans per shift / per operator.
  - Override rate per operator.
  - Incident rate per gate and per shift.

**Incidents:**

- In the scanner app, guards can log an incident alongside or independent of a scan:
  - Reason codes (e.g., suspected fake QR, tailgating, aggressive visitor, hardware failure).
  - Optional free-text notes and photos.
- In the dashboard, Security Managers see:
  - A live incident list/queue, filterable by gate, time, severity, and guard.
  - Incident details linked to the underlying scans and visitor/ID data when available.
- Resolution workflow:
  - Supervisors can mark incidents as \"Under review\", \"Resolved\", or \"Escalated\".
  - All state changes are audit-logged.

### 13.7 Hardware Integration Hooks (Future)

To be the \"brain\" of the physical gate, GateFlow defines integration points for barriers and turnstiles:

- Logical hooks in scan handling for:
  - \"Open barrier\" / \"unlock turnstile\" signals on success.
  - Optional \"lockdown\" behavior on critical incidents or repeated failures.
- Configuration in the dashboard for mapping gates to physical devices (even if implementation is phased in later).

---

## 14. Resident Mobile Enhancement Plan

This section captures the **Resident Mobile Enhancement Plan**: contact-based sharing, real-time notifications (scan + arrival), GPS-guided guest navigation, and delight functions so unit owners love using the app with their guests.

### 14.1 Contact-Based QR Sharing (P0)

**Goal:** Resident selects a phone contact and sends the visitor QR link via WhatsApp or Email.

| Aspect | Approach |
|--------|----------|
| **Platform** | `expo-sharing` + `expo-contacts` (or `react-native-contacts`) — native share sheet and contact picker |
| **Share targets** | WhatsApp, Email, SMS — pre-filled message: \"Your GateFlow access pass: [link]\" |
| **Flow** | Resident taps Share → Contact picker → Select contact → App resolves phone/email → Share sheet opens with pre-filled recipient |

**Data flow:** Create/select visitor QR → Tap Share → Pick contact → App builds share sheet (WhatsApp if phone, Email if email, SMS fallback) → Native share opens with message + link.

### 14.2 Visitor Scan Notification (P0)

**Goal:** When the visitor scans the QR at the gate, notify the resident on their mobile device.

| Component | Mechanism |
|-----------|-----------|
| **Backend** | On scan success: emit event (e.g. `SCAN_SUCCESS`); notification pipeline resolves resident from `VisitorQR.createdBy` / Unit |
| **Resident app** | Push via Expo Notifications (or FCM) |
| **Payload** | \"[Visitor name] just scanned in at [Gate name]\" — minimal, actionable |
| **Deep link** | Tapping notification opens Visitor History or that visitor’s detail |

**Data flow:** Scanner validates QR → Backend logs scan → Notification service resolves resident → Push to device → Resident sees \"Ahmed scanned in at Main Gate\".

### 14.3 GPS Guide for Guest (P1)

**Goal:** After the scan, the QR link (landing page) offers an option to guide the guest to the unit by GPS.

| Step | Mechanism |
|------|-----------|
| **Landing page** | After scan, guest sees QR + \"Copy\" / \"Share\" + **\"Get directions\"** button |
| **Directions** | Opens Google Maps / Apple Maps with destination = unit coordinates (`latitude`, `longitude` on Unit or Gate) |
| **Unit coordinates** | Optional `latitude`, `longitude` on Unit (or Gate); if missing, \"Get directions\" is hidden |
| **Scope** | Directions to **unit** (resident’s door), not only gate — better UX |

**Flow:** Guest scans at gate → Validation succeeds → Redirect to short-link landing page → Page shows \"Navigate to [Unit X]\" → Button opens Maps with unit lat/long.

### 14.4 Arrival Notification (P1)

**Goal:** When the guest arrives near the unit, notify the unit owner again.

| Option | Description |
|--------|-------------|
| **Recommended v1** | **\"I've arrived\" button** — Guest taps when at the door; backend receives check-in → push to resident: \"[Visitor] has arrived at your unit.\" No continuous location tracking. |
| **Future** | Geofence-based auto-detect: guest’s device location (with consent) triggers notification when within radius of unit. |

**Data flow (v1):** Guest opens landing page post-scan → Sees \"Navigate to unit\" + \"I've arrived\" → Taps \"I've arrived\" → Backend `POST /api/visitor-checkin` (or similar) → Push to resident.

### 14.5 Functions to Make Unit Owners Love the App

| Feature | Description | Impact |
|---------|-------------|--------|
| **Quota widget** | Prominent \"X/Y visitors left\" with progress ring | Reduces anxiety about running out |
| **Who visited today** | Simple list: \"Ahmed (2:30 PM), Sara (4:15 PM)\" | At-a-glance awareness |
| **One-tap share** | From visitor detail: Share → last used method or contact | Friction reduction |
| **Smart guest templates** | Save presets like \"Family\", \"Maid\", \"Driver\" with default access rules | Speeds up frequent guest creation |
| **Recurring visitor presets** | \"Maid: Mon–Fri 8am–6pm\" — one-tap create | Saves repeated setup |
| **Guest self-check-in (optional)** | After scan, guest can confirm name/contact and (optionally) upload ID, per tenant policy | Stronger audit trail and dispute resolution |
| **Scan + arrival in one card** | Combined timeline: \"Scanned at 2:30 PM → Arrived 2:35 PM\" | Clear guest journey |
| **RTL + Arabic** | Full RTL layout, Arabic copy | MENA market fit |
| **Offline QR display** | Cache created QRs locally; show even offline | Works in basement parking |
| **Notification preferences** | Toggle: \"Notify on scan\" / \"Notify on arrival\" / \"Quiet hours\" | User control |

### 14.6 Resident Mobile Technical Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Expo SDK 54 / React Native |
| **Navigation** | expo-router (file-based) |
| **State** | React state + AsyncStorage for preferences |
| **Share** | expo-sharing + expo-contacts (or react-native-contacts) |
| **Push** | expo-notifications (Expo Push) or FCM |
| **Maps** | Expo Linking to `google.maps` or `maps.apple.com` (no native Maps SDK required for v1) |

### 14.7 Implementation Order (Resident Mobile)

| Phase | Deliverables |
|-------|--------------|
| **Phase A** | Contact picker + share to WhatsApp/Email (resident mobile) |
| **Phase B** | Backend: scan event → push to resident; resident app: receive push, show \"X scanned in\" |
| **Phase C** | Landing page: \"Get directions\" + \"I've arrived\" button; backend: arrival check-in → push |
| **Phase D** | Unit coordinates (schema + UI); \"Get directions\" opens Maps with destination |
| **Phase E** | Delight features: quota widget, who visited today, one-tap share |

---

## 15. References and Versioning

- **Previous PRD:** `docs/plan/phase-1-mvp/specs/PRD_v5.0.md` — baseline for MVP features.
- **Marketing Draft (Archived):** `docs/# GateFlow — Product Requirements Docume.md` — detailed marketing-first v6 draft; now treated as supporting context only.
- **Resident Mobile Enhancement Plan:** See Section 14 (and `.cursor/plans/resident_mobile_enhancement_*.plan.md` for full plan artifact).
- **Current Canonical PRD:** `docs/plan/phase-1-mvp/specs/PRD_v6.0.md` (this document).

---

**Document Version:** 6.0  
**Last Updated:** February 2026  
**Next Review:** March 2026

