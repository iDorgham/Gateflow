# GateFlow Comprehensive Improvements & PRD v4.0

---

## Part 1: Comprehensive Improvement Suggestions

### 1. UX/UI Polish

| Area         | Issue            | Suggestion                                       |
| ------------ | ---------------- | ------------------------------------------------ |
| QR List      | No search        | Add search by code, filter by type/status/gate   |
| QR List      | No bulk actions  | Add select-all + bulk activate/deactivate/delete |
| QR Creation  | No template      | Add CSV template download                        |
| Scanner      | No gate selector | Add gate dropdown before scan                    |
| Dashboard    | Static           | Add polling or SSE for live updates              |
| Analytics    | No date picker   | Add custom date range selector                   |
| Scans        | No search        | Add QR code search                               |
| Errors       | Generic          | Add contextual error messages                    |
| Loading      | No skeletons     | Add loading skeletons to all pages               |
| Empty states | Basic            | Improve empty state illustrations                |
| Mobile nav   | Not optimized    | Add bottom tab nav for mobile                    |

### 2. Security Improvements

| Area             | Issue             | Suggestion                                 |
| ---------------- | ----------------- | ------------------------------------------ |
| Rate limiter     | In-memory only    | Replace with Redis-backed                  |
| Audit logs       | No hash chain     | Implement cryptographic log chain          |
| API keys         | Not implemented   | Full CRUD with scopes                      |
| Session          | 15min fixed       | Add session duration settings              |
| QR replay        | Client nonce only | Add server-side nonce tracking             |
| Encryption       | Scanner only      | Add DB field encryption for sensitive data |
| CSRF             | Not configured    | Add CSRF protection                        |
| Security headers | Not set           | Add CSP, HSTS, X-Frame-Options             |

### 3. Performance

| Area              | Issue             | Suggestion                      |
| ----------------- | ----------------- | ------------------------------- |
| Analytics queries | Sequential        | Use Promise.all or raw SQL      |
| Rate limiter      | O(n) lookup       | Use Redis with O(1)             |
| Large lists       | No virtualization | Add react-window/virtualization |
| Images            | Not optimized     | Add next/image everywhere       |
| Bundle size       | Growing           | Add bundle analyzer             |

### 4. Scalability

| Area         | Issue              | Suggestion                  |
| ------------ | ------------------ | --------------------------- |
| Rate limiter | Single instance    | Add Redis                   |
| Database     | No connection pool | Add PgBouncer               |
| API          | No caching         | Add Redis caching           |
| Files        | Local storage      | Add S3/cloud storage        |
| Multi-region | Not designed       | Add edge-ready architecture |

### 5. Mobile Experience

| Area               | Issue           | Suggestion              |
| ------------------ | --------------- | ----------------------- |
| Offline UI         | No queue view   | Add queue status screen |
| Override           | Not implemented | Add supervisor PIN flow |
| Gate select        | Not available   | Add gate picker         |
| History            | Not available   | Add recent scans        |
| Deep links         | Not implemented | Add URL scheme          |
| Push notifications | Not implemented | Add for sync events     |

### 6. Analytics & Reporting

| Area           | Issue           | Suggestion                |
| -------------- | --------------- | ------------------------- |
| Heatmaps       | Not implemented | Add gate activity heatmap |
| Peak times     | Not implemented | Add hourly breakdown      |
| Export         | CSV only        | Add PDF export            |
| Custom reports | Not available   | Add report builder        |
| Alerts         | Not implemented | Add threshold alerts      |

### 7. Fraud Detection

| Area                 | Issue           | Suggestion                 |
| -------------------- | --------------- | -------------------------- |
| Duplicate detection  | Not implemented | Add time-window detection  |
| Cross-gate anomaly   | Not implemented | Add pattern detection      |
| Override abuse       | Not tracked     | Add operator override rate |
| Screenshot detection | Not implemented | Add watermarking           |

### 8. Enterprise Features

| Area           | Issue           | Suggestion            |
| -------------- | --------------- | --------------------- |
| SSO            | Not implemented | Add SAML/OIDC         |
| White-label    | Not implemented | Add custom branding   |
| Compliance     | Not implemented | Add immutable logs    |
| Data residency | Not implemented | Add region selection  |
| Audit exports  | Manual          | Add compliance export |

---

## Part 2: PRD v4.0 - Consolidated Requirements

### 1. Executive Summary

**Product Name:** GateFlow  
**Version:** 4.0  
**Target Markets:** Egypt & Gulf (MENA)  
**Business Model:** B2B SaaS (monthly/annual + per-scan)

### 2. MVP Features (Phase 1 - Q3/Q4 2026)

#### Must Have (Release Blocker)

- [x] Organization management
- [x] User authentication (JWT + Argon2id)
- [x] Single QR code creation
- [ ] **Bulk CSV QR creation** ← ADD
- [ ] **Email QR delivery** ← ADD
- [ ] **Webhook system** ← ADD
- [x] Gate management
- [x] QR code validation API
- [x] Offline-capable scanner app
- [x] Live dashboard
- [x] Basic analytics
- [x] Team management (RBAC)
- [x] Audit logs
- [ ] **QR role tags (VIP/guest/staff)** ← ADD
- [ ] **Supervisor override** ← ADD

#### Should Have (Pre-MVP)

- [ ] API key management
- [ ] Advanced analytics (heatmaps, peak times)
- [ ] PDF export
- [ ] Project model (multi-project)

### 3. Technical Requirements

#### Authentication

| Requirement      | Current  | Target                  |
| ---------------- | -------- | ----------------------- |
| JWT Access Token | 15min    | Configurable            |
| Refresh Token    | 30 days  | Configurable + rotation |
| Password Hashing | Argon2id | Argon2id (keep)         |
| SSO              | ❌       | SAML/OIDC (Phase 3)     |

#### Rate Limiting

| Current          | Target                      |
| ---------------- | --------------------------- |
| In-memory        | Redis-backed                |
| 100 req/user/min | Configurable per-endpoint   |
| No global        | Global with burst allowance |

#### Encryption

| Current                  | Target                   |
| ------------------------ | ------------------------ |
| Scanner offline: AES-256 | Keep                     |
| PBKDF2 key derivation    | Keep + key rotation      |
| DB encryption at rest    | Add for sensitive fields |
| TLS 1.3                  | Production config        |

### 4. Data Models Updates

#### New: Project Model (ADD)

```prisma
model Project {
  id              String   @id @default(cuid())
  name            String
  status          ProjectStatus @default(ACTIVE)
  startDate       DateTime?
  endDate         DateTime?
  location        String?
  organization    Organization @relation(...)
  organizationId  String
  gates           Gate[]
  qrCodes         QRCode[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?
}

enum ProjectStatus {
  DRAFT
  ACTIVE
  COMPLETED
  ARCHIVED
}
```

#### New: QR Role Tag (ADD)

```prisma
model QRCode {
  // ... existing fields
  roleTag         QRRoleTag?  // VIP, GUEST, STAFF
}

enum QRRoleTag {
  VIP
  GUEST
  STAFF
  CONTRACTOR
  DELIVERY
}
```

#### New: Webhook (ADD)

```prisma
model Webhook {
  id              String   @id @default(cuid())
  url             String
  events          WebhookEvent[]
  secret          String
  isActive        Boolean  @default(true)
  organization    Organization @relation(...)
  organizationId  String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum WebhookEvent {
  QR_CREATED
  QR_SCANNED
  QR_REVOKED
  QR_EXPIRED
  SCAN_SUCCESS
  SCAN_FAILED
}
```

#### New: ApiKey (ADD)

```prisma
model ApiKey {
  id              String   @id @default(cuid())
  name            String
  keyHash         String   @unique
  scopes          ApiScope[]
  lastUsedAt      DateTime?
  expiresAt       DateTime?
  organization    Organization @relation(...)
  organizationId  String
  createdAt       DateTime @default(now())
}

enum ApiScope {
  QR_CREATE
  QR_READ
  QR_VALIDATE
  SCANS_READ
  ANALYTICS_READ
  WEBHOOK_WRITE
}
```

---

## Part 3: Prioritized Roadmap

### Next 8-10 Tasks with Priority, Effort & Owner

| #   | Task                 | Priority | Effort | App              | Description                                       |
| --- | -------------------- | -------- | ------ | ---------------- | ------------------------------------------------- |
| 1   | Bulk CSV QR Creation | P0       | 3 days | Client Dashboard | CSV upload, validation, bulk insert with progress |
| 2   | Email QR Delivery    | P0       | 2 days | Client Dashboard | Integrate Resend/SendGrid, send QR via email      |
| 3   | Webhook System       | P0       | 3 days | API + Dashboard  | CRUD webhooks, delivery queue, retry logic        |
| 4   | QR Role Tags         | P0       | 1 day  | DB + Dashboard   | Add roleTag field, UI selector, analytics filter  |
| 5   | Supervisor Override  | P1       | 1 day  | Scanner App      | Add PIN/password bypass with audit logging        |
| 6   | Advanced Analytics   | P1       | 4 days | Client Dashboard | Peak times, heatmaps, date range picker           |
| 7   | API Key Management   | P1       | 2 days | Client Dashboard | Full CRUD with scoped permissions                 |
| 8   | Project Model        | P2       | 5 days | DB + Dashboard   | Add Project model, migrate gates/QRs              |
| 9   | Admin Dashboard      | P2       | 5 days | Admin Dashboard  | Org management, system analytics                  |
| 10  | Real-time Updates    | P2       | 2 days | Client Dashboard | SSE/polling for live dashboard                    |

---

## Part 4: Technical Debt & Refactoring

### High Priority

| Item              | Issue     | Recommendation                     |
| ----------------- | --------- | ---------------------------------- |
| Rate limiter      | In-memory | Add `@upstash/ratelimit` or Redis  |
| Analytics queries | N+1       | Use raw SQL for aggregations       |
| Test coverage     | Minimal   | Add Vitest + React Testing Library |

### Medium Priority

| Item           | Issue            | Recommendation                      |
| -------------- | ---------------- | ----------------------------------- |
| Error handling | Inconsistent     | Create centralized error middleware |
| Type sharing   | Some duplication | Audit shared types                  |
| API response   | Inconsistent     | Standardize wrapper                 |
| Logging        | Minimal          | Add Pino/winston                    |
| i18n           | Partial          | Complete translations               |

### Low Priority

| Item             | Issue       | Recommendation          |
| ---------------- | ----------- | ----------------------- |
| UI components    | Duplication | Audit shared components |
| Environment vars | Scattered   | Document all env vars   |
| Bundle size      | Growing     | Add bundle analyzer     |

---

## Part 5: Phase 2 & 3 Features

### Phase 2 (Post-MVP 3-9 months)

1. WordPress plugin
2. Risk & fraud detection rules
3. Full Zero-Trust enforcement
4. SMS gateway integration
5. Advanced RBAC (project-level)
6. PDF report generation

### Phase 3 (Enterprise Scale)

1. White-label / custom branding
2. Resident self-service portal
3. NFC support
4. SSO (SAML/OIDC)
5. Compliance mode (immutable logs)
6. Edge validation nodes

---

## Part 6: Quick Wins (<1 Day Each)

1. Add QR code search/filter on list page
2. Add "copy QR code" button
3. Add scan cooldown indicator in scanner
4. Add organization switcher
5. Add loading skeletons to dashboard
6. Add keyboard shortcuts
7. Add "last accessed" to gate cards
8. Add CSV template download button

---

## Part 7: Ready-to-Use Claude Prompts

### Prompt 1: Bulk CSV QR Creation (Client Dashboard)

```
Create a complete bulk QR creation feature for the GateFlow client dashboard.

FILE: apps/client-dashboard/src/app/dashboard/qrcodes/bulk/page.tsx

Requirements:
- Create a new page at /dashboard/qrcodes/bulk
- Add CSV file upload with drag-and-drop
- Parse CSV with columns: name, email, phone, role (VIP/GUEST/STAFF), gate (optional), expiresAt (optional)
- Show preview table of parsed data before creation
- Add validation (required fields, email format, date format)
- Create QR codes in bulk using existing createQRCode action
- Show progress bar during bulk creation
- Display success summary with created count
- Handle errors gracefully with specific messages
- Use existing UI components from @gate-access/ui
- Follow existing code patterns in the codebase (look at /dashboard/qrcodes/create/create-qr-client.tsx)

The CSV should support this format:
name,email,phone,role,gate,expiresAt
John Doe,john@example.com,0123456789,VIP,Main Gate,2026-12-31T23:59
```

### Prompt 2: Email QR Delivery (Client Dashboard)

```
Create email QR delivery feature for GateFlow.

FILE: apps/client-dashboard/src/app/api/qr/send-email/route.ts

Requirements:
- Create API route to send QR code via email
- Integrate with email service (use Resend or generic SMTP)
- Email should include: QR code image (base64 or attachment), access details, expiry info
- Add UI button to "Send via email" on QR list and creation success page
- Use template for professional email design
- Handle errors (invalid email, delivery failure)
- Log email delivery in audit trail

Also update the QR creation success page to include email option:
FILE: apps/client-dashboard/src/app/dashboard/qrcodes/create/create-qr-client.tsx
- Add "Send via email" button
- Add email input field
- Call the new API endpoint
```

### Prompt 3: Webhook System (API + Dashboard)

```
Implement webhook system for GateFlow.

FILE: packages/db/prisma/schema.prisma (add to existing)

Add new model:
model Webhook {
  id              String   @id @default(cuid())
  url             String
  events          WebhookEvent[]
  secret          String
  isActive        Boolean  @default(true)
  organization    Organization @relation(fields: [organizationId], references: [id])
  organizationId  String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum WebhookEvent {
  QR_CREATED
  QR_SCANNED
  QR_REVOKED
  QR_EXPIRED
  SCAN_SUCCESS
  SCAN_FAILED
}

FILE: apps/client-dashboard/src/app/dashboard/workspace/webhooks/page.tsx

Create webhooks management page:
- List all webhooks
- Add new webhook (URL, events selection)
- Edit webhook
- Delete webhook
- Test webhook button (sends test payload)
- Show last 5 delivery attempts with status

FILE: apps/client-dashboard/src/app/api/webhooks/deliver/route.ts

Create webhook delivery system:
- Queue webhook deliveries
- Add HMAC signature to payloads
- Implement retry logic (3 attempts with backoff)
- Log delivery attempts
```

### Prompt 4: Scanner Supervisor Override (Scanner App)

```
Add supervisor override feature to GateFlow scanner app.

FILE: apps/scanner-app/src/components/SupervisorOverride.tsx

Requirements:
- Create supervisor override component
- Triggered when operator taps "Override" on rejected scan
- Request supervisor PIN/password (4-6 digits)
- Validate against stored supervisor credentials
- Log override attempt with supervisor ID
- Allow override after 3 failed attempts with audit warning
- Show confirmation before allowing override
- Use existing ResultOverlay pattern

FILE: apps/scanner-app/App.tsx

Update scanner to:
- Add "Override" button to rejected results
- Integrate SupervisorOverride component
- Pass scan context to override flow
- Update audit trail to include override details

Supervisor credentials should be:
- Stored securely in secure storage
- Configured in scanner settings
- Validated against server on first use
- Rotatable via dashboard
```

### Prompt 5: QR Role Tags (Database + Dashboard)

```
Add QR role tags feature to GateFlow.

FILE: packages/db/prisma/schema.prisma

Update QRCode model:
- Add roleTag QRRoleTag? field
- Add QRRoleTag enum: VIP, GUEST, STAFF, CONTRACTOR, DELIVERY

Run migration and update types.

FILE: apps/client-dashboard/src/app/dashboard/qrcodes/create/create-qr-client.tsx

Update QR creation form:
- Add role tag selector (dropdown or pill buttons)
- Show role in QR list table
- Filter QR list by role tag

FILE: apps/client-dashboard/src/app/dashboard/analytics/page.tsx

Update analytics:
- Add breakdown by role tag
- Include role in scan logs export
- Show role distribution chart
```

### Prompt 6: Advanced Analytics (Client Dashboard)

```
Add advanced analytics to GateFlow dashboard.

FILE: apps/client-dashboard/src/app/dashboard/analytics/page.tsx

Requirements:
- Add date range picker (today, 7d, 30d, custom)
- Add peak hours heatmap (24h x 7d grid)
- Add gate comparison charts
- Add scan success/fail trends over time
- Add role-based breakdown
- Add export to PDF functionality
- Use recharts or similar for visualizations
- Keep existing basic stats at top

New components needed:
FILE: apps/client-dashboard/src/components/analytics/DateRangePicker.tsx
FILE: apps/client-dashboard/src/components/analytics/PeakHoursHeatmap.tsx
FILE: apps/client-dashboard/src/components/analytics/GateComparisonChart.tsx

PDF Export:
FILE: apps/client-dashboard/src/app/api/analytics/export-pdf/route.ts
- Generate PDF with charts and data
- Include date range in filename
- Professional formatting
```

### Prompt 7: Admin Dashboard - Organization Management

```
Create admin dashboard for GateFlow super admin.

FILE: apps/admin-dashboard/src/app/page.tsx

Requirements:
- Full layout with sidebar navigation
- Dashboard overview with system stats
- Organization management
- User management across orgs
- System-wide analytics

FILE: apps/admin-dashboard/src/app/organizations/page.tsx

Organization management:
- List all organizations with plan, users, QR codes, scans
- Search/filter organizations
- View organization details
- Suspend/activate organization
- Change plan tier
- View organization audit logs

FILE: apps/admin-dashboard/src/app/users/page.tsx

User management:
- List all users across organizations
- Search by email/name
- View user details
- Reset user password
- Disable user

FILE: apps/admin-dashboard/src/app/analytics/page.tsx

System analytics:
- Total organizations
- Total users
- Total scans (24h, 7d, 30d)
- Scan success rate
- Top organizations by activity
- System health metrics

Use @gate-access/ui components. Follow client-dashboard styling.
```

### Prompt 8: API Key Management (Client Dashboard)

```
Implement API key management for GateFlow.

FILE: packages/db/prisma/schema.prisma

Add models:
model ApiKey {
  id              String   @id @default(cuid())
  name            String
  keyHash         String   @unique
  keyPrefix       String   // First 8 chars for display
  scopes          ApiScope[]
  lastUsedAt      DateTime?
  expiresAt       DateTime?
  organization    Organization @relation(fields: [organizationId], references: [id])
  organizationId  String
  createdAt       DateTime @default(now())
  createdBy       String   // userId
}

FILE: apps/client-dashboard/src/app/dashboard/workspace/api-keys/page.tsx

API keys page:
- List all API keys with name, scopes, created, last used
- Create new API key (name, expiry, scopes)
- Show key once on creation (copy button)
- Revoke/delete key
- Filter by status (active/expired)

FILE: apps/client-dashboard/src/app/api/api-keys/route.ts

API routes:
- GET /api-keys - list keys
- POST /api-keys - create key
- DELETE /api-keys/:id - revoke key

FILE: apps/client-dashboard/src/app/api/auth/validate-api-key/route.ts

API key validation middleware:
- Accept API key in Authorization header (Bearer or X-API-Key)
- Validate key hash
- Check scopes
- Check expiry
- Return appropriate error for invalid/expired keys
```
