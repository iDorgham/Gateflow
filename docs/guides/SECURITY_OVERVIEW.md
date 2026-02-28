# GateFlow Security Overview (Docs v2)

**Version:** 1.0  
**Aligned with:** `docs/PRD_v6.0.md`, `.cursor/rules/00-gateflow-core.mdc`, `.cursor/contracts/CONTRACTS.md`  

---

## 1. Security Posture & Scope

GateFlow is a **zero‑trust digital gate infrastructure** for gated communities and venues. Security is enforced at three layers:

- **Core rules** — always-on invariants (multi-tenancy, soft deletes, QR signing, secrets).
- **Contracts** — implementation‑level guarantees (queries, tokens, scanner behavior).
- **Specialist guidance** — SECURITY role skills and PRD v6 requirements (visitor identity levels, watchlists, guard operations).

This guide is a high‑level companion to:

- `PRD_v6.0.md` (Sections 8, 11–14).
- `.cursor/rules/00-gateflow-core.mdc` and `.cursor/rules/gateflow-security.mdc`.
- `.cursor/contracts/CONTRACTS.md`.

---

## 2. Core Security Invariants

### 2.1 Multi-Tenancy & Soft Deletes

- Every tenant query **must** scope by `organizationId`.
- Mutable models (e.g. `User`, `Gate`, `QRCode`, `Unit`) use `deletedAt DateTime?`:
  - Reads filter `deletedAt: null`.
  - “Deletes” set `deletedAt` instead of hard‑deleting.

These rules are non‑negotiable and codified in the core rules and contracts.

### 2.2 Authentication & Tokens

- **Access tokens:**
  - JWT, 15‑minute expiry (HS256 via `jose`).
  - Issuer/audience: `gateflow` / `gateflow-api`.
  - Claims include `sub` (userId), `email`, `role`, `orgId`.
- **Refresh tokens:**
  - Long‑lived, stored in DB (`RefreshToken` model) with rotation.
  - On refresh, old token is invalidated; new token is issued.
- **Storage:**
  - Web: secure cookies (never `localStorage`).
  - Mobile (scanner/resident): SecureStore (never plain AsyncStorage).

### 2.3 QR Security & Scanner Invariants

- All QR payloads are **HMAC‑SHA256 signed** using `QR_SIGNING_SECRET`.
- Scanner app:
  - Verifies QR signatures offline using a shared secret.
  - Queues scans offline; encrypts queue entries (AES‑256 + PBKDF2).
  - Uses `scanUuid` as the **deduplication key** for sync (contract: unchanged).

If QR signing or `scanUuid` behavior regresses, overall system integrity is at risk.

### 2.4 Secrets & Configuration

- `.env` / `.env.local` files must never be committed.
- Only `.env.example` files with placeholder values are tracked.
- For security‑critical env vars (JWT secrets, DB URL, QR signing, Redis tokens), the system must:
  - **Fail closed** on missing/invalid values (refuse to start or error explicitly).

---

## 3. RBAC & Permissions

RBAC is enforced via:

- `Role` model in Prisma (`packages/db/prisma/schema.prisma`).
- JSON `permissions` map (e.g. `gates:manage`, `scans:override`, `roles:manage`).
- `User.roleId` linking to a `Role`.

Built‑in roles (seeded via `packages/db/src/seed-roles.js`):

- Super Admin — platform‑level.
- Organization Admin — full tenant control.
- Security Manager — security+analytics, overrides, watchlists.
- Gate Operator — scanner-focused, limited permissions.
- Resident — resident portal/mobile with visitor QR capabilities.

Custom roles allow tenants to define narrower roles, but **never** to grant more power than the creating admin already has.

---

## 4. Visitor Identity & Trust (v6)

GateFlow v6 formalizes visitor identity levels:

| Level   | Description                                                     | Typical use cases                     |
|---------|-----------------------------------------------------------------|---------------------------------------|
| Level 0 | Basic details only: name + phone                                | Casual guests, low‑risk events        |
| Level 1 | ID photo capture at gate (front/back), stored with the scan    | Contractors, vendors, long‑term stays |
| Level 2 | ID OCR + matching (name/ID number vs invite data)              | High‑security compounds, sensitive orgs |

Configuration:

- Per‑tenant default.
- Per‑gate overrides (e.g. main gate Level 2, side gate Level 1).
- Optionally per project or scenario (events vs resident invites).

Artifacts (ID images, OCR text) are:

- Attached to `ScanLog`/incident records.
- Subject to tenant‑level data retention policies (see §7.2).

---

## 5. Watchlists, Guard Shifts & Incidents

### 5.1 Watchlists & Blocklists

Tenants can maintain:

- Person entries (name, optional ID number/phone/notes).
- Future: vehicle/plate entries.

On every scan (online or when syncing):

- System checks visitor details (and plate when present) against watchlists.
- On match:
  - Scanner shows a clear **hard stop** (e.g., “Blocked person on security list”).
  - An incident is automatically created for follow‑up.
- All watchlist changes are:
  - Restricted to appropriate roles (e.g., Security Manager, Org Admin).
  - Audit‑logged with who, what, and when.

### 5.2 Guard Shifts & Incidents

Shifts:

- Guards start/end shifts in the scanner app.
- Every scan, override, and incident is tagged with:
  - Shift ID, operator ID, gate ID.
- KPIs:
  - Scans per shift/guard.
  - Override rate per guard.
  - Incident rate per gate and shift.

Incidents:

- Logged in the scanner with:
  - Reason codes (fake QR, tailgating, aggressive visitor, barrier failure, etc.).
  - Optional notes and photos.
- Reviewed in dashboards:
  - Live incident list/queue for Security Managers.
  - Filterable by gate, severity, time, guard.
- Workflow:
  - States: Under Review → Resolved / Escalated.
  - All changes are recorded for audit exports.

---

## 6. Scanner Policies & Gate Controls

GateFlow adds a policy layer for scans:

- **Gate–account assignment:**
  - Operator accounts may be restricted to specific gates.
  - Scanner app shows only allowed gates.
  - APIs reject scans for gates the operator is not assigned to.

- **Location rule (optional):**
  - **Opt-in:** Enforcement is per gate; when `locationEnforced` is false, scans are not rejected for location.
  - **Config:** Each gate can set latitude, longitude, and radius (meters). When enabled, the server accepts a scan only if the device location is within the radius (Haversine distance).
  - **Scanner:** Sends device latitude/longitude in scan context when available (permissions and UX considered). If the API rejects due to location, the scanner shows a clear message (e.g. “Scanning is only allowed at the gate location. Enable device location or move closer to the gate.”).
  - **Location unavailable or denied:** When the rule is on and the device does not send location (user denied permission or unavailable), the scan is **rejected** with a clear error; the scan is not queued for later sync as a success. Bulk-sync rejects individual scans that fail the location check for their gate.
  - **APIs:** Single-scan validate (`POST /api/qrcodes/validate`) and bulk-sync (`POST /api/scans/bulk`) both enforce the location rule when the gate has it enabled; rejection reason is `not_on_location`.

- **Gate hours & policies (future in v6 roadmap):**
  - Per‑gate operating hours and access rules (e.g. deliveries only during the day).
  - Integration with incidents and lock‑down behavior for severe events.

Implementation details are in `PRD_v6.0.md` (Scanner Rules & Gate–Account Assignment).

---

## 7. Privacy, Retention & Compliance

### 7.1 Resident & Visitor Privacy

- Residents control:
  - Whether guests see full name vs initials.
  - Whether QR landing pages expose unit number and navigation links.
  - Notification preferences (on scan, on arrival, quiet hours).
- Tenants configure:
  - Required identity level by gate.
  - Whether guest ID capture is enabled and how it is used.

### 7.2 Data Retention

- Tenant‑level settings for:
  - Scan log retention (e.g. 6/12/24 months).
  - Visitor history retention per resident.
  - Retention for sensitive artifacts (ID images, incident attachments).
- Future: legal hold flags on specific incidents/visitors to prevent automatic deletion.

---

## 8. Secure Development Practices

- **Package management:** pnpm only (no npm/yarn).
- **Static analysis & dependencies:**
  - CI should include lint, typecheck, tests, and dependency audits.
- **API design:**
  - Input validation (e.g., Zod) on all mutation routes.
  - CSRF protection on cookie‑auth web routes.
  - Rate limiting on sensitive endpoints (auth, exports, bulk operations).

When modifying auth, RBAC, QR flows, scanner sync, or tenant‑scoped APIs:

- Always load:
  - `.cursor/skills/gf-security/SKILL.md`
  - `.cursor/contracts/CONTRACTS.md`
  - `.cursor/rules/00-gateflow-core.mdc`
- Treat violations of these invariants as **hard errors**, not stylistic issues.

