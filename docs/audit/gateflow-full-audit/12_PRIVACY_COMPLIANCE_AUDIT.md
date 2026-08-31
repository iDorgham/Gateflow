# 12. PRIVACY & COMPLIANCE AUDIT — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Personally Identifiable Information (PII) Protection, GDPR Compliance, Data Minimization, Attachment Lifecycle, and Consent Management

---

## 1. PII Handling & Data Minimization

GateFlow handles sensitive personal data including resident names, phone numbers, email addresses, property unit numbers, vehicle license plates, and visitor ID capture images.

### PII Protection Standards

- **Database Schema**: Contact details are linked strictly to tenant organizations (`organizationId`). Access is protected by server-side session checks.
- **Log Masking**: API error logs redact sensitive headers, authorization tokens, and raw passwords before writing to console or logging services.
- **Attachment Storage Security**: Visitor ID capture photos and scan attachments (`ScanAttachment`) are saved with randomized key names and served via short-lived signed URLs.

---

## 2. Compliance & Retention Evaluation

- **Soft Delete Compliance**: Soft-deleted entities retain timestamps (`deletedAt`) to allow forensic audit verification while masking data from operational operator views.
- **Right to Erasure (GDPR)**: System supports permanent purging of resident contact records via workspace danger endpoints (`/api/danger/delete-workspace`).
- **Consent Tracking**: Marketing forms (`apps/marketing`) capture explicit communication preferences.

---

## 3. Findings & Recommendations

### Pros

- Strict PII isolation within tenant organization boundaries.
- Error logs exclude raw passwords, HMAC keys, and bearer tokens.
- Support for PII deletion and soft-delete audit masking.

### Cons

- Automated retention policies should be implemented to purge expired scan attachment images after 90 days.

### Compliance Verification Commands

```bash
# Verify scan attachment schema definitions
rg -n "model ScanAttachment" packages/db/prisma/schema.prisma

# Audit PII fields across contact schemas
rg -n "firstName|lastName|email|phone" packages/db/prisma/schema.prisma
```
