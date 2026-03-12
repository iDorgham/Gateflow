# GateFlow — Product Requirements Document v7.0

**Product Name:** GateFlow  
**Version:** 7.0  
**Author:** Founder + Engineering + Marketing Team  
**Target Markets:** Egypt & Gulf (MENA gated compounds, real-estate developers, private schools, beach clubs, marinas, wedding venues, nightclubs, corporate events)  
**Business Model:** B2B recurring SaaS (monthly/annual subscriptions) + per-event / per-scan hybrid options  
**Status:** MVP ~95% Complete | Phase 2 (Resident Mobile + Real-time Updates) In Progress

---

## 1. Executive Summary

### Product Vision

GateFlow is the **Zero-Trust Digital Gate Infrastructure Platform** for physical spaces — replacing chaotic WhatsApp lists, paper guest books, and screenshot QR chaos with secure, auditable, real-time controlled access.

With v7.0, GateFlow has evolved from pure access control into a **complete physical access infrastructure** with:
- **Marketing-first access** — UTM-tagged, pixel-enabled visitor flows for attribution and retargeting
- **Resident-first experience** — self-service visitor management, notifications, and mobile-friendly flows
- **Security-first operations** — watchlists, incident management, guard accountability, and identity verification
- **Real-time intelligence** — live updates, SSE streaming, and instant notifications across all apps

### Problem It Solves

- **Compounds/Schools/Marinas:** Manual guest lists → security holes, resident complaints, lost control
- **Events/Weddings:** Disorganized invitations → gate bottlenecks, VIP fraud, poor analytics
- **Clubs/Nightlife:** Guest-list chaos → long queues, fake entries, revenue leakage
- **All Venues:** No real-time visibility, no audit trail for disputes, weak team/role separation
- **Marketing teams:** No attribution between digital spend and physical visits
- **Security teams:** No watchlists, no incident tracking, no guard accountability

### Core Value Proposition

- **Stripe-level infrastructure for physical access** — controlled entry + live intelligence + enterprise-grade security & integrations
- **Marketing-first access** — UTM-tagged, pixel-enabled visitor flows for attribution and retargeting
- **Resident-first experience** — self-service visitor management, notifications, and mobile-friendly flows
- **Security operations center** — watchlists, incidents, guard shifts, and identity verification
- **Real-time everywhere** — SSE streaming, push notifications, and live updates across all apps

### The Six Apps Strategy

GateFlow consists of **6 interconnected applications**:

| #   | App                   | Purpose                    | Users               | Status  |
| --- | --------------------- | -------------------------- | ------------------- | ------- |
| 1   | **Admin Dashboard**   | Super admin management     | Platform operators  | ✅ 95%  |
| 2   | **Client Dashboard**  | Property/Org management    | Admins, managers    | ✅ 95%  |
| 3   | **Scanner App**       | Gate scanning              | Security/operators  | ✅ 100% |
| 4   | **Marketing Website** | Public marketing           | Prospects           | ✅ 90%  |
| 5   | **Resident Portal**   | Self-service for residents | Unit owners/renters | ✅ 95%  |
| 6   | **Resident Mobile**   | Native resident app        | Unit owners/renters | 🔄 60%  |

---

## 2. Target Users & Personas

### Updated Persona Table

| Persona                  | Role / Job-to-be-Done | Pain Points                                      | Must-have Features                                     |
| ------------------------ | --------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| **Platform Admin**       | Super admin           | No platform visibility                           | Org management, system analytics, billing oversight    |
| **Property Manager**     | Compound/School Admin | Security breaches, resident complaints, no logs  | Bulk CSV, team RBAC, live dashboard, audit logs        |
| **Event Organizer**      | Project Manager       | Gate chaos, VIP fraud, poor data                 | Per-event projects, bulk + manual QR, analytics export |
| **Security Head**        | Gate Supervisor       | Fake entries, operator abuse, no visibility      | Live scan feed, operator management, override logs, watchlists, incidents |
| **Gate Operator**        | Gate Operator         | Fast & reliable scanning                         | Offline-capable mobile app, vibration/sound, simple UI, shift tracking |
| **Resident**             | Unit Owner/Renter     | Can't give guests access easily, complex process | Self-service QR creation, quota tracking, Open QR, mobile app |
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

## 3. Full Scope: All 6 Apps

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
| Authorization keys          | P1       | ✅ Done (ADMIN/SERVICE keys with CRUD)   |
| Compliance reporting        | P2       | Placeholder (Coming Q4 2026)             |
| Stripe real integration     | P2       | Not started                              |
| MFA for admin               | P3       | Not started                              |

### 3.2 Client Dashboard (apps/client-dashboard)

| Feature                             | Priority | Status  |
| ----------------------------------- | -------- | ------- |
| Organization management             | P0       | ✅ 100% |
| QR code management (single)         | P0       | ✅ 100% |
| QR code management (bulk CSV)       | P0       | ✅ 100% |
| Gate management                     | P0       | ✅ 100% |
| Team/RBAC (roles + permissions)     | P0       | ✅ 100% |
| Custom roles                        | P1       | ✅ 100% |
| Gate assignments                    | P1       | ✅ 100% |
| Analytics dashboard                 | P1       | ✅ 100% |
| Webhooks                            | P1       | ✅ 100% |
| API keys                            | P1       | ✅ 100% |
| Projects (multi-project)            | P1       | ✅ 100% |
| Contacts (CRM)                      | P1       | ✅ 100% |
| Units (resident management)         | P1       | ✅ 100% |
| Watchlists                          | P1       | ✅ 100% |
| Incidents                           | P1       | ✅ 100% |
| Visitor identity levels             | P1       | ✅ 100% |
| Privacy & retention controls        | P1       | ✅ 100% |
| Real-time updates (SSE)             | P1       | ✅ 100% |
| Marketing suite (pixels, UTM, CRM)  | P2       | 🔄 50%  |

### 3.3 Scanner App (apps/scanner-app)

| Feature                       | Priority | Status  |
| ----------------------------- | -------- | ------- |
| Login/auth                    | P0       | ✅ 100% |
| Camera scanning               | P0       | ✅ 100% |
| Offline mode + sync           | P0       | ✅ 100% |
| Supervisor override           | P1       | ✅ 100% |
| Gate selector                 | P1       | ✅ 100% |
| Today's expected visits       | P1       | ✅ 100% |
| Scan history/log              | P1       | ✅ 100% |
| Chat with admin               | P1       | ✅ 100% |
| Settings                      | P1       | ✅ 100% |
| Queue status UI               | P2       | ✅ 100% |
| Gate–account assignment rules | P1       | ✅ 100% |
| Location-based rules          | P2       | ✅ 100% |
| Shift tracking                | P1       | ✅ 100% |
| Incident reporting            | P1       | ✅ 100% |
| ID capture                    | P1       | ✅ 100% |

### 3.4 Marketing Website (apps/marketing)

| Feature           | Priority | Status |
| ----------------- | -------- | ------ |
| Landing page      | P0       | ✅ 90% |
| Features page     | P1       | ✅ 90% |
| Pricing page      | P1       | ✅ 90% |
| Solutions pages   | P1       | ✅ 90% |
| Contact form      | P1       | ✅ 90% |
| Blog/Case studies | P2       | 🔄 40% |
| Documentation     | P2       | 🔄 30% |

### 3.5 Resident Portal (apps/resident-portal)

| Feature                           | Priority | Status  |
| --------------------------------- | -------- | ------- |
| Unit linking                      | P0       | ✅ 100% |
| Visitor QR creation               | P0       | ✅ 100% |
| Quota tracking                    | P0       | ✅ 100% |
| Open QR creation                  | P1       | ✅ 100% |
| Visitor history                   | P1       | ✅ 100% |
| Access time controls              | P1       | ✅ 100% |
| Mobile-optimized web              | P1       | ✅ 100% |
| Profile management                | P1       | ✅ 100% |
| Notification settings             | P1       | ✅ 100% |

### 3.6 Resident Mobile (apps/resident-mobile)

| Feature                           | Priority | Status  |
| --------------------------------- | -------- | ------- |
| Login/auth                        | P0       | ✅ 100% |
| QR list                           | P0       | ✅ 100% |
| QR creation                       | P0       | ✅ 100% |
| Offline QR cache                  | P0       | ✅ 100% |
| Contact picker                    | P0       | 🔄 60%  |
| Share sheet (WhatsApp/Email)      | P0       | 🔄 60%  |
| Push notifications (scan)         | P0       | 🔄 60%  |
| Visitor history                   | P1       | ✅ 100% |
| Settings                          | P1       | ✅ 100% |
| GPS guide for guest               | P1       | ❌ 0%   |
| Arrival notification              | P1       | ❌ 0%   |
| Quota widget                      | P2       | ❌ 0%   |
| Who visited today                 | P2       | ❌ 0%   |
| One-tap share                     | P2       | ❌ 0%   |

---

## 4. Core Features Deep Dive

### 4.1 Multi-Tenant Architecture

**Implementation:**
- Every model has `organizationId` field
- All queries MUST filter by `organizationId`
- Soft deletes via `deletedAt` field
- Row-level security enforced at API layer

**Key Models:**
- `Organization` — root tenant entity
- `Project` — sub-grouping within organization
- `User` — linked to organization via `organizationId`

### 4.2 Role-Based Access Control (RBAC)

**Built-in Roles:**
- **Super Admin** — platform-level access (admin dashboard)
- **Organization Admin** — full tenant access
- **Security Manager** — security-focused operations
- **Gate Operator** — scanner-only access
- **Resident** — resident portal access

**Custom Roles:**
- Org admins can create custom roles
- Permission-based access control
- Granular permissions: `gates:manage`, `qr:create`, `scans:view`, etc.
- Cannot grant more permissions than creator has

**Implementation:**
- `Role` model with `permissions` JSON field
- `User.roleId` points to `Role`
- Server-side permission checks on all routes
- UI adapts based on user permissions

### 4.3 QR Code System

**QR Code Types:**
- **SINGLE** — one-time use
- **RECURRING** — multiple uses with expiry
- **PERMANENT** — no expiry
- **VISITOR** — created by residents
- **OPEN** — unit-linked, no visitor name

**Features:**
- HMAC-SHA256 signing for security
- Short links (`/s/[shortId]`) for easy sharing
- UTM tracking for marketing attribution
- Bulk CSV upload
- Gate-specific QR codes
- Project-scoped QR codes

**Validation:**
- Signature verification
- Expiry check
- Max uses check
- Active status check
- Gate assignment check (if specified)

### 4.4 Scanner Operations

**Scanner App Features:**
- **5-tab interface:**
  1. Scanner — QR scanning with camera
  2. Today — expected visits list
  3. Log — scan history
  4. Chat — communication with admin
  5. Settings — app configuration

**Offline Capability:**
- AES-256 encrypted queue
- Local HMAC verification
- Automatic sync when online
- Scan deduplication via `scanUuid`

**Supervisor Override:**
- PIN-based bypass for denied scans
- Audit trail with reason
- Role-gated (Security Manager only)

**Gate Assignment:**
- Operators assigned to specific gates
- Server-side validation
- Optional shift times (start/end)

**Location Enforcement:**
- Optional GPS-based validation
- Configurable radius per gate
- Fallback to non-enforced mode

### 4.5 Resident Portal & Mobile

**Unit-Based System:**
- Units linked to residents
- Quota limits by unit type
- Self-service visitor QR creation

**Unit Types & Quotas:**
| Unit Type | Monthly Quota | Can Create Open QR |
| --------- | ------------- | ------------------ |
| Studio    | 3             | No                 |
| 1 Bedroom | 5             | No                 |
| 2 Bedroom | 10            | Yes                |
| 3 Bedroom | 15            | Yes                |
| 4 Bedroom | 20            | Yes                |
| Penthouse | 25            | Yes                |
| Villa     | 30            | Yes                |

**Access Rule Types:**
| Type           | Description                     | Use Case         |
| -------------- | ------------------------------- | ---------------- |
| **One-Time**   | Single use, specific date       | One-time guests  |
| **Date Range** | Multiple uses within date range | Weekend visitors |
| **Recurring**  | Specific days + time window     | Weekly helpers   |
| **Permanent**  | No time restrictions            | Family members   |

**Open QR Feature:**
- Permanent QR code linked to unit
- No visitor name required
- Shows unit number at gate
- For close friends/family

### 4.6 Security Operations

**Watchlists:**
- Person watchlist (name, ID, phone)
- Vehicle watchlist (plate number) — future
- Hard stop at gate on match
- Automatic incident creation
- Role-gated management

**Incidents:**
- Guard-reported incidents
- Linked to scans and gates
- Status workflow: Under Review → Resolved/Escalated
- Photo attachments
- Audit trail

**Guard Accountability:**
- Shift tracking
- Scans per shift/operator
- Override rate per operator
- Incident rate per gate/shift

**Visitor Identity Levels:**
| Level | Description | Use Case |
|-------|-------------|----------|
| 0 | Name + phone only | Low-risk guests |
| 1 | ID photo capture | Contractors, vendors |
| 2 | ID OCR + matching | High-security facilities |

**ID Capture:**
- Front/back photo capture
- Stored with scan log
- Configurable per org/gate
- Respects retention policies

### 4.7 Real-Time Updates

**Server-Sent Events (SSE):**
- Live updates across dashboard
- Stateless, DB-polling based
- Works on Vercel serverless
- Org-scoped event stream

**Event Types:**
- `QR_CREATED` — new QR code
- `QR_UPDATED` — QR modified
- `QR_DELETED` — QR removed
- `SCAN_RECORDED` — new scan
- `CONTACT_CREATED` — new contact
- `CONTACT_UPDATED` — contact modified
- `VISITOR_QR_CREATED` — resident created visitor QR
- `VISITOR_QR_DELETED` — visitor QR removed

**Implementation:**
- `EventLog` model (append-only)
- 24-hour TTL (auto-pruned)
- `/api/events/stream` endpoint
- TanStack Query invalidation
- Fallback polling for reliability

**Push Notifications:**
- Expo Push for mobile apps
- Scan notifications to residents
- Arrival notifications (future)
- Configurable per user

### 4.8 Projects & Multi-Project Support

**Project Features:**
- Sub-grouping within organization
- Project-specific gates
- Project-specific QR codes
- Project-specific units
- Gallery and branding per project

**Gate Modes:**
- **SINGLE** — one primary gate
- **MULTI** — multiple gates (default)

**Use Cases:**
- Real estate developers with multiple compounds
- Event organizers with multiple venues
- Schools with multiple campuses

### 4.9 Contacts & CRM

**Contact Management:**
- Full CRM for visitors
- Contact fields: name, phone, email, company, job title
- Birthday tracking
- Avatar upload
- Notes field
- Source tracking (manual, import, QR scan, referral)

**Contact-Unit Linking:**
- Many-to-many relationship
- Track which units a contact visits
- Resident relationship management

**Tags:**
- Custom tags per organization
- Color-coded
- Multi-tag support
- Filter contacts by tags

### 4.10 Analytics & Reporting

**Dashboard Analytics:**
- Real-time scan monitoring
- Scans by status (success/failed/expired)
- Scans by gate
- Scans by time period
- Top visitors
- Busiest gates
- Resident engagement metrics

**Charts:**
- Line charts (time series)
- Bar charts (comparisons)
- Pie charts (distributions)
- Stats cards (KPIs)

**Exports:**
- CSV export
- PDF reports (future)
- Date range filtering
- Gate filtering
- Project filtering

### 4.11 Webhooks & API

**Webhook Events:**
- `QR_CREATED`
- `QR_SCANNED`
- `QR_REVOKED`
- `QR_EXPIRED`
- `SCAN_SUCCESS`
- `SCAN_FAILED`

**Webhook Features:**
- HMAC signature verification
- Retry logic with exponential backoff
- Delivery status tracking
- Event filtering
- Active/inactive toggle

**API Keys:**
- SHA-256 hashed storage
- Scoped permissions:
  - `QR_CREATE`
  - `QR_READ`
  - `QR_VALIDATE`
  - `SCANS_READ`
  - `ANALYTICS_READ`
  - `WEBHOOK_WRITE`
- Last used tracking
- Expiry dates
- Key prefix for identification

**Admin Authorization Keys:**
- Platform-level keys
- Types: ADMIN, SERVICE
- Cross-org access
- Separate from tenant API keys

### 4.12 Privacy & Data Retention

**Configurable Retention:**
- Scan logs retention (months)
- Visitor history retention (months)
- ID artifact retention (months)
- Incident retention (months)
- Null = keep indefinitely

**Privacy Controls:**
- Mask resident name on landing page
- Show/hide unit on landing page
- Configurable per organization

**Data Deletion:**
- Soft deletes for audit trail
- Hard deletes for GDPR compliance (future)
- Automatic pruning based on retention policies

---

## 5. Technical Architecture

### 5.1 Tech Stack

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
| Real-time           | Server-Sent Events (SSE) | —       |
| Push Notifications  | Expo Push                | Latest  |

### 5.2 Monorepo Structure

```
Gate-Access/
├── apps/
│   ├── admin-dashboard/      # Super admin panel (Next.js)
│   ├── client-dashboard/     # Main SaaS portal (Next.js)
│   ├── scanner-app/          # Mobile scanner (Expo)
│   ├── marketing/            # Public website (Next.js)
│   ├── resident-portal/      # Resident web portal (Next.js)
│   └── resident-mobile/      # Resident mobile app (Expo)
├── packages/
│   ├── db/                   # Prisma schema & client
│   ├── types/                # Shared TypeScript types
│   ├── ui/                   # UI component library
│   ├── api-client/           # Fetch utilities
│   ├── i18n/                 # AR/EN translations
│   └── config/               # ESLint, TSConfig, Tailwind
└── docs/                     # Documentation
```

### 5.3 Database Schema

**Core Models (25 total):**
1. `Organization` — multi-tenant root
2. `Project` — sub-grouping
3. `Role` — RBAC roles
4. `User` — authentication
5. `Invitation` — user invitations
6. `Gate` — access points
7. `GateAssignment` — user-gate mapping
8. `QRCode` — access codes
9. `ScanLog` — audit trail
10. `VisitorQR` — resident-created QRs
11. `AccessRule` — time-based access
12. `Unit` — residential units
13. `Contact` — CRM contacts
14. `ContactUnit` — contact-unit linking
15. `Tag` — contact tags
16. `ContactTag` — contact-tag linking
17. `ResidentLimit` — quota config
18. `Watchlist` — security watchlist
19. `Incident` — security incidents
20. `ScanAttachment` — ID photos
21. `Webhook` — webhook config
22. `WebhookDelivery` — delivery tracking
23. `ApiKey` — API keys
24. `AdminAuthorizationKey` — admin keys
25. `EventLog` — real-time events
26. `QrShortLink` — short URLs
27. `AuditLog` — audit trail
28. `RefreshToken` — token rotation
29. `Task` — task management
30. `ChatMessage` — chat messages

**Key Relationships:**
- Organization → Users, Gates, QRCodes, Projects, Units
- Project → Gates, QRCodes, Units
- User → Role, Organization, Unit, GateAssignments
- Gate → ScanLogs, QRCodes, GateAssignments, Incidents
- QRCode → ScanLogs, VisitorQR
- Unit → VisitorQRs, Contacts, User
- VisitorQR → QRCode, Unit, AccessRule

### 5.4 Security Architecture

**Authentication:**
- JWT tokens (HS256 algorithm)
- Access tokens: 15-minute expiry
- Refresh tokens: 30-day expiry
- Argon2id password hashing (t=3, m=65536, p=4)
- Token rotation on refresh

**Authorization:**
- Role-based access control (RBAC)
- Permission-based checks
- Multi-tenant isolation
- Row-level security

**Data Protection:**
- AES-256-GCM field encryption
- HMAC-SHA256 QR signing
- CSRF protection (double-submit cookie)
- Rate limiting (Upstash Redis)
- Soft deletes for audit trail

**Security Headers:**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Content-Security-Policy

### 5.5 API Architecture

**REST API:**
- `/api/*` — client dashboard
- `/api/admin/*` — admin dashboard
- `/api/resident/*` — resident portal
- `/api/events/stream` — SSE endpoint

**Authentication:**
- JWT Bearer tokens
- Cookie-based auth (web)
- SecureStore tokens (mobile)

**Rate Limiting:**
- Per-endpoint limits
- Redis-backed
- Multi-instance safe

**Error Handling:**
- Consistent error format
- HTTP status codes
- Error messages (no sensitive data)

### 5.6 Mobile Architecture

**Scanner App:**
- Expo SDK 54
- 5-tab interface
- Offline-first with encrypted queue
- Camera scanning with expo-camera
- Secure token storage with expo-secure-store

**Resident Mobile:**
- Expo SDK 54
- 3-tab interface
- Offline QR cache
- Push notifications with expo-notifications
- Contact picker with expo-contacts
- Share sheet with expo-sharing

### 5.7 Real-Time Architecture

**Server-Sent Events (SSE):**
- Stateless, DB-polling based
- 3-second poll interval
- 5-minute connection lifetime
- Automatic reconnection
- Org-scoped event stream

**Event Flow:**
1. Mutation occurs (QR created, scan recorded, etc.)
2. `emitEvent()` writes to `EventLog` table
3. SSE endpoint polls `EventLog` every 3s
4. Events pushed to connected clients
5. Client invalidates TanStack Query cache
6. UI updates automatically

**Fallback Polling:**
- TanStack Query `refetchInterval`
- 30-60 second intervals
- Ensures data freshness if SSE drops

### 5.8 Internationalization (i18n)

**Supported Languages:**
- English (EN)
- Arabic (AR-EG)

**Implementation:**
- `@gate-access/i18n` package
- JSON translation files
- RTL support for Arabic
- Dynamic locale switching
- Server-side rendering support

**Coverage:**
- All UI strings
- Error messages
- Email templates
- Push notifications

---

## 6. Data Models Reference

### 6.1 Organization Model

```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  logoUrl   String?
  domain    String?  @unique
  plan      Plan     @default(FREE)
  
  // Privacy & Retention
  requiredIdentityLevel     Int       @default(0)
  scanLogRetentionMonths    Int?
  visitorHistoryRetentionMonths Int?
  idArtifactRetentionMonths Int?
  incidentRetentionMonths   Int?
  maskResidentNameOnLandingPage Boolean @default(false)
  showUnitOnLandingPage     Boolean   @default(true)
  
  // Configuration
  scannerConfig             Json?
  integrationConfig         Json?
  notificationConfig        Json?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}
```

### 6.2 User Model

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String
  avatarUrl    String?
  bio          String?
  passwordHash String
  role         Role          @relation(fields: [roleId], references: [id])
  roleId       String
  organization Organization? @relation(fields: [organizationId], references: [id])
  organizationId String?
  preferences  Json?
  
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  deletedAt    DateTime?
}
```

### 6.3 Role Model

```prisma
model Role {
  id             String        @id @default(cuid())
  name           String
  description    String?
  permissions    Json          // Map of permission keys to booleans
  isBuiltIn      Boolean       @default(false)
  organization   Organization? @relation(fields: [organizationId], references: [id])
  organizationId String?
  
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

### 6.4 Gate Model

```prisma
model Gate {
  id           String        @id @default(cuid())
  name         String
  location     String?
  organization Organization @relation(fields: [organizationId], references: [id])
  organizationId String
  project      Project?      @relation(fields: [projectId], references: [id])
  projectId    String?
  isActive     Boolean       @default(true)
  
  // Location enforcement
  latitude             Float?
  longitude            Float?
  locationRadiusMeters Int?
  locationEnforced     Boolean?  @default(false)
  
  // Identity verification
  requiredIdentityLevel Int?
  
  lastAccessedAt DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  deletedAt    DateTime?
}
```

### 6.5 QRCode Model

```prisma
model QRCode {
  id           String        @id @default(cuid())
  code         String        @unique
  type         QRCodeType
  organization Organization @relation(fields: [organizationId], references: [id])
  organizationId String
  project      Project?      @relation(fields: [projectId], references: [id])
  projectId    String?
  gate         Gate?         @relation(fields: [gateId], references: [id])
  gateId       String?
  
  maxUses      Int?
  currentUses  Int           @default(0)
  expiresAt    DateTime?
  isActive     Boolean       @default(true)
  
  // Marketing
  utmCampaign  String?
  utmSource    String?
  
  // Guest info
  guestName    String?
  guestEmail   String?
  guestPhone   String?
  contactId    String?
  
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  deletedAt    DateTime?
}
```

### 6.6 Unit Model

```prisma
model Unit {
  id             String        @id @default(cuid())
  name           String        // Unit number
  type           UnitType
  sizeSqm        Int?
  qrQuota        Int?
  organization   Organization  @relation(fields: [organizationId], references: [id])
  organizationId String
  project        Project?      @relation(fields: [projectId], references: [id])
  projectId      String?
  building       String?
  
  // GPS for guest guide
  lat            Float?
  lng            Float?
  
  // Linked resident
  user           User?         @relation(fields: [userId], references: [id])
  userId         String?       @unique
  
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  deletedAt      DateTime?
}
```

### 6.7 VisitorQR Model

```prisma
model VisitorQR {
  id              String        @id @default(cuid())
  qrCode          QRCode        @relation(fields: [qrCodeId], references: [id])
  qrCodeId        String        @unique
  unit            Unit          @relation(fields: [unitId], references: [id])
  unitId          String
  
  visitorName     String?       // null for Open QR
  visitorPhone    String?
  visitorEmail    String?
  isOpenQR        Boolean       @default(false)
  
  accessRule      AccessRule?   @relation(fields: [accessRuleId], references: [id])
  accessRuleId    String?       @unique
  
  createdBy       String        // userId of resident
  createdAt       DateTime      @default(now())
}
```

### 6.8 AccessRule Model

```prisma
model AccessRule {
  id              String            @id @default(cuid())
  type            AccessRuleType    // ONETIME, DATERANGE, RECURRING, PERMANENT
  startDate       DateTime?
  endDate         DateTime?
  recurringDays   Int[]            // Days of week (0-6, Sunday=0)
  startTime       String?           // "09:00" format
  endTime         String?           // "22:00" format
}
```

### 6.9 EventLog Model

```prisma
model EventLog {
  id             String       @id @default(cuid())
  organization   Organization @relation(fields: [organizationId], references: [id])
  organizationId String
  type           EventType
  payload        Json         @default("{}")
  createdAt      DateTime     @default(now())
}
```

---

## 7. Implementation Status

### 7.1 Completed Features (~95%)

| Feature                              | Status      | Notes                                     |
| ------------------------------------ | ----------- | ----------------------------------------- |
| Organization CRUD                    | ✅ Complete | Multi-tenant architecture                 |
| JWT Auth (Argon2id + token rotation) | ✅ Complete | 15-min access, 30-day refresh             |
| Single QR Code Creation              | ✅ Complete | Individual visitor passes                 |
| Bulk CSV QR Creation                 | ✅ Complete | Batch generation                          |
| Gate Management                      | ✅ Complete | Physical access point CRUD                |
| Mobile Scanner (offline-capable)     | ✅ Complete | Expo app with AES-256 sync                |
| Scanner App - 5 Tabs                 | ✅ Complete | Scanner, Today, Log, Chat, Settings       |
| RBAC (roles + permissions)           | ✅ Complete | Built-in + custom roles                   |
| Gate Assignments                     | ✅ Complete | User-gate mapping with shifts             |
| Live Analytics Dashboard             | ✅ Complete | Real-time scan monitoring                 |
| Webhooks + API Keys                  | ✅ Complete | Event notifications + programmatic access |
| Admin - Authorization Keys           | ✅ Complete | Platform-wide auth key management         |
| CSRF Protection                      | ✅ Complete | Double-submit cookie pattern              |
| Rate Limiting                        | ✅ Complete | Upstash Redis                             |
| Field Encryption                     | ✅ Complete | AES-256 for webhook secrets               |
| QR Signing                           | ✅ Complete | HMAC-SHA256                               |
| Supervisor Override                  | ✅ Complete | PIN-based bypass in scanner               |
| Advanced Analytics                   | ✅ Complete | Charts and reporting                      |
| Admin Dashboard                      | ✅ Complete | Super-admin panel                         |
| Resident Portal (Web)                | ✅ Complete | Visitor pass management, quota, profile   |
| Marketing Site                       | ✅ Complete | Full platform marketing                   |
| Projects (Multi-project)             | ✅ Complete | Sub-grouping within organization          |
| Contacts (CRM)                       | ✅ Complete | Full contact management                   |
| Units (Resident Management)          | ✅ Complete | Unit-based resident system                |
| Watchlists                           | ✅ Complete | Security watchlist management             |
| Incidents                            | ✅ Complete | Incident tracking and resolution          |
| Visitor Identity Levels              | ✅ Complete | 0/1/2 identity verification               |
| Privacy & Retention Controls         | ✅ Complete | Configurable data retention               |
| Real-time Updates (SSE)              | ✅ Complete | Live dashboard updates                    |

### 7.2 In Progress (~5%)

| Feature             | Status     | Notes                          |
| ------------------- | ---------- | ------------------------------ |
| Resident Mobile App | 🔄 60%     | Contact picker, share, push    |
| Marketing Suite     | 🔄 50%     | Pixels, UTM, CRM integration   |
| Blog/Case Studies   | 🔄 40%     | Content creation               |

### 7.3 Planned Features

| Feature                        | Priority | Target    |
| ------------------------------ | -------- | --------- |
| GPS Guide for Guest            | P1       | Q3 2026   |
| Arrival Notification           | P1       | Q3 2026   |
| Quota Widget                   | P2       | Q3 2026   |
| Who Visited Today              | P2       | Q3 2026   |
| One-tap Share                  | P2       | Q3 2026   |
| WhatsApp/Omni-channel Delivery | P2       | Q4 2026   |
| LPR Integration                | P2       | Q4 2026   |
| Stripe Real Integration        | P2       | Q4 2026   |
| MFA for Admin                  | P3       | 2027      |

---

## 8. Roadmap

### Phase 1: MVP (✅ Complete)

**Status:** 95% Complete

**Deliverables:**
- Core platform infrastructure
- Client Dashboard
- Admin Dashboard
- Scanner App (offline-capable)
- Marketing Site
- Security features (JWT, RBAC, encryption)
- Resident Portal (web)

### Phase 2: Resident Mobile & Real-time (🔄 In Progress)

**Status:** 60% Complete

**Target:** Q2 2026

**Deliverables:**
- Resident Mobile App (iOS/Android)
- Contact picker & share sheet
- Push notifications (scan events)
- Real-time updates (SSE)
- GPS guide for guests
- Arrival notifications

### Phase 3: Marketing Suite (📋 Planned)

**Target:** Q3-Q4 2026

**Deliverables:**
- WhatsApp integration
- SMS delivery
- Meta Pixel / GA4 tracking
- UTM-powered visitor profiling
- CRM webhook sync
- Campaign analytics

### Phase 4: Advanced Features (📋 Planned)

**Target:** 2027

**Deliverables:**
- License Plate Recognition (LPR)
- Hardware integration (barriers, turnstiles)
- Advanced reporting
- Compliance features
- Multi-language support (beyond EN/AR)

---

## 9. Security & Compliance

### 9.1 Security Features

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
| QR code signing                    | ✅     | HMAC-SHA256                                     |
| Resident privacy controls          | ✅     | Masking options, visibility toggles             |
| Data retention per tenant          | ✅     | Configurable retention windows                  |
| Visitor identity verification      | ✅     | 3-level system (0/1/2)                          |
| Watchlists                         | ✅     | Person and vehicle (future)                     |
| Incident tracking                  | ✅     | Full workflow                                   |
| Data residency                     | ❌     | Not implemented                                 |
| Immutable logs                     | ❌     | Not implemented                                 |

### 9.2 Compliance

**GDPR Considerations:**
- Data retention policies
- Right to be forgotten (soft deletes)
- Data export capabilities
- Privacy controls

**Audit Trail:**
- All mutations logged
- User attribution
- Timestamp tracking
- Immutable scan logs

**Data Protection:**
- Encryption at rest (field-level)
- Encryption in transit (HTTPS)
- Secure token storage
- Password hashing

---

## 10. Pricing Tiers

| Tier       | QR/month  | Team      | Features       | Price (EGP) |
| ---------- | --------- | --------- | -------------- | ----------- |
| Starter    | 5,000     | 3         | Basic          | 499–799     |
| Pro        | 50,000    | 10        | Full + export  | 1,999–2,999 |
| Enterprise | Unlimited | Unlimited | Advanced + SLA | 5k–30k+     |

**Feature Comparison:**

| Feature                  | Starter | Pro | Enterprise |
| ------------------------ | ------- | --- | ---------- |
| QR Codes                 | 5,000   | 50k | Unlimited  |
| Team Members             | 3       | 10  | Unlimited  |
| Gates                    | 3       | 10  | Unlimited  |
| Projects                 | 1       | 5   | Unlimited  |
| Analytics                | Basic   | ✅  | ✅         |
| Webhooks                 | ❌      | ✅  | ✅         |
| API Access               | ❌      | ✅  | ✅         |
| Custom Roles             | ❌      | ✅  | ✅         |
| Watchlists               | ❌      | ✅  | ✅         |
| Incidents                | ❌      | ✅  | ✅         |
| Resident Portal          | ❌      | ✅  | ✅         |
| Priority Support         | ❌      | ❌  | ✅         |
| SLA                      | ❌      | ❌  | ✅         |
| Dedicated Account Manager| ❌      | ❌  | ✅         |

---

## 11. API Reference

### 11.1 API Endpoints

**Client Dashboard API (`/api/*`):**

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/login` | POST | User login | Public |
| `/api/auth/refresh` | POST | Refresh token | Public |
| `/api/auth/logout` | POST | User logout | JWT |
| `/api/organizations` | GET | List organizations | JWT |
| `/api/organizations/:id` | GET | Get organization | JWT |
| `/api/organizations/:id` | PATCH | Update organization | JWT |
| `/api/gates` | GET | List gates | JWT |
| `/api/gates` | POST | Create gate | JWT |
| `/api/gates/:id` | GET | Get gate | JWT |
| `/api/gates/:id` | PATCH | Update gate | JWT |
| `/api/gates/:id` | DELETE | Delete gate | JWT |
| `/api/qrcodes` | GET | List QR codes | JWT |
| `/api/qrcodes` | POST | Create QR code | JWT |
| `/api/qrcodes/bulk` | POST | Bulk create QR codes | JWT |
| `/api/qrcodes/:id` | GET | Get QR code | JWT |
| `/api/qrcodes/:id` | PATCH | Update QR code | JWT |
| `/api/qrcodes/:id` | DELETE | Delete QR code | JWT |
| `/api/qrcodes/validate` | POST | Validate QR code | JWT |
| `/api/scans` | GET | List scans | JWT |
| `/api/scans/:id` | GET | Get scan | JWT |
| `/api/analytics/summary` | GET | Analytics summary | JWT |
| `/api/analytics/scans` | GET | Scan analytics | JWT |
| `/api/webhooks` | GET | List webhooks | JWT |
| `/api/webhooks` | POST | Create webhook | JWT |
| `/api/webhooks/:id` | PATCH | Update webhook | JWT |
| `/api/webhooks/:id` | DELETE | Delete webhook | JWT |
| `/api/api-keys` | GET | List API keys | JWT |
| `/api/api-keys` | POST | Create API key | JWT |
| `/api/api-keys/:id` | DELETE | Delete API key | JWT |
| `/api/projects` | GET | List projects | JWT |
| `/api/projects` | POST | Create project | JWT |
| `/api/projects/:id` | PATCH | Update project | JWT |
| `/api/projects/:id` | DELETE | Delete project | JWT |
| `/api/contacts` | GET | List contacts | JWT |
| `/api/contacts` | POST | Create contact | JWT |
| `/api/contacts/:id` | PATCH | Update contact | JWT |
| `/api/contacts/:id` | DELETE | Delete contact | JWT |
| `/api/units` | GET | List units | JWT |
| `/api/units` | POST | Create unit | JWT |
| `/api/units/:id` | PATCH | Update unit | JWT |
| `/api/units/:id` | DELETE | Delete unit | JWT |
| `/api/watchlist` | GET | List watchlist entries | JWT |
| `/api/watchlist` | POST | Create watchlist entry | JWT |
| `/api/watchlist/:id` | DELETE | Delete watchlist entry | JWT |
| `/api/incidents` | GET | List incidents | JWT |
| `/api/incidents` | POST | Create incident | JWT |
| `/api/incidents/:id` | PATCH | Update incident | JWT |
| `/api/roles` | GET | List roles | JWT |
| `/api/roles` | POST | Create custom role | JWT |
| `/api/roles/:id` | PATCH | Update role | JWT |
| `/api/roles/:id` | DELETE | Delete role | JWT |
| `/api/gate-assignments` | GET | List gate assignments | JWT |
| `/api/gate-assignments` | POST | Create gate assignment | JWT |
| `/api/gate-assignments/:id` | DELETE | Delete gate assignment | JWT |
| `/api/events/stream` | GET | SSE event stream | JWT |

**Resident API (`/api/resident/*`):**

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/resident/me` | GET | Get resident profile | JWT (RESIDENT) |
| `/api/resident/visitors` | GET | List visitor QRs | JWT (RESIDENT) |
| `/api/resident/visitors` | POST | Create visitor QR | JWT (RESIDENT) |
| `/api/resident/visitors/:id` | DELETE | Delete visitor QR | JWT (RESIDENT) |
| `/api/resident/history` | GET | Visitor history | JWT (RESIDENT) |
| `/api/resident/quota` | GET | Quota status | JWT (RESIDENT) |

**Admin API (`/api/admin/*`):**

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/admin/organizations` | GET | List all organizations | JWT (ADMIN) |
| `/api/admin/organizations/:id` | PATCH | Update organization | JWT (ADMIN) |
| `/api/admin/users` | GET | List all users | JWT (ADMIN) |
| `/api/admin/users/:id` | PATCH | Update user | JWT (ADMIN) |
| `/api/admin/analytics` | GET | Platform analytics | JWT (ADMIN) |
| `/api/admin/auth-keys` | GET | List auth keys | JWT (ADMIN) |
| `/api/admin/auth-keys` | POST | Create auth key | JWT (ADMIN) |
| `/api/admin/auth-keys/:id` | DELETE | Delete auth key | JWT (ADMIN) |

### 11.2 Authentication

**JWT Token Structure:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "TENANT_ADMIN",
  "orgId": "org_id",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Token Lifecycle:**
1. Login → Access token (15 min) + Refresh token (30 days)
2. Access token expires → Use refresh token
3. Refresh → New access token + New refresh token
4. Logout → Revoke refresh token

**Mobile Token Storage:**
- Scanner: `expo-secure-store`
- Resident: `expo-secure-store`

### 11.3 Webhook Payload Examples

**QR Created:**
```json
{
  "event": "QR_CREATED",
  "timestamp": "2026-03-12T13:35:37.190Z",
  "data": {
    "id": "qr_123",
    "code": "GF-ABC123",
    "type": "SINGLE",
    "guestName": "Ahmed Hassan",
    "guestPhone": "+201234567890",
    "expiresAt": "2026-03-13T13:35:37.190Z",
    "organizationId": "org_123"
  }
}
```

**Scan Success:**
```json
{
  "event": "SCAN_SUCCESS",
  "timestamp": "2026-03-12T14:00:00.000Z",
  "data": {
    "scanId": "scan_456",
    "qrCodeId": "qr_123",
    "gateId": "gate_789",
    "gateName": "Main Gate",
    "guestName": "Ahmed Hassan",
    "scannedAt": "2026-03-12T14:00:00.000Z",
    "organizationId": "org_123"
  }
}
```

### 11.4 Error Responses

**Standard Error Format:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
- `UNAUTHORIZED` — 401
- `FORBIDDEN` — 403
- `NOT_FOUND` — 404
- `VALIDATION_ERROR` — 400
- `RATE_LIMIT_EXCEEDED` — 429
- `INTERNAL_ERROR` — 500

---

## 12. Development Guide

### 12.1 Getting Started

**Prerequisites:**
- Node.js 20+
- pnpm 8+
- PostgreSQL 15+

**Setup:**
```bash
# Clone repository
git clone https://github.com/iDorgham/Gate-Access.git
cd Gate-Access

# Install dependencies
pnpm install

# Setup database
cd packages/db
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev
npx prisma db seed

# Start all apps
cd ../..
pnpm turbo dev
```

**Development Ports:**
- Marketing: 3000
- Client Dashboard: 3001
- Admin Dashboard: 3002
- Resident Portal: 3003
- Scanner App: 8081
- Resident Mobile: 8083

### 12.2 Environment Variables

**Required for all apps:**
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
NEXTAUTH_SECRET="..."
QR_SIGNING_SECRET="..."
ENCRYPTION_MASTER_KEY="..."
```

**Optional:**
```bash
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
RESEND_API_KEY="..."
EXPO_PUBLIC_API_URL="..."
```

### 12.3 Common Commands

```bash
# Development
pnpm turbo dev                    # Start all apps
pnpm turbo dev --filter=client-dashboard  # Start single app

# Build
pnpm turbo build                  # Build all apps
pnpm turbo build --filter=marketing       # Build single app

# Database
cd packages/db
npx prisma migrate dev            # Create migration
npx prisma db push                # Push schema (dev only)
npx prisma generate               # Generate client
npx prisma studio                 # Open Prisma Studio

# Testing
pnpm turbo test                   # Run all tests
pnpm turbo test --filter=client-dashboard # Test single app

# Linting
pnpm turbo lint                   # Lint all apps
pnpm turbo typecheck              # Type check all apps
```

### 12.4 Code Conventions

**Multi-Tenancy:**
```typescript
// ✅ CORRECT
const gates = await prisma.gate.findMany({
  where: {
    organizationId: user.orgId,
    deletedAt: null
  }
});

// ❌ WRONG
const gates = await prisma.gate.findMany();
```

**Soft Deletes:**
```typescript
// ✅ CORRECT
await prisma.gate.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// ❌ WRONG
await prisma.gate.delete({ where: { id } });
```

**Imports:**
```typescript
// ✅ CORRECT
import { prisma } from '@gate-access/db';
import { Button } from '@gate-access/ui';

// ❌ WRONG
import { prisma } from '../../../packages/db';
```

---

## 13. Deployment

### 13.1 Vercel Deployment

**Apps:**
- Marketing → Vercel
- Client Dashboard → Vercel
- Admin Dashboard → Vercel
- Resident Portal → Vercel

**Configuration:**
```json
{
  "buildCommand": "pnpm turbo build --filter=client-dashboard",
  "outputDirectory": "apps/client-dashboard/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### 13.2 Mobile Deployment

**Scanner App:**
```bash
cd apps/scanner-app
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
```

**Resident Mobile:**
```bash
cd apps/resident-mobile
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
```

### 13.3 Database

**Production:**
- PostgreSQL 15+ (managed service recommended)
- Connection pooling enabled
- Automated backups
- Point-in-time recovery

**Migrations:**
```bash
cd packages/db
npx prisma migrate deploy
```

---

## 14. Testing Strategy

### 14.1 Unit Tests

**Coverage Target:** 80%+

**Test Files:** `*.test.ts` or `*.test.tsx`

**Example:**
```typescript
import { describe, it, expect } from '@jest/globals';
import { validateQRCode } from './qr-validation';

describe('validateQRCode', () => {
  it('should validate correct QR code', () => {
    const result = validateQRCode('GF-ABC123');
    expect(result.valid).toBe(true);
  });

  it('should reject expired QR code', () => {
    const result = validateQRCode('GF-EXPIRED');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('EXPIRED');
  });
});
```

### 14.2 Integration Tests

**API Route Testing:**
```typescript
import { POST } from './route';

describe('POST /api/qrcodes', () => {
  it('should create QR code', async () => {
    const request = new Request('http://localhost/api/qrcodes', {
      method: 'POST',
      body: JSON.stringify({
        type: 'SINGLE',
        guestName: 'Test User'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

### 14.3 E2E Tests

**Playwright (Future):**
- User flows
- Critical paths
- Cross-browser testing

---

## 15. Monitoring & Observability

### 15.1 Metrics

**Key Metrics:**
- Scan success rate
- API response time
- Error rate
- Active users
- QR codes created
- Scans per day

### 15.2 Logging

**Log Levels:**
- ERROR — Critical errors
- WARN — Warnings
- INFO — Important events
- DEBUG — Detailed debugging

**Structured Logging:**
```typescript
logger.info('QR code created', {
  qrCodeId: 'qr_123',
  organizationId: 'org_123',
  type: 'SINGLE'
});
```

### 15.3 Alerts

**Alert Conditions:**
- Error rate > 5%
- API response time > 2s
- Database connection failures
- Webhook delivery failures

---

## 16. Support & Documentation

### 16.1 Documentation

**User Guides:**
- Getting Started
- Creating QR Codes
- Managing Gates
- Scanner Operations
- Resident Portal Guide

**Developer Docs:**
- API Reference
- Webhook Integration
- Authentication Guide
- Database Schema

### 16.2 Support Channels

**Tiers:**
- **Starter:** Email support (48h response)
- **Pro:** Email + Chat support (24h response)
- **Enterprise:** Priority support + Dedicated account manager (4h response)

---

## 17. References

### 17.1 Previous Versions

- **PRD v6.0** — `docs/PRD_v7.0.md`
- **PRD v5.0** — `docs/plan/phase-1-mvp/specs/PRD_v5.0.md`

### 17.2 Related Documents

- **Architecture** — `docs/guides/ARCHITECTURE.md`
- **Security Overview** — `docs/guides/SECURITY_OVERVIEW.md`
- **Development Guide** — `docs/guides/DEVELOPMENT_GUIDE.md`
- **Scanner Operations** — `docs/guides/SCANNER_OPERATIONS.md`
- **Resident Experience** — `docs/guides/RESIDENT_EXPERIENCE.md`

### 17.3 Planning Documents

- **Real-time Updates Plan** — `docs/plan/execution/PLAN_realtime_updates.md`
- **Marketing Website Plan** — `docs/plan/execution/PLAN_marketing_website.md`
- **Resident Mobile Plan** — `docs/plan/execution/PLAN_resident_mobile.md`

---

## 18. Changelog

### v7.0 (March 2026)

**Major Updates:**
- ✅ Real-time updates via SSE
- ✅ Resident mobile app (60% complete)
- ✅ Marketing website (90% complete)
- ✅ Watchlists and incidents
- ✅ Visitor identity levels
- ✅ Privacy and retention controls
- ✅ Gate assignments with shifts
- ✅ Custom roles
- ✅ Projects (multi-project support)
- ✅ Contacts (CRM)
- ✅ Units (resident management)
- ✅ Admin authorization keys

**Breaking Changes:**
- None

**Deprecations:**
- None

### v6.0 (February 2026)

**Major Updates:**
- Resident portal (web)
- Supervisor override
- Advanced analytics
- Admin dashboard completion

### v5.0 (January 2026)

**Major Updates:**
- MVP completion
- Scanner app (5 tabs)
- Core security features

---

**Document Version:** 7.0  
**Last Updated:** March 12, 2026  
**Next Review:** April 2026  
**Status:** Living Document

---

<p align="center">
  <strong>GateFlow — Zero-Trust Digital Gate Infrastructure Platform</strong><br>
  Built with ❤️ for secure physical spaces in the MENA region.
</p>
