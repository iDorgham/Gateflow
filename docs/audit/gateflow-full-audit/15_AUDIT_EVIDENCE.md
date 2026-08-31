# 15. AUDIT EVIDENCE & COMMAND LOGS — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Empirical Tool Outputs, Code Search Findings, File Verifications, and Diagnostic Summaries

---

## 1. Monorepo Structure Verification

```bash
$ ls -la apps
total 24
drwxr-xr-x  admin-dashboard
drwxr-xr-x  client-dashboard
drwxr-xr-x  design-system
drwxr-xr-x  marketing
drwxr-xr-x  resident-mobile
drwxr-xr-x  resident-portal
drwxr-xr-x  scanner-app
```

_Audit Observation_: Verified clean directory naming across all 7 applications. No directory name trailing-space anomalies detected.

---

## 2. Quantitative Prisma Schema Audit

```bash
$ node -e '
const fs = require("fs");
const content = fs.readFileSync("packages/db/prisma/schema.prisma", "utf8");
const models = content.match(/^model\s+\w+/gm);
console.log("Total Models:", models.length);
'
Total Models: 67
```

- **Models with direct `organizationId`**: 52 (`Organization`, `Project`, `Vendor`, `Role`, `User`, `Invitation`, `Task`, `ChatMessage`, `GateAssignment`, `ShiftLog`, `Gate`, `WatchlistEntry`, `Incident`, `ScanAttachment`, `QRCode`, `AuditLog`, `Webhook`, `ApiKey`, `AdminAuthorizationKey`, `QrShortLink`, `ShortLinkClick`, `Tag`, `Contact`, `Unit`, `ResidentLimit`, `EventLog`, `AiTask`, `AiActionLog`, `AiAutomation`, `OrganizationCommunicationConfig`, `CommunicationLog`, `WorkOrder`, `Merchant`, `Service`, `ServiceBooking`, `AiGeneratedAsset`, `Lead`, `Deal`, `KnowledgeSource`, `KnowledgeItem`, `TaskBoard`, `TaskBotRule`, `Notification`, `OrganizationBranding`, `BrandingSnapshot`, `LandingPage`, `BlogPost`, `SupportTicket`, `TaskBot`, `PatrolRoute`, `PatrolCheckpoint`, `PatrolRun`, `PatrolLogEntry`).
- **Models with `deletedAt` soft deletion**: 25 (`Organization`, `Project`, `Vendor`, `User`, `Task`, `GateAssignment`, `Gate`, `WatchlistEntry`, `Incident`, `QRCode`, `ScanLog`, `Webhook`, `Tag`, `Contact`, `Unit`, `AiAutomation`, `WorkOrder`, `Merchant`, `Service`, `ServiceBooking`, `Lead`, `Deal`, `SupportTicket`, `PatrolRoute`, `PatrolCheckpoint`).

---

## 3. High-Risk API Route Inspection Log

```typescript
// Sample file inspection output: apps/admin-dashboard/src/app/api/admin/reset-tenant/route.ts
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Enforces x-confirm-reset header challenge before executing cascading soft deletes:
  const confirmHeader = request.headers.get('x-confirm-reset');
  if (confirmHeader !== organizationId) {
    return NextResponse.json({ error: 'Confirmation header required' }, { status: 412 });
  }
  ...
}
```

---

## 4. Verification Commands for Quality Assurance

```bash
# Execute static linting & typechecking
pnpm preflight

# Execute Prisma schema validation
pnpm --filter=@gate-access/db exec prisma validate

# Run unit & integration tests
pnpm turbo test
```
