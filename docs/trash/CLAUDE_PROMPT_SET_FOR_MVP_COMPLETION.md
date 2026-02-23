# Claude Prompt Set for GateFlow MVP Completion

This document contains 8 ready-to-use Claude prompts for completing the remaining MVP features. Each prompt is self-contained, references PRD_v4.0.md, and specifies exact output format.

---

## Prompt 1: Bulk CSV QR Creation + Email Delivery

**Target App:** `client-dashboard`  
**Priority:** P0  
**Files to Create:**

- `apps/client-dashboard/src/app/dashboard/qrcodes/bulk/page.tsx`
- `apps/client-dashboard/src/app/api/qr/bulk-create/route.ts`
- `apps/client-dashboard/src/app/api/qr/send-email/route.ts`

Create a complete bulk QR creation feature with email delivery for GateFlow client dashboard.

**Requirements:**

1. **Bulk QR Page** (`/dashboard/qrcodes/bulk`):
   - File upload with drag-and-drop using native file input
   - CSV parsing with columns: `name,email,phone,role,gate,expiresAt`
   - Preview table showing parsed data (first 10 rows)
   - Validation: required fields, email format, date format
   - Progress bar during creation
   - Success/error summary

2. **Bulk Create API** (`/api/qr/bulk-create`):
   - Accept array of QR data
   - Create QRs in transaction
   - Return created count and any errors

3. **Email Delivery** (`/api/qr/send-email`):
   - Send QR code image as attachment (generate on-the-fly)
   - Professional email template
   - Handle delivery errors gracefully

**CSV Format:**

```csv
name,email,phone,role,gate,expiresAt
John Doe,john@example.com,0123456789,VIP,Main Gate,2026-12-31T23:59
Jane Smith,jane@example.com,0123456788,GUEST,2026-06-15
```

**Reference:** PRD_v4.0.md Section 5.2, Section 8 (Remaining MVP #1, #2)

---

## Prompt 2: Scans Log + Advanced Filters + Export

**Target App:** `client-dashboard`  
**Priority:** P1  
**Files to Update:**

- `apps/client-dashboard/src/app/dashboard/scans/page.tsx`
- `apps/client-dashboard/src/app/api/scans/export/route.ts`

Enhance the scans log page with advanced filtering and export functionality.

**Requirements:**

1. **Search & Filters:**
   - Search by QR code (partial match)
   - Filter by status (SUCCESS, FAILED, EXPIRED, MAX_USES_REACHED, INACTIVE)
   - Filter by gate (dropdown)
   - Filter by date range (date picker)
   - Filter by operator (user)
   - Filter by device ID

2. **Enhanced Table:**
   - Add search input above table
   - Add filter chips showing active filters
   - Add "Clear all filters" button
   - Sort by any column (date, status, gate)
   - Pagination (25 per page)

3. **Export:**
   - CSV export with all filtered data
   - Include all fields in export
   - Filename format: `scans_export_YYYY-MM-DD.csv`

4. **UI Polish:**
   - Loading skeleton while data loads
   - Empty state illustration
   - "Showing X of Y results" text

**Reference:** PRD_v4.0.md Section 5.7, Section 8 (Advanced Analytics)

---

## Prompt 3: Gates Management Full CRUD + Live Status

**Target App:** `client-dashboard`  
**Priority:** P1  
**Files to Update:**

- `apps/client-dashboard/src/app/dashboard/gates/page.tsx`
- `apps/client-dashboard/src/app/dashboard/gates/gate-client.tsx`
- `apps/client-dashboard/src/app/api/gates/route.ts`

Implement full gate management with live status indicators.

**Requirements:**

1. **Gate List Page:**
   - Grid/card layout showing all gates
   - Status indicator (green = active, gray = inactive)
   - Quick actions: edit, toggle active
   - "Add Gate" modal/page

2. **Gate CRUD:**
   - Create: name, location, description
   - Read: view gate details and stats
   - Update: edit any field
   - Delete: soft delete with confirmation

3. **Live Status:**
   - Show "Last accessed" timestamp
   - Show "Scans today" count
   - Real-time indicator (pulsing dot if active today)
   - Auto-refresh every 30 seconds

4. **Gate Card Display:**
   - Gate name and location
   - QR code count assigned
   - Total scans count
   - Status badge
   - Last accessed time

**Reference:** PRD_v4.0.md Section 5.1

---

## Prompt 4: Webhooks CRUD + Delivery System

**Target App:** `client-dashboard`  
**Priority:** P0  
**Files to Create:**

- `apps/client-dashboard/src/app/dashboard/workspace/webhooks/page.tsx`
- `apps/client-dashboard/src/app/api/webhooks/route.ts`
- `packages/db/prisma/schema.prisma` (add Webhook model)

Implement webhook management system for integrations.

**Requirements:**

1. **Database Schema Addition:**

```prisma
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
```

2. **Webhook Management Page:**
   - List all webhooks with status
   - Create new webhook (URL, events)
   - Edit webhook
   - Delete webhook
   - Test webhook (send test payload)
   - Show delivery history (last 5 attempts)

3. **Delivery System:**
   - Queue webhook deliveries
   - HMAC-SHA256 signature in headers
   - Retry logic (3 attempts)
   - Log delivery attempts

**Reference:** PRD_v4.0.md Section 5.8, Section 8 (Remaining MVP #3)

---

## Prompt 5: API Keys Full Management

**Target App:** `client-dashboard`  
**Priority:** P1  
**Files to Create:**

- `apps/client-dashboard/src/app/dashboard/workspace/api-keys/page.tsx`
- `apps/client-dashboard/src/app/api/api-keys/route.ts`
- `packages/db/prisma/schema.prisma` (add ApiKey model)

Implement complete API key management system.

**Requirements:**

1. **Database Schema:**

```prisma
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

enum ApiScope {
  QR_CREATE
  QR_READ
  QR_VALIDATE
  SCANS_READ
  ANALYTICS_READ
  WEBHOOK_WRITE
}
```

2. **API Keys Page:**
   - List all API keys (name, prefix, scopes, created, last used)
   - Create new key (name, expiry, scopes checkboxes)
   - Show full key ONCE on creation (copy button)
   - Revoke/delete key
   - Filter: active, expired, all

3. **API Validation:**
   - Middleware to validate API keys
   - Check key hash, scopes, expiry
   - Return 401 for invalid/expired keys

**Reference:** PRD_v4.0.md Section 5.8, Section 8 (Remaining MVP #6)

---

## Prompt 6: Supervisor Override + Queue Visibility

**Target App:** `scanner-app`  
**Priority:** P1  
**Files to Create/Update:**

- `apps/scanner-app/src/components/SupervisorOverride.tsx`
- `apps/scanner-app/src/components/QueueStatus.tsx`
- `apps/scanner-app/App.tsx` (integrate components)

Add supervisor override flow and offline queue visibility to scanner app.

**Requirements:**

1. **Supervisor Override:**
   - Add "Override" button to rejected scan results
   - Prompt for supervisor PIN (4-6 digits)
   - Validate PIN against supervisor credentials
   - Log override attempt with supervisor ID and reason
   - Allow after 3 failed with warning
   - Use existing ResultOverlay pattern

2. **Queue Status Screen:**
   - Accessible from scanner menu
   - Show pending scans count
   - Show failed/pending sync status
   - Manual sync button
   - Clear failed queue option
   - Last sync timestamp

3. **Gate Selector:**
   - Add gate dropdown to scanner
   - Select gate before scanning
   - Persist selected gate in storage

**Reference:** PRD_v4.0.md Section 5.3, Section 8 (Remaining MVP #5)

---

## Prompt 7: Admin Dashboard Basics

**Target App:** `admin-dashboard`  
**Priority:** P2  
**Files to Create:**

- `apps/admin-dashboard/src/app/layout.tsx`
- `apps/admin-dashboard/src/app/page.tsx`
- `apps/admin-dashboard/src/app/organizations/page.tsx`
- `apps/admin-dashboard/src/app/users/page.tsx`
- `apps/admin-dashboard/src/components/Sidebar.tsx`

Build basic admin dashboard for super admin management.

**Requirements:**

1. **Layout:**
   - Sidebar navigation
   - Header with admin info
   - Responsive design

2. **Dashboard Overview:**
   - Total organizations count
   - Total users count
   - Total scans (24h, 7d, 30d)
   - System health indicators

3. **Organization Management:**
   - List all orgs (name, plan, users, QR codes, scans)
   - Search/filter orgs
   - View org details
   - Suspend/activate org
   - Change plan tier

4. **User Management:**
   - List all users across orgs
   - Search by email
   - View user details
   - Reset password action

**Reference:** PRD_v4.0.md Section 8 (Remaining MVP #10)

---

## Prompt 8: Marketing Website Landing Page

**Target App:** `marketing`  
**Priority:** P2  
**Files to Update:**

- `apps/marketing/app/page.tsx`
- `apps/marketing/app/layout.tsx`
- `apps/marketing/app/pricing/page.tsx`
- `apps/marketing/app/contact/page.tsx`

Create complete marketing website with landing page, pricing, and contact.

**Requirements:**

1. **Landing Page:**
   - Hero section with CTA (Get Started, Watch Demo)
   - Features section (QR Access, Real-time Analytics, Offline Mode, Team Management)
   - Use cases (Compounds, Schools, Events, Clubs)
   - Testimonials
   - Footer with links

2. **Pricing Page:**
   - Starter, Pro, Enterprise tiers
   - Feature comparison table
   - CTA buttons
   - FAQ section

3. **Contact Page:**
   - Contact form (name, email, company, message)
   - Company info (Egypt/Gulf focus)
   - Map or location

4. **Styling:**
   - Use Tailwind CSS
   - Professional, modern design
   - Mobile responsive
   - Consistent with dashboard branding (blue/slate)

**Reference:** PRD_v4.0.md Marketing App currently ~10% complete

---

## Usage Notes

1. **Before implementing each prompt:**
   - Review existing code patterns in the codebase
   - Check existing components in `@gate-access/ui`
   - Verify database schema in `packages/db/prisma/schema.prisma`

2. **Output format for each file:**
   - Use `FILE: path/to/file.tsx` or `FILE: path/to/file.ts`
   - Include full code with imports
   - Use existing styling patterns (Tailwind CSS)

3. **Testing:**
   - Run `pnpm build` after changes
   - Run `pnpm lint` to check code quality
   - Test in development mode before committing
