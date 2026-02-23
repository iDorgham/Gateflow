# GateFlow — Product Requirements Document v4.0

**Product Name:** GateFlow  
**Version:** 4.0  
**Author:** Founder + Engineering Team  
**Target Markets:** Egypt & Gulf (MENA gated compounds, real-estate developers, private schools, beach clubs, marinas, wedding venues, nightclubs, corporate events)  
**Business Model:** B2B recurring SaaS (monthly/annual subscriptions) + per-event / per-scan hybrid options  
**Status:** MVP ~70% Complete

---

## 1. Executive Summary & Product Vision

### One-liner

GateFlow is the **Zero-Trust Digital Gate Infrastructure Platform** for physical spaces — replacing chaotic WhatsApp lists, paper guest books and screenshot QR chaos with secure, auditable, real-time controlled access.

### Problem it Solves

- Compounds / schools / marinas: manual guest lists → security holes, resident complaints, lost control
- Events / weddings: disorganized invitations → gate bottlenecks, VIP fraud, poor analytics
- Clubs / nightlife: guest-list chaos → long queues, fake entries, revenue leakage
- All: no real-time visibility, no audit trail for disputes, weak team/role separation

### Core Value Proposition

"Stripe-level infrastructure for physical access" — controlled entry + live intelligence + enterprise-grade security & integrations

### Success Metrics (12–24 months)

- 150–300 paying organizations
- 5–15 million QR scans processed
- Recurring MRR ≥ $35k–80k
- Enterprise deals with 2–3 large real-estate developers
- NPS ≥ 45

---

## 2. Target Users & Personas

| Persona                    | Role / Job-to-be-Done | Pain Points                                     | Must-have Features                                     |
| -------------------------- | --------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| Compound / School Manager  | Owner / Admin         | Security breaches, resident complaints, no logs | Bulk CSV, team RBAC, live dashboard, audit logs        |
| Event Organizer            | Project Manager       | Gate chaos, VIP fraud, poor data                | Per-event projects, bulk + manual QR, analytics export |
| Club / Venue Security Head | Gate Supervisor       | Fake entries, operator abuse, no visibility     | Live scan feed, operator management, override logs     |
| Gate Operator / Bouncer    | Gate Operator         | Fast & reliable scanning                        | Offline-capable mobile app, vibration/sound, simple UI |
| Developer / Integrator     | Developer             | Easy CRM/booking sync                           | Full REST API, webhooks, API keys with scopes          |
| Analytics / Marketing      | Analytics Viewer      | No data on attendance                           | Read-only analytics, exports, trends                   |

---

## 3. Directory Structure

```
/
├── apps/
│   ├── marketing/                    # Next.js App Router – public marketing site
│   ├── client-dashboard/             # Next.js App Router – authenticated tenant dashboard
│   ├── admin-dashboard/              # Next.js App Router – super admin panel
│   └── scanner-app/                 # Expo / React Native mobile scanner app
│
├── packages/
│   ├── ui/                          # Shared React components (shadcn/ui style)
│   ├── api-client/                  # Generated API types + fetch client
│   ├── db/                          # Prisma database client & schema
│   ├── config/                      # Shared ESLint, TSConfig, Tailwind presets
│   ├── types/                       # Shared TypeScript interfaces & Zod schemas
│   └── i18n/                        # i18next translation files & setup
│
├── infra/                           # Dockerfiles, docker-compose, Terraform
├── .github/workflows/               # GitHub Actions CI/CD
├── docs/                            # Documentation
│
├── turbo.json                       # Turborepo configuration
├── tsconfig.json                    # Root TypeScript config (strict mode)
├── .eslintrc.json                   # Root ESLint config
├── .prettierrc                      # Prettier config
└── package.json                     # Root package.json with workspace config
```

---

## 4. Scope: MVP → Phase 3

### MVP (Phase 1 — Q3/Q4 2026)

- ✅ Multi-tenant dashboard (organization level) ⚠️ Multi-project NOT implemented
- ❌ Bulk + single QR creation (CSV upload) — **MISSING**
- ⚠️ Expiration, one-time / multi-use ✅ Role tags — **MISSING**
- ✅ Mobile scanner app (iOS + Android) — offline mode + sync
- ✅ Live dashboard + basic analytics (scans, pending, rejected)
- ✅ RBAC with core roles + permissions
- ❌ Basic API (create QR, verify, list scans) + webhooks — **WEBHOOKS MISSING**
- ✅ Immutable audit logs
- ❌ Email delivery of QR — **MISSING**

### Phase 2 (post-MVP 3–9 months)

- WordPress plugin
- Advanced analytics (heatmaps, peak times, per-gate)
- Risk & fraud detection rules + scoring
- Full Zero-Trust enforcement
- Webhook retry & signing
- SMS gateway integration

### Phase 3 (enterprise scale)

- White-label / custom branding
- Resident self-service portal
- NFC support
- SSO (SAML / OIDC)
- Compliance mode (immutable logs, customer-managed keys)
- Edge validation nodes

### Out of Scope

- Payment processing (use external gateways)
- Full CRM replacement
- Biometric facial recognition

---

## 5. Functional Requirements

### 5.1 Organization & Project Management

| Feature                                          | Status     | Notes                                     |
| ------------------------------------------------ | ---------- | ----------------------------------------- |
| Org: billing, team, API keys, webhooks, settings | ⚠️ Partial | Billing/API keys/webhooks not implemented |
| Project: compound / event / club instance        | ❌ Missing | Not in schema                             |

### 5.2 QR Engine

| Feature                               | Status                         | Notes                                        |
| ------------------------------------- | ------------------------------ | -------------------------------------------- |
| Single & bulk creation (CSV)          | ⚠️ Single done, bulk missing   | Single QR works, CSV not implemented         |
| Signed/encrypted payload              | ✅ Complete                    | HMAC-SHA256                                  |
| Types: one-time, multi-use, permanent | ✅ Complete                    | All types supported                          |
| Date-range support                    | ⚠️ Partial                     | Expiry date works, date-range type not added |
| Resend, revoke, extend expiry         | ⚠️ Revoke done, others missing | Can deactivate only                          |

### 5.3 Mobile Scanner App

| Feature                               | Status      | Notes                    |
| ------------------------------------- | ----------- | ------------------------ |
| Login → device registration           | ✅ Complete | Full auth flow           |
| Camera scan → instant local check     | ✅ Complete | Local verification works |
| Offline queue + auto-sync             | ✅ Complete | Full implementation      |
| Feedback: green/red + sound/vibration | ✅ Complete | Haptic + visual          |
| Supervisor override flow              | ❌ Missing  | **MISSING**              |

### 5.4 Offline Sync Details

#### Architecture (✅ Implemented)

```
Scanner App                          Server
┌─────────────────────────┐         ┌──────────────────┐
│ QR Scan                 │         │                  │
│ ──────────────────     │         │                  │
│ 1. Capture scan        │         │                  │
│ 2. Encrypt (AES-256)   │         │                  │
│ 3. Store locally       │         │                  │
│                        │────────▶│ POST /scans/bulk │
│ Offline Queue:         │  Sync   │                  │
│ - id                  │────────▶│ Response:        │
│ - encryptedData        │         │  - synced []     │
│ - scannedAt           │         │  - conflicted []  │
│ - synced: false        │         │  - failed []     │
└─────────────────────────┘         └──────────────────┘
```

#### Encryption (✅ Implemented)

- **Algorithm:** AES-256 via crypto-js ✅
- **Key Derivation:** PBKDF2 with salt ✅
- **Key Storage:** expo-secure-store ✅

#### Conflict Resolution: Last-Write-Wins (✅ Implemented)

#### Retry Logic (✅ Implemented)

| Retry | Delay     |
| ----- | --------- |
| 1     | Immediate |
| 2     | 5s        |
| 3     | 30s       |
| 4     | 2min      |
| 5     | 5min      |
| 6+    | 10min     |

### 5.5 Access Validation Engine

| Feature                                 | Status      | Notes           |
| --------------------------------------- | ----------- | --------------- |
| Server-side validation                  | ✅ Complete | Full validation |
| Signature, expiry, usage, project match | ✅ Complete | All checks work |
| Fraud signals                           | ❌ Missing  | Not implemented |

### 5.6 RBAC & Permissions

| Feature                     | Status     | Notes                                               |
| --------------------------- | ---------- | --------------------------------------------------- |
| Atomic permissions by scope | ❌ Missing | Simple role only                                    |
| Default roles               | ⚠️ Partial | 4 roles (ADMIN, TENANT_ADMIN, TENANT_USER, VISITOR) |

### 5.7 Analytics & Live Dashboard

| Feature                           | Status         | Notes                     |
| --------------------------------- | -------------- | ------------------------- |
| Real-time: current gate activity  | ⚠️ Partial     | Static data, no real-time |
| Historical: total created/scanned | ✅ Complete    | 7-day chart               |
| Exports: CSV/PDF                  | ⚠️ CSV partial | CSV endpoint exists       |

### 5.8 API & Integrations

| Feature                                        | Status      | Notes       |
| ---------------------------------------------- | ----------- | ----------- |
| REST: /qr/create, /qr/bulk, /qr/verify, /scans | ✅ Complete | Full API    |
| Webhooks                                       | ❌ Missing  | **MISSING** |
| API keys with scopes                           | ❌ Missing  | UI only     |

---

## 6. Data Models (Current Schema)

### 6.1 Core Entities

#### Organization ✅

| Field     | Type                       | Notes             |
| --------- | -------------------------- | ----------------- |
| id        | String (cuid)              | Primary key       |
| name      | String                     | Organization name |
| email     | String                     | Unique            |
| domain    | String?                    | Unique, nullable  |
| plan      | Enum (FREE/PRO/ENTERPRISE) | Subscription tier |
| createdAt | DateTime                   |                   |
| updatedAt | DateTime                   |                   |
| deletedAt | DateTime?                  | Soft delete       |

#### User ✅

| Field          | Type                                          | Notes              |
| -------------- | --------------------------------------------- | ------------------ |
| id             | String (cuid)                                 | Primary key        |
| email          | String                                        | Unique             |
| name           | String                                        |                    |
| passwordHash   | String                                        | Argon2id           |
| role           | Enum (ADMIN/TENANT_ADMIN/TENANT_USER/VISITOR) |                    |
| organizationId | String?                                       | FK to Organization |
| createdAt      | DateTime                                      |                    |
| updatedAt      | DateTime                                      |                    |
| deletedAt      | DateTime?                                     | Soft delete        |

#### Gate ✅

| Field          | Type          | Notes              |
| -------------- | ------------- | ------------------ |
| id             | String (cuid) | Primary key        |
| name           | String        | Gate name          |
| location       | String        | Physical location  |
| organizationId | String        | FK to Organization |
| isActive       | Boolean       | Default true       |
| lastAccessedAt | DateTime?     |                    |
| createdAt      | DateTime      |                    |
| updatedAt      | DateTime      |                    |
| deletedAt      | DateTime?     | Soft delete        |

#### QRCode ⚠️ (Missing: roleTag)

| Field          | Type                              | Notes                         |
| -------------- | --------------------------------- | ----------------------------- |
| id             | String (cuid)                     | Primary key                   |
| code           | String                            | Unique, the actual QR content |
| type           | Enum (SINGLE/RECURRING/PERMANENT) | Usage type                    |
| organizationId | String                            | FK to Organization            |
| gateId         | String?                           | Optional FK to Gate           |
| maxUses        | Int?                              | For RECURRING type            |
| currentUses    | Int                               | Default 0                     |
| expiresAt      | DateTime?                         | Optional expiration           |
| isActive       | Boolean                           | Default true                  |
| roleTag        | Enum?                             | **MISSING**                   |
| createdAt      | DateTime                          |                               |
| updatedAt      | DateTime                          |                               |
| deletedAt      | DateTime?                         | Soft delete                   |

#### ScanLog ✅

| Field      | Type                                                    | Notes                |
| ---------- | ------------------------------------------------------- | -------------------- |
| id         | String (cuid)                                           | Primary key          |
| scanUuid   | String?                                                 | Unique               |
| status     | Enum (SUCCESS/FAILED/EXPIRED/MAX_USES_REACHED/INACTIVE) |                      |
| scannedAt  | DateTime                                                |                      |
| userId     | String?                                                 | FK to User (scanner) |
| gateId     | String                                                  | FK to Gate           |
| qrCodeId   | String                                                  | FK to QRCode         |
| deviceId   | String?                                                 |                      |
| auditNotes | JSON?                                                   | Deprecated           |
| auditTrail | JSON[]                                                  | Complete             |

---

## 7. Non-Functional Requirements

| Category       | Requirement                                                                        | Status                  |
| -------------- | ---------------------------------------------------------------------------------- | ----------------------- |
| Performance    | < 400ms gate validation (online), < 1s sync after offline                          | ✅ Met                  |
| Scalability    | 10k concurrent scans/hour (large event), 1M+ scans/month                           | ⚠️ Needs testing        |
| Availability   | 99.9% uptime (SLA enterprise tier)                                                 | ⚠️ Needs infrastructure |
| Security       | OWASP Top 10, Zero-Trust, audit trail, rate limiting, encryption at rest & transit | ⚠️ Partial              |
| Multi-tenancy  | Strict isolation (row-level), no cross-tenant leakage                              | ✅ Met                  |
| Mobile         | iOS 15+ / Android 9+, offline-first                                                | ✅ Met                  |
| Data Residency | Egypt / KSA / UAE options (enterprise)                                             | ❌ Not implemented      |

### Security Requirements

- **Zero-Trust:** Never trust network/device/role alone ⚠️ Partial
- **Encryption at Rest:** AES-256 for sensitive fields ⚠️ Scanner only
- **Encryption in Transit:** TLS 1.3 ⚠️ Config needed
- **Password Hashing:** Argon2id (t=3, m=65536, p=4) ✅ Complete
- **Audit Logs:** Immutable with hash chain ❌ Not implemented
- **Rate Limiting:** 100 req/min per IP, 1000 req/min authenticated ⚠️ In-memory only

---

## 8. MVP Prioritization

### ✅ Completed Items

1. ✅ Org creation + management
2. ✅ User authentication (JWT + Argon2id)
3. ✅ Single QR creation
4. ✅ Gate management (CRUD)
5. ✅ Mobile scanner (offline)
6. ✅ Basic RBAC (Owner/Admin/Gate Operator)
7. ✅ Live dashboard + scan logs
8. ✅ Basic audit trail

### ❌ Remaining MVP Scope (Top 10 Must-Have)

| #   | Feature                          | Priority | Effort | Status     |
| --- | -------------------------------- | -------- | ------ | ---------- |
| 1   | Bulk CSV QR Creation             | P0       | 3 days | ❌ Missing |
| 2   | Email QR Delivery                | P0       | 2 days | ❌ Missing |
| 3   | Webhook System (CRUD + delivery) | P0       | 3 days | ❌ Missing |
| 4   | QR Role Tags (VIP/Guest/Staff)   | P0       | 1 day  | ❌ Missing |
| 5   | Supervisor Override (Scanner)    | P1       | 1 day  | ❌ Missing |
| 6   | API Key Management (Full)        | P1       | 2 days | ❌ Missing |
| 7   | Advanced Analytics               | P1       | 4 days | ❌ Missing |
| 8   | Project Model (Multi-project)    | P2       | 5 days | ❌ Missing |
| 9   | PDF Export                       | P2       | 1 day  | ❌ Missing |
| 10  | Admin Dashboard Basics           | P2       | 5 days | ❌ Missing |

---

## 9. Risks & Mitigations

| Risk                                  | Mitigation                         | Status              |
| ------------------------------------- | ---------------------------------- | ------------------- |
| QR forgery / screenshot sharing       | Signed payload + fraud rules       | ⚠️ Partial          |
| Offline scan conflicts / double entry | Server authoritative + LWW + audit | ✅ Implemented      |
| Operator abuse (fake approvals)       | Override logging + rate alerts     | ❌ Missing override |
| Slow gate experience                  | Offline-first + edge caching       | ✅ Implemented      |
| Regulatory / privacy                  | Compliance mode + data residency   | ❌ Not started      |

---

## 10. Pricing Tiers

| Tier       | QR / month | Team members | API/Webhooks | Analytics             | Price (EGP/month) |
| ---------- | ---------- | ------------ | ------------ | --------------------- | ----------------- |
| Starter    | 5,000      | 3            | No           | Basic                 | ~499–799          |
| Pro        | 50,000     | 10           | Yes          | Full + export         | ~1,999–2,999      |
| Enterprise | Unlimited  | Unlimited    | Yes + SLA    | Advanced + compliance | Custom (5k–30k+)  |

Add-ons: SMS delivery, white-label, dedicated support.

---

## 11. Technical Stack

| Component       | Choice                         | Status |
| --------------- | ------------------------------ | ------ |
| Frontend        | Next.js 14 (App Router)        | ✅     |
| Mobile          | Expo / React Native            | ✅     |
| Database        | PostgreSQL + Prisma            | ✅     |
| Package Manager | pnpm                           | ✅     |
| Build System    | Turborepo                      | ✅     |
| UI Components   | shadcn/ui style shared package | ✅     |

---

**This PRD v4.0 is the single source of truth for implementation.**
**Last Updated:** February 2026
