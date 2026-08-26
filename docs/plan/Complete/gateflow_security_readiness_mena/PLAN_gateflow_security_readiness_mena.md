# PLAN: GateFlow Enterprise Security Readiness & MENA Compliance

**Slug:** `gateflow_security_readiness_mena`  
**Application:** `workspace` (`packages/db`, `packages/security`, `apps/client-dashboard`, `apps/admin-dashboard`, `apps/scanner-app`)  
**Status:** 🔵 Active — Phase 1 In Progress  
**Created:** 2026-08-26  
**Target:** Q4 2026  
**Primary App:** `packages/db`, `packages/security`  
**Skills:** `security`, `database`, `api`, `rbac`, `data-privacy`, `qr-crypto`, `system-invariants`

---

## Overview

Elevate GateFlow's multi-tenant core platform, database architecture, and client/admin dashboards to enterprise-grade security and regulatory compliance for Egypt and the MENA region (Egyptian Personal Data Protection Law No. 151, Saudi PDPL, UAE ADGM). Deliver AES-256-GCM field-level encryption for sensitive PII, an append-only tamper-evident signed audit ledger, time-bounded dynamic RBAC privilege attenuation, and hardware barrier anti-spoofing verification with 100% preflight test coverage.

---

## Phases

| #   | Phase                                                 | Primary Role      | Preferred Tool    | Scope & Deliverables                                                                                                     | Status |
| :-- | :---------------------------------------------------- | :---------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------- | :----- |
| 1   | **Field-Level PII Encryption & Key Management**       | BACKEND_DATABASE  | Gemini / Claude   | AES-256-GCM encryption helpers, encrypted columns in schema (National IDs, Plates, Phones), dual-key envelope rotation.  | [ ]    |
| 2   | **Tamper-Evident Audit Ledger & Compliance Export**   | BACKEND_API       | OpenCode / Claude | Append-only `AuditLog` structure with SHA-256 hash chaining, tamper detection unit tests, PDF/JSON compliance reporting. | [ ]    |
| 3   | **Dynamic RBAC & Privilege Attenuation**              | SECURITY          | Claude / Cursor   | Time-bounded supervisory delegation, step-up MFA challenge routes, role permission guard middleware across dashboards.   | [ ]    |
| 4   | **Perimeter Hardware Security & Anti-Spoofing**       | MOBILE / HARDWARE | Gemini / Claude   | CRC16 gate packet validation, guard offline nonce replay quarantine, emergency fail-safe protocol.                       | [ ]    |
| 5   | **Automated Pen-Test Suite & Security Certification** | QA / SECURITY     | Cursor / Claude   | Security fuzz tests, secret leak scanner enhancement, full preflight & MENA readiness certification packet.              | [ ]    |

---

## Technical Constraints & Invariants

- **Multi-Tenancy Hardlock**: Every database query touching tenant data MUST enforce `organizationId` scoping and `deletedAt: null` (where model supports soft-deletes).
- **Zero Raw PII in Logs**: Logs must strictly redact tokens, national IDs, encrypted blobs, and secrets.
- **HMAC QR Signing**: QR payloads must remain HMAC-SHA256 signed and validated against database `qrId` with replay nonce detection.
- **Zero-Deprecation Next.js 16 / Node 20**: Security middlewares and encryption services must run efficiently on Edge and Node runtimes with zero hydration side-effects.
- **Verification Gates**: `pnpm preflight` must pass with 0 errors after each phase.

---

## Tools Reference

| Tool             | Best for                                                           | Mode                   |
| :--------------- | :----------------------------------------------------------------- | :--------------------- |
| **Claude CLI**   | Security architecture, dynamic RBAC attenuation, complex reasoning | Headless               |
| **Gemini CLI**   | Prisma schema, migration safety, fast structural analysis          | Headless               |
| **OpenCode CLI** | Code generation, audit ledger models, export formatting            | Headless               |
| **Cursor**       | UI integration, security settings pages, visual verification       | IDE (pair-programming) |
