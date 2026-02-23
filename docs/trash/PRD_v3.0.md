# GateFlow — Product Requirements Document v3.0

**Product Name:** GateFlow (working title)  
**Version:** 3.0 (Consolidated Technical PRD)  
**Author:** Founder + Engineering Team  
**Target Markets:** Egypt & Gulf (MENA gated compounds, real-estate developers, private schools, beach clubs, marinas, wedding venues, nightclubs, corporate events)  
**Business Model:** B2B recurring SaaS (monthly/annual subscriptions) + per-event / per-scan hybrid options

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

| Persona | Role / Job-to-be-Done | Pain Points | Must-have Features |
|---------|----------------------|--------------|---------------------|
| Compound / School Manager | Owner / Admin | Security breaches, resident complaints, no logs | Bulk CSV, team RBAC, live dashboard, audit logs |
| Event Organizer | Project Manager | Gate chaos, VIP fraud, poor data | Per-event projects, bulk + manual QR, analytics export |
| Club / Venue Security Head | Gate Supervisor | Fake entries, operator abuse, no visibility | Live scan feed, operator management, override logs |
| Gate Operator / Bouncer | Gate Operator | Fast & reliable scanning | Offline-capable mobile app, vibration/sound, simple UI |
| Developer / Integrator | Developer | Easy CRM/booking sync | Full REST API, webhooks, API keys with scopes |
| Analytics / Marketing | Analytics Viewer | No data on attendance | Read-only analytics, exports, trends |

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
- Multi-tenant dashboard (organization → multiple projects)
- Bulk + single QR creation (CSV upload)
- Expiration, one-time / multi-use, role tags (VIP/guest/staff)
- Mobile scanner app (iOS + Android) — offline mode + sync
- Live dashboard + basic analytics (scans, pending, rejected)
- RBAC with core roles + permissions
- Basic API (create QR, verify, list scans) + webhooks
- Immutable audit logs
- Email delivery of QR

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
- Org: billing, team, API keys, webhooks, settings
- Project: compound / event / club instance — name, dates, location, status

### 5.2 QR Engine
- Single & bulk creation (CSV: name, phone, email, role, notes, expiry)
- Signed/encrypted payload
- Types: one-time, multi-use (limit), permanent, date-range
- Resend, revoke, extend expiry

### 5.3 Mobile Scanner App
- Login → device registration
- Camera scan → instant local check + optimistic result
- Offline queue + auto-sync
- Feedback: green/red/yellow + sound/vibration
- Supervisor override flow

### 5.4 Offline Sync Details

#### Architecture
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

#### Encryption (Current Implementation)
- **Algorithm:** AES-256 via crypto-js
- **Key Derivation:** SHA-256 hash of JWT token (PLACEHOLDER — TODO: PBKDF2)
- **Key Storage:** expo-secure-store
- **TODO:** Add salt, key rotation, proper PBKDF2

#### Conflict Resolution: Last-Write-Wins (LWW)
```
For each incoming scan:
  1. Lookup existing ScanLog by qrCode
  2. Compare scannedAt timestamps
  3. If incoming newer → update existing record
  4. If existing newer → mark as conflicted
  5. If no existing → create new record
```

#### Audit Notes
```json
{
  "action": "sync_resolve",
  "strategy": "lww",
  "timestampsCompared": { "existing": "...", "incoming": "..." }
}
```

#### Retry Logic
| Retry | Delay |
|-------|-------|
| 1 | Immediate |
| 2 | 5s |
| 3 | 30s |
| 4 | 2min |
| 5 | 5min |
| 6+ | 10min |

Max retries: 10

#### Known TODOs
- [ ] PBKDF2 key derivation (replace SHA-256 placeholder)
- [ ] Salt for key derivation
- [ ] Key rotation mechanism
- [ ] Structured audit table (replace JSON field)
- [ ] Offline validation (cache gate/QR status)
- [ ] CRDT conflict resolution

### 5.5 Access Validation Engine
- Server-side: signature, expiry, usage, project match, revocation
- Fraud signals: duplicate in short time, cross-gate, operator override rate

### 5.6 RBAC & Permissions
- Atomic permissions by scope: organization / project / device
- Default roles: Owner, Admin, Developer, Analytics, Project Manager, Gate Supervisor, Gate Operator

### 5.7 Analytics & Live Dashboard
- Real-time: current gate activity, pending, rejected
- Historical: total created/scanned, peak hours, per-role breakdown
- Exports: CSV/PDF

### 5.8 API & Integrations
- REST: /qr/create, /qr/bulk, /qr/verify, /scans, /analytics
- Webhooks: qr.scanned, qr.created, qr.revoked, qr.expired

---

## 6. Data Models

### 6.1 Core Entities

#### Organization
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| name | String | Organization name |
| email | String | Unique |
| domain | String? | Unique, nullable |
| plan | Enum (FREE/PRO/ENTERPRISE) | Subscription tier |
| createdAt | DateTime | |
| updatedAt | DateTime | |
| deletedAt | DateTime? | Soft delete |

#### User
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| email | String | Unique |
| name | String | |
| passwordHash | String | Argon2id |
| role | Enum (ADMIN/TENANT_ADMIN/TENANT_USER/VISITOR) | |
| organizationId | String? | FK to Organization |
| createdAt | DateTime | |
| updatedAt | DateTime | |
| deletedAt | DateTime? | Soft delete |

#### Gate
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| name | String | Gate name |
| location | String | Physical location |
| organizationId | String | FK to Organization |
| isActive | Boolean | Default true |
| lastAccessedAt | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |
| deletedAt | DateTime? | Soft delete |

#### QRCode
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| code | String | Unique, the actual QR content |
| type | Enum (SINGLE/RECURRING/PERMANENT) | Usage type |
| organizationId | String | FK to Organization |
| gateId | String? | Optional FK to Gate |
| maxUses | Int? | For RECURRING type |
| currentUses | Int | Default 0 |
| expiresAt | DateTime? | Optional expiration |
| isActive | Boolean | Default true |
| createdAt | DateTime | |
| updatedAt | DateTime | |
| deletedAt | DateTime? | Soft delete |

#### ScanLog
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| status | Enum (SUCCESS/FAILED/EXPIRED/MAX_USES_REACHED/INACTIVE) | |
| scannedAt | DateTime | |
| userId | String? | FK to User (scanner) |
| gateId | String | FK to Gate |
| qrCodeId | String | FK to QRCode |
| auditNotes | JSON? | Sync resolution notes |

### 6.2 Indexes
```prisma
@@index([organizationId])
@@index([deletedAt])
@@index([gateId])
@@index([qrCodeId])
@@index([userId])
@@index([scannedAt])
```

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | < 400ms gate validation (online), < 1s sync after offline |
| Scalability | 10k concurrent scans/hour (large event), 1M+ scans/month |
| Availability | 99.9% uptime (SLA enterprise tier) |
| Security | OWASP Top 10, Zero-Trust, audit trail, rate limiting, encryption at rest & transit |
| Multi-tenancy | Strict isolation (row-level), no cross-tenant leakage |
| Mobile | iOS 15+ / Android 9+, offline-first |
| Data Residency | Egypt / KSA / UAE options (enterprise) |

### Security Requirements
- **Zero-Trust:** Never trust network/device/role alone
- **Encryption at Rest:** AES-256 for sensitive fields
- **Encryption in Transit:** TLS 1.3
- **Password Hashing:** Argon2id (t=3, m=65536, p=4)
- **Audit Logs:** Immutable with hash chain
- **Rate Limiting:** 100 req/min per IP, 1000 req/min authenticated

---

## 8. MVP Prioritization

### Must-Have (Ship to first 10–20 beta clients)
1. Org + project creation
2. Bulk QR + CSV
3. Mobile scanner (offline)
4. Basic RBAC (Owner/Admin/Gate Operator)
5. Live dashboard + scan logs
6. Email QR delivery
7. Basic audit

### Phase 1.5 Polish
- API + webhooks
- WordPress plugin
- Advanced RBAC
- Fraud rules

### Metrics to Track
- Activation: % orgs with ≥1 project & ≥100 QR in first 14 days
- Retention: % paying after month 2
- Usage: scans / org / month
- Security incidents: zero critical (target)

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| QR forgery / screenshot sharing | Signed payload + fraud rules |
| Offline scan conflicts / double entry | Server authoritative + LWW + audit |
| Operator abuse (fake approvals) | Override logging + rate alerts |
| Slow gate experience | Offline-first + edge caching |
| Regulatory / privacy | Compliance mode + data residency |

---

## 10. Pricing Tiers

| Tier | QR / month | Team members | API/Webhooks | Analytics | Price (EGP/month) |
|------|------------|--------------|--------------|-----------|-------------------|
| Starter | 5,000 | 3 | No | Basic | ~499–799 |
| Pro | 50,000 | 10 | Yes | Full + export | ~1,999–2,999 |
| Enterprise | Unlimited | Unlimited | Yes + SLA | Advanced + compliance | Custom (5k–30k+) |

Add-ons: SMS delivery, white-label, dedicated support.

---

## 11. Technical Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Mobile:** Expo / React Native
- **Database:** PostgreSQL + Prisma
- **Package Manager:** pnpm
- **Build System:** Turborepo
- **UI Components:** shadcn/ui style shared package

---

**This PRD is the single source of truth for implementation.**
