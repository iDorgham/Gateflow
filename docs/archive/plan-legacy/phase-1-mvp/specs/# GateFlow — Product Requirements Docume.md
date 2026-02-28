# GateFlow — Product Requirements Document v6.0
## "Marketing-First Access Infrastructure"

> **Document Status**: Planning Draft | **Version**: 6.0  
> **Owner**: Product Leadership + Engineering + Marketing  
> **Target Launch**: Q3 2026 (Phase 2) | **Next Review**: Post-Alignment Workshop  
> **Scope**: Documentation-only planning artifact. No code, no prompts.

---

## 1. Executive Summary

### 1.1 Problem Statement
Physical access control systems today operate in isolation from marketing and business intelligence. Real estate developers, gated compounds, and event venues lose critical revenue opportunities because:
- **No attribution**: Cannot link digital ad spend to physical gate visits
- **Fragmented workflows**: Residents must call management for every guest invitation
- **Blind analytics**: Security logs exist but aren't actionable for growth teams
- **Regional gaps**: Global tools lack MENA-specific localization, compliance, and payment support

### 1.2 Product Vision
GateFlow is the **Zero-Trust Digital Gate Infrastructure Platform** that uniquely combines **physical access control** with **marketing intelligence**. We don't just secure gates—we turn every entry into a data point, every visitor into a lead, and every compound into a smart marketing channel.

> **New Tagline**: *"Where Security Meets Growth"*

### 1.3 Goals & Objectives (Q3-Q4 2026)

| Objective | Success Metric | Target | Measurement Method |
|-----------|---------------|--------|-------------------|
| **Launch Resident Portal MVP** | 40% of eligible units activate within 30 days | 40% adoption | Portal analytics + tenant surveys |
| **Enable Marketing Attribution** | 60% of Pro+ tenants configure ≥1 tracking pixel | 60% adoption | Admin dashboard telemetry |
| **Differentiate in Brokerage Segment** | Win ≥50% of deals where marketing features are evaluated | 50% win rate | CRM deal tracking |
| **Achieve Enterprise-Grade Security** | 0 critical security bugs post-launch; <2s QR validation latency | Zero critical bugs | Security audits + performance monitoring |
| **Drive Expansion Revenue** | 25% of Starter → Pro upgrades driven by marketing suite | 25% conversion | Billing analytics + cohort analysis |

### 1.4 Out of Scope (v6.0)
- Native mobile app for residents (Phase 3, 2027)
- Facial recognition / biometric gate triggers (Phase 3)
- White-label custom domains per tenant (Phase 3)
- SMS gateway integration beyond WhatsApp/email deep links (Phase 3)
- Automated compliance report generation (AI feature, Phase 3)

---

## 2. User Personas & Use Cases

### 2.1 Primary Personas (Prioritized)

| Persona | Role | Primary Job-to-be-Done | Key Pain Points |
|---------|------|----------------------|----------------|
| **Real Estate Marketing Manager** | Manages campaigns for compound/unit sales | "I need to know which marketing channels drive physical visits, and retarget visitors who showed interest" | No link between digital ads and gate scans; can't attribute foot traffic to campaigns; no visitor segmentation |
| **Property Manager** | Oversees compound security & resident experience | "I need to reduce admin burden while maintaining security and resident satisfaction" | Manual guest list management; resident complaints about access; no audit trail for disputes |
| **Resident (Unit Owner/Renter)** | Lives in gated compound | "I want to invite guests without calling management, and give permanent access to family" | Must contact management for every guest; no visibility into visitor history; complicated process for recurring visitors |
| **Brokerage Owner / Developer** | Owns multiple compounds/projects | "I need to separate marketing performance by project, owner, and campaign—and retarget high-intent visitors" | Blended analytics across properties; no visitor-level retargeting; manual campaign reporting |
| **Security Head / Gate Supervisor** | Manages gate operations | "I need real-time visibility into gate activity and tools to prevent fraud or abuse" | Fake entries; operator errors; no live dashboard for incident response |

### 2.2 Key Use Cases (Prioritized)

| Use Case | Persona | Flow Summary | Success Criteria |
|----------|---------|--------------|-----------------|
| **Resident creates visitor QR via mobile** | Resident | Resident logs into portal → selects "Add Visitor" → enters guest details → shares UTM-tagged link via WhatsApp → guest scans at gate | QR created in <30s; link shared successfully; gate scan validates in <2s |
| **Marketing Manager attributes campaign to gate visit** | Marketing Manager | Creates campaign with UTM parameters → shares trackable link → visitor scans at gate → analytics dashboard shows source attribution | UTM parameters persist through landing page to scan log; attribution visible in dashboard within 5min |
| **Brokerage Owner compares project performance** | Brokerage Owner | Logs into admin dashboard → selects "Brokerage View" → filters by project/owner → views visitor volume, conversion rates, ROI | Data loads in <3s; filters work accurately; export to CSV/PDF available |
| **Security Supervisor overrides failed scan** | Security Head | Scanner shows "Invalid QR" → Supervisor enters PIN + reason → override logged with audit trail → gate opens | Override completes in <10s; audit log includes timestamp, user, reason; no security bypass possible |
| **System detects anomalous scan pattern** | Platform (AI) | ML model analyzes scan logs → flags unusual pattern (e.g., 3 AM surge) → alert sent to security team + dashboard | False positive rate <5%; alert delivered within 1min of detection; actionable context included |

---

## 3. Functional Requirements

### 3.1 Core Platform Capabilities (MVP Hardening)

| ID | Requirement | Priority | Acceptance Criteria | Dependencies |
|----|-------------|----------|---------------------|-------------|
| FR-001 | **Fail-Closed Authentication**: System must reject any request missing valid JWT or QR signature; no fallback defaults | P0 (Critical) | - Missing JWT returns 401 with safe error message<br>- Empty `QR_SIGNING_SECRET` causes startup failure<br>- No "undefined" secret fallbacks in logs | Auth service, env validation |
| FR-002 | **Cryptographic QR Signing**: Replace `Math.random()` with `crypto.randomUUID()` for `scanUuid` and all QR payloads | P0 | - All new QR codes use UUID v4<br>- Scanner validation rejects non-UUID scanUuids<br>- Audit logs show UUID format | QR generation service, scanner app |
| FR-003 | **CSV Injection Protection**: Escape `= + - @` and control characters on all data exports | P0 | - Exported CSV files open safely in Excel/Sheets<br>- No formula execution possible<br>- Test suite includes injection attack vectors | Export service, client-dashboard |
| FR-004 | **Project Scoping Enforcement**: All APIs, exports, and analytics must respect `projectId` isolation | P0 | - User in Project A cannot access Project B data via API<br>- Exports filtered by active project context<br>- Unit tests verify isolation | Multi-tenancy layer, RBAC |
| FR-005 | **CSRF Protection on State-Changing Routes**: Enforce token validation on `/api/project/switch` and all mutation endpoints | P1 | - POST requests without valid CSRF token return 403<br>- Token rotation works across sessions<br>- Penetration test passes | Middleware, client-dashboard auth |

### 3.2 Resident Portal (Phase 2)

| ID | Requirement | Priority | Acceptance Criteria | Dependencies |
|----|-------------|----------|---------------------|-------------|
| FR-101 | **Unit-User Linking**: Admin or self-service flow to link `User` with `Unit`; enforce `RESIDENT` role gating | P0 | - Resident cannot access portal without linked unit<br>- Admin can assign units via dashboard<br>- Audit log records linking events | Prisma models, RBAC service |
| FR-102 | **Quota Engine**: Calculate monthly visitor quota based on `UnitType`; atomic check/consume on QR creation | P0 | - Studio unit limited to 3 visitor QRs/month<br>- Quota resets on 1st of month<br>- Atomic operation prevents race conditions | Quota service, Prisma transactions |
| FR-103 | **Visitor QR Creation**: Resident can create QR with access rules (one-time, date-range, recurring) | P0 | - Form validates required fields<br>- QR payload includes access rule metadata<br>- Scanner validates time windows | QR service, access rule engine |
| FR-104 | **Open QR Creation**: Units with `canCreateOpenQR=true` can create permanent, unit-level QRs (no visitor name) | P1 | - Open QR shows unit number, not visitor name, on scanner<br>- Scanner validates unit is active<br>- Quota not consumed for Open QR scans | QR service, scanner validation |
| FR-105 | **Mobile-Optimized Web UI**: Resident portal responsive for narrow viewports; touch-friendly controls | P1 | - Portal scores ≥90 on Lighthouse mobile audit<br>- QR display has large "Copy/Share" buttons<br>- RTL/Arabic layout supported | Next.js responsive components |
| FR-106 | **Visitor History & Notifications**: Resident sees scan history; receives push notification on guest arrival | P2 | - History page loads in <2s<br>- Notification delivered within 30s of scan<br>- Resident can toggle notification preferences | WebSocket service, push notification provider |

### 3.3 Marketing Intelligence Suite (Phase 2)

| ID | Requirement | Priority | Acceptance Criteria | Dependencies |
|----|-------------|----------|---------------------|-------------|
| FR-201 | **Pixel/GTM Injection**: Admin can configure Google Tag Manager, Meta Pixel, GA4 IDs per project; inject into visitor landing page | P0 | - Tracking scripts load on landing page<br>- No console errors<br>- Privacy consent banner respects user choice | Landing page service, script injector |
| FR-202 | **UTM Persistence Engine**: Capture and persist `utm_*` parameters from delivery link through landing page session to scan log | P0 | - UTM params visible in audit log for each scan<br>- Attribution dashboard groups scans by source/campaign<br>- Params survive redirect to landing page | Link service, analytics pipeline |
| FR-203 | **Campaign Separation**: Isolate analytics by owner, project, marketing vector; enable brokerage-level reporting | P0 | - Brokerage owner sees aggregated view across projects<br>- Project manager sees only their project data<br>- Export respects separation | Multi-tenancy, RBAC, analytics |
| FR-204 | **Visitor Landing Page**: Mobile-optimized page hosting dynamic QR; supports pixel injection and UTM capture | P0 | - Page loads in <1.5s on 3G<br>- QR displays prominently with copy/share actions<br>- Consent banner appears if tracking enabled | Next.js page, QR service |
| FR-205 | **Direct Share Utilities**: Pre-filled WhatsApp/Email/SMS share with UTM-tagged link; native contact picker integration | P1 | - Share opens native app with pre-filled message<br>- Contact picker returns selected phone/email<br>- Link includes UTM params | Mobile APIs, share service |
| FR-206 | **CRM Webhook Sync**: Push visitor data (scan event + UTM context) to HubSpot, Salesforce, or custom endpoint | P2 | - Webhook delivers within 60s of scan<br>- Payload includes visitor details + attribution data<br>- Retry logic with exponential backoff | Webhook service, integration layer |

### 3.4 AI & Enterprise Features (Phase 3 Preview)

| ID | Requirement | Priority | Acceptance Criteria | Dependencies |
|----|-------------|----------|---------------------|-------------|
| FR-301 | **Predictive Traffic Analytics**: Forecast peak visitor times using historical scan patterns | P2 | - Dashboard shows 7-day forecast with confidence interval<br>- Model retrained weekly with new data<br>- Forecast accuracy ≥80% vs. actual | Time-series ML model, analytics pipeline |
| FR-302 | **Anomaly Detection**: Alert on unusual scan patterns (e.g., 3 AM surge, duplicate scans) | P2 | - Alert triggered within 1min of anomaly<br>- False positive rate <5%<br>- Alert includes context (gate, time, pattern) | Unsupervised ML model, alerting service |
| FR-303 | **Automated Compliance Reports**: Generate weekly security audits with natural language summary | P2 | - Report includes scan volume, overrides, anomalies<br>- PDF export available<br>- Report delivered to configured recipients | Report generator, NLG service |
| FR-304 | **Visitor Intent Scoring**: Rank visitors by likelihood to convert (real estate) using behavioral signals | P3 | - Score 0-100 displayed in brokerage dashboard<br>- Model trained on historical conversion data<br>- Score updates in real-time as visitor engages | Logistic regression model, feature store |

---

## 4. Non-Functional Requirements

### 4.1 Security & Compliance

| Requirement | Standard / Target | Verification Method |
|-------------|------------------|---------------------|
| **Authentication** | JWT with 15-min access token + refresh token rotation; Argon2id password hashing (t=3, m=65536, p=4) | Penetration test; code review of auth flows |
| **Authorization** | RBAC with project-level scoping; all APIs enforce `projectId` isolation | Unit tests; integration tests with multi-project scenarios |
| **Data Protection** | Field-level encryption for webhook secrets; TLS 1.3 in transit; AES-256 at rest | Security audit; infrastructure as code review |
| **Audit Logging** | Immutable-ish `ScanLog` with correlation IDs; retention policy (archive after 12 months) | Log review; retention job testing |
| **Privacy Compliance** | Consent banner for tracking pixels; data residency options for MENA tenants | Legal review; user acceptance testing |
| **Secrets Management** | Fail-closed on missing env vars; no hardcoded secrets; rotation support | Startup health check; secrets scanning in CI |

### 4.2 Performance & Reliability

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **QR Validation Latency** | <2s p95 (online); <500ms p95 (offline cache) | Load testing; production monitoring |
| **Landing Page Load** | <1.5s on 3G; <800ms on 4G | Lighthouse; real-user monitoring |
| **Scanner Offline Sync** | Queue indefinitely; sync within 30s of reconnect; dedup via `scanUuid` | Integration tests; field testing |
| **Analytics Query Performance** | <3s for dashboard loads; cursor pagination for large datasets | Query profiling; database indexing review |
| **System Uptime** | 99.9% for core APIs; 99.5% for analytics | Uptime monitoring; incident response SLA |
| **Error Rate** | <0.1% for critical paths (auth, QR validation, scan logging) | Error tracking; alerting thresholds |

### 4.3 Scalability & Maintainability

| Requirement | Approach | Success Indicator |
|-------------|----------|-------------------|
| **Multi-Tenancy** | Row-level isolation via `organizationId`/`projectId`; connection pooling per tenant group | New tenant onboarded in <5min; no cross-tenant data leaks |
| **Horizontal Scaling** | Stateless APIs; Redis for rate limiting/cache; database read replicas | Handle 2x traffic spike with <20% latency increase |
| **Feature Flags** | Env-based toggles for Resident Portal, Marketing Suite, AI features | Roll out feature to 10% of tenants without redeploy |
| **Observability** | Structured logging (Pino) with correlation IDs; metrics exported to Datadog/Logtail | Mean time to detect (MTTD) <5min for critical issues |
| **Developer Experience** | OpenAPI specs for public APIs; typed clients via `@gate-access/api-client` | New engineer contributes to API in <1 day |

---

## 5. Technical Architecture & Integration Points

### 5.1 High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Marketing Site │     │  Client Dashboard│     │  Admin Dashboard│
│  (Next.js)      │     │  (Next.js)      │     │  (Next.js)      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Auth Layer                  │
│  • JWT validation • CSRF protection • Rate limiting (Redis) │
└────────┬────────────────────────────────────────┬───────────┘
         │                                        │
         ▼                                        ▼
┌─────────────────┐                 ┌─────────────────────────┐
│  Core Services  │                 │  Marketing Intelligence │
│  • QR generation│                 │  • UTM persistence      │
│  • Validation   │                 │  • Pixel injection      │
│  • Quota engine │                 │  • Attribution engine   │
└────────┬────────┘                 └────────┬────────────────┘
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────────────┐
│  Scanner App    │                 │  Analytics & Reporting  │
│  (Expo/RN)      │                 │  • Recharts dashboards  │
│  • Offline queue│                 │  • Export service       │
│  • Supervisor   │                 │  • Webhook dispatcher   │
└────────┬────────┘                 └────────┬────────────────┘
         │                                   │
         ▼                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  • PostgreSQL (Prisma ORM) • Redis (cache/rate limit)       │
│  • ScanLog (time-series optimized) • Feature flags (env)    │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Key Integration Points

| Integration | Purpose | Protocol / Format | Authentication | Priority |
|-------------|---------|-------------------|----------------|----------|
| **WhatsApp Business API** | Direct share of UTM-tagged access links | HTTPS POST / JSON | Bearer token (Meta) | P1 |
| **Google Tag Manager** | Inject tracking containers into landing pages | Script tag injection | None (client-side) | P0 |
| **Meta Pixel** | Retargeting for property visitors | JavaScript pixel | Pixel ID (client-side) | P1 |
| **HubSpot / Salesforce** | Sync visitor data + attribution to CRM | Webhook POST / JSON | API key + HMAC signature | P2 |
| **Upstash Redis** | Rate limiting, session cache, offline queue | Redis protocol | Token-based | P0 |
| **Datadog / Logtail** | Centralized logging and metrics | HTTPS POST / JSON | API key | P1 |
| **Twilio / AWS SNS** | SMS fallback for access links (Phase 3) | HTTPS POST / JSON | API key + secret | P3 |

### 5.3 Data Model Extensions (Phase 2)

```prisma
// New: Unit - residence in compound
model Unit {
  id              String   @id @default(cuid())
  unitNumber      String
  unitType        UnitType
  building        String?
  user            User?    @relation(fields: [userId], references: [id])
  userId          String?  @unique
  organization    Organization @relation(fields: [organizationId], references: [id])
  organizationId  String
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  visitorQRs      VisitorQR[]

  @@unique([organizationId, unitNumber])
  @@index([organizationId])
  @@index([userId])
}

// New: VisitorQR - extends QRCode with visitor details
model VisitorQR {
  id              String        @id @default(cuid())
  qrCode          QRCode        @relation(fields: [qrCodeId], references: [id], onDelete: Cascade)
  qrCodeId        String        @unique
  unit            Unit          @relation(fields: [unitId], references: [id], onDelete: Cascade)
  unitId          String
  visitorName     String?       // null for Open QR
  visitorPhone    String?
  visitorEmail    String?
  isOpenQR        Boolean       @default(false)
  accessRule      AccessRule?   @relation(fields: [accessRuleId], references: [id])
  accessRuleId    String?
  createdBy       String        // userId of resident
  createdAt       DateTime      @default(now())

  @@index([unitId])
  @@index([createdBy])
}

// New: AccessRule - when visitor can access
model AccessRule {
  id              String            @id @default(cuid())
  type            AccessRuleType    // ONETIME, DATERANGE, RECURRING, PERMANENT
  startDate       DateTime?
  endDate         DateTime?
  recurringDays   Int[]?            // Days of week (0-6, Sunday=0)
  startTime       String?           // "09:00" format
  endTime         String?           // "22:00" format
  visitorQR       VisitorQR?

  @@index([startDate])
}

// New: ResidentLimit - quota config per org/unit-type
model ResidentLimit {
  id              String   @id @default(cuid())
  organization    Organization @relation(fields: [organizationId], references: [id])
  organizationId  String
  unitType        UnitType
  monthlyQuota    Int
  canCreateOpenQR Boolean @default(false)
  createdAt       DateTime @default(now())

  @@unique([organizationId, unitType])
}

// Updated enums
enum UserRole {
  ADMIN
  TENANT_ADMIN
  TENANT_USER
  VISITOR
  RESIDENT  // NEW
}

enum QRCodeType {
  SINGLE
  RECURRING
  PERMANENT
  VISITOR   // NEW - created by resident
  OPEN      // NEW - permanent unit-level
}

enum UnitType {
  STUDIO
  ONE_BEDROOM    // 5 visitors/month
  TWO_BEDROOM    // 10 visitors/month 
  THREE_BEDROOM  // 15 visitors/month
  FOUR_BEDROOM   // 20 visitors/month
  PENTHOUSE      // 25 visitors/month
  VILLA          // 30 visitors/month
}

enum AccessRuleType {
  ONETIME       // Single use, specific date
  DATERANGE     // Multiple uses within date range
  RECURRING     // Recurring access (daily/weekly)
  PERMANENT     // No time limits (Open QR default)
}
```

---

## 6. User Stories & Acceptance Criteria

### 6.1 Resident Portal Stories

**Story RP-01: As a resident, I want to create a visitor QR in under 30 seconds so I can invite guests without calling management.**
- *Given* I am logged into the Resident Portal with a linked unit
- *When* I tap "Add Visitor" and fill in guest name + select one-time access
- *Then* a QR code is generated and displayed with "Copy Link" and "Share via WhatsApp" buttons
- *And* my monthly quota is decremented by 1
- *And* the QR payload includes UTM parameters if shared from a campaign link

**Story RP-02: As a resident with a 3BR unit, I want to create a permanent Open QR for my family so they can enter anytime.**
- *Given* my unit type has `canCreateOpenQR = true`
- *When* I select "Create Open QR" and confirm permanent access
- *Then* a QR is generated that shows my unit number (not a visitor name) on the scanner
- *And* scanning this QR does not consume my monthly visitor quota
- *And* the QR remains valid until I revoke it or my unit is deactivated

### 6.2 Marketing Intelligence Stories

**Story MK-01: As a marketing manager, I want to see which ad campaign drove a gate visit so I can optimize spend.**
- *Given* I created a campaign link with `utm_source=facebook&utm_campaign=spring_open_house`
- *When* a visitor scans that link's QR at the gate
- *Then* the scan log entry includes the original UTM parameters
- *And* the Analytics dashboard shows "Facebook / spring_open_house" as the source for that scan
- *And* I can export a report grouping scans by `utm_campaign`

**Story MK-02: As a brokerage owner, I want to compare visitor volume across my projects so I can allocate marketing budget.**
- *Given* I am logged in with brokerage-level permissions
- *When* I navigate to the Brokerage Dashboard
- *Then* I see a summary card for each project: visitor count, conversion rate, top campaign
- *And* I can filter by date range, unit type, or marketing channel
- *And* I can export the comparison to CSV for stakeholder reporting

### 6.3 Security & Operations Stories

**Story SEC-01: As a security supervisor, I want to override a failed scan with audit trail so legitimate guests aren't blocked.**
- *Given* a visitor's QR fails validation (expired, wrong gate, etc.)
- *When* I enter my supervisor PIN and select a reason code
- *Then* the gate opens and an audit log entry is created with timestamp, user, reason, and original QR payload
- *And* the override is visible in the live dashboard for real-time monitoring
- *And* I cannot override without valid credentials (fail-closed)

**Story OPS-01: As a platform engineer, I want structured logs with correlation IDs so I can debug issues quickly.**
- *Given* a user reports a QR validation failure
- *When* I search logs by `scanUuid` or `requestId`
- *Then* I see the full request flow: auth → validation → scanner response
- *And* logs include context: projectId, userId, gateId, latency
- *And* logs are shipped to Datadog with alerting on error rate spikes

---

## 7. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy | Owner |
|------|--------|------------|---------------------|-------|
| **Privacy regulation changes (GDPR/CCPA/MENA)** | Legal exposure; tenant churn | Medium | Built-in consent banners; data residency options; audit-ready logs; legal review before launch | Legal + Product |
| **Marketing feature complexity slows adoption** | Low feature usage; support burden | High | Progressive disclosure; guided setup wizards; template library; in-app tooltips | Product + UX |
| **AI feature expectations vs. reality** | Over-promising; reputational damage | Medium | Clear positioning: "assistive intelligence" not autonomous decisions; beta program for AI features | Product + Engineering |
| **MENA localization perceived as superficial** | Lost deals to local competitors | Medium | Native Arabic copy (not machine-translated); local payment methods; regional compliance scaffolding; hire MENA UX consultant | Localization + Product |
| **Competitor copies marketing features** | Price pressure; feature parity | High | Continuous innovation cadence; deep real estate workflow integration; patent key attribution methods | Product + Legal |
| **Offline scanner sync conflicts** | Data loss; duplicate scans | Low | Dedup via cryptographic `scanUuid`; conflict resolution rules; idempotent API endpoints | Engineering |

---

## 8. Timeline & Milestones

### 8.1 Phase 1: MVP Hardening (Complete by April 2026)
- [x] Security fixes: fail-closed auth, cryptographic UUIDs, CSV injection protection
- [x] Developer experience: structured logging, health checks, OpenAPI docs
- [x] Testing: smoke tests, scenario tests, staging parity
- **Gate**: Zero critical bugs; 99.9% uptime in staging; go/no-go for Phase 2

### 8.2 Phase 2: Resident Portal + Marketing Suite (Q3 2026)
| Milestone | Target Date | Deliverables | Success Criteria |
|-----------|-------------|--------------|-----------------|
| **M2.1: Data Model & Quota Engine** | Week 2 | Prisma migrations; quota service; unit tests | Quota logic passes edge-case tests; migrations reversible |
| **M2.2: Resident Portal Web MVP** | Week 4 | `/dashboard/residents` route; QR creation forms; mobile UI | Lighthouse mobile score ≥90; resident usability test passes |
| **M2.3: Marketing Suite Core** | Week 6 | Pixel injection; UTM persistence; landing page | Attribution visible in analytics; tracking scripts load without errors |
| **M2.4: Brokerage Enablement** | Week 8 | Owner-level dashboards; campaign separation; CRM webhook | Brokerage user can export project comparison; webhook delivers within 60s |
| **M2.5: Beta Launch** | Week 10 | 5 pilot tenants; monitoring; feedback loop | 80% of pilot tenants activate ≥1 marketing feature; NPS ≥40 |

### 8.3 Phase 3: AI & Enterprise Scale (Q1-Q2 2027)
- Predictive analytics, anomaly detection, automated compliance reports
- White-label branding, NFC support, SSO integration
- **Gate**: Enterprise pilot with 3 brokerage clients; 90% retention at 90 days

---

## 9. Success Metrics & KPIs

### 9.1 Product Health Metrics
| Metric | Target | Measurement Frequency | Owner |
|--------|--------|----------------------|-------|
| Critical security bugs post-launch | 0 | Per release | Engineering Lead |
| QR validation latency (p95) | <2s online; <500ms offline cache | Real-time monitoring | Platform Engineering |
| Resident portal activation rate | 40% of eligible units in 30 days | Weekly cohort analysis | Product Manager |
| Marketing suite configuration rate | 60% of Pro+ tenants configure ≥1 pixel | Monthly telemetry review | Growth Lead |
| Scanner offline sync success rate | 99.9% of queued scans synced within 5min | Daily job monitoring | Mobile Engineering |

### 9.2 Business Impact Metrics
| Metric | Target | Measurement Method | Owner |
|--------|--------|-------------------|-------|
| Customer Acquisition Cost (CAC) reduction | 30% lower via marketing-attributed demos | CRM + billing analytics | Marketing Director |
| Expansion revenue from marketing suite | 25% of Starter → Pro upgrades | Cohort analysis + billing data | Revenue Ops |
| Brokerage add-on renewal rate | 90%+ at 12 months | Subscription analytics | Customer Success |
| Competitive win rate (marketing features evaluated) | >50% | CRM deal tracking + win/loss analysis | Sales Leadership |
| Resident NPS | >50 | Quarterly in-app survey | Product + CX |

### 9.3 Differentiation Validation Metrics
| Metric | Target | How We Measure | Owner |
|--------|--------|----------------|-------|
| "Marketing-first" message recall | 70% of prospects cite attribution as key differentiator | Post-demo survey | Marketing |
| Time-to-value for marketing setup | <15 minutes to configure first pixel | User session analytics | Product |
| Brokerage-specific feature adoption | 80% of brokerage tenants use owner-level dashboards | Feature usage telemetry | Product |
| AI insight utilization | 30% of enterprise tenants use predictive alerts weekly | Dashboard engagement metrics | Data Science |

---

## 10. Appendix & References

### 10.1 Linked Documents
- `PRD_v5.0.md` — Previous version; baseline for Phase 2 scope
- `RESIDENT_PORTAL_SPEC.md` — Technical specification for resident features
- `PRD_WHATSAPP_MARKETING_EDITION.md` — Omni-channel marketing workflows
- `SUGGESTED_IMPROVEMENTS_AND_FUNCTIONS.md` — Engineering improvement backlog
- `ALL_TASKS_BACKLOG.md` — Master task list with priorities and status
- `CODE_QUALITY_AND_PERFORMANCE_AUDIT.md` — Security and performance findings

### 10.2 Glossary
| Term | Definition |
|------|------------|
| **Open QR** | Permanent, unit-level QR code that does not consume visitor quota; shows unit number on scanner |
| **UTM Persistence** | Capturing and retaining `utm_*` parameters from marketing link through landing page to gate scan |
| **Fail-Closed** | Security principle: system rejects requests when validation fails, rather than defaulting to allow |
| **Brokerage View** | Admin dashboard mode that aggregates analytics across multiple projects/owners for real estate brokerages |
| **Quota Engine** | Service that calculates and enforces monthly visitor limits based on unit type and organization rules |

### 10.3 Differentiation Strategy Summary
GateFlow wins by being the **only access platform built for growth teams**, not just security teams:
1. **Marketing-First Access**: QR codes are trackable, UTM-tagged, pixel-enabled links—not just entry tokens
2. **Real Estate Brokerage Enablement**: Built-in campaign separation, owner-level analytics, visitor profiling
3. **MENA-First Experience**: Native RTL/Arabic, local payment integrations, regional compliance scaffolding
4. **AI That Acts**: Predictive alerts, automated reports, and intelligent recommendations—not just dashboards
5. **Resident Experience First**: Self-service, mobile-native, notification-ready—reducing admin burden while increasing satisfaction

> *"We don't just secure gates—we turn every entry into a data point, every visitor into a lead, and every compound into a smart marketing channel."*

---

**Document Version**: 6.0  
**Last Updated**: February 2026  
**Next Review**: Post-Alignment Workshop (Target: March 2026)  
**Distribution**: Product, Engineering, Marketing, Executive Stakeholders  

*This document is a planning artifact. Implementation details, code, and prompts will be derived in subsequent sprints. All technical decisions must reference this PRD and linked specifications.*
```