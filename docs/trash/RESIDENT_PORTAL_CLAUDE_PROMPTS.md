# Claude Prompt Set for Resident Portal Implementation

This document contains 8 ready-to-use Claude prompts for implementing the Resident Self-Service Portal feature. Each prompt is self-contained, references RESIDENT_PORTAL_SPEC.md and PRD_v4.0.md, and specifies exact output format.

---

## Prompt 1: Database Models & Migration

**Target:** packages/db/prisma/schema.prisma  
**Priority:** P0  
**Description:** Add new models for Unit, VisitorQR, AccessRule, ResidentLimit, and update existing models

**Requirements:**

Add the following to schema.prisma:

```prisma
// New enums
enum UnitType {
  STUDIO
  ONE_BEDROOM
  TWO_BEDROOM
  THREE_BEDROOM
  FOUR_BEDROOM
  PENTHOUSE
  VILLA
}

enum AccessRuleType {
  ONETIME
  DATERANGE
  RECURRING
  PERMANENT
}

// Update UserRole enum - add RESIDENT
enum UserRole {
  ADMIN
  TENANT_ADMIN
  TENANT_USER
  VISITOR
  RESIDENT
}

// Update QRCodeType enum - add VISITOR, OPEN
enum QRCodeType {
  SINGLE
  RECURRING
  PERMANENT
  VISITOR
  OPEN
}

// New models
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
}

model VisitorQR {
  id              String        @id @default(cuid())
  qrCode          QRCode        @relation(fields: [qrCodeId], references: [id], onDelete: Cascade)
  qrCodeId        String        @unique
  unit            Unit          @relation(fields: [unitId], references: [id], onDelete: Cascade)
  unitId          String
  visitorName     String?
  visitorPhone    String?
  visitorEmail    String?
  isOpenQR        Boolean       @default(false)
  accessRule      AccessRule?   @relation(fields: [accessRuleId], references: [id])
  accessRuleId    String?
  createdBy       String
  createdAt       DateTime      @default(now())
}

model AccessRule {
  id              String            @id @default(cuid())
  type            AccessRuleType
  startDate       DateTime?
  endDate         DateTime?
  recurringDays   Int[]?
  startTime       String?
  endTime         String?
  visitorQR       VisitorQR?
}

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

// Update Organization - add relations
model Organization {
  // ... existing fields
  units           Unit[]
  residentLimits  ResidentLimit[]
}

// Update User - add units relation
model User {
  // ... existing fields
  unit            Unit?
}
```

After adding models, generate migration:

```bash
cd packages/db && pnpm prisma migrate dev --name add_resident_portal_models
```

---

## Prompt 2: Resident API - Unit & Quota

**Target:** apps/client-dashboard/src/app/api/resident/  
**Priority:** P0  
**Files to create:**

- `apps/client-dashboard/src/app/api/resident/unit/route.ts`
- `apps/client-dashboard/src/app/api/resident/quota/route.ts`
- `apps/client-dashboard/src/app/api/resident/visitors/route.ts`

**Requirements:**

1. **GET /api/resident/unit** - Get current user's linked unit

```typescript
// Returns: { success: true, data: { unit, unitType, quota, used } }
```

2. **GET /api/resident/quota** - Get monthly quota status

```typescript
// Returns: { success: true, data: { monthlyQuota, used, remaining, resetDate } }
```

3. **GET /api/resident/visitors** - List visitor QRs

```typescript
// Query params: ?page=1&limit=20&status=active
// Returns: { success: true, data: { visitors, total, page } }
```

4. **POST /api/resident/visitors** - Create visitor QR

```typescript
// Body: { visitorName, visitorPhone, visitorEmail, accessType, startDate, endDate, daysOfWeek, startTime, endTime, gateIds }
// Validates quota before creation
// Returns: { success: true, data: { visitorQR, qrCode } }
```

All endpoints must:

- Check user has RESIDENT role
- Verify user has linked Unit
- Enforce tenant isolation (organizationId)
- Return 401/403 appropriately

---

## Prompt 3: Resident API - Open QR & Actions

**Target:** apps/client-dashboard/src/app/api/resident/  
**Priority:** P1  
**Files to create:**

- `apps/client-dashboard/src/app/api/resident/visitors/open/route.ts`
- `apps/client-dashboard/src/app/api/resident/visitors/[id]/route.ts`

**Requirements:**

1. **POST /api/resident/visitors/open** - Create Open QR

```typescript
// Body: { accessType: 'RECURRING' | 'PERMANENT', daysOfWeek, startTime, endTime, gateIds }
// Validates: unit canCreateOpenQR
// Returns: { success: true, data: { visitorQR, qrCode } }
```

2. **DELETE /api/resident/visitors/[id]** - Revoke visitor QR

```typescript
// Soft deletes - sets qrCode.isActive = false
// Returns: { success: true }
```

3. **PATCH /api/resident/visitors/[id]** - Extend/Modify access

```typescript
// Body: { endDate?, daysOfWeek?, startTime?, endTime? }
// Returns: { success: true, data: { visitorQR } }
```

All endpoints must:

- Verify ownership (createdBy matches user)
- Include audit trail entry
- Trigger webhook if configured

---

## Prompt 4: QR Signing for Visitor/Open QRs

**Target:** packages/types/src/qr-signing.ts  
**Priority:** P0  
**Description:** Update QR payload signing to support VISITOR and OPEN types

**Requirements:**

Update `signQRPayload` function to accept new types:

```typescript
interface QRPayload {
  qrId: string;
  organizationId: string;
  type: QRCodeType | 'VISITOR' | 'OPEN'; // Extended types
  maxUses?: number;
  expiresAt?: string;
  issuedAt: string;
  nonce: string;
  // NEW: Visitor-specific fields
  visitorId?: string; // VisitorQR id
  unitId?: string;
  accessRuleId?: string;
  isOpenQR?: boolean;
  // NEW: Open QR fields
  openFrom?: string; // "09:00"
  openTo?: string; // "22:00"
  openDays?: number[]; // [0,1,2,3,4,5,6]
}
```

Update `verifyScanQR` in scanner app to validate:

1. VISITOR QR - check accessRule allows current time/date
2. OPEN QR - check unit is active, no quota needed

---

## Prompt 5: Resident Dashboard UI

**Target:** apps/client-dashboard/src/app/dashboard/residents/  
**Priority:** P0  
**Files to create:**

- `apps/client-dashboard/src/app/dashboard/residents/page.tsx`
- `apps/client-dashboard/src/app/dashboard/residents/resident-client.tsx`

**Requirements:**

Create `/dashboard/residents` page with:

1. **Unit Info Card**
   - Unit number, building, type
   - Edit link if not linked

2. **Quota Widget**
   - Circular progress (used/remaining)
   - "X of Y visitors this month"
   - Reset date

3. **Quick Actions**
   - "Add Visitor" button
   - "Create Open QR" button (if allowed)

4. **Visitor List Table**
   - Columns: Visitor, Type, Status, Access, Created, Actions
   - Row actions: View QR, Extend, Revoke
   - Pagination

5. **Empty State**
   - If no linked unit: "Link your unit to get started"
   - If no visitors: "Create your first visitor pass"

Use existing UI components from @gate-access/ui. Follow current dashboard styling.

---

## Prompt 6: Create Visitor Form UI

**Target:** apps/client-dashboard/src/app/dashboard/residents/  
**Priority:** P0  
**File to create:** `apps/client-dashboard/src/app/dashboard/residents/create-visitor-modal.tsx`

**Requirements:**

Create modal form for creating visitor QR:

**Fields:**

- Visitor Name (text, required)
- Visitor Phone (tel, optional)
- Visitor Email (email, optional)
- Access Type (radio): One-time / Date Range / Recurring
- Date inputs based on type
- Time Range (start/end time pickers)
- Gate Selection (multi-select)

**Validation:**

- Check quota before submit
- Show error if quota exceeded
- Client-side validation for required fields

**On Success:**

- Show QR code display
- "Copy" button
- "Share" button (opens native share)
- "Done" button

Use existing @gate-access/ui components. Follow modal patterns from gates page.

---

## Prompt 7: Create Open QR Form UI

**Target:** apps/client-dashboard/src/app/dashboard/residents/  
**Priority:** P1  
**File to create:** `apps/client-dashboard/src/app/dashboard/residents/create-open-qr-modal.tsx`

**Requirements:**

Create modal form for Open QR (simpler than visitor):

**Fields:**

- Access Type: Recurring / Permanent
- Days of Week (checkboxes: Sun-Sat) - only for recurring
- Time Range: Start time, End time (e.g., 9 AM - 10 PM)
- Gate Selection (which gates can use)

**Validation:**

- Check unit canCreateOpenQR
- Show error if not allowed

**On Success:**

- Display permanent QR code
- "Share" button
- Note: "This QR works for any visitor you authorize"

---

## Prompt 8: Scanner Validation for Visitor/Open QRs

**Target:** apps/scanner-app/src/lib/qr-verify.ts  
**Priority:** P1  
**Description:** Update scanner validation logic to handle VISITOR and OPEN QR types

**Requirements:**

Update validation to:

1. **VISITOR QR Validation:**

```typescript
async function validateVisitorQR(
  payload: QRPayload,
  scanTime: Date
): Promise<ValidationResult> {
  // 1. Check visitor QR is active
  // 2. Check access rule type:
  //    - ONETIME: check date matches
  //    - DATERANGE: check within start/end
  //    - RECURRING: check day of week + time range
  //    - PERMANENT: always allowed
  // 3. Check max uses not exceeded
  // 4. Return appropriate status
}
```

2. **OPEN QR Validation:**

```typescript
async function validateOpenQR(
  payload: QRPayload,
  scanTime: Date
): Promise<ValidationResult> {
  // 1. Check unit is active
  // 2. Check access rule (same as visitor)
  // 3. No max uses check needed
  // 4. Allow access if within rule
}
```

3. **Update /api/qrcodes/validate:**
   - Add VISITOR and OPEN type handling
   - Fetch access rule if needed
   - Return helpful error messages

---

## Usage Notes

1. **Before implementing each prompt:**
   - Review existing code patterns in the codebase
   - Check existing components in @gate-access/ui
   - Verify database schema in packages/db/prisma/schema.prisma

2. **Testing:**
   - Run `pnpm build` after changes
   - Run `pnpm lint` to check code quality
   - Test in development mode before committing

3. **Order matters:**
   - Prompt 1 (DB) must go first
   - Prompts 2-3 (API) before 5-7 (UI)
   - Prompt 8 (Scanner) can be done in parallel with UI

---

**Document Version:** 1.0  
**Reference:** RESIDENT_PORTAL_SPEC.md, PRD_v4.0.md
