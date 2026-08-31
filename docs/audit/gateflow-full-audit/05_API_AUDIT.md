# 05. API CONTRACTS & GATEWAY AUDIT — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Next.js App Router API Routes, Zod Input Validation, Response Standardization, Error Envelopes, and Special High-Risk Endpoint Inspection

---

## 1. API Architecture & Routing Overview

GateFlow utilizes Next.js 14 App Router route handlers (`app/api/**/route.ts`) as a distributed API gateway across its applications.

```
                              API Gateway Architecture

     Client Request (Dashboard, Mobile Scanner, Webhook, Portal)
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   App Router Route Handlers   │
                       │   (e.g., /api/scans/bulk)     │
                       └───────────────┬───────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
 ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
 │ Authentication Guard│    │ Zod Schema Validate │    │ Organization Scoped │
 │ (Session / Bearer)  │    │  (Input Payload)    │    │  Prisma Execution   │
 └─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

---

## 2. API Contract Standards

### 2.1 Standardized Response Envelopes

- **Success Response**: Returns HTTP 200/201 with JSON body:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "page": 1, "total": 150 }
  }
  ```
- **Error Response**: Returns HTTP 400/401/403/404/429/500 with standardized error payload:
  ```json
  {
    "error": "Human-readable error summary",
    "details": { ... }
  }
  ```

### 2.2 Zod Validation Layer

Input bodies, query parameters, and dynamic route parameters across mutating endpoints are strictly validated using Zod schemas (`z.object({ ... })`), preventing prototype pollution and invalid data types from reaching database handlers.

---

## 3. Special High-Risk Endpoint Inspection

| App        | Endpoint Path                   | Auth Required | Org Scoped | Rate Limited | Risk Level | Audit Finding & Safeguards                                       |
| :--------- | :------------------------------ | :-----------: | :--------: | :----------: | :--------: | :--------------------------------------------------------------- |
| **Client** | `/api/danger/delete-workspace`  |      Yes      |    Yes     |     Yes      |    High    | Enforces `requireAuth` + `x-confirm-delete` header challenge.    |
| **Client** | `/api/danger/purge-scans`       |      Yes      |    Yes     |      No      |    High    | Requires `requireAuth`; missing rate limit wrapper (P0-001).     |
| **Client** | `/api/qrcodes/validate`         |      Yes      |    Yes     |      No      |    High    | Validates HMAC signature; requires rate limit wrapper (P0-001).  |
| **Client** | `/api/scans/bulk`               |      Yes      |    Yes     |      No      |    High    | Atomically ingests scan batches; needs rate limiting (P0-001).   |
| **Client** | `/api/webhooks/stripe`          |   Signature   |    Yes     |      No      |    High    | Verifies `stripe-signature` header via Stripe SDK.               |
| **Client** | `/api/ai/actions/execute`       |      Yes      |    Yes     |      No      |   Medium   | Audits tool execution in `AiActionLog`; needs rate limiting.     |
| **Admin**  | `/api/admin/reset-tenant`       |  Admin Auth   |    Yes     |      No      |    High    | Protected by `isAdminAuthorized()`; requires `x-confirm-reset`.  |
| **Admin**  | `/api/admin/seed-hierarchy`     |  Admin Auth   |    Yes     |      No      |    High    | Seed generator protected by admin session cookie / bearer token. |
| **Admin**  | `/api/admin/authorization-keys` |  Admin Auth   |    Yes     |      No      |    High    | Manages programmatic access keys; key hashes stored securely.    |

---

## 4. Findings & Recommendations

### Pros

- Consistent Zod schema validation across mutating App Router POST/PUT/PATCH endpoints.
- High-risk danger endpoints incorporate HTTP header confirmation challenges (`x-confirm-reset`, `x-confirm-delete`).
- Webhook endpoints verify signatures before processing external event payloads.

### Cons

- Missing rate-limiting middleware wrappers on bulk QR ingestion and validation endpoints (documented in P0-001).

### API Verification Commands

```bash
# Inventory all App Router API endpoints
rg --files apps -g "**/app/api/**/route.ts"

# Verify HTTP method exports
rg "export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)" apps --glob "**/app/api/**/route.ts"
```
