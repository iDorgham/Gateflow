# GateFlow — Product Requirements Document v5.0

**Product Name:** GateFlow  
**Version:** 5.0  
**Author:** Founder + Engineering Team  
**Target Markets:** Egypt & Gulf (MENA gated compounds, real-estate developers, private schools, beach clubs, marinas, wedding venues, nightclubs, corporate events)  
**Business Model:** B2B recurring SaaS (monthly/annual subscriptions) + per-event / per-scan hybrid options  
**Status:** MVP ~75% Complete | Phase 2 Planning

---

## 1. Executive Summary

### Product Vision

GateFlow is the **Zero-Trust Digital Gate Infrastructure Platform** for physical spaces — replacing chaotic WhatsApp lists, paper guest books, and screenshot QR chaos with secure, auditable, real-time controlled access.

### Problem It Solves

- **Compounds/Schools/Marinas:** Manual guest lists → security holes, resident complaints, lost control
- **Events/Weddings:** Disorganized invitations → gate bottlenecks, VIP fraud, poor analytics
- **Clubs/Nightlife:** Guest-list chaos → long queues, fake entries, revenue leakage
- **All Venues:** No real-time visibility, no audit trail for disputes, weak team/role separation

### Core Value Proposition

"Stripe-level infrastructure for physical access" — controlled entry + live intelligence + enterprise-grade security & integrations

### The Five Apps Strategy

GateFlow now consists of **5 interconnected applications**:

| #   | App                   | Purpose                    | Users               | Status  |
| --- | --------------------- | -------------------------- | ------------------- | ------- |
| 1   | **Admin Dashboard**   | Super admin management     | Platform operators  | ~15%    |
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
| **Developer/Integrator** | Developer             | Easy CRM/booking sync                            | Full REST API, webhooks, API keys with scopes          |
| **Analytics Viewer**     | Analytics Viewer      | No data on attendance                            | Read-only analytics, exports, trends                   |

### NEW: Resident Persona Deep Dive

**Pain Points:**

- Must contact property management for every guest
- No visibility into who has visited
- Can't give permanent access to close family/friends
- Complicated process for recurring visitors (maids, drivers)
- No mobile-friendly way to manage access

**Needs:**

- Simple mobile app to create visitor QR codes
- Clear quota limits based on unit size
- Ability to set time restrictions (e.g., maid only 8AM-6PM)
- Open QR for family with permanent access
- View history of who visited their unit
- Get notified when visitors arrive

---

## 3. Full Scope: All 5 Apps

### 3.1 Admin Dashboard (apps/admin-dashboard)

| Feature                  | Priority | Status |
| ------------------------ | -------- | ------ |
| Organization management  | P0       | ~50%   |
| User management (global) | P0       | ~30%   |
| System-wide analytics    | P1       | ~20%   |
| Billing management       | P1       | 0%     |
| Platform settings        | P2       | 0%     |
| Compliance reporting     | P2       | 0%     |

### 3.2 Client Dashboard (apps/client-dashboard)

| Feature                       | Priority | Status  |
| ----------------------------- | -------- | ------- |
| Organization management       | P0       | ~90%    |
| QR code management (single)   | P0       | ~95%    |
| QR code management (bulk CSV) | P0       | ~100%   |
| Gate management               | P0       | ~90%    |
| Team/RBAC                     | P0       | ~85%    |
| Analytics dashboard           | P1       | ~70%    |
| Webhooks                      | P1       | ~80%    |
| API keys                      | P1       | ~70%    |
| Resident unit management      | P1       | **NEW** |
| Visitor QR management         | P1       | **NEW** |

### 3.3 Scanner App (apps/scanner-app)

| Feature             | Priority | Status  |
| ------------------- | -------- | ------- |
| Login/auth          | P0       | ~95%    |
| Camera scanning     | P0       | ~100%   |
| Offline mode + sync | P0       | ~100%   |
| Supervisor override | P1       | **NEW** |
| Gate selector       | P1       | 0%      |
| Scan history        | P2       | 0%      |
| Queue status UI     | P2       | 0%      |

### 3.4 Marketing Website (apps/marketing)

| Feature           | Priority | Status |
| ----------------- | -------- | ------ |
| Landing page      | P0       | ~30%   |
| Features page     | P1       | 0%     |
| Pricing page      | P1       | ~20%   |
| Contact form      | P1       | ~20%   |
| Blog/Case studies | P2       | 0%     |
| Documentation     | P2       | 0%     |

### 3.5 Resident Portal (apps/resident-portal + apps/resident-mobile) — NEW

| Feature                 | Priority | Status  |
| ----------------------- | -------- | ------- |
| Unit linking            | P0       | **NEW** |
| Visitor QR creation     | P0       | **NEW** |
| Quota tracking          | P0       | **NEW** |
| Open QR creation        | P1       | **NEW** |
| Visitor history         | P1       | **NEW** |
| Access time controls    | P1       | **NEW** |
| Mobile-optimized web    | P1       | **NEW** |
| Native mobile app       | P2       | **NEW** |
| Push notifications      | P2       | **NEW** |
| Guest approval workflow | P3       | **NEW** |

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
   - Push notifications for visitor arrivals

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
  startTime       String?          // "09:00"
  endTime         String?          // "22:00"
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
| Mobile (Scanner)    | Expo/React Native        | SDK 52  |
| Mobile (Resident)   | Expo/React Native        | SDK 52  |
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

### Remaining MVP (~25%)

| #   | Feature                       | Priority | Status |
| --- | ----------------------------- | -------- | ------ |
| 1   | Supervisor override (scanner) | P1       | ❌     |
| 2   | Advanced analytics            | P1       | ❌     |
| 3   | Multi-project support         | P2       | ❌     |
| 4   | Admin dashboard basics        | P1       | ⚠️     |
| 5   | Marketing website polish      | P2       | ❌     |

---

## 7. Phase 2 Roadmap (Q3-Q4 2026)

| Feature                  | Target Month | Effort  |
| ------------------------ | ------------ | ------- |
| Resident Portal (Web)    | Month 1      | 3 weeks |
| Resident Portal (Mobile) | Month 2      | 2 weeks |
| Quota enforcement        | Month 1      | 1 week  |
| Open QR feature          | Month 2      | 1 week  |
| Supervisor override      | Month 2      | 1 week  |
| Advanced analytics       | Month 3      | 3 weeks |
| Multi-project            | Month 3-4    | 4 weeks |

---

## 8. Phase 3 Roadmap (2027)

| Feature                       | Target |
| ----------------------------- | ------ |
| White-label / custom branding | Q1     |
| NFC support                   | Q1     |
| SSO (SAML/OIDC)               | Q2     |
| Compliance mode               | Q2     |
| WordPress plugin              | Q3     |
| SMS gateway                   | Q3     |

---

## 9. Security & Compliance

| Requirement                 | Status | Notes                |
| --------------------------- | ------ | -------------------- |
| JWT Authentication          | ✅     | 15-min access token  |
| Password Hashing (Argon2id) | ✅     | t=3, m=65536, p=4    |
| Multi-tenant isolation      | ✅     | Row-level            |
| Audit logs                  | ✅     | Full trail           |
| Rate limiting (Redis)       | ✅     | Multi-instance       |
| CSRF protection             | ✅     | Double-submit cookie |
| Token rotation              | ✅     | Refresh token        |
| Field encryption            | ✅     | Webhook secrets      |
| Data residency              | ❌     | Not implemented      |
| Immutable logs              | ❌     | Not implemented      |

---

## 10. API Summary

| App              | Base Path         | Auth                                   |
| ---------------- | ----------------- | -------------------------------------- |
| Client Dashboard | `/api/*`          | JWT (ADMIN, TENANT_ADMIN, TENANT_USER) |
| Scanner App      | `/api/*`          | Bearer token                           |
| Resident Portal  | `/api/resident/*` | JWT (RESIDENT)                         |
| Admin            | `/api/admin/*`    | JWT (PLATFORM_ADMIN)                   |

---

## 11. Pricing Tiers (Unchanged)

| Tier       | QR/month  | Team      | Features       | Price (EGP) |
| ---------- | --------- | --------- | -------------- | ----------- |
| Starter    | 5,000     | 3         | Basic          | 499-799     |
| Pro        | 50,000    | 10        | Full + export  | 1,999-2,999 |
| Enterprise | Unlimited | Unlimited | Advanced + SLA | 5k-30k+     |

---

**Document Version:** 5.0  
**Last Updated:** February 2026  
**Next Review:** March 2026
