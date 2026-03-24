# Explore Subagent — Prompt Library

Copy-paste prompts for codebase exploration. Use with **explore** subagent.

---

## Flows & architecture

**QR creation flow**
```
Trace the end-to-end flow for QR code creation: from the create QR UI in client-dashboard through the API route, signature generation, and DB write. Return key files and a short call graph.
```

**Scan validation flow**
```
Trace how the scanner app validates a QR code: offline HMAC check, online API validation, and scan log creation. Return key files and the validation path.
```

**Bulk sync flow**
```
Trace the offline scan sync flow: from scanner app's bulk sync API call through deduplication (scanUuid) and DB writes. Return key files and the sync contract.
```

**Resident/Unit flow**
```
Trace how residents are linked to units and how visitor QR creation works. Return key files for Unit, VisitorQR, and access rules.
```

---

## Refactor & discovery

**Symbol usage**
```
Find all places where [symbol] is used across apps/packages and group by feature area. List file paths and usage context.
```

**API route inventory**
```
List all API routes under apps/client-dashboard/src/app/api/ and summarize: method, path, auth, org scope, inputs.
```

**Multi-tenant audit**
```
Find all Prisma queries that touch [Model] and verify each has organizationId in the where clause. Flag any missing org scope.
```

**Soft delete audit**
```
Find all Prisma model queries for [Model] and verify deletedAt: null is in the where clause where appropriate.
```

---

## Security & auth

**Auth flow**
```
Trace the auth flow: login page → API → token issue → cookie storage → protected route. Return key files.
```

**RBAC checks**
```
Where is role checked (TENANT_ADMIN, TENANT_USER, RESIDENT) for dashboard access? List all role guards.
```

**QR signing**
```
Where is QR payload signed with HMAC-SHA256? Where is it verified? Return key files and env var usage.
```

---

## i18n

**Translation keys**
```
Find all translation keys used in [namespace] and list which components use them.
```

**RTL/LTR**
```
Where is dir or RTL handled for Arabic layout? List layout files and i18n config.
```
