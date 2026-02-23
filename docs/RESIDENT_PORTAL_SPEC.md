# Resident Self-Service Portal - Technical Specification

**Version:** 1.0  
**Date:** February 2026  
**Feature:** Phase 2 - Resident Self-Service Portal  
**Reference:** PRD_v4.0.md Section 4 (Phase 3)

---

## 1. Overview

The Resident Self-Service Portal enables residents within gated compounds to create visitor QR codes for their guests. This feature shifts QR creation from compound administrators to individual residents, with automatic quota enforcement based on unit type.

### Key Requirements

- Residents create QR codes for their visitors
- Quota limits based on unit type (1BR = 5/month, 3BR = 15/month)
- Control: Date range, recurring access
- "Open QR" for close friends (permanent, no specific name)

---

## 2. Architecture

### 2.1 Placement

- **Route:** `/dashboard/residents` (new section in client-dashboard)
- **Access:** Users with `RESIDENT` role (new role)
- **Requirement:** User must have linked Unit to access portal

### 2.2 New Database Models

```prisma
// Unit - represents a residence (apartment/villa)
model Unit {
  id              String   @id @default(cuid())
  unitNumber      String   // e.g., "A-101", "Villa-5"
  unitType        UnitType // STUDIO, 1BR, 2BR, 3BR, 4BR, PENTHOUSE, VILLA
  building        String?  // Building name (optional)
  user            User?    @relation(fields: [userId], references: [id])
  userId          String?  @unique // Linked resident user
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

enum UnitType {
  STUDIO
  ONE_BEDROOM    // 5 visitors/month
  TWO_BEDROOM    // 10 visitors/month
  THREE_BEDROOM  // 15 visitors/month
  FOUR_BEDROOM   // 20 visitors/month
  PENTHOUSE      // 25 visitors/month
  VILLA          // 30 visitors/month
}

// Visitor QR - extends QRCode with visitor details
model VisitorQR {
  id              String        @id @default(cuid())
  qrCode          QRCode        @relation(fields: [qrCodeId], references: [id], onDelete: Cascade)
  qrCodeId        String        @unique
  unit            Unit          @relation(fields: [unitId], references: [id], onDelete: Cascade)
  unitId          String
  visitorName     String?       // Optional - null for Open QR
  visitorPhone    String?       // Optional
  visitorEmail    String?       // Optional
  isOpenQR        Boolean       @default(false) // Open QR - no name required
  accessRule      AccessRule?   @relation(fields: [accessRuleId], references: [id])
  accessRuleId    String?
  createdBy       String        // userId of resident
  createdAt       DateTime      @default(now())

  @@index([unitId])
  @@index([createdBy])
}

// Access Rule - when visitor can access
model AccessRule {
  id              String            @id @default(cuid())
  type            AccessRuleType    // ONETIME, DATERANGE, RECURRING
  startDate       DateTime?
  endDate         DateTime?
  recurringDays   Int[]?            // Days of week (0-6, Sunday=0)
  startTime       String?           // "09:00" format
  endTime         String?           // "22:00" format
  visitorQR       VisitorQR?

  @@index([startDate])
}

enum AccessRuleType {
  ONETIME       // Single use, specific date
  DATERANGE    // Multiple uses within date range
  RECURRING    // Recurring access (daily/weekly)
  PERMANENT    // No time limits (Open QR default)
}
```

### 2.3 Updated Existing Models

```prisma
// Add to User model
enum UserRole {
  ADMIN
  TENANT_ADMIN
  TENANT_USER
  VISITOR
  RESIDENT  // NEW - can access resident portal
}

// Add to QRCode model
enum QRCodeType {
  SINGLE
  RECURRING
  PERMANENT
  VISITOR    // NEW - created by resident
  OPEN       // NEW - Open QR by resident
}

// Add to Organization model
model Organization {
  // ... existing fields
  residentLimits ResidentLimit[]
}

model ResidentLimit {
  id              String   @id @default(cuid())
  organization    Organization @relation(fields: [organizationId], references: [id])
  organizationId  String
  unitType        UnitType
  monthlyQuota    Int      // Max visitors per month
  canCreateOpenQR Boolean @default(false) // Whether unit type can create Open QR
  createdAt       DateTime @default(now())

  @@unique([organizationId, unitType])
}
```

---

## 3. Quota Enforcement

### 3.1 Monthly Quota Logic

```typescript
interface QuotaCheckResult {
  allowed: boolean;
  remaining: number;
  used: number;
  resetDate: Date;
}

function calculateMonthlyQuota(unitType: UnitType): number {
  const quotas: Record<UnitType, number> = {
    STUDIO: 3,
    ONE_BEDROOM: 5,
    TWO_BEDROOM: 10,
    THREE_BEDROOM: 15,
    FOUR_BEDROOM: 20,
    PENTHOUSE: 25,
    VILLA: 30,
  };
  return quotas[unitType] ?? 3;
}

async function checkAndConsumeQuota(unitId: string): Promise<QuotaCheckResult> {
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { organization: { include: { residentLimits: true } } },
  });

  const quota =
    unit.organization.residentLimits.find((r) => r.unitType === unit.unitType)
      ?.monthlyQuota ?? 5;

  const startOfMonth = startOfMonth(new Date());
  const endOfMonth = endOfMonth(new Date());

  const used = await prisma.visitorQR.count({
    where: {
      unitId,
      createdAt: { gte: startOfMonth, lte: endOfMonth },
      // Exclude expired/Revoked QRs from count
      qrCode: { isActive: true },
    },
  });

  if (used >= quota) {
    return { allowed: false, remaining: 0, used, resetDate: endOfMonth };
  }

  // Atomically increment (would need to track usage differently)
  return {
    allowed: true,
    remaining: quota - used,
    used,
    resetDate: endOfMonth,
  };
}
```

### 3.2 Open QR Special Rules

- **Who can create:** Only units with `canCreateOpenQR = true`
- **What it includes:** No visitor name, permanent or recurring
- **Payload:** Different type `OPEN` with special flag
- **Validation:** Scanner treats OPEN QR differently (no name check)

---

## 4. API Endpoints

### 4.1 Resident Portal API

| Method | Endpoint                      | Description                               |
| ------ | ----------------------------- | ----------------------------------------- |
| GET    | `/api/resident/units`         | Get resident's linked unit                |
| GET    | `/api/resident/quota`         | Get current month quota usage             |
| GET    | `/api/resident/visitors`      | List visitor QR codes created by resident |
| POST   | `/api/resident/visitors`      | Create new visitor QR                     |
| POST   | `/api/resident/visitors/open` | Create Open QR                            |
| DELETE | `/api/resident/visitors/:id`  | Revoke visitor QR                         |
| PATCH  | `/api/resident/visitors/:id`  | Extend/Modify access rule                 |

### 4.2 QR Validation (Scanner)

The scanner app already validates QRs. New logic needed:

```typescript
// In /api/qrcodes/validate
function validateQRCode(payload) {
  // ... existing validation ...

  if (payload.type === 'OPEN') {
    // Open QR - verify:
    // 1. Unit is active
    // 2. Resident hasn't exceeded quota
    // 3. Access rule allows current time
    return validateOpenQR(payload);
  }

  if (payload.type === 'VISITOR') {
    // Visitor QR - verify:
    // 1. Visitor hasn't exceeded max uses
    // 2. Within access rule date/time
    return validateVisitorQR(payload);
  }
}
```

---

## 5. UI/UX Design

### 5.1 Resident Dashboard Page

**Route:** `/dashboard/residents`

**Sections:**

1. **Unit Info Card** - Shows unit number, type, building
2. **Quota Widget** - Circular progress showing monthly usage
3. **Quick Actions** - "Add Visitor" + "Create Open QR" buttons
4. **Active Visitors List** - Table of current visitor QR codes
5. **History** - Past visitors with scan status

### 5.2 Create Visitor Form

**Fields:**

- Visitor Name\* (required for regular QR)
- Visitor Phone (optional)
- Visitor Email (optional)
- Access Type: One-time / Date Range / Recurring
- Date/Time inputs based on access type
- Gate Selection (which gates can use)

### 5.3 Create Open QR Form

**Fields:**

- Access Type: Recurring / Permanent
- Days of week (for recurring)
- Time range (e.g., 9 AM - 10 PM)
- Gate Selection

### 5.4 Mobile Optimization

- Simplified mobile view for residents
- Large touch targets for creating QRs
- Easy-to-copy QR code display
- Share via messaging apps

---

## 6. Security Considerations

### 6.1 Access Control

- Only users with `RESIDENT` role can access portal
- Resident must have linked `Unit` record
- All actions filtered by `userId` + `organizationId`

### 6.2 Quota Security

- Server-side quota enforcement (never trust client)
- Atomic quota check before QR creation
- Audit trail includes quota check result

### 6.3 QR Security

- Visitor QRs signed with same HMAC-SHA256
- Open QR includes unit verification in payload
- Scanner validates unit is active

---

## 7. Implementation Priority

| Task                        | Effort | Priority |
| --------------------------- | ------ | -------- |
| Database models + migration | 1 day  | P0       |
| Unit-User linking UI        | 1 day  | P0       |
| Quota logic + API           | 2 days | P0       |
| Visitor QR creation UI      | 2 days | P0       |
| Open QR creation UI         | 1 day  | P1       |
| Scanner validation update   | 1 day  | P1       |
| Resident dashboard page     | 1 day  | P1       |
| Mobile optimization         | 1 day  | P2       |

---

## 8. Dependencies

- **Existing:** QRCode model, scan validation, auth
- **New:** Unit, VisitorQR, AccessRule, ResidentLimit models
- **External:** None required

---

**Document Version:** 1.0  
**Last Updated:** February 2026
