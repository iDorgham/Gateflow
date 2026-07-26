# Phase 03: Contacts & Invitations Matrix

**App:** `apps/client-dashboard`  
**Date:** 2026-07-26  
**Status:** Locked

---

## 1. Contact Management Endpoints

| Endpoint                    | Method  | Scope            | Tenant Guard     | Soft Delete Guard | Status   |
| --------------------------- | ------- | ---------------- | ---------------- | ----------------- | -------- |
| `/api/crm/contacts`         | GET     | List contacts    | `organizationId` | `deletedAt: null` | Verified |
| `/api/crm/contacts`         | POST    | Create contact   | `organizationId` | N/A               | Verified |
| `/api/crm/contacts/[id]`    | GET/PUT | Contact detail   | `organizationId` | `deletedAt: null` | Verified |
| `/api/crm/contacts/[id]`    | DELETE  | Soft delete      | `organizationId` | Sets `deletedAt`  | Verified |
| `/api/contacts/bulk-delete` | POST    | Bulk soft delete | `organizationId` | Sets `deletedAt`  | Verified |

---

## 2. Invitation & Delivery State Lifecycle

| Channel    | Endpoint                 | Trigger Event        | Security Guard                    | Delivery Status  |
| ---------- | ------------------------ | -------------------- | --------------------------------- | ---------------- |
| Email      | `/api/qr/send-email`     | Resident invitation  | SMTP auth + rate-limited (5/min)  | SENT / FAILED    |
| WhatsApp   | `/api/webhooks/whatsapp` | Meta/Infobip webhook | HMAC signature + timestamp window | DELIVERED / READ |
| Short Link | `/s/[shortId]`           | Guest tap            | Purpose-bound capability token    | ACTIVE / EXPIRED |

---

## 3. Test Verification

- Contact CRM tests: **Passing** (`src/app/api/crm/contacts/route.test.ts` & `src/app/api/crm/contacts/[id]/route.test.ts`).
- Email rate-limiting tests: **Passing** (`src/app/api/qr/send-email/route.test.ts`).
- WhatsApp replay guard tests: **Passing** (`src/app/api/webhooks/whatsapp/route.test.ts`).
- Workflow contract test suite: **58/58 passed**.
